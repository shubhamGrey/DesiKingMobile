import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, fonts } from '../../config/theme';
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
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.88}
      accessibilityLabel={`${product.name}, ₹${hasDiscount ? discountedPrice : price}`}
    >
      {/* Top accent bar */}
      <LinearGradient
        colors={[colors.secondary.main, colors.secondary.light]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.accentBar}
      />

      {/* Image */}
      <View style={styles.imageContainer}>
        <ImageBackground
          source={require('../../../assets/ProductBackground.png')}
          style={styles.imageBg}
          resizeMode="cover"
        >
          <Image
            source={{ uri: product.thumbnailUrl || product.imageUrls?.[0] || 'https://via.placeholder.com/150' }}
            style={styles.image}
            resizeMode="contain"
            accessibilityLabel={product.name}
          />
        </ImageBackground>

        {/* Badges */}
        <View style={styles.badges}>
          {hasDiscount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{discountPct}% OFF</Text>
            </View>
          )}
          {product.isFeatured && !hasDiscount && (
            <View style={styles.featuredBadge}>
              <Text style={styles.featuredText}>TOP</Text>
            </View>
          )}
        </View>

        {/* Cart button */}
        <TouchableOpacity
          style={[styles.cartBtn, inCart && styles.cartBtnAdded]}
          onPress={handleAddToCart}
          activeOpacity={0.85}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel={inCart ? 'Added to cart' : 'Add to cart'}
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
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.card.border,
    overflow: 'hidden',
    backgroundColor: colors.background.paper,
    shadowColor: '#1f4f40',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 3,
  },
  accentBar: {
    height: 3,
    width: '100%',
  },
  imageContainer: {
    width: '100%',
    height: CARD_WIDTH * 0.88,
    position: 'relative',
    backgroundColor: colors.background.cream,
  },
  imageBg: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
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
    backgroundColor: colors.accent.orange,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  discountText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: fonts.body.extrabold,
    letterSpacing: 0.4,
  },
  featuredBadge: {
    backgroundColor: '#1B4D3E',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  featuredText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: fonts.body.extrabold,
    letterSpacing: 0.3,
  },
  cartBtn: {
    position: 'absolute',
    bottom: spacing.xs,
    right: spacing.xs,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accent.orange,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accent.orange,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  cartBtnAdded: {
    backgroundColor: '#1B4D3E',
  },
  info: {
    padding: spacing.sm,
    paddingTop: spacing.xs + 2,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  category: {
    fontSize: 11,
    fontFamily: fonts.body.medium,
    color: colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  name: {
    fontSize: fontSize.sm,
    fontFamily: fonts.heading.bold,
    color: colors.text.primary,
    lineHeight: 20,
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  ratingText: {
    fontSize: 11,
    fontFamily: fonts.body.bold,
    color: colors.text.secondary,
  },
  ratingCount: {
    fontSize: 11,
    fontFamily: fonts.body.regular,
    color: colors.text.muted,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  price: {
    fontSize: fontSize.md,
    fontFamily: fonts.heading.extrabold,
    color: colors.secondary.light,
  },
  strikePrice: {
    fontSize: 11,
    fontFamily: fonts.body.regular,
    color: colors.text.disabled,
    textDecorationLine: 'line-through',
  },
});

export default ProductCard;
