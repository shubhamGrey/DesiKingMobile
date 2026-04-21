import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, fonts, CATEGORY_COLORS, CATEGORY_COLORS_DEFAULT } from '../../config/theme';
import { getImageUrl } from '../../utils/imageUrl';
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

  const barColors = CATEGORY_COLORS[product.categoryName] || CATEGORY_COLORS_DEFAULT;

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
      activeOpacity={0.88}
      accessibilityLabel={`${product.name}, ₹${hasDiscount ? discountedPrice : price}`}
    >
      {/* Top color bar — category gradient */}
      <LinearGradient
        colors={barColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.accentBar}
      />

      {/* Image area */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: getImageUrl(product.thumbnailUrl || product.imageUrls?.[0]) }}
          style={styles.image}
          resizeMode="contain"
          accessibilityLabel={product.name}
        />

        {/* Badges */}
        {hasDiscount ? (
          <View style={styles.discountBadge}>
            <Text style={styles.badgeText}>{discountPct}% OFF</Text>
          </View>
        ) : product.isFeatured ? (
          <View style={styles.featuredBadge}>
            <Text style={styles.badgeText}>TOP</Text>
          </View>
        ) : null}

        {/* Quick-add button */}
        <TouchableOpacity
          style={[styles.cartBtn, inCart && styles.cartBtnAdded]}
          onPress={handleAddToCart}
          activeOpacity={0.85}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel={inCart ? 'Added to cart' : 'Add to cart'}
        >
          <Ionicons name={inCart ? 'checkmark' : 'add'} size={18} color="#fff" />
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
        <Text style={styles.stars}>★★★★★</Text>
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
    borderRadius: 22,
    marginBottom: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.card.border,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: colors.primary.main,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 16,
    elevation: 3,
  },
  accentBar: {
    height: 3,
    width: '100%',
  },
  imageContainer: {
    width: '100%',
    height: 120,
    backgroundColor: colors.background.cream,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  image: {
    width: '85%',
    height: '85%',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: colors.primary.main,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  featuredBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: colors.primary.light,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: fonts.body.extrabold,
    letterSpacing: 0.4,
  },
  cartBtn: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary.main,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  cartBtnAdded: {
    backgroundColor: colors.success,
  },
  info: {
    padding: 10,
    paddingTop: 10,
    paddingBottom: 12,
  },
  category: {
    fontSize: 10,
    fontFamily: fonts.body.semibold,
    color: colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  name: {
    fontSize: 14,
    fontFamily: fonts.heading.bold,
    color: colors.text.primary,
    lineHeight: 18,
    marginBottom: 5,
  },
  stars: {
    fontSize: 10,
    color: colors.secondary.main,
    marginBottom: 5,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 5,
  },
  price: {
    fontSize: 17,
    fontFamily: fonts.heading.extrabold,
    color: colors.primary.main,
  },
  strikePrice: {
    fontSize: 11,
    fontFamily: fonts.body.regular,
    color: colors.text.disabled,
    textDecorationLine: 'line-through',
  },
});

export default ProductCard;
