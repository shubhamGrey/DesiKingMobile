import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/common/Header';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import { colors, spacing, fontSize, borderRadius } from '../config/theme';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';

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

  const currencySymbol = '₹';
  const shipping = 0;
  const taxRate = 0.05; // 5% GST
  const taxAmount = checkoutTotal * taxRate;
  const grandTotal = checkoutTotal + shipping + taxAmount;

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);

      // Load addresses
      if (user?.id) {
        const addrRes = await apiService.addressByUser(user.id);
        const addrData = addrRes.data || [];
        setAddresses(addrData);
        if (addrData.length > 0) setSelectedAddress(addrData[0].id);
      }

      // Enrich items with product details
      let totalValue = 0;
      const enriched = await Promise.all(items.map(async (item) => {
        try {
          const productData = await apiService.getProductById(item.productId);
          const matchingSku = productData.pricesAndSkus?.find(
            sku => sku.skuNumber === item.sku || sku.discountedAmount === item.price || sku.price === item.price
          ) || productData.pricesAndSkus?.[0];

          const currentPrice = matchingSku ? (matchingSku.isDiscounted ? matchingSku.discountedAmount : matchingSku.price) : item.price;
          totalValue += (currentPrice * item.quantity);

          return {
            ...item,
            name: productData.name || item.name,
            image: productData.thumbnailUrl || (productData.imageUrls && productData.imageUrls[0]) || item.image,
            price: currentPrice
          };
        } catch (err) {
          console.error(`Error enriching item ${item.productId}:`, err);
          totalValue += (item.price * item.quantity);
          return item;
        }
      }));

      setEnrichedItems(enriched);
      setCheckoutTotal(totalValue);
    } catch (error) {
      console.error('Checkout initialization error:', error);
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
        addressId: selectedAddress,
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          sku: item.sku,
        })),
        amount: grandTotal,
      };

      await apiService.createOrder(orderData);

      Alert.alert('Success', 'Order placed successfully!', [
        { text: 'OK', onPress: () => {
          clearCart();
          navigation.reset({
            index: 0,
            routes: [{ name: 'MainTabs' }],
          });
        }}
      ]);
    } catch (error) {
      console.error('Checkout Error:', error);
      Alert.alert('Error', 'Failed to process checkout. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) return <Loading fullScreen text="Preparing checkout..." />;

  return (
    <View style={styles.container}>
      <Header title="Checkout" showBack />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Address Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AddressBook')}>
              <Text style={styles.addLink}>Change</Text>
            </TouchableOpacity>
          </View>

          {addresses.length > 0 ? (
            addresses.map((addr) => (
              <TouchableOpacity
                key={addr.id}
                style={[styles.addressCard, selectedAddress === addr.id && styles.selectedCard]}
                onPress={() => setSelectedAddress(addr.id)}
              >
                <Ionicons
                  name={selectedAddress === addr.id ? "radio-button-on" : "radio-button-off"}
                  size={20}
                  color={selectedAddress === addr.id ? colors.primary.main : colors.text.disabled}
                  style={{ marginRight: spacing.sm }}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.addressType}>Saved Address</Text>
                  <Text style={styles.addressText}>{addr.fullAddress}</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Button title="Add Address" onPress={() => navigation.navigate('AddressBook')} variant="outline" />
          )}
        </View>

        {/* Items Summary Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          {enrichedItems.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <Image source={{ uri: item.image }} style={styles.itemThumb} />
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.itemMeta}>Qty: {item.quantity}</Text>
              </View>
              <Text style={styles.itemPrice}>
                {currencySymbol}{(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* Summary Card */}
        <View style={styles.section}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>{currencySymbol}{checkoutTotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping</Text>
              <Text style={[styles.summaryValue, { color: colors.success.main }]}>FREE</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax (5%)</Text>
              <Text style={styles.summaryValue}>{currencySymbol}{taxAmount.toFixed(2)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Grand Total</Text>
              <Text style={styles.totalValue}>{currencySymbol}{grandTotal.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={isProcessing ? "Processing..." : `Place Order • ${currencySymbol}${grandTotal.toFixed(2)}`}
          onPress={handlePlaceOrder}
          fullWidth
          loading={isProcessing}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.default },
  scrollView: { flex: 1 },
  section: { padding: spacing.md },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  sectionTitle: { fontSize: fontSize.lg, fontWeight: '700', color: colors.text.primary },
  addLink: { color: colors.primary.main, fontWeight: '600' },
  addressCard: { flexDirection: 'row', backgroundColor: '#fff', padding: spacing.md, borderRadius: borderRadius.md, borderWidth: 1, borderColor: colors.divider, marginBottom: spacing.sm },
  selectedCard: { borderColor: colors.primary.main, backgroundColor: '#f1f8e9' },
  addressType: { fontSize: 10, fontWeight: 'bold', color: colors.primary.main, marginBottom: 2, textTransform: 'uppercase' },
  addressText: { fontSize: fontSize.sm, color: colors.text.primary },
  itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm, backgroundColor: '#fff', padding: spacing.sm, borderRadius: borderRadius.sm },
  itemThumb: { width: 40, height: 40, borderRadius: 4, marginRight: spacing.sm },
  itemName: { fontSize: fontSize.sm, fontWeight: '500', flex: 1 },
  itemMeta: { fontSize: 11, color: colors.text.secondary },
  itemPrice: { fontSize: fontSize.sm, fontWeight: '600', marginLeft: spacing.sm },
  summaryCard: { backgroundColor: '#fff', padding: spacing.md, borderRadius: borderRadius.md, borderWidth: 1, borderColor: colors.divider },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs },
  summaryLabel: { color: colors.text.secondary },
  divider: { height: 1, backgroundColor: colors.divider, marginVertical: spacing.sm },
  totalLabel: { fontSize: fontSize.md, fontWeight: 'bold' },
  totalValue: { fontSize: fontSize.lg, fontWeight: 'bold', color: colors.primary.main },
  footer: { padding: spacing.md, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: colors.divider },
});

export default CheckoutScreen;
