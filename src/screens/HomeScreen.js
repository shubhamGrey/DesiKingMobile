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
      style={[{ width: w, height: h, borderRadius: radius, backgroundColor: '#D4CBBA', opacity }, style]}
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
    { id: '1', title: 'Premium Spices', sub: 'Straight from the farm to your kitchen', bg: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=1000&auto=format&fit=crop' },
    { id: '2', title: 'Pure. Natural. Authentic.', sub: 'No additives. No preservatives.', bg: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?q=80&w=1000&auto=format&fit=crop' },
    { id: '3', title: 'Farm Fresh Direct', sub: 'Sourced from top Indian farms', bg: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=1000&auto=format&fit=crop' },
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

  const handleAddToCart = (product) => {
    const pricing = product.pricesAndSkus?.[0];
    addItem({
      productId: product.id,
      name: product.name,
      price: pricing?.discountedAmount || pricing?.price || 0,
      image: product.thumbnailUrl || product.imageUrls?.[0],
      sku: pricing?.skuNumber,
      quantity: 1,
    });
  };

  const renderSection = (title, emoji, productList) => {
    if (!productList.length) return null;
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionEmoji}>{emoji}</Text>
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
                activeOpacity={0.9}
              >
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
                    <TouchableOpacity style={styles.rowAddBtn} onPress={() => handleAddToCart(product)}>
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
      <StatusBar barStyle="dark-content" />
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
                source={{ uri: item.bg }}
                style={styles.heroCard}
                imageStyle={{ borderRadius: borderRadius.xl }}
              >
                <View style={styles.heroOverlay}>
                  <View style={styles.heroPill}>
                    <Text style={styles.heroPillText}>NEW ARRIVAL</Text>
                  </View>
                  <Text style={styles.heroTitle}>{item.title}</Text>
                  <Text style={styles.heroSub}>{item.sub}</Text>
                  <TouchableOpacity style={styles.heroBtn} onPress={() => navigation.navigate('Products')}>
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
            >
              <Text style={[styles.chipText, activeCategory === cat && styles.chipTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Product sections */}
        {renderSection('Daily Essentials', '🔥', dailyEssentials)}
        {renderSection('Immunity Boosters', '🛡️', immunityBoosters)}
        {renderSection('Digestive Aids', '🍃', digestiveAids)}
        {renderSection('DesiKing Specials', '✨', desiKingSpecials)}

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
    fontWeight: '900',
    color: colors.text.primary,
    letterSpacing: -0.3,
  },
  greetSub: {
    fontSize: fontSize.sm,
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
    backgroundColor: colors.background.paper,
    height: 48,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    gap: 8,
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSize.sm,
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
    backgroundColor: 'rgba(0,0,0,0.42)',
    padding: spacing.lg,
    justifyContent: 'flex-end',
  },
  heroPill: {
    backgroundColor: colors.secondary.main,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  heroPillText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.3,
    lineHeight: 26,
  },
  heroSub: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 12,
  },
  heroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
    gap: 6,
  },
  heroBtnText: {
    color: colors.primary.main,
    fontWeight: '800',
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
    backgroundColor: colors.divider,
  },
  dotActive: {
    width: 18,
    backgroundColor: colors.primary.main,
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
    paddingVertical: 9,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.paper,
    borderWidth: 1.5,
    borderColor: colors.divider,
  },
  chipActive: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },
  chipText: {
    color: colors.text.secondary,
    fontWeight: '600',
    fontSize: 13,
  },
  chipTextActive: {
    color: '#fff',
    fontWeight: '800',
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
  },
  sectionEmoji: {
    fontSize: 18,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '800',
    color: colors.text.primary,
    letterSpacing: -0.2,
  },
  viewAll: {
    fontSize: 13,
    color: colors.secondary.main,
    fontWeight: '800',
  },
  rowList: {
    paddingLeft: spacing.md,
    paddingRight: spacing.sm,
    paddingBottom: 4,
  },
  rowCard: {
    backgroundColor: colors.background.paper,
    width: 155,
    borderRadius: borderRadius.lg,
    marginRight: spacing.md,
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.divider,
    overflow: 'hidden',
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
    backgroundColor: colors.secondary.main,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  rowBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '900',
  },
  rowCardBody: {
    padding: spacing.sm,
  },
  rowCardName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 6,
  },
  rowCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowCardPrice: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.primary.main,
    flex: 1,
  },
  rowCardStrike: {
    fontSize: 10,
    color: colors.text.disabled,
    textDecorationLine: 'line-through',
    marginRight: 6,
  },
  rowAddBtn: {
    backgroundColor: colors.primary.main,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HomeScreen;
