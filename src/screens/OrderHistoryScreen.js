import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/common/Header';
import Loading from '../components/common/Loading';
import Button from '../components/common/Button';
import { colors, spacing, fontSize, borderRadius, shadows } from '../config/theme';
import apiService from '../services/api';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

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
      const response = await apiService.request(`/checkout/user/${user.id}`);
      let orderData = response.data || [];

      const enrichedOrders = await Promise.all(orderData.map(async (order) => {
        if (order.orderItems && order.orderItems.length > 0) {
          const enrichedItems = await Promise.all(order.orderItems.map(async (item) => {
            try {
              const productRes = await apiService.request(`/product/${item.productId}`);
              const productData = productRes;
              return {
                ...item,
                productName: productData.name || 'Agro Nexis Spices',
                productImage: productData.thumbnailUrl || (productData.imageUrls && productData.imageUrls[0]),
                originalPrice: item.price * 1.2,
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
      case 'pending': return colors.secondary.main;
      case 'shipped': return '#2196F3';
      case 'cancelled': return colors.error.main;
      default: return colors.text.secondary;
    }
  };

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => navigation.navigate('OrderDetails', { orderId: item.id })}
      activeOpacity={0.7}
    >
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderId}>Order #{item.razorpayOrderId?.substring(6) || item.id.substring(0, 8).toUpperCase()}</Text>
          <Text style={styles.orderDate}>{new Date(item.createdDate).toLocaleDateString()}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '15' }]}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status || 'Created'}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.orderContent}>
        <View style={styles.itemsList}>
          {item.items?.slice(0, 2).map((orderItem, index) => (
            <View key={index} style={styles.productRow}>
              {orderItem.productImage ? (
                <Image source={{ uri: orderItem.productImage }} style={styles.productThumb} />
              ) : (
                <View style={styles.productThumbPlaceholder}><Ionicons name="image-outline" size={16} color={colors.text.disabled} /></View>
              )}
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={1}>{orderItem.productName}</Text>
                <Text style={styles.productMeta}>Qty: {orderItem.quantity} • ₹{orderItem.price}</Text>
              </View>
            </View>
          ))}
          {item.items?.length > 2 && (
            <Text style={styles.moreItemsText}>+ {item.items.length - 2} more items</Text>
          )}
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.totalLabel}>Total Paid</Text>
          <Text style={styles.totalAmount}>₹{item.totalAmount?.toFixed(2)}</Text>
          <View style={styles.detailsBtn}>
            <Text style={styles.detailsBtnText}>Details</Text>
            <Ionicons name="chevron-forward" size={12} color={colors.primary.main} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isLoading && !refreshing) return <Loading fullScreen text="Fetching your orders..." />;

  return (
    <View style={styles.container}>
      <Header title="My Orders" showBack />
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderOrderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary.main]} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}><Ionicons name="bag-handle-outline" size={40} color={colors.text.disabled} /></View>
            <Text style={styles.emptyTitle}>No orders yet</Text>
            <Text style={styles.emptySubtitle}>When you place an order, it will appear here.</Text>
            <Button title="Browse Spices" onPress={() => navigation.navigate('Products')} style={styles.shopButton} />
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.default },
  listContent: { padding: spacing.md },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  orderId: { fontSize: fontSize.sm, fontWeight: '700', color: colors.text.primary },
  orderDate: { fontSize: 11, color: colors.text.muted, marginTop: 2 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  statusText: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  divider: { height: 1, backgroundColor: colors.divider, marginVertical: spacing.sm },
  orderContent: { flexDirection: 'row', justifyContent: 'space-between' },
  itemsList: { flex: 1.8, paddingRight: spacing.sm },
  productRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  productThumb: { width: 36, height: 36, borderRadius: 6, backgroundColor: colors.background.muted, marginRight: 10 },
  productThumbPlaceholder: { width: 36, height: 36, borderRadius: 6, backgroundColor: colors.background.muted, marginRight: 10, alignItems: 'center', justifyContent: 'center' },
  productInfo: { flex: 1 },
  productName: { fontSize: 12, fontWeight: '600', color: colors.text.primary },
  productMeta: { fontSize: 10, color: colors.text.secondary, marginTop: 2 },
  moreItemsText: { fontSize: 10, color: colors.primary.main, fontWeight: '600', marginTop: 2 },
  priceContainer: { flex: 1, alignItems: 'flex-end', justifyContent: 'center', borderLeftWidth: 1, borderLeftColor: colors.divider, paddingLeft: spacing.sm },
  totalLabel: { fontSize: 9, color: colors.text.muted, textTransform: 'uppercase', letterSpacing: 0.5 },
  totalAmount: { fontSize: fontSize.md, fontWeight: 'bold', color: colors.primary.main, marginVertical: 2 },
  detailsBtn: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  detailsBtnText: { fontSize: 11, color: colors.primary.main, fontWeight: '700', marginRight: 2 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 100 },
  emptyIconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.background.muted, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  emptyTitle: { fontSize: fontSize.lg, fontWeight: 'bold', color: colors.text.primary },
  emptySubtitle: { fontSize: fontSize.sm, color: colors.text.secondary, textAlign: 'center', marginTop: spacing.sm, paddingHorizontal: spacing.xl },
  shopButton: { marginTop: spacing.xl, paddingHorizontal: spacing.xl },
});

export default OrderHistoryScreen;
