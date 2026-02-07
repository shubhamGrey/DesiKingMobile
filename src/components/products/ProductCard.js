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
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.thumbnailUrl || product.imageUrls?.[0] || 'https://via.placeholder.com/150' }}
          style={styles.image}
          resizeMode="contain"
        />
        {/* Modern Pill-Shaped Micro-Tags */}
        <View style={styles.tagContainer}>
          {hasDiscount && (
            <View style={[styles.microTag, { backgroundColor: colors.secondary.main }]}>
              <Text style={styles.microTagText}>{Math.round(pricing.discountPercentage)}% OFF</Text>
            </View>
          )}
          {product.isFeatured && (
            <View style={[styles.microTag, { backgroundColor: colors.primary.main }]}>
              <Text style={styles.microTagText}>BESTSELLER</Text>
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.category}>{product.categoryName || 'Spices'}</Text>
        <Text style={styles.name} numberOfLines={1}>
          {product.name}
        </Text>

        {/* Social Proof: Star Ratings */}
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={10} color="#FFD700" />
          <Text style={styles.ratingText}>4.8</Text>
          <Text style={styles.reviewText}>(120 reviews)</Text>
        </View>

        <View style={styles.footer}>
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

          <TouchableOpacity
            style={[styles.addButton, inCart && styles.addedButton]}
            onPress={handleAddToCart}
          >
            <Ionicons
              name={inCart ? 'checkmark' : 'cart-outline'}
              size={16}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    ...shadows.sm,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  imageContainer: {
    width: '100%',
    height: CARD_WIDTH * 0.85,
    backgroundColor: '#fff',
    borderTopLeftRadius: borderRadius.md,
    borderTopRightRadius: borderRadius.md,
    padding: spacing.sm,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  tagContainer: {
    position: 'absolute',
    top: spacing.xs,
    left: spacing.xs,
    gap: 4,
  },
  microTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
  },
  microTagText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  content: {
    padding: spacing.sm,
    paddingTop: 0,
  },
  category: {
    fontSize: 9,
    color: colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  name: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  ratingText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginLeft: 2,
  },
  reviewText: {
    fontSize: 9,
    color: colors.text.muted,
    marginLeft: 2,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceContainer: {
    flex: 1,
  },
  price: {
    fontSize: fontSize.md,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  originalPrice: {
    fontSize: 10,
    color: colors.text.muted,
    textDecorationLine: 'line-through',
  },
  addButton: {
    backgroundColor: colors.primary.main,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  addedButton: {
    backgroundColor: colors.success,
  },
});

export default ProductCard;
