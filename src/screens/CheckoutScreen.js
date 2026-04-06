import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/common/Header';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import { colors, spacing, fontSize, borderRadius, shadows, fonts } from '../config/theme';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';

const { width } = Dimensions.get('window');

const CheckoutScreen = () => {
  const navigation = useNavigation();
  const { items, clearCart } = useCart();
  const { user } = useAuth();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [enrichedItems, setEnrichedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutTotal, setCheckoutTotal] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);

  const currencySymbol = '₹';
  const taxRate = 0.05;
  const shippingFees = 100;
  const taxAmount = checkoutTotal * taxRate;
  const grandTotal = checkoutTotal + taxAmount + shippingFees;

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      if (user?.id) {
        const addrRes = await apiService.addressByUser(user.id);
        const addrData = addrRes.data || [];
        setAddresses(addrData);
        if (addrData.length > 0) setSelectedAddress(addrData[0].id);
      }

      let runningTotal = 0;
      let runningDiscount = 0;

      const enriched = await Promise.all(items.map(async (item) => {
        try {
          const productData = await apiService.getProductById(item.productId);
          const matchingSku = productData.pricesAndSkus?.find(
            sku => sku.skuNumber === item.sku || sku.discountedAmount === item.price || sku.price === item.price
          ) || productData.pricesAndSkus?.[0];

          const currentPrice = matchingSku ? (matchingSku.isDiscounted ? matchingSku.discountedAmount : matchingSku.price) : item.price;
          const originalPrice = matchingSku ? matchingSku.price : (item.originalPrice || currentPrice);

          runningTotal += (currentPrice * item.quantity);
          if (originalPrice > currentPrice) {
            runningDiscount += (originalPrice - currentPrice) * item.quantity;
          }

          return {
            ...item,
            name: productData.name || item.name,
            image: productData.thumbnailUrl || (productData.imageUrls && productData.imageUrls[0]) || item.image,
            price: currentPrice,
            originalPrice: originalPrice
          };
        } catch (err) {
          console.error(`Error enriching item ${item.productId}:`, err);
          runningTotal += (item.price * item.quantity);
          return item;
        }
      }));

      setEnrichedItems(enriched);
      setCheckoutTotal(runningTotal);
      setTotalDiscount(runningDiscount);
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      Alert.alert('Selection Required', 'Please select a delivery address.');
      return;
    }

    try {
      setIsProcessing(true);
      const orderData = {
        userId: user.id,
        totalAmount: grandTotal,
        currency: 'INR',
        paymentMethod: 'RAZORPAY',
        shippingAddressId: selectedAddress,
        billingAddressId: selectedAddress,
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      await apiService.createOrder(orderData);

      try {
        await Promise.all(items.map(item => apiService.removeFromCart(item.id)));
      } catch (cartError) {
        console.warn('Silent failure clearing some items from server cart:', cartError.message);
      }

      Alert.alert('Success', 'Your premium spices are on the way!', [
        { text: 'Continue Shopping', onPress: () => {
          clearCart();
          navigation.reset({ index: 0, routes: [{ name: 'MainTabs', params: { screen: 'Home' } }] });
        }}
      ]);
    } catch (error) {
      console.error('Order creation failed:', error);
      Alert.alert('Error', 'Failed to process order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) return <Loading fullScreen />;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a1628" />
      <Header title="Secure Checkout" showBack />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Delivery Address */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Delivery To</Text>
          <TouchableOpacity onPress={() => navigation.navigate('AddressBook')}>
            <Text style={styles.editLink}>Change</Text>
          </TouchableOpacity>
        </View>

        {addresses.length > 0 ? (
          addresses.map((addr) => (
            <TouchableOpacity
              key={addr.id}
              style={[styles.addressCard, selectedAddress === addr.id && styles.selectedCard]}
              onPress={() => setSelectedAddress(addr.id)}
              activeOpacity={0.8}
            >
              <View style={[styles.radio, selectedAddress === addr.id && styles.radioActive]}>
                {selectedAddress === addr.id && <View style={styles.radioInner} />}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.addressType}>Saved Location</Text>
                <Text style={styles.addressText} numberOfLines={2}>{addr.fullAddress}</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyAddress}>
            <Text style={styles.emptyText}>No addresses found.</Text>
            <Button title="Add New Address" onPress={() => navigation.navigate('AddressBook')} variant="outline" />
          </View>
        )}

        {/* Order Preview */}
        <Text style={[styles.sectionTitle, { marginTop: spacing.xl, marginBottom: spacing.md }]}>Order Preview</Text>
        <View style={styles.previewContainer}>
          {enrichedItems.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <Image source={{ uri: item.image }} style={styles.itemThumb} />
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemMeta}>Qty: {item.quantity}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.itemPrice}>{currencySymbol}{(item.price * item.quantity).toFixed(2)}</Text>
                {item.originalPrice > item.price && (
                  <Text style={styles.strikedPrice}>₹{(item.originalPrice * item.quantity).toFixed(0)}</Text>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Breakdown */}
        <View style={styles.breakdownCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{currencySymbol}{(checkoutTotal + totalDiscount).toFixed(2)}</Text>
          </View>
          {totalDiscount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Savings</Text>
              <Text style={[styles.summaryValue, { color: colors.success }]}>−{currencySymbol}{totalDiscount.toFixed(2)}</Text>
            </View>
          )}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping Fee</Text>
            <Text style={styles.summaryValue}>{currencySymbol}{shippingFees.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>GST (5%)</Text>
            <Text style={styles.summaryValue}>{currencySymbol}{taxAmount.toFixed(2)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>Grand Total</Text>
            <Text style={styles.grandTotalValue}>{currencySymbol}{grandTotal.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.secureNote}>
          <Ionicons name="lock-closed" size={13} color={colors.text.muted} />
          <Text style={styles.secureText}>Payments encrypted & secured by Razorpay</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={isProcessing ? 'Processing...' : `Place Order • ${currencySymbol}${grandTotal.toFixed(2)}`}
          onPress={handlePlaceOrder}
          fullWidth
          loading={isProcessing}
          style={styles.placeOrderBtn}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.default },
  scrollView: { flex: 1 },
  scrollContent: { padding: spacing.md, paddingBottom: 130 },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  sectionTitle: { fontSize: 18, fontFamily: fonts.heading.extrabold, color: colors.text.primary, letterSpacing: -0.5 },
  editLink: { color: colors.secondary.main, fontFamily: fonts.body.bold, fontSize: 14 },

  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.glass.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.glass.border,
    marginBottom: spacing.md,
  },
  selectedCard: {
    borderColor: colors.secondary.main,
    backgroundColor: colors.glass.gold,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    marginRight: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: { borderColor: colors.secondary.main },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.secondary.main },
  addressType: { fontSize: 10, fontFamily: fonts.body.extrabold, color: colors.secondary.light, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 },
  addressText: { fontSize: 13, color: colors.text.secondary, lineHeight: 19 },

  emptyAddress: { alignItems: 'center', padding: spacing.xl },
  emptyText: { color: colors.text.muted, fontFamily: fonts.body.regular, marginBottom: spacing.md },

  previewContainer: {
    backgroundColor: colors.glass.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  itemThumb: { width: 44, height: 44, borderRadius: 8, marginRight: 12, backgroundColor: colors.background.muted },
  itemName: { fontSize: 13, fontFamily: fonts.body.semibold, color: colors.text.primary, marginBottom: 2 },
  itemMeta: { fontSize: 11, color: colors.text.muted },
  itemPrice: { fontSize: 14, fontFamily: fonts.heading.bold, color: colors.text.primary },
  strikedPrice: { fontSize: 10, color: colors.text.disabled, textDecorationLine: 'line-through' },

  breakdownCard: {
    marginTop: spacing.lg,
    padding: spacing.lg,
    backgroundColor: '#0d1e3d',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(188,129,65,0.2)',
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryLabel: { color: colors.text.muted, fontSize: 13, fontFamily: fonts.body.medium },
  summaryValue: { fontFamily: fonts.body.semibold, color: colors.text.primary, fontSize: 13 },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.08)', marginVertical: spacing.sm },
  grandTotalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  grandTotalLabel: { fontSize: 14, fontFamily: fonts.body.extrabold, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 0.5 },
  grandTotalValue: { fontSize: 24, fontFamily: fonts.heading.black, color: colors.secondary.light, letterSpacing: -0.5 },

  secureNote: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: spacing.lg, opacity: 0.7 },
  secureText: { fontSize: 11, color: colors.text.muted, marginLeft: 6 },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    paddingBottom: spacing.lg + 4,
    backgroundColor: '#0d1e3d',
    borderTopLeftRadius: borderRadius.xxl,
    borderTopRightRadius: borderRadius.xxl,
    borderTopWidth: 1,
    borderTopColor: 'rgba(188,129,65,0.25)',
  },
  placeOrderBtn: { height: 56, borderRadius: borderRadius.md },
});

export default CheckoutScreen;