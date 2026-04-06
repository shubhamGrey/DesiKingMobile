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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/common/Header';
import CartItem from '../components/cart/CartItem';
import Button from '../components/common/Button';
import { colors, spacing, fontSize, borderRadius, shadows, fonts } from '../config/theme';
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

  if (items.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0a1628" />
        <Header title="My Cart" showBack showCart={false} />
        <View style={styles.emptyState}>
          <View style={styles.emptyIconWrap}>
            <Ionicons name="cart-outline" size={48} color={colors.primary.main} />
          </View>
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

  const displayItems = enrichedItems.length > 0 ? enrichedItems : items;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a1628" />
      <Header title="My Cart" showBack showCart={false} />

      <FlatList
        data={displayItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CartItem item={item} onRemove={removeItem} onUpdateQuantity={updateQuantity} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text style={styles.countLabel}>{itemCount} {itemCount === 1 ? 'item' : 'items'}</Text>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary.main]} />
        }
      />

      {/* Summary sheet */}
      <View style={styles.summarySheet}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>₹{(cartTotal + totalDiscount).toFixed(2)}</Text>
        </View>
        {totalDiscount > 0 && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Savings</Text>
            <Text style={[styles.summaryValue, { color: colors.success }]}>−₹{totalDiscount.toFixed(2)}</Text>
          </View>
        )}
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Shipping</Text>
          <Text style={styles.summaryValue}>₹{shippingFee.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>GST (5%)</Text>
          <Text style={styles.summaryValue}>₹{taxAmount.toFixed(2)}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.totalRow}>
          <View>
            <Text style={styles.totalCaption}>Total Payable</Text>
            <Text style={styles.totalAmount}>₹{orderTotal.toFixed(2)}</Text>
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
  listContent: {
    padding: spacing.md,
    paddingBottom: 300,
  },
  countLabel: {
    fontSize: 11,
    fontFamily: fonts.body.extrabold,
    color: 'rgba(255,255,255,0.45)',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: spacing.md,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyIconWrap: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.glass.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  emptyTitle: {
    fontSize: fontSize.xl,
    fontFamily: fonts.heading.extrabold,
    color: '#fff',
    marginBottom: spacing.xs,
  },
  emptySub: {
    fontSize: fontSize.sm,
    fontFamily: fonts.body.regular,
    color: 'rgba(255,255,255,0.55)',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.xl,
  },
  shopBtn: {
    paddingHorizontal: spacing.xl,
  },
  summarySheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0d1e3d',
    borderTopLeftRadius: borderRadius.xxl,
    borderTopRightRadius: borderRadius.xxl,
    padding: spacing.lg,
    paddingBottom: spacing.xl + 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(188,129,65,0.25)',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 13,
    fontFamily: fonts.body.medium,
    color: 'rgba(255,255,255,0.55)',
  },
  summaryValue: {
    fontSize: 13,
    fontFamily: fonts.body.bold,
    color: '#fff',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
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
    color: 'rgba(255,255,255,0.45)',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  totalAmount: {
    fontSize: 26,
    fontFamily: fonts.heading.black,
    color: colors.secondary.light,
    letterSpacing: -0.5,
  },
  checkoutBtn: {
    paddingHorizontal: spacing.lg,
  },
});

export default CartScreen;
