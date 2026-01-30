import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius } from '../../config/theme';
import { useCart } from '../../context/CartContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - spacing.md * 3) / 2;

const ProductCard = ({ product, onPress }) => {
  const { addItem, isInCart } = useCart();
  const inCart = isInCart(product.id);
  
  const pricing = product.pricesAndSkus?.[0];
  const price = pricing?.price || 0;
  const discountedPrice = pricing?.discountedAmount;
  const hasDiscount = pricing?.isDiscounted && discountedPrice;
  const currencySymbol = '₹';
  const weightLabel = pricing ? `${pricing.weightValue}${pricing.weightUnit}` : '';

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: `${product.name}${weightLabel ? ` - ${weightLabel}` : ''}`,
      price: hasDiscount ? discountedPrice : price,
      image: product.thumbnailUrl || product.imageUrls?.[0],
      brandId: product.brandId,
      sku: pricing?.skuNumber,
    });
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
      testID={`product-card-${product.id}`}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.thumbnailUrl || product.imageUrls?.[0] || 'https://via.placeholder.com/150' }}
          style={styles.image}
          resizeMode="contain"
        />
        {hasDiscount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>
              {Math.round(pricing.discountPercentage)}% OFF
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        
        {weightLabel && (
          <Text style={styles.weight}>{weightLabel}</Text>
        )}
        
        <View style={styles.priceRow}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>
              {currencySymbol}{hasDiscount ? discountedPrice : price}
            </Text>
            {hasDiscount && (
              <Text style={styles.originalPrice}>
                {currencySymbol}{price}
              </Text>
            )}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.addButton, inCart && styles.addedButton]}
          onPress={handleAddToCart}
          testID={`add-to-cart-${product.id}`}
        >
          <Ionicons
            name={inCart ? 'checkmark' : 'add'}
            size={18}
            color="#fff"
          />
          <Text style={styles.addButtonText}>
            {inCart ? 'Added' : 'Add'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.divider,
  },
  imageContainer: {
    width: '100%',
    height: CARD_WIDTH * 0.9,
    backgroundColor: '#f5f5f5',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: spacing.xs,
    left: spacing.xs,
    backgroundColor: colors.error.main,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  discountText: {
    color: '#fff',
    fontSize: fontSize.xs,
    fontWeight: 'bold',
  },
  content: {
    padding: spacing.sm,
  },
  name: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.xs,
    minHeight: 36,
  },
  weight: {
    fontSize: fontSize.xs,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.primary.main,
  },
  originalPrice: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    textDecorationLine: 'line-through',
    marginLeft: spacing.xs,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary.main,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.sm,
  },
  addedButton: {
    backgroundColor: colors.success.main,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: spacing.xs,
    fontSize: fontSize.sm,
  },
});

export default ProductCard;
