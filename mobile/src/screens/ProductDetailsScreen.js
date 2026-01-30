import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/common/Header';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import { colors, spacing, fontSize, borderRadius } from '../config/theme';
import apiService from '../services/api';
import { useCart } from '../context/CartContext';

const { width } = Dimensions.get('window');

const ProductDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { productId } = route.params;
  const { addItem, isInCart } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedSku, setSelectedSku] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const inCart = product ? isInCart(product.id) : false;

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getProductById(productId);
      const productData = response.data || response;
      setProduct(productData);
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    const pricing = product.pricesAndSkus?.[selectedSku];
    const price = pricing?.discountedAmount || pricing?.price || 0;
    const weightLabel = pricing ? `${pricing.weightValue}${pricing.weightUnit}` : '';

    addItem({
      productId: product.id,
      name: `${product.name}${weightLabel ? ` - ${weightLabel}` : ''}`,
      price,
      image: product.thumbnailUrl || product.imageUrls?.[0],
      brandId: product.brandId,
      sku: pricing?.skuNumber,
      quantity,
    });
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header title="Product Details" showBack />
        <Loading fullScreen text="Loading product..." />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.container}>
        <Header title="Product Details" showBack />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Product not found</Text>
          <Button title="Go Back" onPress={() => navigation.goBack()} />
        </View>
      </View>
    );
  }

  const pricing = product.pricesAndSkus?.[selectedSku];
  const price = pricing?.price || 0;
  const discountedPrice = pricing?.discountedAmount;
  const hasDiscount = pricing?.isDiscounted && discountedPrice;
  const images = product.imageUrls || [product.thumbnailUrl];
  const currencySymbol = '₹';

  return (
    <View style={styles.container}>
      <Header title="" showBack />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: images[currentImageIndex] || 'https://via.placeholder.com/300' }}
            style={styles.mainImage}
            resizeMode="contain"
          />
          {images.length > 1 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.thumbnailsContainer}
            >
              {images.map((img, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setCurrentImageIndex(index)}
                  style={[
                    styles.thumbnail,
                    currentImageIndex === index && styles.thumbnailActive,
                  ]}
                >
                  <Image source={{ uri: img }} style={styles.thumbnailImage} resizeMode="contain" />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
          {hasDiscount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>
                {Math.round(pricing.discountPercentage)}% OFF
              </Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          {/* Title & Category */}
          <Text style={styles.categoryText}>{product.categoryName}</Text>
          <Text style={styles.title}>{product.name}</Text>

          {/* Price */}
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

          {/* Size/SKU Selection */}
          {product.pricesAndSkus?.length > 1 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Select Size</Text>
              <View style={styles.skuContainer}>
                {product.pricesAndSkus.map((sku, index) => (
                  <TouchableOpacity
                    key={sku.id}
                    style={[
                      styles.skuButton,
                      selectedSku === index && styles.skuButtonActive,
                    ]}
                    onPress={() => setSelectedSku(index)}
                    testID={`sku-option-${index}`}
                  >
                    <Text
                      style={[
                        styles.skuButtonText,
                        selectedSku === index && styles.skuButtonTextActive,
                      ]}
                    >
                      {sku.weightValue}{sku.weightUnit}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Quantity */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quantity</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                testID="decrease-quantity-btn"
              >
                <Ionicons name="remove" size={20} color={colors.text.primary} />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(quantity + 1)}
                testID="increase-quantity-btn"
              >
                <Ionicons name="add" size={20} color={colors.text.primary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          {/* Key Features */}
          {product.keyFeatures?.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Key Features</Text>
              {product.keyFeatures.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={18} color={colors.success.main} />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Additional Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Information</Text>
            {product.origin && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Origin:</Text>
                <Text style={styles.infoValue}>{product.origin}</Text>
              </View>
            )}
            {product.shelfLife && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Shelf Life:</Text>
                <Text style={styles.infoValue}>{product.shelfLife}</Text>
              </View>
            )}
            {product.storageInstructions && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Storage:</Text>
                <Text style={styles.infoValue}>{product.storageInstructions}</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomPriceContainer}>
          <Text style={styles.bottomPriceLabel}>Total:</Text>
          <Text style={styles.bottomPrice}>
            {currencySymbol}{((hasDiscount ? discountedPrice : price) * quantity).toFixed(2)}
          </Text>
        </View>
        <Button
          title={inCart ? 'Added to Cart' : 'Add to Cart'}
          onPress={handleAddToCart}
          variant={inCart ? 'secondary' : 'primary'}
          style={styles.addToCartButton}
          testID="add-to-cart-btn"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    backgroundColor: '#fff',
    position: 'relative',
  },
  mainImage: {
    width: width,
    height: width * 0.8,
  },
  thumbnailsContainer: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.sm,
    borderWidth: 2,
    borderColor: 'transparent',
    marginRight: spacing.sm,
    backgroundColor: '#f5f5f5',
  },
  thumbnailActive: {
    borderColor: colors.primary.main,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.sm - 2,
  },
  discountBadge: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    backgroundColor: colors.error.main,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  discountText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: fontSize.sm,
  },
  content: {
    padding: spacing.md,
  },
  categoryText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  price: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    color: colors.primary.main,
  },
  originalPrice: {
    fontSize: fontSize.lg,
    color: colors.text.secondary,
    textDecorationLine: 'line-through',
    marginLeft: spacing.sm,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  skuContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skuButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.divider,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  skuButtonActive: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },
  skuButtonText: {
    fontSize: fontSize.sm,
    color: colors.text.primary,
  },
  skuButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
  },
  quantityButton: {
    padding: spacing.sm,
  },
  quantityText: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    paddingHorizontal: spacing.lg,
  },
  description: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  featureText: {
    fontSize: fontSize.md,
    color: colors.text.primary,
    marginLeft: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  infoLabel: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    width: 100,
  },
  infoValue: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.text.primary,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.background.paper,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  bottomPriceContainer: {
    flex: 1,
  },
  bottomPriceLabel: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  bottomPrice: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.primary.main,
  },
  addToCartButton: {
    flex: 1,
    marginLeft: spacing.md,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  errorText: {
    fontSize: fontSize.lg,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
});

export default ProductDetailsScreen;
