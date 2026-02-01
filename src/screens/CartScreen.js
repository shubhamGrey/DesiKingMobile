import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/common/Header';
import CartItem from '../components/cart/CartItem';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import { colors, spacing, fontSize, borderRadius } from '../config/theme';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';

const CartScreen = () => {
  const navigation = useNavigation();
  const { items, itemCount, removeItem, updateQuantity, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [enrichedItems, setEnrichedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cartTotal, setCartTotal] = useState(0);

  const currencySymbol = '₹';
  const shipping = 0;
  const taxRate = 0.05; // 5% GST
  const taxAmount = cartTotal * taxRate;
  const orderTotal = cartTotal + shipping + taxAmount;

  useEffect(() => {
    enrichCartItems();
  }, [items]);

  const enrichCartItems = async () => {
    if (items.length === 0) {
      setEnrichedItems([]);
      setCartTotal(0);
      return;
    }

    try {
      setIsLoading(true);
      let runningTotal = 0;

      // Fetch full product details for each item in the cart to ensure fresh images/names/prices
      const enriched = await Promise.all(items.map(async (item) => {
        try {
          const productData = await apiService.getProductById(item.productId);

          // Match the SKU to get the current actual price
          const matchingSku = productData.pricesAndSkus?.find(
            sku => sku.skuNumber === item.sku || sku.discountedAmount === item.price || sku.price === item.price
          ) || productData.pricesAndSkus?.[0];

          const currentPrice = matchingSku ? (matchingSku.isDiscounted ? matchingSku.discountedAmount : matchingSku.price) : item.price;

          runningTotal += (currentPrice * item.quantity);

          return {
            ...item,
            name: productData.name || item.name,
            image: productData.thumbnailUrl || (productData.imageUrls && productData.imageUrls[0]) || item.image,
            price: currentPrice,
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
    } catch (error) {
      console.error('Error enriching cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Login Required',
        'Please login to proceed with checkout.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: () => navigation.navigate('Login') },
        ]
      );
      return;
    }
    navigation.navigate('Checkout');
  };

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: clearCart },
      ]
    );
  };

  if (items.length === 0) {
    return (
      <View style={styles.container}>
        <Header title="Cart" showBack showCart={false} />
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={80} color={colors.text.disabled} />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>
            Looks like you haven't added any items yet.
          </Text>
          <Button
            title="Start Shopping"
            onPress={() => navigation.navigate('Products')}
            style={styles.shopButton}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Cart" showBack showCart={false} />
      
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </Text>
        <TouchableOpacity onPress={handleClearCart}>
          <Text style={styles.clearText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={enrichedItems.length > 0 ? enrichedItems : items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CartItem
            item={item}
            onRemove={removeItem}
            onUpdateQuantity={updateQuantity}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Order Summary */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>{currencySymbol}{cartTotal.toFixed(2)}</Text>
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
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalValue}>{currencySymbol}{orderTotal.toFixed(2)}</Text>
        </View>
        
        <Button
          title="Proceed to Checkout"
          onPress={handleCheckout}
          fullWidth
          style={styles.checkoutButton}
        />
        
        <View style={styles.secureRow}>
          <Ionicons name="shield-checkmark" size={16} color={colors.success.main} />
          <Text style={styles.secureText}>Secure Checkout by Agro Nexis</Text>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background.paper,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  headerTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text.primary,
  },
  clearText: {
    fontSize: fontSize.sm,
    color: colors.error.main,
  },
  listContent: {
    padding: spacing.md,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyTitle: {
    fontSize: fontSize.xl,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  shopButton: {
    paddingHorizontal: spacing.xl,
  },
  summaryContainer: {
    backgroundColor: colors.background.paper,
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  summaryLabel: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
  },
  summaryValue: {
    fontSize: fontSize.md,
    color: colors.text.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.sm,
  },
  totalLabel: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text.primary,
  },
  totalValue: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.primary.main,
  },
  checkoutButton: {
    marginTop: spacing.md,
  },
  secureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  secureText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginLeft: spacing.xs,
  },
});

export default CartScreen;
