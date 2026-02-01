import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/common/Header';
import Loading from '../components/common/Loading';
import { colors, spacing, fontSize, borderRadius } from '../config/theme';
import apiService from '../services/api';
import { useAuth } from '../context/AuthContext';

const OrderHistoryScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      // 1. Fetch user orders
      const response = await apiService.request(`/checkout/user/${user.id}`);
      let orderData = response.data || [];

      // 2. Enrich orders with product details
      const enrichedOrders = await Promise.all(orderData.map(async (order) => {
        if (order.orderItems && order.orderItems.length > 0) {
          const enrichedItems = await Promise.all(order.orderItems.map(async (item) => {
            try {
              // Fetch product details for each productId in orderItems
              const productRes = await apiService.request(`/product/${item.productId}`);
              // Product response is the product object itself
              const productData = productRes;

              // Find matching SKU price if available
              // Assuming item.price in order is the base price,
              // but we want to check if it's already a discounted price from the order record

              return {
                ...item,
                productName: productData.name || 'Agro Nexis Spices',
                productImage: productData.thumbnailUrl || (productData.imageUrls && productData.imageUrls[0]),
                // Keep the price from the order item as it's the price at the time of purchase
                originalPrice: item.originalPrice || item.price * 1.2, // Fallback for display if not in API
              };
            } catch (err) {
              console.error(`Error fetching product ${item.productId}:`, err);
              return item;
            }
          }));
          return { ...order, items: enrichedItems };
        }
        return { ...order, items: [] };
      }));

      setOrders(enrichedOrders.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate)));
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
      case 'delivered': return colors.success.main;
      case 'created':
      case 'pending': return colors.warning.main;
      case 'shipped': return colors.info.main || '#2196F3';
      case 'cancelled': return colors.error.main;
      default: return colors.text.secondary;
    }
  };

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => navigation.navigate('OrderDetails', { orderId: item.id })}
    >
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderId}>Order #{item.razorpayOrderId || item.id.substring(0, 8).toUpperCase()}</Text>
          <Text style={styles.orderDate}>{new Date(item.createdDate).toLocaleDateString()}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '15' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status || 'Created'}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.orderContent}>
        <View style={styles.itemsList}>
          {item.items?.slice(0, 3).map((orderItem, index) => (
            <View key={index} style={styles.productRow}>
              {orderItem.productImage ? (
                <Image
                  source={{ uri: orderItem.productImage }}
                  style={styles.productThumb}
                />
              ) : (
                <View style={[styles.productThumb, { justifyContent: 'center', alignItems: 'center' }]}>
                  <Ionicons name="image-outline" size={20} color={colors.text.disabled} />
                </View>
              )}
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={1}>
                  {orderItem.productName}
                </Text>
                <View style={styles.priceRow}>
                  <Text style={styles.productMeta}>Qty: {orderItem.quantity} • </Text>
                  <Text style={styles.discountedPrice}>₹{orderItem.price}</Text>
                  {orderItem.originalPrice > orderItem.price && (
                    <Text style={styles.originalPrice}>₹{orderItem.originalPrice.toFixed(0)}</Text>
                  )}
                </View>
              </View>
            </View>
          ))}
          {item.items?.length > 3 && (
            <Text style={styles.moreItemsText}>+ {item.items.length - 3} more items</Text>
          )}
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.totalLabel}>Total Paid</Text>
          <Text style={styles.totalAmount}>₹{item.totalAmount?.toFixed(2)}</Text>
          <View style={styles.viewDetailsRow}>
            <Text style={styles.viewDetailsText}>Details</Text>
            <Ionicons name="chevron-forward" size={14} color={colors.primary.main} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isLoading && !refreshing) {
    return (
      <View style={styles.container}>
        <Header title="My Orders" showBack />
        <Loading fullScreen text="Fetching your orders..." />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="My Orders" showBack />
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderOrderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary.main]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="bag-handle-outline" size={80} color={colors.text.disabled} />
            <Text style={styles.emptyTitle}>No orders yet</Text>
            <Text style={styles.emptySubtitle}>
              When you place an order, it will appear here.
            </Text>
            <TouchableOpacity
              style={styles.shopButton}
              onPress={() => navigation.navigate('Products')}
            >
              <Text style={styles.shopButtonText}>Browse Spices</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  listContent: {
    padding: spacing.md,
  },
  orderCard: {
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.divider,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  orderId: {
    fontSize: fontSize.md,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  orderDate: {
    fontSize: fontSize.xs,
    color: colors.text.secondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.sm,
  },
  orderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemsList: {
    flex: 2,
    paddingRight: spacing.sm,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  productThumb: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.sm,
    backgroundColor: '#f5f5f5',
    marginRight: spacing.sm,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    color: colors.text.primary,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productMeta: {
    fontSize: 11,
    color: colors.text.secondary,
  },
  discountedPrice: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  originalPrice: {
    fontSize: 10,
    color: colors.text.disabled,
    textDecorationLine: 'line-through',
    marginLeft: spacing.xs,
  },
  moreItemsText: {
    fontSize: 11,
    color: colors.primary.main,
    fontStyle: 'italic',
    marginTop: 2,
  },
  priceContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderLeftColor: colors.divider,
    paddingLeft: spacing.sm,
  },
  totalLabel: {
    fontSize: 10,
    color: colors.text.secondary,
  },
  totalAmount: {
    fontSize: fontSize.md,
    fontWeight: 'bold',
    color: colors.primary.main,
    marginTop: 2,
  },
  viewDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  viewDetailsText: {
    fontSize: 12,
    color: colors.primary.main,
    fontWeight: '600',
    marginRight: 2,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginTop: spacing.md,
  },
  emptySubtitle: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    paddingHorizontal: spacing.xl,
  },
  shopButton: {
    marginTop: spacing.xl,
    backgroundColor: colors.primary.main,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  shopButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: fontSize.md,
  },
});

export default OrderHistoryScreen;
