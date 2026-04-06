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
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../components/common/Header';
import OrbBackground, { ORB_CONFIGS } from '../components/common/OrbBackground';
import { colors, spacing, fontSize, borderRadius, shadows, fonts } from '../config/theme';
import apiService from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const { width } = Dimensions.get('window');
const HERO_WIDTH = width - 32;

// Shimmer skeleton
const SkeletonBlock = ({ w, h, radius = 12, style }) => {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  const opacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0.25, 0.55] });
  return (
    <Animated.View
      style={[{ width: w, height: h, borderRadius: radius, backgroundColor: 'rgba(255,255,255,0.12)', opacity }, style]}
    />
  );
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
    { id: '1', title: 'Premium Spices', sub: 'Straight from the farm to your kitchen', bg: require('../../assets/Hero Banner 1.png') },
    { id: '2', title: 'Pure. Natural. Authentic.', sub: 'No additives. No preservatives.', bg: require('../../assets/Hero Banner 2.png') },
    { id: '3', title: 'Farm Fresh Direct', sub: 'Sourced from top Indian farms', bg: require('../../assets/Hero Banner 3.png') },
    { id: '4', title: 'Taste the Tradition', sub: 'Hand-picked spices from Indian farms', bg: require('../../assets/Hero Banner 4.png') },
    { id: '5', title: 'Agro Nexis Quality', sub: 'Certified organic. 100% pure.', bg: require('../../assets/Hero Banner 5.png') },
  ];

  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    if (isLoading) return;
    const interval = setInterval(() => {
      const next = (heroIndex + 1) % heroItems.length;
      setHeroIndex(next);
      heroScrollRef.current?.scrollTo({ x: next * (HERO_WIDTH + 12), animated: true });
    }, 4500);
    return () => clearInterval(interval);
  }, [heroIndex, isLoading]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [pRes, cRes] = await Promise.all([apiService.getProducts(), apiService.getCategories()]);
      setAllProducts((pRes.data || pRes || []).filter(p => p.isActive));
      setCategories((cRes.data || cRes || []).filter(c => c.isActive));
    } catch (err) {
      console.error('Home load error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const filteredProducts = useMemo(() => allProducts.filter(p => {
    const q = searchQuery.toLowerCase();
    return p.name.toLowerCase().includes(q) && (activeCategory === 'All' || p.categoryName === activeCategory);
  }), [allProducts, searchQuery, activeCategory]);

  const dailyEssentials = useMemo(() => allProducts.filter(p => p.isFeatured).slice(0, 8), [allProducts]);
  const immunityBoosters = useMemo(() => allProducts.filter(p => ['turmeric', 'pepper', 'ginger'].some(k => p.name.toLowerCase().includes(k))).slice(0, 8), [allProducts]);
  const digestiveAids = useMemo(() => allProducts.filter(p => ['cumin', 'fennel'].some(k => p.name.toLowerCase().includes(k))).slice(0, 8), [allProducts]);
  const desiKingSpecials = useMemo(() => allProducts.filter(p => ['masala', 'blend'].some(k => p.name.toLowerCase().includes(k))).slice(0, 8), [allProducts]);

  const renderBrandBanner = () => (
    <ImageBackground
      source={require('../../assets/Brand.png')}
      style={styles.brandBanner}
      resizeMode="cover"
    >
      <View style={styles.brandOverlay}>
        <Text style={styles.brandBannerTitle}>Straight from Farm to Kitchen</Text>
        <Text style={styles.brandBannerSub}>Premium spices crafted since 2014</Text>
      </View>
    </ImageBackground>
  );

  const renderAchievements = () => (
    <ImageBackground
      source={require('../../assets/Achievement.jpg')}
      style={styles.achievementsBanner}
      resizeMode="cover"
    >
      <View style={styles.achievementsOverlay}>
        <View style={styles.achievementItem}>
          <Text style={styles.achievementNum}>10+</Text>
          <Text style={styles.achievementLabel}>Years</Text>
        </View>
        <View style={styles.achievementDivider} />
        <View style={styles.achievementItem}>
          <Text style={styles.achievementNum}>50+</Text>
          <Text style={styles.achievementLabel}>Products</Text>
        </View>
        <View style={styles.achievementDivider} />
        <View style={styles.achievementItem}>
          <Text style={styles.achievementNum}>1000+</Text>
          <Text style={styles.achievementLabel}>Customers</Text>
        </View>
      </View>
    </ImageBackground>
  );

  const handleAddToCart = (product) => {
    const pricing = product.pricesAndSkus?.[0];
    addItem({
      productId: product.id,
      name: product.name,
      price: pricing?.discountedAmount || pricing?.price || 0,
      image: product.thumbnailUrl || product.imageUrls?.[0],
      brandId: product.brandId,
      sku: pricing?.skuNumber,
      quantity: 1,
    });
  };

  const renderSearchResults = () => {
    if (filteredProducts.length === 0) {
      return (
        <View style={styles.emptySearch}>
          <Ionicons name="search-outline" size={40} color={colors.text.disabled} />
          <Text style={styles.emptySearchText}>No results for "{searchQuery}"</Text>
        </View>
      );
    }
    return renderSection('Search Results', 'search-outline', filteredProducts);
  };

  const renderSection = (title, emoji, productList) => {
    if (!productList.length) return null;
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name={emoji} size={18} color={colors.accent.orange} />
            <Text style={styles.sectionTitle}>{title}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Products')}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.rowList}
        >
          {productList.map((product) => {
            const pricing = product.pricesAndSkus?.[0];
            const pay = pricing?.discountedAmount || pricing?.price || 0;
            const orig = pricing?.price || 0;
            const hasDis = pricing?.isDiscounted && orig > pay;
            return (
              <TouchableOpacity
                key={product.id}
                style={styles.rowCard}
                onPress={() => navigation.navigate('ProductDetails', { productId: product.id })}
                activeOpacity={0.88}
                accessibilityLabel={product.name}
              >
                {/* Orange top accent bar */}
                <LinearGradient
                  colors={['#1B4D3E', colors.accent.orange]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.rowAccentBar}
                />
                <View style={styles.rowCardImg}>
                  <Image source={{ uri: product.thumbnailUrl }} style={styles.rowCardImage} resizeMode="cover" />
                  {hasDis && (
                    <View style={styles.rowBadge}>
                      <Text style={styles.rowBadgeText}>{Math.round(pricing.discountPercentage)}%</Text>
                    </View>
                  )}
                </View>
                <View style={styles.rowCardBody}>
                  <Text style={styles.rowCardName} numberOfLines={1}>{product.name}</Text>
                  <View style={styles.rowCardFooter}>
                    <Text style={styles.rowCardPrice}>₹{pay}</Text>
                    {hasDis && <Text style={styles.rowCardStrike}>₹{orig}</Text>}
                    <TouchableOpacity
                      style={styles.rowAddBtn}
                      onPress={() => handleAddToCart(product)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      accessibilityLabel="Add to cart"
                    >
                      <Ionicons name="add" size={16} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (isLoading && !refreshing) {
    return (
      <View style={styles.container}>
        <Header />
        <View style={{ padding: spacing.md, gap: 16 }}>
          <SkeletonBlock w={200} h={24} radius={8} />
          <SkeletonBlock w={HERO_WIDTH} h={180} radius={20} />
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {[1, 2, 3, 4].map(i => <SkeletonBlock key={i} w={60} h={28} radius={14} />)}
          </View>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <SkeletonBlock w={(width - 56) / 2} h={200} radius={16} />
            <SkeletonBlock w={(width - 56) / 2} h={200} radius={16} />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <OrbBackground orbs={ORB_CONFIGS.home} />
      <StatusBar barStyle="light-content" backgroundColor="#0a1628" />
      <Header />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary.main]} />
        }
      >
        {/* Greeting */}
        <View style={styles.greeting}>
          <View>
            <Text style={styles.greetHi}>{greeting()}, {user?.firstName || 'Guest'} 👋</Text>
            <Text style={styles.greetSub}>Bring purity to your kitchen today.</Text>
          </View>
        </View>

        {/* Search bar */}
        <View style={styles.searchWrap}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={18} color={colors.text.muted} />
            <TextInput
              placeholder="Search premium spices..."
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={colors.text.disabled}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color={colors.text.muted} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Hero carousel */}
        <ScrollView
          ref={heroScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={HERO_WIDTH + 12}
          snapToAlignment="center"
          decelerationRate="fast"
          contentContainerStyle={{ paddingHorizontal: 16 }}
          style={styles.heroScroll}
        >
          {heroItems.map((item, idx) => (
            <View key={item.id} style={{ width: HERO_WIDTH, marginRight: 12 }}>
              <ImageBackground
                source={item.bg}
                style={styles.heroCard}
                imageStyle={{ borderRadius: borderRadius.xl }}
              >
                <View style={styles.heroOverlay}>
                  <LinearGradient
                    colors={[colors.secondary.main, colors.secondary.light]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.heroPill}
                  >
                    <Text style={styles.heroPillText}>NEW ARRIVAL</Text>
                  </LinearGradient>
                  <Text style={styles.heroTitle}>{item.title}</Text>
                  <Text style={styles.heroSub}>{item.sub}</Text>
                  <TouchableOpacity style={styles.heroBtn} onPress={() => navigation.navigate('Products')} accessibilityLabel="Shop Now">
                    <Text style={styles.heroBtnText}>Shop Now</Text>
                    <Ionicons name="arrow-forward" size={14} color={colors.primary.main} />
                  </TouchableOpacity>
                </View>
              </ImageBackground>
            </View>
          ))}
        </ScrollView>

        {/* Dots indicator */}
        <View style={styles.dots}>
          {heroItems.map((_, i) => (
            <View key={i} style={[styles.dot, i === heroIndex && styles.dotActive]} />
          ))}
        </View>

        {/* Category chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipList}
          style={styles.chipScroll}
        >
          {['All', ...categories.map(c => c.name)].map((cat, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.chip, activeCategory === cat && styles.chipActive]}
              onPress={() => setActiveCategory(cat)}
              accessibilityRole="button"
              accessibilityLabel={cat}
              accessibilityState={{ selected: activeCategory === cat }}
            >
              <Text style={[styles.chipText, activeCategory === cat && styles.chipTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Product sections */}
        {searchQuery.length > 0 ? renderSearchResults() : (
          <>
            {renderSection('Daily Essentials', 'flame', dailyEssentials)}
            {renderBrandBanner()}
            {renderSection('Immunity Boosters', 'shield-checkmark', immunityBoosters)}
            {renderAchievements()}
            {renderSection('Digestive Aids', 'leaf', digestiveAids)}
            {renderSection('DesiKing Specials', 'sparkles', desiKingSpecials)}
          </>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  greeting: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  greetHi: {
    fontSize: fontSize.xl,
    fontFamily: fonts.heading.black,
    color: colors.text.primary,
    letterSpacing: -0.3,
  },
  greetSub: {
    fontSize: fontSize.sm,
    fontFamily: fonts.body.regular,
    color: colors.text.muted,
    marginTop: 3,
  },
  searchWrap: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.glass.surface,
    height: 48,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSize.sm,
    fontFamily: fonts.body.regular,
    color: colors.text.primary,
  },
  heroScroll: {
    marginTop: spacing.xs,
  },
  heroCard: {
    width: '100%',
    height: 180,
    overflow: 'hidden',
    borderRadius: borderRadius.xl,
  },
  heroOverlay: {
    flex: 1,
    backgroundColor: 'rgba(6,13,26,0.70)',
    padding: spacing.lg,
    justifyContent: 'flex-end',
  },
  heroPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  heroPillText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: fonts.body.extrabold,
    letterSpacing: 1,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 22,
    fontFamily: fonts.heading.black,
    letterSpacing: -0.3,
    lineHeight: 28,
  },
  heroSub: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    fontFamily: fonts.body.regular,
    marginTop: 4,
    marginBottom: 12,
  },
  heroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
    gap: 6,
  },
  heroBtnText: {
    color: colors.primary.main,
    fontFamily: fonts.body.extrabold,
    fontSize: 12,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: spacing.sm,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  dotActive: {
    width: 18,
    backgroundColor: colors.secondary.main,
  },
  chipScroll: {
    marginTop: spacing.md,
  },
  chipList: {
    paddingHorizontal: spacing.md,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: borderRadius.full,
    backgroundColor: colors.glass.surface,
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  chipActive: {
    backgroundColor: colors.secondary.main,
    borderColor: colors.secondary.main,
  },
  chipText: {
    color: 'rgba(255,255,255,0.65)',
    fontFamily: fonts.body.semibold,
    fontSize: 13,
  },
  chipTextActive: {
    color: '#fff',
    fontFamily: fonts.body.extrabold,
  },
  section: {
    marginTop: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent.orange,
    paddingLeft: 8,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontFamily: fonts.heading.bold,
    color: '#fff',
    letterSpacing: -0.2,
  },
  viewAll: {
    fontSize: 13,
    color: colors.secondary.light,
    fontFamily: fonts.body.extrabold,
  },
  rowList: {
    paddingLeft: spacing.md,
    paddingRight: spacing.sm,
    paddingBottom: 4,
  },
  rowCard: {
    width: 155,
    borderRadius: borderRadius.lg,
    marginRight: spacing.md,
    borderWidth: 1,
    borderColor: colors.glass.border,
    overflow: 'hidden',
    backgroundColor: colors.glass.surface,
  },
  rowCardImg: {
    height: 115,
    backgroundColor: colors.accent.lightGray,
    position: 'relative',
  },
  rowCardImage: {
    width: '100%',
    height: '100%',
  },
  rowBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: colors.accent.orange,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  rowBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: fonts.body.extrabold,
  },

  rowCardBody: {
    padding: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  rowCardName: {
    fontSize: 13,
    fontFamily: fonts.heading.bold,
    color: '#fff',
    marginBottom: 6,
  },
  rowCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowCardPrice: {
    fontSize: 15,
    fontFamily: fonts.heading.extrabold,
    color: colors.secondary.light,
    flex: 1,
  },
  rowCardStrike: {
    fontSize: 11,
    fontFamily: fonts.body.regular,
    color: 'rgba(255,255,255,0.35)',
    textDecorationLine: 'line-through',
    marginRight: 6,
  },
  rowAddBtn: {
    backgroundColor: colors.accent.orange,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptySearch: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptySearchText: {
    fontSize: fontSize.sm,
    fontFamily: fonts.body.regular,
    color: 'rgba(255,255,255,0.55)',
    textAlign: 'center',
  },
  rowAccentBar: {
    height: 3,
    width: '100%',
  },
  brandBanner: {
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
    height: 140,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  brandOverlay: {
    flex: 1,
    backgroundColor: 'rgba(10,30,22,0.80)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  brandBannerTitle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: fonts.heading.extrabold,
    letterSpacing: 0.2,
    textAlign: 'center',
  },

  brandBannerSub: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 12,
    fontFamily: fonts.body.regular,
    marginTop: 6,
    textAlign: 'center',
  },
  achievementsBanner: {
    marginTop: spacing.lg,
    height: 110,
    overflow: 'hidden',
  },
  achievementsOverlay: {
    flex: 1,
    backgroundColor: 'rgba(10,30,22,0.82)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  achievementItem: {
    flex: 1,
    alignItems: 'center',
  },
  achievementNum: {
    color: '#fff',
    fontSize: 24,
    fontFamily: fonts.heading.black,
    letterSpacing: -0.5,
  },

  achievementLabel: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 11,
    fontFamily: fonts.body.medium,
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  achievementDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.25)',
    marginHorizontal: spacing.md,
  },
});

export default HomeScreen;
