import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Share,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/common/Header';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import ProductCard from '../components/products/ProductCard';
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
  const [relatedProducts, setRelatedProducts] = useState([]);
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

      // Fetch related products (same category)
      if (productData.categoryId) {
        const allProductsRes = await apiService.getProducts();
        const allProducts = Array.isArray(allProductsRes) ? allProductsRes : allProductsRes.data || [];
        const related = allProducts
          .filter(p => p.categoryId === productData.categoryId && p.id !== productData.id)
          .slice(0, 4);
        setRelatedProducts(related);
      }
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${product.name} on Agro Nexis! Sourced directly from farms. https://www.agronexis.com/product/${product.id}`,
        title: product.name,
      });
    } catch (error) {
      console.error('Error sharing:', error);
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

    Alert.alert('Success', 'Item added to cart!');
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header title="Product Details" showBack />
        <Loading fullScreen text="Loading details..." />
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
      <Header
        title=""
        showBack
        rightIcon="share-outline"
        onRightPress={handleShare}
      />
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
          <View style={styles.titleSection}>
            <View style={{ flex: 1 }}>
              <Text style={styles.categoryText}>{product.categoryName}</Text>
              <Text style={styles.title}>{product.name}</Text>
            </View>
            <View style={styles.trustBadge}>
              <Ionicons name="leaf" size={16} color={colors.primary.main} />
              <Text style={styles.trustBadgeText}>Pure</Text>
            </View>
          </View>

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
              <Text style={styles.sectionTitle}>Select Weight</Text>
              <View style={styles.skuContainer}>
                {product.pricesAndSkus.map((sku, index) => (
                  <TouchableOpacity
                    key={sku.id}
                    style={[
                      styles.skuButton,
                      selectedSku === index && styles.skuButtonActive,
                    ]}
                    onPress={() => setSelectedSku(index)}
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
              >
                <Ionicons name="remove" size={20} color={colors.text.primary} />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(quantity + 1)}
              >
                <Ionicons name="add" size={20} color={colors.text.primary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Trust Indicators */}
          <View style={styles.trustRow}>
            <View style={styles.trustItem}>
              <Ionicons name="shield-checkmark" size={24} color={colors.secondary.main} />
              <Text style={styles.trustText}>Lab Tested</Text>
            </View>
            <View style={styles.trustItem}>
              <Ionicons name="flask" size={24} color={colors.secondary.main} />
              <Text style={styles.trustText}>Chemical Free</Text>
            </View>
            <View style={styles.trustItem}>
              <Ionicons name="cube" size={24} color={colors.secondary.main} />
              <Text style={styles.trustText}>Secure Pack</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About this Product</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          {/* Key Features */}
          {product.keyFeatures?.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Why it's Special</Text>
              {product.keyFeatures.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Ionicons name="star" size={16} color={colors.secondary.main} />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>You May Also Like</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {relatedProducts.map((item) => (
                  <View key={item.id} style={{ width: 160, marginRight: spacing.md }}>
                    <ProductCard
                      product={item}
                      onPress={() => navigation.push('ProductDetails', { productId: item.id })}
                    />
                  </View>
                ))}
              </ScrollView>
            </View>
          )}
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
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  trustBadgeText: {
    color: colors.primary.main,
    fontSize: fontSize.xs,
    fontWeight: '700',
    marginLeft: 4,
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
  trustRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.divider,
    marginBottom: spacing.lg,
  },
  trustItem: {
    alignItems: 'center',
  },
  trustText: {
    fontSize: 10,
    color: colors.text.secondary,
    marginTop: 4,
    fontWeight: '600',
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
