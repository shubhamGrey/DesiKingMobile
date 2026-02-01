import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/common/Header';
import Loading from '../components/common/Loading';
import { colors, spacing, fontSize, borderRadius } from '../config/theme';
import apiService from '../services/api';

const OrderDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { orderId } = route.params;
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { loadOrderDetails(); }, [orderId]);

  const loadOrderDetails = async () => {
    try {
      setIsLoading(true);
      // 1. Fetch order details using the ID
      const response = await apiService.request(`/checkout/order/${orderId}`);
      const orderData = response.data;

      // 2. Fetch product details for each item in 'orderItems' to get thumbnails and names
      if (orderData.orderItems && orderData.orderItems.length > 0) {
        const enrichedItems = await Promise.all(orderData.orderItems.map(async (item) => {
          try {
            // Fetch product details from Product API
            const productRes = await apiService.request(`/product/${item.productId}`);
            const productData = productRes;

            return {
              ...item,
              productName: productData.name || 'Agro Nexis Product',
              productImage: productData.thumbnailUrl || (productData.imageUrls && productData.imageUrls[0]),
            };
          } catch (err) {
            console.error(`Error fetching product ${item.productId}:`, err);
            return item;
          }
        }));
        orderData.items = enrichedItems;
      }

      setOrder(orderData);
    } catch (error) {
      console.error('Error loading order details:', error);
      Alert.alert('Error', 'Could not load order details');
    } finally { setIsLoading(false); }
  };

  if (isLoading) return <Loading fullScreen text="Loading order details..." />;
  if (!order) return <View style={styles.center}><Text>Order not found</Text></View>;

  return (
    <View style={styles.container}>
      <Header title="Order Details" showBack />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Status Card */}
        <View style={styles.card}>
          <View style={styles.statusHeader}>
            <Text style={styles.orderIdText}>Order #{order.razorpayOrderId || order.id?.substring(0,8).toUpperCase()}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '15' }]}>
              <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>{order.status || 'Confirmed'}</Text>
            </View>
          </View>
          <Text style={styles.orderDate}>Placed on {new Date(order.createdDate).toLocaleDateString()}</Text>
          {order.docketNumber && (
            <Text style={styles.docketText}>Tracking ID: {order.docketNumber}</Text>
          )}
        </View>

        {/* Shipping Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipping Address</Text>
          <Text style={styles.addressName}>{order.shippingAddress?.fullName}</Text>
          <Text style={styles.addressText}>{order.shippingAddress?.addressLine}</Text>
          <Text style={styles.addressText}>
            {order.shippingAddress?.city}, {order.shippingAddress?.stateCode} - {order.shippingAddress?.pinCode}
          </Text>
          <Text style={styles.addressText}>Phone: {order.shippingAddress?.phoneNumber}</Text>
        </View>

        {/* Items Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Items Ordered</Text>
          {order.items?.map((item, i) => (
            <View key={i} style={styles.itemRow}>
              <Image
                source={{ uri: item.productImage || 'https://via.placeholder.com/60' }}
                style={styles.itemImage}
              />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.productName}</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.itemMeta}>Qty: {item.quantity} × </Text>
                  <Text style={styles.discountedPrice}>₹{item.price}</Text>
                </View>
              </View>
              <Text style={styles.itemTotal}>₹{(item.price * item.quantity).toFixed(2)}</Text>
            </View>
          ))}
        </View>

        {/* Summary Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>₹{order.totalAmount?.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text style={styles.summaryValue}>₹0</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Grand Total</Text>
            <Text style={styles.totalValue}>₹{order.totalAmount?.toFixed(2)}</Text>
          </View>
          <Text style={styles.currencyNote}>Prices in {order.currency || 'INR'}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'paid':
    case 'delivered': return colors.success.main;
    case 'created':
    case 'pending': return colors.warning.main;
    default: return colors.primary.main;
  }
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.default },
  scrollContent: { padding: spacing.md },
  card: { backgroundColor: '#fff', padding: spacing.md, borderRadius: borderRadius.md, marginBottom: spacing.md, elevation: 1 },
  statusHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderIdText: { fontSize: fontSize.md, fontWeight: 'bold', color: colors.text.primary },
  statusBadge: { paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: borderRadius.sm },
  statusText: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  orderDate: { fontSize: fontSize.xs, color: colors.text.secondary, marginTop: 4 },
  docketText: { fontSize: fontSize.xs, color: colors.primary.main, marginTop: 4, fontWeight: '600' },
  section: { backgroundColor: '#fff', padding: spacing.md, borderRadius: borderRadius.md, marginBottom: spacing.md, elevation: 1 },
  sectionTitle: { fontSize: fontSize.md, fontWeight: 'bold', color: colors.primary.main, marginBottom: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.divider, paddingBottom: 5 },
  itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  itemImage: { width: 50, height: 50, borderRadius: borderRadius.sm, backgroundColor: '#f5f5f5', marginRight: spacing.md },
  itemInfo: { flex: 1 },
  itemName: { fontSize: fontSize.sm, fontWeight: '500', color: colors.text.primary },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  itemMeta: { fontSize: 11, color: colors.text.secondary },
  discountedPrice: { fontSize: 11, fontWeight: 'bold', color: colors.text.primary },
  itemTotal: { fontSize: fontSize.sm, fontWeight: 'bold', color: colors.text.primary },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs },
  summaryLabel: { fontSize: fontSize.sm, color: colors.text.secondary },
  summaryValue: { fontSize: fontSize.sm, color: colors.text.primary },
  totalRow: { borderTopWidth: 1, borderTopColor: colors.divider, paddingTop: spacing.sm, marginTop: spacing.sm },
  totalLabel: { fontWeight: 'bold', fontSize: fontSize.md, color: colors.text.primary },
  totalValue: { fontWeight: 'bold', fontSize: fontSize.lg, color: colors.primary.main },
  currencyNote: { fontSize: 10, color: colors.text.disabled, textAlign: 'right', marginTop: 4 },
  addressName: { fontWeight: 'bold', fontSize: fontSize.sm, marginBottom: 4 },
  addressText: { fontSize: fontSize.sm, color: colors.text.secondary, marginBottom: 2 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});

export default OrderDetailsScreen;
