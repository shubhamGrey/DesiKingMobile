import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, shadows } from '../../config/theme';
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
  const weightLabel = pricing ? `${pricing.weightValue}${pricing.weightUnit}` : '';
  const discountPct = hasDiscount ? Math.round(pricing.discountPercentage) : 0;

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
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.9}>
      {/* Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.thumbnailUrl || product.imageUrls?.[0] || 'https://via.placeholder.com/150' }}
          style={styles.image}
          resizeMode="contain"
        />

        {/* Badges */}
        <View style={styles.badges}>
          {hasDiscount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{discountPct}% OFF</Text>
            </View>
          )}
          {product.isFeatured && !hasDiscount && (
            <View style={styles.featuredBadge}>
              <Text style={styles.featuredText}>★ TOP</Text>
            </View>
          )}
        </View>

        {/* Cart button */}
        <TouchableOpacity
          style={[styles.cartBtn, inCart && styles.cartBtnAdded]}
          onPress={handleAddToCart}
          activeOpacity={0.85}
        >
          <Ionicons name={inCart ? 'checkmark' : 'add'} size={16} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.category} numberOfLines={1}>
          {product.categoryName || 'Spices'}
        </Text>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>

        <View style={styles.ratingRow}>
          <Ionicons name="star" size={10} color={colors.accent.saffron} />
          <Text style={styles.ratingText}> 4.8 </Text>
          <Text style={styles.ratingCount}>(120)</Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.price}>
            ₹{hasDiscount ? discountedPrice : price}
          </Text>
          {hasDiscount && (
            <Text style={styles.strikePrice}>₹{price}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    backgroundColor: colors.background.paper,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    ...shadows.light,
    borderWidth: 1,
    borderColor: colors.divider,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: CARD_WIDTH * 0.88,
    backgroundColor: colors.accent.lightGray,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badges: {
    position: 'absolute',
    top: spacing.xs,
    left: spacing.xs,
    gap: 4,
  },
  discountBadge: {
    backgroundColor: colors.secondary.main,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  discountText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  featuredBadge: {
    backgroundColor: colors.primary.main,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  featuredText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  cartBtn: {
    position: 'absolute',
    bottom: spacing.xs,
    right: spacing.xs,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  cartBtnAdded: {
    backgroundColor: colors.success,
  },
  info: {
    padding: spacing.sm,
    paddingTop: spacing.xs + 2,
  },
  category: {
    fontSize: 9,
    color: colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  name: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.text.primary,
    lineHeight: 18,
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  ratingText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.text.primary,
  },
  ratingCount: {
    fontSize: 9,
    color: colors.text.muted,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  price: {
    fontSize: fontSize.md,
    fontWeight: '800',
    color: colors.primary.main,
  },
  strikePrice: {
    fontSize: 11,
    color: colors.text.disabled,
    textDecorationLine: 'line-through',
  },
});

export default ProductCard;
