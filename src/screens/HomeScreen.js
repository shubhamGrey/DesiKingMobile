import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  RefreshControl,
  Dimensions,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Platform,
  ImageBackground,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/common/Header';
import { colors, spacing, fontSize, borderRadius, shadows } from '../config/theme';
import apiService from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const { width } = Dimensions.get('window');
const HERO_CARD_WIDTH = width - 40;

// Modern Shimmer Skeleton Component
const SkeletonCard = () => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(animatedValue, { toValue: 0, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  const opacity = animatedValue.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.6] });
  return <Animated.View style={[styles.skeletonCard, { opacity }]} />;
};

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { addItem } = useCart();
  const heroScrollRef = useRef(null);

  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);

  const heroItems = [
    { id: 'brand', type: 'brand', title: 'AGRO NEXIS', bg: 'https://images.unsplash.com/photo-15336306755ef-04900966bc0a?q=80&w=1000&auto=format&fit=crop' },
    { id: '1', title: 'Premium Spices', bg: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=1000&auto=format&fit=crop' },
    { id: '2', title: 'Farm Fresh Direct', bg: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?q=80&w=1000&auto=format&fit=crop' },
  ];

  useEffect(() => {
    loadData();
  }, []);

  // Auto-scrolling carousel logic
  useEffect(() => {
    if (!isLoading && heroItems.length > 0) {
      const interval = setInterval(() => {
        let nextIndex = (heroIndex + 1) % heroItems.length;
        setHeroIndex(nextIndex);
        heroScrollRef.current?.scrollTo({ x: nextIndex * (HERO_CARD_WIDTH + 10), animated: true });
      }, 4500);
      return () => clearInterval(interval);
    }
  }, [heroIndex, isLoading]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        apiService.getProducts(),
        apiService.getCategories(),
      ]);
      setAllProducts((productsRes.data || productsRes || []).filter(p => p.isActive));
      setCategories((categoriesRes.data || categoriesRes || []).filter(c => c.isActive));
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

  const filteredProducts = useMemo(() => {
    return allProducts.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || p.categoryName === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [allProducts, searchQuery, activeCategory]);

  const dailyEssentials = useMemo(() => allProducts.filter(p => p.isFeatured).slice(0, 6), [allProducts]);
  const immunityBoosters = useMemo(() => allProducts.filter(p => p.name.toLowerCase().includes('turmeric') || p.name.toLowerCase().includes('pepper') || p.name.toLowerCase().includes('ginger')).slice(0, 6), [allProducts]);
  const digestiveAids = useMemo(() => allProducts.filter(p => p.name.toLowerCase().includes('cumin') || p.name.toLowerCase().includes('fennel')).slice(0, 6), [allProducts]);
  const desiKingSpecials = useMemo(() => allProducts.filter(p => p.name.toLowerCase().includes('masala') || p.name.toLowerCase().includes('blend')).slice(0, 6), [allProducts]);

  const handleAddToCart = (product) => {
    const pricing = product.pricesAndSkus?.[0];
    addItem({
      productId: product.id,
      name: product.name,
      price: pricing?.discountedAmount || pricing?.price || 0,
      image: product.thumbnailUrl || (product.imageUrls && product.imageUrls[0]),
      sku: pricing?.skuNumber,
      quantity: 1,
    });
  };

  const renderProductRow = (title, productList) => {
    if (productList.length === 0) return null;
    return (
      <View style={{ marginBottom: spacing.md }}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Products')}><Text style={styles.viewAllText}>View All</Text></TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList} style={{ paddingBottom: 15 }}>
          {productList.map((product) => {
            const pricing = product.pricesAndSkus?.[0];
            const priceToPay = pricing?.discountedAmount || pricing?.price || 0;
            const originalPrice = pricing?.price || 0;
            return (
              <TouchableOpacity key={product.id} style={styles.curatedCard} onPress={() => navigation.navigate('ProductDetails', { productId: product.id })}>
                <View style={styles.curatedImageContainer}>
                  <Image source={{ uri: product.thumbnailUrl }} style={styles.curatedImage} resizeMode="cover" />
                </View>
                <Text style={styles.curatedName} numberOfLines={1}>{product.name}</Text>
                <View style={styles.curatedFooter}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.curatedPrice}>₹{priceToPay}</Text>
                    {pricing?.isDiscounted && <Text style={styles.strikedPrice}>₹{originalPrice}</Text>}
                  </View>
                  <TouchableOpacity style={styles.quickAdd} onPress={() => handleAddToCart(product)}>
                    <Ionicons name="add" size={18} color="#fff" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  if (isLoading && !refreshing) {
    return (
      <View style={styles.container}>
        <Header />
        <View style={{ padding: spacing.md }}>
          <SkeletonCard />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
            <View style={{ width: '48%', height: 180, backgroundColor: '#eee', borderRadius: 16 }} />
            <View style={{ width: '48%', height: 180, backgroundColor: '#eee', borderRadius: 16 }} />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary.main]} />}
      >
        {/* Hello Section - Reduced Spacing */}
        <View style={styles.headerGreeting}>
          <View>
            <Text style={styles.greetingText}>Hello, {user?.firstName || 'Guest'} 👋</Text>
            <Text style={styles.subGreetingText}>Bring purity to your kitchen today.</Text>
          </View>
          {/*<TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Image source={{ uri: 'https://i.pravatar.cc/100' }} style={styles.profileImage} />
          </TouchableOpacity>*/}
        </View>

        {/* Search Bar */}
        {/*<View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color={colors.text.muted} />
            <TextInput
              placeholder="Search premium spices..."
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color={colors.text.muted} />
              </TouchableOpacity>
            )}
          </View>
        </View>*/}

        {/* Hero Carousel - Fixed alignment */}
        <ScrollView
          ref={heroScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.carouselContainer}
          snapToInterval={HERO_CARD_WIDTH + 10}
          snapToAlignment="center"
          decelerationRate="fast"
          contentContainerStyle={{ paddingHorizontal: 20 }}
        >
          {heroItems.map((item) => (
            <View key={item.id} style={{ width: HERO_CARD_WIDTH, marginRight: 10 }}>
              <ImageBackground source={{ uri: item.bg }} style={styles.heroCard} imageStyle={{ borderRadius: borderRadius.lg }}>
                <View style={[styles.heroOverlay, item.type === 'brand' && styles.brandOverlay]}>
                  <Text style={styles.heroTitle}>{item.title}</Text>
                  <TouchableOpacity style={styles.shopNowBtn} onPress={() => navigation.navigate('Products')}>
                    <Text style={styles.shopNowText}>Shop Now</Text>
                  </TouchableOpacity>
                </View>
              </ImageBackground>
            </View>
          ))}
        </ScrollView>

        {/* Categories Chips */}
        <View style={styles.categoriesSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesList}>
            {['All', ...categories.map(c => c.name)].map((cat, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.categoryChip, activeCategory === cat && styles.categoryChipActive]}
                onPress={() => setActiveCategory(cat)}
              >
                <Text style={[styles.categoryChipText, activeCategory === cat && styles.categoryChipTextActive]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Filtered Rows */}
        {renderProductRow('Daily Essentials 🔥', dailyEssentials)}
        {renderProductRow('Immunity Boosters 🛡️', immunityBoosters)}
        {renderProductRow('Digestive Aids 🍃', digestiveAids)}
        {renderProductRow('The "DesiKing" Specials ✨', desiKingSpecials)}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.default },
  headerGreeting: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.md, paddingTop: 5, paddingBottom: spacing.sm },
  greetingText: { fontSize: 18, fontWeight: '800', color: colors.text.primary },
  subGreetingText: { fontSize: 13, color: colors.text.secondary },
  profileImage: { width: 45, height: 45, borderRadius: 22.5, borderWidth: 2, borderColor: '#fff' },
  searchSection: { paddingHorizontal: spacing.md, marginBottom: spacing.sm },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', height: 50, borderRadius: borderRadius.md, paddingHorizontal: spacing.md, ...shadows.light },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 14, color: colors.text.primary },
  carouselContainer: { marginVertical: spacing.sm },
  heroCard: { width: '100%', height: 160, overflow: 'hidden', borderRadius: borderRadius.lg },
  heroOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', padding: spacing.lg, justifyContent: 'center' },
  heroTitle: { color: '#fff', fontSize: 24, fontWeight: '900' },
  shopNowBtn: { backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8, alignSelf: 'flex-start', marginTop: 10 },
  shopNowText: { color: colors.primary.main, fontWeight: 'bold', fontSize: 12 },
  categoriesSection: { marginVertical: spacing.xs },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: colors.text.primary },
  categoriesList: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  categoryChip: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: borderRadius.full, backgroundColor: '#fff', marginRight: 10, borderWidth: 1, borderColor: '#eee' },
  categoryChipActive: { backgroundColor: colors.primary.main, borderColor: colors.primary.main },
  categoryChipText: { color: colors.text.primary, fontWeight: '600', fontSize: 13 },
  categoryChipTextActive: { color: '#fff' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: spacing.md, marginTop: 5, marginBottom: 10, alignItems: 'center' },
  viewAllText: { fontSize: 13, color: colors.secondary.main, fontWeight: '700' },
  horizontalList: { paddingLeft: spacing.md },
  curatedCard: { backgroundColor: '#fff', width: 160, borderRadius: 20, padding: spacing.sm, marginRight: spacing.md, ...shadows.light },
  curatedImageContainer: { height: 120, backgroundColor: colors.accent.lightGray, borderRadius: 16, overflow: 'hidden' },
  curatedImage: { width: '100%', height: '100%' },
  curatedName: { fontSize: 14, fontWeight: '700', color: colors.text.primary, marginTop: 8 },
  curatedFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  curatedPrice: { fontSize: 15, fontWeight: '800', color: colors.text.primary },
  strikedPrice: { fontSize: 11, color: colors.text.muted, textDecorationLine: 'line-through', marginLeft: 6 },
  quickAdd: { backgroundColor: colors.primary.main, width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  skeletonCard: { width: width - 32, height: 180, backgroundColor: '#eee', borderRadius: 16, alignSelf: 'center' }
});

export default HomeScreen;
