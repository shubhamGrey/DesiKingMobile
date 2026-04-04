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
import { colors, spacing, fontSize, borderRadius, shadows } from '../config/theme';
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

      if (productData.categoryId) {
        const allProductsRes = await apiService.getProducts();
        const allProducts = allProductsRes.data || allProductsRes || [];
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
        message: `Check out ${product.name} on Agro Nexis! https://www.agronexis.com/product/${product.id}`,
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

    Alert.alert('Added to Cart', `${product.name} has been added.`);
  };

  if (isLoading) return <Loading fullScreen />;

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

  return (
    <View style={styles.container}>
      <Header title="" showBack rightIcon="share-outline" onRightPress={handleShare} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Modern Image Gallery */}
        <View style={styles.imageSection}>
          <View style={styles.mainImageContainer}>
            <Image
              source={{ uri: images[currentImageIndex] || 'https://via.placeholder.com/300' }}
              style={styles.mainImage}
              resizeMode="contain"
            />
            {hasDiscount && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>{Math.round(pricing.discountPercentage)}% OFF</Text>
              </View>
            )}
          </View>

          {images.length > 1 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.thumbnailsList}>
              {images.map((img, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setCurrentImageIndex(index)}
                  style={[styles.thumbnail, currentImageIndex === index && styles.thumbnailActive]}
                >
                  <Image source={{ uri: img }} style={styles.thumbnailImage} resizeMode="contain" />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Added Spacer here */}
        <View style={styles.sectionSpacer} />

        <View style={styles.content}>
          {/* Header Info */}
          <Text style={styles.categoryLabel}>{product.categoryName}</Text>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{product.name}</Text>
            <View style={styles.badge}>
              <Ionicons name="shield-checkmark" size={14} color={colors.success.main} />
              <Text style={styles.badgeText}>Authentic</Text>
            </View>
          </View>

          {/* Pricing */}
          <View style={styles.priceRow}>
            <Text style={styles.price}>₹{hasDiscount ? discountedPrice : price}</Text>
            {hasDiscount && <Text style={styles.originalPrice}>₹{price}</Text>}
          </View>

          {/* Sku Selector */}
          {product.pricesAndSkus?.length > 1 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Select Size</Text>
              <View style={styles.skuRow}>
                {product.pricesAndSkus.map((sku, index) => (
                  <TouchableOpacity
                    key={sku.id}
                    style={[styles.skuCard, selectedSku === index && styles.skuCardActive]}
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

          {/* Quantity Selector */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quantity</Text>
            <View style={styles.qtyContainer}>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => setQuantity(Math.max(1, quantity - 1))}>
                <Ionicons name="remove" size={20} color={colors.text.primary} />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{quantity}</Text>
              <TouchableOpacity style={styles.qtyBtn} onPress={() => setQuantity(quantity + 1)}>
                <Ionicons name="add" size={20} color={colors.text.primary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Features Grid */}
          <View style={styles.trustGrid}>
            <View style={styles.trustItem}><Ionicons name="leaf" size={20} color={colors.primary.main} /><Text style={styles.trustLabel}>100% Pure</Text></View>
            <View style={styles.trustItem}><Ionicons name="flask" size={20} color={colors.primary.main} /><Text style={styles.trustLabel}>Lab Tested</Text></View>
            <View style={styles.trustItem}><Ionicons name="globe" size={20} color={colors.primary.main} /><Text style={styles.trustLabel}>Global Quality</Text></View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Product Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          {/* Key Highlights */}
          {product.keyFeatures?.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Key Highlights</Text>
              {product.keyFeatures.map((f, i) => (
                <View key={i} style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.secondary.main} />
                  <Text style={styles.featureText}>{f}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Related Spices</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {relatedProducts.map((p) => (
                  <View key={p.id} style={{ width: 160, marginRight: spacing.md }}>
                    <ProductCard product={p} onPress={() => navigation.push('ProductDetails', { productId: p.id })} />
                  </View>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Modern Action Bar */}
      <View style={styles.footer}>
        <View style={styles.footerPrice}>
          <Text style={styles.footerLabel}>Total Price</Text>
          <Text style={styles.footerAmount}>₹{((hasDiscount ? discountedPrice : price) * quantity).toFixed(2)}</Text>
        </View>
        <Button
          title={inCart ? 'Go to Cart' : 'Add to Cart'}
          onPress={inCart ? () => navigation.navigate('Cart') : handleAddToCart}
          style={styles.actionBtn}
          variant={inCart ? 'secondary' : 'primary'}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollView: { flex: 1 },
  imageSection: { backgroundColor: colors.background.muted, paddingBottom: spacing.md },
  mainImageContainer: { width: width, height: width * 0.85, backgroundColor: '#fff', ...shadows.sm },
  mainImage: { width: '100%', height: '100%' },
  discountBadge: { position: 'absolute', top: spacing.md, left: spacing.md, backgroundColor: colors.secondary.main, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  discountText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  thumbnailsList: { paddingHorizontal: spacing.md, marginTop: spacing.md },
  thumbnail: { width: 60, height: 60, borderRadius: 8, backgroundColor: '#fff', marginRight: 10, padding: 4, borderWidth: 1, borderColor: '#eee' },
  thumbnailActive: { borderColor: colors.primary.main, borderWidth: 2 },
  thumbnailImage: { width: '100%', height: '100%' },
  sectionSpacer: { height: 20 }, // New spacer style
  content: { padding: spacing.lg, backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: -20 },
  categoryLabel: { fontSize: 12, color: colors.text.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  title: { fontSize: fontSize.xxl, fontWeight: '800', color: colors.text.primary, flex: 1, marginRight: 10 },
  badge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e8f5e9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 10, color: colors.success, fontWeight: 'bold', marginLeft: 4 },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
  price: { fontSize: 28, fontWeight: 'bold', color: colors.primary.main },
  originalPrice: { fontSize: 18, color: colors.text.muted, textDecorationLine: 'line-through', marginLeft: spacing.sm },
  section: { marginBottom: spacing.xl },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text.primary, marginBottom: spacing.md },
  skuRow: { flexDirection: 'row', flexWrap: 'wrap' },
  skuCard: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: '#eee', marginRight: 10, marginBottom: 10, backgroundColor: '#f9f9f9' },
  skuCardActive: { backgroundColor: colors.primary.main, borderColor: colors.primary.main, ...shadows.sm },
  skuText: { fontSize: 14, color: colors.text.primary, fontWeight: '600' },
  skuTextActive: { color: '#fff' },
  qtyContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f5', borderRadius: 12, alignSelf: 'flex-start', padding: 4 },
  qtyBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  qtyText: { fontSize: 18, fontWeight: 'bold', paddingHorizontal: 20 },
  trustGrid: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.lg, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#f0f0f0', marginBottom: spacing.xl },
  trustItem: { alignItems: 'center' },
  trustLabel: { fontSize: 10, color: colors.text.secondary, marginTop: 4, fontWeight: '600' },
  description: { fontSize: 15, color: colors.text.secondary, lineHeight: 24 },
  featureItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  featureText: { fontSize: 14, color: colors.text.primary, marginLeft: 10 },
  footer: { flexDirection: 'row', alignItems: 'center', padding: spacing.lg, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f0f0f0', ...shadows.lg },
  footerPrice: { flex: 1 },
  footerLabel: { fontSize: 12, color: colors.text.muted },
  footerAmount: { fontSize: 20, fontWeight: 'bold', color: colors.primary.main },
  actionBtn: { flex: 1.5, height: 54 },
  errorContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  errorText: { fontSize: 18, color: colors.text.secondary, marginBottom: spacing.md },
});

export default ProductDetailsScreen;
