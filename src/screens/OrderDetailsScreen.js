import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Image, StatusBar } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/common/Header';
import Loading from '../components/common/Loading';
import { colors, spacing, fontSize, borderRadius, fonts } from '../config/theme';
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
      const response = await apiService.getOrderById(orderId);
      const orderData = response.data;

      if (orderData.orderItems && orderData.orderItems.length > 0) {
        const enrichedItems = await Promise.all(orderData.orderItems.map(async (item) => {
          try {
            const productData = await apiService.request(`/product/${item.productId}`);
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
      default: return colors.text.muted;
    }
  };

  if (isLoading) return <Loading fullScreen text="Loading details..." />;
  if (!order) return (
    <View style={styles.center}>
      <Text style={{ color: colors.text.muted }}>Order not found</Text>
    </View>
  );

  const totalPaid = order.totalAmount || 0;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a1628" />
      <Header title="Order Details" showBack />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Status Card */}
        <View style={styles.card}>
          <View style={styles.statusHeader}>
            <View>
              <Text style={styles.orderIdLabel}>Order ID</Text>
              <Text style={styles.orderId}>#{order.razorpayOrderId?.substring(6) || order.id?.substring(0, 8).toUpperCase()}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '20' }]}>
              <View style={[styles.statusDot, { backgroundColor: getStatusColor(order.status) }]} />
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
              <Ionicons name="location-outline" size={14} color={colors.secondary.main} />
              <Text style={styles.trackingText}>Tracking: {order.docketNumber}</Text>
            </View>
          )}
        </View>

        {/* Shipping Address */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconCircle}>
              <Ionicons name="map-outline" size={16} color={colors.secondary.main} />
            </View>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
          </View>
          <Text style={styles.addressName}>{order.shippingAddress?.fullName}</Text>
          <Text style={styles.addressText}>{order.shippingAddress?.addressLine}</Text>
          <Text style={styles.addressText}>
            {order.shippingAddress?.city}, {order.shippingAddress?.stateCode} — {order.shippingAddress?.pinCode}
          </Text>
          <View style={styles.phoneRow}>
            <Ionicons name="call-outline" size={12} color={colors.text.muted} />
            <Text style={styles.phoneText}>{order.shippingAddress?.phoneNumber}</Text>
          </View>
        </View>

        {/* Items Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconCircle}>
              <Ionicons name="bag-handle-outline" size={16} color={colors.secondary.main} />
            </View>
            <Text style={styles.sectionTitle}>Items Ordered</Text>
          </View>
          {order.items?.map((item, i) => (
            <View key={i} style={[styles.itemRow, i < order.items.length - 1 && styles.itemRowBorder]}>
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

        {/* Payment Summary */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconCircle}>
              <Ionicons name="receipt-outline" size={16} color={colors.secondary.main} />
            </View>
            <Text style={styles.sectionTitle}>Payment Summary</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total Paid</Text>
            <Text style={styles.totalValue}>₹{totalPaid.toFixed(2)}</Text>
          </View>
          <Text style={styles.paymentMethod}>via {order.transaction?.paymentMethod || 'RAZORPAY'}</Text>
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.default },
  scrollContent: { padding: spacing.md, paddingBottom: spacing.xxl },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background.default },

  card: {
    backgroundColor: colors.glass.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  statusHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  orderIdLabel: { fontSize: 10, color: colors.text.muted, textTransform: 'uppercase', letterSpacing: 1 },
  orderId: { fontSize: fontSize.md, fontFamily: fonts.heading.bold, color: colors.text.primary, marginTop: 2 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  statusText: { fontSize: 10, fontFamily: fonts.body.extrabold, textTransform: 'uppercase' },
  divider: { height: 1, backgroundColor: colors.divider, marginVertical: spacing.sm },
  dateRow: { flexDirection: 'row', alignItems: 'center' },
  dateText: { fontSize: 12, color: colors.text.muted, marginLeft: 6 },
  trackingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  trackingText: { fontSize: 12, color: colors.secondary.main, fontFamily: fonts.body.semibold, marginLeft: 6 },

  section: {
    backgroundColor: colors.glass.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  sectionIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(188,129,65,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  sectionTitle: { fontSize: 14, fontFamily: fonts.heading.bold, color: colors.text.primary },

  addressName: { fontSize: 14, fontFamily: fonts.body.bold, color: colors.text.primary, marginBottom: 4 },
  addressText: { fontSize: 13, color: colors.text.secondary, lineHeight: 19 },
  phoneRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  phoneText: { fontSize: 12, color: colors.text.secondary, fontFamily: fonts.body.medium, marginLeft: 4 },

  itemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm },
  itemRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.divider },
  itemImage: { width: 48, height: 48, borderRadius: 8, backgroundColor: colors.background.muted, marginRight: 12 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 13, fontFamily: fonts.body.semibold, color: colors.text.primary },
  itemMeta: { fontSize: 11, color: colors.text.muted, marginTop: 2 },
  itemTotal: { fontSize: 14, fontFamily: fonts.heading.bold, color: colors.text.primary },

  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  totalLabel: { fontSize: 14, fontFamily: fonts.body.extrabold, color: colors.text.secondary },
  totalValue: { fontSize: 22, fontFamily: fonts.heading.black, color: colors.secondary.light, letterSpacing: -0.5 },
  paymentMethod: { fontSize: 10, color: colors.text.muted, textAlign: 'right', fontFamily: fonts.body.regular, marginTop: 2 },
});

export default OrderDetailsScreen;
