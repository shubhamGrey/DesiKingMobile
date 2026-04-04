import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/common/Header';
import Loading from '../components/common/Loading';
import { colors, spacing, fontSize, borderRadius, shadows } from '../config/theme';
import apiService from '../services/api';

const { width } = Dimensions.get('window');

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
      // Fixed URL: Remove extra /order/ segment to match web app pattern
      const response = await apiService.request(`/checkout/order/${orderId}`);
      const orderData = response.data;

      if (orderData.orderItems && orderData.orderItems.length > 0) {
        const enrichedItems = await Promise.all(orderData.orderItems.map(async (item) => {
          try {
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

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
      case 'delivered': return colors.success;
      case 'created':
      case 'pending': return colors.secondary.main;
      case 'shipped': return '#2196F3';
      case 'cancelled': return colors.error.main;
      default: return colors.text.secondary;
    }
  };

  if (isLoading) return <Loading fullScreen text="Loading details..." />;
  if (!order) return <View style={styles.center}><Text>Order not found</Text></View>;

  const shippingFees = 100;
  const taxRate = 0.05; // 5% GST
  const taxAmount = (order.totalAmount || 0) * taxRate;
  const subTotal = (order.totalAmount || 0);
  const grandTotal = subTotal + taxAmount + shippingFees;

  return (
    <View style={styles.container}>
      <Header title="Order Details" showBack />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Status Card */}
        <View style={styles.card}>
          <View style={styles.statusHeader}>
            <View>
              <Text style={styles.orderIdLabel}>Order ID</Text>
              <Text style={styles.orderId}>#{order.razorpayOrderId?.substring(6) || order.id?.substring(0,8).toUpperCase()}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '15' }]}>
              <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>{order.status || 'Confirmed'}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.dateRow}>
            <Ionicons name="calendar-outline" size={14} color={colors.text.muted} />
            <Text style={styles.dateText}>Placed on {new Date(order.createdDate).toLocaleDateString()}</Text>
          </View>
          {order.docketNumber && (
            <View style={styles.trackingRow}>
              <Ionicons name="location-outline" size={14} color={colors.primary.main} />
              <Text style={styles.trackingText}>Tracking: {order.docketNumber}</Text>
            </View>
          )}
        </View>

        {/* Shipping Address */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="map-outline" size={18} color={colors.primary.main} />
            <Text style={styles.sectionTitle}>Delivery Address</Text>
          </View>
          <Text style={styles.addressName}>{order.shippingAddress?.fullName}</Text>
          <Text style={styles.addressText}>{order.shippingAddress?.addressLine}</Text>
          <Text style={styles.addressText}>
            {order.shippingAddress?.city}, {order.shippingAddress?.stateCode} - {order.shippingAddress?.pinCode}
          </Text>
          <View style={styles.phoneRow}>
            <Ionicons name="call-outline" size={12} color={colors.text.muted} />
            <Text style={styles.phoneText}>{order.shippingAddress?.phoneNumber}</Text>
          </View>
        </View>

        {/* Items Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="bag-handle-outline" size={18} color={colors.primary.main} />
            <Text style={styles.sectionTitle}>Items Ordered</Text>
          </View>
          {order.items?.map((item, i) => (
            <View key={i} style={styles.itemRow}>
              <Image
                source={{ uri: item.productImage || 'https://via.placeholder.com/60' }}
                style={styles.itemImage}
              />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName} numberOfLines={1}>{item.productName}</Text>
                <Text style={styles.itemMeta}>Qty: {item.quantity} × ₹{item.price}</Text>
              </View>
              <Text style={styles.itemTotal}>₹{(item.price * item.quantity).toFixed(2)}</Text>
            </View>
          ))}
        </View>

        {/* Summary Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="receipt-outline" size={18} color={colors.primary.main} />
            <Text style={styles.sectionTitle}>Payment Summary</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>₹{subTotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping Fee</Text>
            <Text style={styles.summaryValue}>₹{shippingFees.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax (5%)</Text>
            <Text style={styles.summaryValue}>₹{taxAmount.toFixed(2)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>₹{grandTotal.toFixed(2)}</Text>
          </View>
          <Text style={styles.paymentMethod}>Payment Mode: {order.transaction?.paymentMethod || 'RAZORPAY'}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.default },
  scrollContent: { padding: spacing.md },
  card: { backgroundColor: '#fff', padding: spacing.md, borderRadius: borderRadius.md, marginBottom: spacing.md, ...shadows.sm, borderWidth: 1, borderColor: colors.border },
  statusHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  orderIdLabel: { fontSize: 10, color: colors.text.muted, textTransform: 'uppercase', letterSpacing: 1 },
  orderId: { fontSize: fontSize.md, fontWeight: 'bold', color: colors.text.primary, marginTop: 2 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  statusText: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  divider: { height: 1, backgroundColor: colors.divider, marginVertical: spacing.sm },
  dateRow: { flexDirection: 'row', alignItems: 'center' },
  dateText: { fontSize: 12, color: colors.text.secondary, marginLeft: 6 },
  trackingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  trackingText: { fontSize: 12, color: colors.primary.main, fontWeight: '600', marginLeft: 6 },
  section: { backgroundColor: '#fff', padding: spacing.md, borderRadius: borderRadius.md, marginBottom: spacing.md, ...shadows.sm, borderWidth: 1, borderColor: colors.border },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: colors.text.primary, marginLeft: 8 },
  addressName: { fontSize: 14, fontWeight: '700', color: colors.text.primary, marginBottom: 4 },
  addressText: { fontSize: 13, color: colors.text.secondary, lineHeight: 18 },
  phoneRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  phoneText: { fontSize: 12, color: colors.text.primary, fontWeight: '600', marginLeft: 4 },
  itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  itemImage: { width: 48, height: 48, borderRadius: 8, backgroundColor: colors.background.muted, marginRight: 12 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 13, fontWeight: '600', color: colors.text.primary },
  itemMeta: { fontSize: 11, color: colors.text.secondary, marginTop: 2 },
  itemTotal: { fontSize: 14, fontWeight: 'bold', color: colors.text.primary },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  summaryLabel: { fontSize: 13, color: colors.text.secondary },
  summaryValue: { fontSize: 13, color: colors.text.primary, fontWeight: '600' },
  totalLabel: { fontSize: 15, fontWeight: '800', color: colors.text.primary },
  totalValue: { fontSize: 18, fontWeight: '900', color: colors.primary.main },
  paymentMethod: { fontSize: 10, color: colors.text.muted, marginTop: spacing.sm, textAlign: 'right', fontStyle: 'italic' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});

export default OrderDetailsScreen;
