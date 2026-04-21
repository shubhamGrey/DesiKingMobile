import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  StatusBar,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import CartItem from '../components/cart/CartItem';
import Button from '../components/common/Button';
import { colors, spacing, fontSize, borderRadius, shadows, fonts } from '../config/theme';
import LottieView from 'lottie-react-native';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';

const CartScreen = () => {
  const navigation = useNavigation();
  const { items, itemCount, removeItem, updateQuantity, refreshCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [enrichedItems, setEnrichedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);

  const shippingFee = 100;
  const taxRate = 0.05;
  const taxAmount = cartTotal * taxRate;
  const orderTotal = cartTotal + shippingFee + taxAmount;

  useEffect(() => {
    if (isAuthenticated) refreshCart();
  }, []);

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
      let total = 0, discount = 0;
      const enriched = await Promise.all(items.map(async (item) => {
        try {
          const p = await apiService.getProductById(item.productId);
          const sku = p.pricesAndSkus?.find(s => s.skuNumber === item.sku || s.discountedAmount === item.price || s.price === item.price) || p.pricesAndSkus?.[0];
          const current = sku ? (sku.isDiscounted ? sku.discountedAmount : sku.price) : item.price;
          const original = sku ? sku.price : (item.originalPrice || current);
          total += current * item.quantity;
          if (original > current) discount += (original - current) * item.quantity;
          return { ...item, name: p.name || item.name, image: p.thumbnailUrl || p.imageUrls?.[0] || item.image, price: current, originalPrice: original };
        } catch {
          total += item.price * item.quantity;
          return item;
        }
      }));
      setEnrichedItems(enriched);
      setCartTotal(total);
      setTotalDiscount(discount);
    } catch (err) {
      console.error('Cart enrichment error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      Alert.alert('Login Required', 'Please login to proceed to checkout.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Login', onPress: () => navigation.navigate('Login') },
      ]);
      return;
    }
    navigation.navigate('Checkout');
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (isAuthenticated) await refreshCart();
    setRefreshing(false);
  };

  const displayItems = enrichedItems.length > 0 ? enrichedItems : items;

  if (items.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={colors.primary.main} />
        <View style={styles.header}>
          <View style={styles.blobA} />
          <View style={styles.headerInner}>
            <Text style={styles.headerEye}>✦ Shopping</Text>
            <Text style={styles.headerTitle}>My Cart</Text>
            <Text style={styles.headerSub}>0 items</Text>
          </View>
          <View style={styles.headerWave} />
        </View>
        <View style={styles.emptyState}>
          <LottieView
            source={require('../../assets/lottie/fork.json')}
            autoPlay
            loop
            style={styles.emptyLottie}
          />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySub}>Let's find some amazing spices for your kitchen!</Text>
          <Button
            title="Start Shopping"
            onPress={() => navigation.navigate('Products')}
            size="large"
            icon="bag-outline"
            style={styles.shopBtn}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary.main} />

      {/* Green header */}
      <View style={styles.header}>
        <View style={styles.blobA} />
        <View style={styles.headerInner}>
          <Text style={styles.headerEye}>✦ Shopping</Text>
          <Text style={styles.headerTitle}>My Cart</Text>
          <Text style={styles.headerSub}>{itemCount} {itemCount === 1 ? 'item' : 'items'}</Text>
        </View>
        <View style={styles.headerWave} />
      </View>

      <FlatList
        data={displayItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CartItem item={item} onRemove={removeItem} onUpdateQuantity={updateQuantity} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary.main]} tintColor={colors.primary.main} />
        }
      />

      {/* Summary sheet */}
      <View style={styles.summarySheet}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>₹{(cartTotal + totalDiscount).toFixed(0)}</Text>
        </View>
        {totalDiscount > 0 && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Savings</Text>
            <Text style={[styles.summaryValue, styles.savingsValue]}>−₹{totalDiscount.toFixed(0)}</Text>
          </View>
        )}
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Shipping</Text>
          <Text style={styles.summaryValue}>₹{shippingFee.toFixed(0)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>GST (5%)</Text>
          <Text style={styles.summaryValue}>₹{taxAmount.toFixed(0)}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.totalRow}>
          <View>
            <Text style={styles.totalCaption}>Total Payable</Text>
            <Text style={styles.totalAmount}>₹{orderTotal.toFixed(0)}</Text>
          </View>
          <Button
            title="Checkout"
            onPress={handleCheckout}
            size="large"
            icon="arrow-forward"
            style={styles.checkoutBtn}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },

  // Green header
  header: {
    backgroundColor: colors.primary.main,
    paddingTop: Platform.OS === 'ios' ? 54 : 38,
    paddingHorizontal: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  blobA: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.055)',
    top: -60,
    right: -40,
  },
  headerInner: {
    position: 'relative',
    zIndex: 2,
    paddingBottom: 30,
  },
  headerEye: {
    fontFamily: fonts.body.bold,
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    letterSpacing: 1.8,
    marginBottom: 4,
  },
  headerTitle: {
    fontFamily: fonts.heading.extrabold,
    fontSize: 32,
    color: '#fff',
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  headerSub: {
    fontFamily: fonts.body.regular,
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
  },
  headerWave: {
    height: 24,
    backgroundColor: colors.background.default,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginHorizontal: -20,
    position: 'relative',
    zIndex: 3,
  },

  // List
  listContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: 280,
  },

  // Empty state
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyLottie: {
    width: 160,
    height: 160,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: fonts.heading.extrabold,
    color: colors.text.primary,
    marginBottom: 6,
  },
  emptySub: {
    fontSize: fontSize.sm,
    fontFamily: fonts.body.regular,
    color: colors.text.muted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.xl,
  },
  shopBtn: {
    paddingHorizontal: spacing.xl,
  },

  // Summary sheet
  summarySheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background.cream,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: spacing.lg,
    paddingBottom: spacing.xl + 8,
    borderTopWidth: 1.5,
    borderTopColor: colors.card.border,
    shadowColor: colors.primary.main,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 13,
    fontFamily: fonts.body.medium,
    color: colors.text.secondary,
  },
  summaryValue: {
    fontSize: 13,
    fontFamily: fonts.body.bold,
    color: colors.text.primary,
  },
  savingsValue: {
    color: colors.success,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.md,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalCaption: {
    fontSize: 11,
    fontFamily: fonts.body.semibold,
    color: colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  totalAmount: {
    fontSize: 30,
    fontFamily: fonts.heading.extrabold,
    color: colors.primary.main,
    letterSpacing: -0.5,
  },
  checkoutBtn: {
    paddingHorizontal: spacing.lg,
  },
});

export default CartScreen;
