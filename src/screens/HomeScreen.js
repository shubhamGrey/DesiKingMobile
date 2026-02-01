import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  RefreshControl,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/common/Header';
import ProductCard from '../components/products/ProductCard';
import CategoryCard from '../components/products/CategoryCard';
import Loading from '../components/common/Loading';
import { colors, spacing, fontSize, borderRadius } from '../config/theme';
import apiService from '../services/api';

const { width } = Dimensions.get('window');

const achievements = [
  {
    value: '500+',
    name: 'Happy Customers',
    icon: 'people-outline',
  },
  {
    value: '4+',
    name: 'Countries',
    icon: 'globe-outline',
  },
  {
    value: '3+',
    name: 'Years Excellence',
    icon: 'ribbon-outline',
  },
];

const HomeScreen = () => {
  const navigation = useNavigation();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        apiService.getProducts(),
        apiService.getCategories(),
      ]);

      // Filter featured products
      const products = Array.isArray(productsRes) ? productsRes : productsRes.data || [];
      const featured = products.filter(p => p.isFeatured && p.isActive).slice(0, 6);
      setFeaturedProducts(featured);

      // Filter active categories
      const cats = Array.isArray(categoriesRes) ? categoriesRes : categoriesRes.data || [];
      setCategories(cats.filter(c => c.isActive));
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header />
        <Loading fullScreen text="Loading..." />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary.main]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Banner */}
        <View style={styles.heroBanner}>
          <Image
            source={require('../../assets/DesiKing.png')}
            style={styles.heroImage}
            resizeMode="contain"
          />
          <Text style={styles.heroTitle}>AGRO NEXIS</Text>
          <Text style={styles.heroSubtitle}>
            Pure, authentic Indian spices sourced directly from trusted farms.
          </Text>
          <TouchableOpacity
            style={styles.heroButton}
            onPress={() => navigation.navigate('Products')}
            testID="shop-now-btn"
          >
            <Text style={styles.heroButtonText}>Shop Now</Text>
          </TouchableOpacity>
        </View>

        {/* Achievements */}
        <View style={styles.achievementsContainer}>
          {achievements.map((item, index) => (
            <View key={index} style={styles.achievementItem}>
              <Ionicons name={item.icon} size={28} color={colors.primary.main} />
              <Text style={styles.achievementValue}>{item.value}</Text>
              <Text style={styles.achievementName}>{item.name}</Text>
            </View>
          ))}
        </View>

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Featured Products</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Products')}
                testID="view-all-products-btn"
              >
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.productsGrid}>
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onPress={() => navigation.navigate('ProductDetails', { productId: product.id })}
                />
              ))}
            </View>
          </View>
        )}

        {/* Categories */}
        {categories.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Product Categories</Text>
            <View style={styles.categoriesGrid}>
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onPress={() => navigation.navigate('Products', { categoryId: category.id })}
                />
              ))}
            </View>
          </View>
        )}

        {/* Why Choose Us */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why Choose Us</Text>
          <View style={styles.featuresContainer}>
            {[
              { icon: 'leaf-outline', title: '100% Natural', desc: 'Pure, authentic ingredients' },
              { icon: 'shield-checkmark-outline', title: 'Lab Tested', desc: 'Quality assured products' },
              { icon: 'location-outline', title: 'Farm Fresh', desc: 'Sourced from trusted farms' },
              { icon: 'globe-outline', title: 'Global Reach', desc: 'Shipping worldwide' },
            ].map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <View style={styles.featureIconContainer}>
                  <Ionicons name={feature.icon} size={24} color={colors.primary.main} />
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDesc}>{feature.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2026 AGRO NEXIS INDIA OVERSEAS PRIVATE LIMITED
          </Text>
        </View>
      </ScrollView>
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
  heroBanner: {
    backgroundColor: colors.primary.main,
    padding: spacing.xl,
    alignItems: 'center',
  },
  heroImage: {
    width: 150,
    height: 150,
    marginBottom: spacing.md,
  },
  heroTitle: {
    fontSize: fontSize.xxxl,
    fontWeight: 'bold',
    color: colors.primary.contrastText,
    marginBottom: spacing.sm,
  },
  heroSubtitle: {
    fontSize: fontSize.md,
    color: colors.primary.contrastText,
    textAlign: 'center',
    marginBottom: spacing.lg,
    opacity: 0.9,
  },
  heroButton: {
    backgroundColor: colors.secondary.main,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.full,
  },
  heroButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: fontSize.md,
  },
  achievementsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background.paper,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  achievementItem: {
    flex: 1,
    alignItems: 'center',
  },
  achievementValue: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.primary.main,
    marginTop: spacing.xs,
  },
  achievementName: {
    fontSize: fontSize.xs,
    color: colors.text.secondary,
    marginTop: 2,
  },
  section: {
    padding: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.primary.main,
    marginBottom: spacing.md,
  },
  viewAllText: {
    fontSize: fontSize.md,
    color: colors.secondary.main,
    fontWeight: '600',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  featureItem: {
    width: '50%',
    padding: spacing.sm,
    alignItems: 'center',
  },
  featureIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff3e0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  featureTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: fontSize.xs,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  footer: {
    padding: spacing.lg,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
  },
  footerText: {
    color: colors.primary.contrastText,
    fontSize: fontSize.xs,
    textAlign: 'center',
  },
});

export default HomeScreen;
