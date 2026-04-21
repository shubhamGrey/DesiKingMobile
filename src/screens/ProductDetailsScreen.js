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
  StatusBar,
  Platform,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import ProductCard from '../components/products/ProductCard';
import { colors, spacing, fontSize, borderRadius, fonts } from '../config/theme';
import { getImageUrl } from '../utils/imageUrl';
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

  useEffect(() => { loadProduct(); }, [productId]);

  const loadProduct = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getProductById(productId);
      const productData = response.data || response;
      setProduct(productData);

      if (productData.categoryId) {
        const allProductsRes = await apiService.getProducts();
        const allProducts = allProductsRes.data || allProductsRes || [];
        setRelatedProducts(
          allProducts.filter(p => p.categoryId === productData.categoryId && p.id !== productData.id).slice(0, 4)
        );
      }
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({ message: `Check out ${product.name} on Desi King!`, title: product.name });
    } catch (error) {}
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
    Alert.alert('Added to Cart', `${product.name} has been added.`);
  };

  if (isLoading) return <Loading fullScreen />;

  if (!product) {
    return (
      <View style={styles.container}>
        <View style={styles.backBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={22} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
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
  const images = (product.imageUrls?.length ? product.imageUrls : [product.thumbnailUrl]).map(getImageUrl).filter(Boolean);
  const totalPrice = ((hasDiscount ? discountedPrice : price) * quantity).toFixed(2);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background.cream} />

      {/* Image area */}
      <View style={styles.imageArea}>
        {/* Overlay back + share buttons */}
        <View style={styles.backBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} accessibilityLabel="Go back">
            <Ionicons name="chevron-back" size={22} color={colors.text.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare} style={styles.backBtn} accessibilityLabel="Share">
            <Ionicons name="share-outline" size={20} color={colors.text.primary} />
          </TouchableOpacity>
        </View>

        <Image
          source={{ uri: images[currentImageIndex] || images[0] }}
          style={styles.mainImage}
          resizeMode="contain"
          accessibilityLabel={product.name}
        />

        {hasDiscount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{Math.round(pricing.discountPercentage)}% OFF</Text>
          </View>
        )}

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.thumbStrip}>
            {images.map((img, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setCurrentImageIndex(index)}
                style={[styles.thumb, currentImageIndex === index && styles.thumbActive]}
              >
                <Image source={{ uri: img }} style={styles.thumbImg} resizeMode="contain" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Product card */}
      <ScrollView style={styles.card} showsVerticalScrollIndicator={false}>
        <Text style={styles.catLabel}>{product.categoryName}</Text>

        <View style={styles.titleRow}>
          <Text style={styles.title}>{product.name}</Text>
          <View style={styles.authBadge}>
            <Text style={styles.authTick}>✓</Text>
            <Text style={styles.authText}>Authentic</Text>
          </View>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{hasDiscount ? discountedPrice : price}</Text>
          {hasDiscount && <Text style={styles.origPrice}>₹{price}</Text>}
        </View>

        {/* SKU selector */}
        {product.pricesAndSkus?.length > 1 && (
          <View style={styles.block}>
            <Text style={styles.blockTitle}>Select Size</Text>
            <View style={styles.skuRow}>
              {product.pricesAndSkus.map((sku, index) => (
                <TouchableOpacity
                  key={sku.id}
                  style={[styles.sku, selectedSku === index && styles.skuActive]}
                  onPress={() => setSelectedSku(index)}
                >
                  <Text style={[styles.skuText, selectedSku === index && styles.skuTextActive]}>
                    {sku.weightValue}{sku.weightUnit}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Quantity */}
        <View style={styles.block}>
          <Text style={styles.blockTitle}>Quantity</Text>
          <View style={styles.qtyRow}>
            <TouchableOpacity style={styles.qtyBtn} onPress={() => setQuantity(Math.max(1, quantity - 1))}>
              <Text style={styles.qtyBtnTxt}>−</Text>
            </TouchableOpacity>
            <Text style={styles.qtyVal}>{quantity}</Text>
            <TouchableOpacity style={styles.qtyBtn} onPress={() => setQuantity(quantity + 1)}>
              <Text style={styles.qtyBtnTxt}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Trust icons */}
        <View style={styles.trustGrid}>
          {[['🌿', '100% Pure'], ['🔬', 'Lab Tested'], ['🌍', 'Global Quality']].map(([icon, label]) => (
            <View key={label} style={styles.trustItem}>
              <Text style={styles.trustIcon}>{icon}</Text>
              <Text style={styles.trustLabel}>{label}</Text>
            </View>
          ))}
        </View>

        {/* Description */}
        <View style={styles.block}>
          <Text style={styles.blockTitle}>Description</Text>
          <Text style={styles.desc}>{product.description}</Text>
        </View>

        {/* Key features */}
        {product.keyFeatures?.length > 0 && (
          <View style={styles.block}>
            <Text style={styles.blockTitle}>Key Highlights</Text>
            {product.keyFeatures.map((f, i) => (
              <View key={i} style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={16} color={colors.secondary.main} />
                <Text style={styles.featureText}>{f}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <View style={styles.block}>
            <Text style={styles.blockTitle}>Related Spices</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {relatedProducts.map((p) => (
                <View key={p.id} style={{ width: 160, marginRight: spacing.md }}>
                  <ProductCard product={p} onPress={() => navigation.push('ProductDetails', { productId: p.id })} />
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerPrice}>
          <Text style={styles.footerLabel}>Total Price</Text>
          <Text style={styles.footerAmt}>₹{totalPrice}</Text>
        </View>
        <Button
          title={inCart ? 'Go to Cart' : 'Add to Cart'}
          onPress={inCart ? () => navigation.navigate('Cart') : handleAddToCart}
          style={styles.actionBtn}
          variant={inCart ? 'secondary' : 'primary'}
          size="large"
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

  // Image area
  imageArea: {
    paddingTop: Platform.OS === 'ios' ? 54 : (StatusBar.currentHeight || 24),
    paddingBottom: 16,
    backgroundColor: colors.background.cream,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBar: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 54 : 36,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    zIndex: 10,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: colors.card.border,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary.main,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 16,
    elevation: 3,
  },
  mainImage: {
    width: 160,
    height: 160,
  },
  discountBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: colors.primary.main,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  discountText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: fonts.body.extrabold,
  },
  thumbStrip: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 20,
  },
  thumb: {
    width: 52,
    height: 52,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginRight: 8,
    padding: 3,
    borderWidth: 1.5,
    borderColor: colors.card.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbActive: {
    borderColor: colors.primary.main,
    borderWidth: 2,
  },
  thumbImg: {
    width: '100%',
    height: '100%',
  },

  // Card
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -20,
    paddingHorizontal: 20,
    paddingTop: 22,
    borderWidth: 1.5,
    borderColor: colors.card.border,
  },
  catLabel: {
    fontFamily: fonts.body.semibold,
    fontSize: 11,
    color: colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 5,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  title: {
    fontFamily: fonts.heading.extrabold,
    fontSize: 28,
    color: colors.text.primary,
    flex: 1,
    lineHeight: 30,
    marginRight: 10,
  },
  authBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.background.cream,
    borderWidth: 1.5,
    borderColor: colors.card.border,
    borderRadius: borderRadius.full,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexShrink: 0,
    marginTop: 4,
  },
  authTick: {
    color: colors.success,
    fontSize: 12,
    fontFamily: fonts.body.bold,
  },
  authText: {
    fontFamily: fonts.body.bold,
    fontSize: 10,
    color: colors.success,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
    marginBottom: 18,
  },
  price: {
    fontFamily: fonts.heading.extrabold,
    fontSize: 34,
    color: colors.primary.main,
    letterSpacing: -0.5,
  },
  origPrice: {
    fontFamily: fonts.body.regular,
    fontSize: 18,
    color: colors.text.disabled,
    textDecorationLine: 'line-through',
  },

  // SKU, qty, trust
  block: {
    marginBottom: 18,
  },
  blockTitle: {
    fontFamily: fonts.body.bold,
    fontSize: 14,
    color: colors.text.primary,
    marginBottom: 10,
  },
  skuRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sku: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.card.border,
    backgroundColor: colors.background.cream,
  },
  skuActive: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
    shadowColor: colors.primary.main,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 3,
  },
  skuText: {
    fontFamily: fonts.body.semibold,
    fontSize: 13,
    color: colors.text.primary,
  },
  skuTextActive: {
    color: '#fff',
    fontFamily: fonts.body.extrabold,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.cream,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.card.border,
    alignSelf: 'flex-start',
    padding: 4,
  },
  qtyBtn: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnTxt: {
    fontFamily: fonts.body.bold,
    fontSize: 20,
    color: colors.text.primary,
  },
  qtyVal: {
    fontFamily: fonts.body.bold,
    fontSize: 16,
    color: colors.text.primary,
    paddingHorizontal: 18,
  },
  trustGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 14,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.divider,
    marginBottom: 18,
  },
  trustItem: {
    alignItems: 'center',
    gap: 4,
  },
  trustIcon: {
    fontSize: 22,
  },
  trustLabel: {
    fontFamily: fonts.body.semibold,
    fontSize: 10,
    color: colors.text.secondary,
  },
  desc: {
    fontFamily: fonts.body.regular,
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 23,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  featureText: {
    fontFamily: fonts.body.regular,
    fontSize: 14,
    color: colors.text.secondary,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: colors.background.cream,
    borderTopWidth: 1.5,
    borderTopColor: colors.card.border,
    shadowColor: colors.primary.main,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.07,
    shadowRadius: 20,
    elevation: 8,
  },
  footerPrice: {
    flex: 1,
  },
  footerLabel: {
    fontFamily: fonts.body.regular,
    fontSize: 11,
    color: colors.text.muted,
  },
  footerAmt: {
    fontFamily: fonts.heading.extrabold,
    fontSize: 24,
    color: colors.primary.main,
    letterSpacing: -0.3,
  },
  actionBtn: {
    flex: 1.5,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  errorText: {
    fontSize: 18,
    color: colors.text.secondary,
    marginBottom: spacing.md,
  },
});

export default ProductDetailsScreen;
