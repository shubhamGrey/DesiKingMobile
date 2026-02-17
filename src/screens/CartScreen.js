import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/common/Header';
import CartItem from '../components/cart/CartItem';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import { colors, spacing, fontSize, borderRadius, shadows } from '../config/theme';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';

const CartScreen = () => {
  const navigation = useNavigation();
  const { items, itemCount, removeItem, updateQuantity, clearCart, refreshCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [enrichedItems, setEnrichedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);

  const currencySymbol = '₹';
  const shippingFees = 100; // Updated from 0 to 100
  const taxRate = 0.05; // 5% GST
  const taxAmount = cartTotal * taxRate;
  const orderTotal = cartTotal + shippingFees + taxAmount;

  useEffect(() => {
    syncCartData();
  }, []);

  const syncCartData = async () => {
    if (isAuthenticated) {
      await refreshCart();
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await syncCartData();
    setRefreshing(false);
  };

  useEffect(() => {
    enrichCartItems();
  }, [items]);

  const enrichCartItems = async () => {
    if (items.length === 0) {
      setEnrichedItems([]);
      setCartTotal(0);
      setTotalDiscount(0);
      return;
    }

    try {
      setIsLoading(true);
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
            originalPrice: originalPrice,
            quantity: item.quantity
          };
        } catch (err) {
          console.error(`Error enriching cart item ${item.productId}:`, err);
          runningTotal += (item.price * item.quantity);
          return item;
        }
      }));

      setEnrichedItems(enriched);
      setCartTotal(runningTotal);
      setTotalDiscount(runningDiscount);
    } catch (error) {
      console.error('Error enriching cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      Alert.alert('Login Required', 'Please login to proceed.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Login', onPress: () => navigation.navigate('Login') },
      ]);
      return;
    }
    navigation.navigate('Checkout');
  };

  if (items.length === 0) {
    return (
      <View style={styles.container}>
        <Header title="My Cart" showBack showCart={false} />
        <View style={styles.emptyState}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="cart-outline" size={50} color={colors.text.disabled} />
          </View>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>Let's find some amazing spices for your kitchen!</Text>
          <Button title="Start Shopping" onPress={() => navigation.navigate('Products')} style={styles.shopBtn} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="My Cart" showBack showCart={false} />
      
      <FlatList
        data={enrichedItems.length > 0 ? enrichedItems : items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CartItem item={item} onRemove={removeItem} onUpdateQuantity={updateQuantity} />
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<Text style={styles.itemCountText}>{itemCount} Items in Cart</Text>}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary.main]} />}
      />

      {/* Modern Summary Sheet */}
      <View style={styles.summarySheet}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>{currencySymbol}{(cartTotal + totalDiscount).toFixed(2)}</Text>
        </View>

        {totalDiscount > 0 && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Savings</Text>
            <Text style={[styles.summaryValue, { color: colors.success }]}>-{currencySymbol}{totalDiscount.toFixed(2)}</Text>
          </View>
        )}

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Shipping Fees</Text>
          <Text style={styles.summaryValue}>{currencySymbol}{shippingFees.toFixed(2)}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Tax (5% GST)</Text>
          <Text style={styles.summaryValue}>{currencySymbol}{taxAmount.toFixed(2)}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.totalRow}>
          <View>
            <Text style={styles.totalLabel}>Total Payable</Text>
            <Text style={styles.totalValue}>{currencySymbol}{orderTotal.toFixed(2)}</Text>
          </View>
          <Button title="Checkout" onPress={handleCheckout} style={styles.checkoutBtn} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.default },
  listContainer: { padding: spacing.md, paddingBottom: 280 },
  itemCountText: { fontSize: 12, fontWeight: '700', color: colors.text.muted, textTransform: 'uppercase', marginBottom: spacing.md, letterSpacing: 1 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  emptyIconCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: colors.background.muted, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text.primary, marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: colors.text.secondary, textAlign: 'center', marginBottom: spacing.xl },
  shopBtn: { paddingHorizontal: 40 },
  summarySheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
    ...shadows.dark,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { fontSize: 13, color: colors.text.secondary, fontWeight: '500' },
  summaryValue: { fontSize: 13, fontWeight: '700', color: colors.text.primary },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.md },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 12, color: colors.text.muted, fontWeight: '600' },
  totalValue: { fontSize: 22, fontWeight: '900', color: colors.primary.main },
  checkoutBtn: { paddingHorizontal: 30, height: 50 },
});

export default CartScreen;
