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

      // Delete each item individually from the server cart
      try {
        await Promise.all(items.map(item => apiService.removeFromCart(item.id)));
      } catch (cartError) {
        console.warn('Silent failure clearing some items from server cart:', cartError.message);
      }

      Alert.alert('Success', 'Your premium spices are on the way!', [
        { text: 'Continue Shopping', onPress: () => {
          clearCart(); // Clears local state and async storage
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
      <StatusBar barStyle="light-content" backgroundColor="#1B4D3E" />
      <Header title="Secure Checkout" showBack />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Address Section */}
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
                <Text style={styles.itemMeta}>Quantity: {item.quantity}</Text>
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

        {/* Breakdown Card */}
        <View style={styles.breakdownCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{currencySymbol}{(checkoutTotal + totalDiscount).toFixed(2)}</Text>
          </View>

          {totalDiscount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Savings</Text>
              <Text style={[styles.summaryValue, { color: colors.success }]}>-{currencySymbol}{totalDiscount.toFixed(2)}</Text>
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
          <View style={styles.summaryRow}>
            <Text style={styles.grandTotalLabel}>Grand Total</Text>
            <Text style={styles.grandTotalValue}>{currencySymbol}{grandTotal.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.secureNote}>
          <Ionicons name="lock-closed" size={14} color={colors.text.muted} />
          <Text style={styles.secureText}>Payments are encrypted and secured by Razorpay</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={isProcessing ? "Processing..." : `Place Order • ${currencySymbol}${grandTotal.toFixed(2)}`}
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
  scrollContent: { padding: spacing.md, paddingBottom: 120 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  sectionTitle: { fontSize: 18, fontFamily: fonts.heading.extrabold, color: colors.text.primary, letterSpacing: -0.5 },
  editLink: { color: colors.secondary.main, fontFamily: fonts.body.bold, fontSize: 14 },
  addressCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    marginBottom: spacing.md,
    ...shadows.light,
    alignItems: 'center',
  },
  selectedCard: { borderColor: colors.primary.main, backgroundColor: '#f1f8e9' },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.text.disabled, marginRight: 15, alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: colors.primary.main },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary.main },
  addressType: { fontSize: 10, fontFamily: fonts.body.bold, color: colors.primary.main, textTransform: 'uppercase', marginBottom: 4 },
  addressText: { fontSize: 14, color: colors.text.secondary, lineHeight: 20 },
  previewContainer: { backgroundColor: '#fff', borderRadius: borderRadius.lg, padding: spacing.md, ...shadows.light },
  itemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: '#f9f9f9' },
  itemThumb: { width: 45, height: 45, borderRadius: 8, marginRight: 12, backgroundColor: colors.background.muted },
  itemName: { fontSize: 13, fontFamily: fonts.body.semibold, color: colors.text.primary, flex: 1 },
  itemMeta: { fontSize: 11, color: colors.text.muted, marginTop: 2 },
  itemPrice: { fontSize: 14, fontFamily: fonts.heading.bold, color: colors.text.primary },
  strikedPrice: { fontSize: 10, color: colors.text.muted, textDecorationLine: 'line-through' },
  breakdownCard: { marginTop: spacing.xl, padding: spacing.lg, backgroundColor: '#fff', borderRadius: borderRadius.lg, ...shadows.medium },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  summaryLabel: { color: colors.text.secondary, fontSize: 14 },
  summaryValue: { fontFamily: fonts.body.semibold, color: colors.text.primary, fontSize: 14 },
  divider: { height: 1, backgroundColor: '#f0f0f0', marginVertical: spacing.sm },
  grandTotalLabel: { fontSize: 16, fontFamily: fonts.heading.extrabold, color: colors.text.primary },
  grandTotalValue: { fontSize: 20, fontFamily: fonts.heading.black, color: colors.primary.main },
  secureNote: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 24, opacity: 0.6 },
  secureText: { fontSize: 11, color: colors.text.muted, marginLeft: 6 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: spacing.lg, backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, ...shadows.dark },
  placeOrderBtn: { height: 56, borderRadius: borderRadius.md },
});

export default CheckoutScreen;
