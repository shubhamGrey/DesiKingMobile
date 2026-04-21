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
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import Header from '../components/common/Header';
import { colors, spacing, fontSize, borderRadius, fonts, CATEGORY_COLORS, CATEGORY_COLORS_DEFAULT } from '../config/theme';
import apiService from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const { width } = Dimensions.get('window');

// Skeleton block for loading state
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
  const opacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0.20, 0.45] });
  return (
    <Animated.View
      style={[{ width: w, height: h, borderRadius: radius, backgroundColor: colors.card.border, opacity }, style]}
    />
  );
};

// Section header: gold eyebrow + Neuton title + view-all link
const SectionHeader = ({ eyebrow, title, onViewAll, lottie }) => (
  <View style={styles.secHdr}>
    <View style={styles.secHdrLeft}>
      <Text style={styles.secEye}>✦ {eyebrow}</Text>
      <View style={styles.secTtlRow}>
        <Text style={styles.secTtl}>{title}</Text>
        {lottie && (
          <LottieView
            source={lottie}
            autoPlay
            loop
            style={styles.secLottie}
          />
        )}
      </View>
    </View>
    {onViewAll && (
      <TouchableOpacity onPress={onViewAll} accessibilityLabel={`View all ${title}`}>
        <Text style={styles.viewAll}>View All ›</Text>
      </TouchableOpacity>
    )}
  </View>
);

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { addItem } = useCart();

  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { loadData(); }, []);

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
  const immunityBoosters = useMemo(() => allProducts.filter(p =>
    ['turmeric', 'pepper', 'ginger'].some(k => p.name.toLowerCase().includes(k))
  ).slice(0, 8), [allProducts]);
  const digestiveAids = useMemo(() => allProducts.filter(p =>
    ['cumin', 'fennel'].some(k => p.name.toLowerCase().includes(k))
  ).slice(0, 8), [allProducts]);
  const desiKingSpecials = useMemo(() => allProducts.filter(p =>
    ['masala', 'blend'].some(k => p.name.toLowerCase().includes(k))
  ).slice(0, 8), [allProducts]);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

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

  const renderRowCard = (product) => {
    const pricing = product.pricesAndSkus?.[0];
    const pay = pricing?.discountedAmount || pricing?.price || 0;
    const orig = pricing?.price || 0;
    const hasDis = pricing?.isDiscounted && orig > pay;
    const discPct = hasDis ? Math.round(pricing.discountPercentage) : 0;
    const barColors = CATEGORY_COLORS[product.categoryName] || CATEGORY_COLORS_DEFAULT;

    return (
      <TouchableOpacity
        key={product.id}
        style={styles.rowCard}
        onPress={() => navigation.navigate('ProductDetails', { productId: product.id })}
        activeOpacity={0.88}
        accessibilityLabel={product.name}
      >
        <LinearGradient colors={barColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.rowAccentBar} />
        <View style={styles.rowCardImg}>
          <Image source={{ uri: product.thumbnailUrl || product.imageUrls?.[0] }} style={styles.rowCardImage} resizeMode="contain" />
          {hasDis && (
            <View style={styles.rowBadge}>
              <Text style={styles.rowBadgeText}>{discPct}% OFF</Text>
            </View>
          )}
          {product.isFeatured && !hasDis && (
            <View style={[styles.rowBadge, styles.rowBadgeTop]}>
              <Text style={styles.rowBadgeText}>TOP</Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.rowAddBtn}
            onPress={() => handleAddToCart(product)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityLabel="Add to cart"
          >
            <Ionicons name="add" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.rowCardBody}>
          <Text style={styles.rowCardCat} numberOfLines={1}>{product.categoryName || 'Spices'}</Text>
          <Text style={styles.rowCardName} numberOfLines={1}>{product.name}</Text>
          <Text style={styles.rowCardStars}>★★★★★</Text>
          <View style={styles.rowCardFooter}>
            <Text style={styles.rowCardPrice}>₹{pay}</Text>
            {hasDis && <Text style={styles.rowCardStrike}>₹{orig}</Text>}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSection = (eyebrow, title, productList, lottie) => {
    if (!productList.length) return null;
    return (
      <View style={styles.section}>
        <SectionHeader
          eyebrow={eyebrow}
          title={title}
          onViewAll={() => navigation.navigate('Products')}
          lottie={lottie}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.rowList}
        >
          {productList.map(renderRowCard)}
        </ScrollView>
      </View>
    );
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
    return renderSection('Results', 'Search Results', filteredProducts);
  };

  const renderMidBanner = () => (
    <View style={styles.midBan}>
      <View style={styles.blobA} />
      <View style={styles.blobB} />
      <View style={styles.midInner}>
        <Text style={styles.midEye}>✦ Our Promise</Text>
        <Text style={styles.midH}>Farm to{'\n'}<Text style={styles.midHEm}>Kitchen,</Text>{'\n'}Pure & Simple.</Text>
        <Text style={styles.midSub}>No additives. No preservatives.{'\n'}Just pure tradition.</Text>
        <View style={styles.midLine} />
        <View style={styles.midStats}>
          {[['4+', 'Years'], ['14+', 'Products'], ['1K+', 'Customers']].map(([n, l], i) => (
            <View key={i} style={[styles.midStat, i > 0 && styles.midStatBorder]}>
              <Text style={styles.midN}>{n}</Text>
              <Text style={styles.midL}>{l}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  const renderAchieveGrid = () => (
    <View style={styles.achieve}>
      <Text style={styles.achieveEye}>✦ Why choose us</Text>
      <Text style={styles.achieveH}>Trusted by Kitchens{'\n'}Across India</Text>
      <View style={styles.achieveGrid}>
        {[['4+', 'Years'], ['14+', 'Products'], ['1K+', 'Customers']].map(([n, l], i) => (
          <View key={i} style={styles.aItem}>
            <Text style={styles.aNum}>{n}</Text>
            <Text style={styles.aLbl}>{l}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  if (isLoading && !refreshing) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={colors.primary.main} />
        <Header showCart />
        <ScrollView contentContainerStyle={{ padding: spacing.md, gap: 16 }}>
          <SkeletonBlock w={220} h={28} radius={8} />
          <SkeletonBlock w={width - 32} h={48} radius={24} />
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {[1, 2, 3, 4].map(i => <SkeletonBlock key={i} w={72} h={32} radius={16} />)}
          </View>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <SkeletonBlock w={154} h={210} radius={22} />
            <SkeletonBlock w={154} h={210} radius={22} />
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary.main} />
      <Header showCart showSearch />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary.main]} tintColor={colors.primary.main} />
        }
      >
        {/* Hero section */}
        <View style={styles.hero}>
          <View style={styles.heroBlobA} />
          <View style={styles.heroBlobB} />
          <LottieView
            source={require('../../assets/lottie/star.json')}
            autoPlay
            loop
            style={styles.heroStarLottie}
          />
          <View style={styles.heroInner}>
            <View style={styles.heroPill}>
              <View style={styles.pillDot} />
              <Text style={styles.heroPillText}>New Arrivals · 2026</Text>
            </View>
            <Text style={styles.heroH}>
              Pure{'\n'}<Text style={styles.heroHEm}>Indian</Text>{'\n'}Spices.
            </Text>
            <Text style={styles.heroSub}>Straight from farm to your kitchen</Text>
            <TouchableOpacity
              style={styles.heroCta}
              onPress={() => navigation.navigate('Products')}
              accessibilityLabel="Shop Collection"
            >
              <Text style={styles.heroCtaText}>Shop Collection</Text>
              <View style={styles.ctaArrow}>
                <Ionicons name="arrow-forward" size={15} color="#fff" />
              </View>
            </TouchableOpacity>
          </View>
          {/* Wave cutout bottom */}
          <View style={styles.heroWave} />
        </View>

        {/* Greeting */}
        <View style={styles.greeting}>
          <Text style={styles.greetHi}>{greeting()}, {user?.firstName || 'Guest'} 👋</Text>
          <Text style={styles.greetSub}>What are you cooking today?</Text>
        </View>

        {/* Search bar */}
        <View style={styles.searchWrap}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={16} color={colors.text.muted} />
            <TextInput
              placeholder="Search premium spices…"
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={colors.text.disabled}
            />
            {searchQuery.length > 0 ? (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={16} color={colors.text.muted} />
              </TouchableOpacity>
            ) : (
              <View style={styles.searchFlt}>
                <Ionicons name="options-outline" size={14} color="#fff" />
              </View>
            )}
          </View>
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
              accessibilityState={{ selected: activeCategory === cat }}
            >
              <Text style={[styles.chipText, activeCategory === cat && styles.chipTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
          <View style={{ width: 6 }} />
        </ScrollView>

        {/* Product sections */}
        {searchQuery.length > 0 ? renderSearchResults() : (
          <>
            {renderSection('Handpicked for you', 'Daily Essentials', dailyEssentials, require('../../assets/lottie/fire.json'))}
            {renderMidBanner()}
            {renderSection('Wellness picks', 'Immunity Boosters', immunityBoosters)}
            {renderAchieveGrid()}
            {renderSection('Good for digestion', 'Digestive Aids', digestiveAids)}
            {renderSection('Our bestsellers', 'DesiKing Specials', desiKingSpecials)}
          </>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },

  // Hero
  hero: {
    backgroundColor: colors.primary.main,
    paddingHorizontal: 22,
    paddingTop: 18,
    overflow: 'hidden',
    position: 'relative',
  },
  heroBlobA: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(255,255,255,0.055)',
    top: -70,
    right: -50,
  },
  heroBlobB: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: 'rgba(201,151,90,0.14)',
    bottom: 10,
    left: -40,
  },
  heroInner: {
    position: 'relative',
    zIndex: 2,
    paddingBottom: 40,
  },
  heroPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.20)',
    borderRadius: borderRadius.full,
    paddingHorizontal: 13,
    paddingVertical: 5,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  pillDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.secondary.light,
  },
  heroPillText: {
    fontFamily: fonts.body.bold,
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  heroH: {
    fontFamily: fonts.heading.extrabold,
    fontSize: 52,
    color: '#fff',
    lineHeight: 50,
    letterSpacing: -1,
    marginBottom: 12,
  },
  heroHEm: {
    color: colors.secondary.light,
    fontFamily: fonts.heading.italic,
  },
  heroSub: {
    fontFamily: fonts.heading.italic,
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 24,
    lineHeight: 22,
  },
  heroCta: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: borderRadius.full,
    paddingVertical: 13,
    paddingLeft: 22,
    paddingRight: 10,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 24,
    elevation: 8,
  },
  heroCtaText: {
    fontFamily: fonts.body.extrabold,
    fontSize: 13,
    color: colors.primary.main,
  },
  ctaArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroStarLottie: {
    position: 'absolute',
    width: 140,
    height: 140,
    right: -10,
    bottom: 28,
    opacity: 0.22,
    zIndex: 1,
  },
  heroWave: {
    height: 28,
    backgroundColor: colors.background.default,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginHorizontal: -22,
    position: 'relative',
    zIndex: 3,
  },

  // Greeting
  greeting: {
    paddingHorizontal: spacing.md + 4,
    paddingTop: spacing.sm,
    paddingBottom: 4,
  },
  greetHi: {
    fontFamily: fonts.heading.extrabold,
    fontSize: 27,
    color: colors.text.primary,
    letterSpacing: -0.3,
    lineHeight: 30,
  },
  greetSub: {
    fontFamily: fonts.body.regular,
    fontSize: 13,
    color: colors.text.muted,
    marginTop: 3,
  },

  // Search
  searchWrap: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: 0,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 48,
    borderRadius: borderRadius.full,
    paddingHorizontal: 18,
    paddingRight: 8,
    gap: 10,
    borderWidth: 1.5,
    borderColor: colors.card.border,
    shadowColor: colors.primary.main,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 16,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSize.sm,
    fontFamily: fonts.body.regular,
    color: colors.text.primary,
  },
  searchFlt: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Chips
  chipScroll: {
    marginTop: 14,
  },
  chipList: {
    paddingLeft: spacing.md,
    gap: 8,
    paddingBottom: 4,
  },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: borderRadius.full,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: colors.card.border,
  },
  chipActive: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
    shadowColor: colors.primary.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 4,
  },
  chipText: {
    fontFamily: fonts.body.semibold,
    fontSize: 13,
    color: colors.text.secondary,
  },
  chipTextActive: {
    color: '#fff',
    fontFamily: fonts.body.extrabold,
  },

  // Section header
  section: {
    marginTop: 28,
  },
  secHdr: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    marginBottom: 14,
  },
  secHdrLeft: {
    flex: 1,
  },
  secTtlRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  secLottie: {
    width: 36,
    height: 36,
    marginLeft: 4,
    marginBottom: -2,
  },
  secEye: {
    fontFamily: fonts.body.bold,
    fontSize: 10,
    color: colors.secondary.main,
    textTransform: 'uppercase',
    letterSpacing: 1.8,
    marginBottom: 1,
  },
  secTtl: {
    fontFamily: fonts.heading.extrabold,
    fontSize: 24,
    color: colors.text.primary,
    letterSpacing: -0.2,
    lineHeight: 24,
  },
  viewAll: {
    fontFamily: fonts.body.extrabold,
    fontSize: 12,
    color: colors.primary.main,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.primary.main,
    paddingBottom: 1,
  },

  // Row product cards
  rowList: {
    paddingLeft: spacing.md,
    paddingRight: spacing.sm,
    paddingBottom: 6,
  },
  rowCard: {
    width: 154,
    borderRadius: 22,
    marginRight: 14,
    borderWidth: 1.5,
    borderColor: colors.card.border,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: colors.primary.main,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 16,
    elevation: 3,
  },
  rowAccentBar: {
    height: 3,
    width: '100%',
  },
  rowCardImg: {
    height: 120,
    backgroundColor: colors.background.cream,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowCardImage: {
    width: '80%',
    height: '80%',
  },
  rowBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: colors.primary.main,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  rowBadgeTop: {
    backgroundColor: colors.primary.light,
  },
  rowBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: fonts.body.extrabold,
    letterSpacing: 0.4,
  },
  rowAddBtn: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary.main,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  rowCardBody: {
    padding: 10,
    paddingBottom: 12,
  },
  rowCardCat: {
    fontSize: 10,
    fontFamily: fonts.body.semibold,
    color: colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  rowCardName: {
    fontSize: 14,
    fontFamily: fonts.heading.bold,
    color: colors.text.primary,
    marginBottom: 5,
  },
  rowCardStars: {
    fontSize: 10,
    color: colors.secondary.main,
    marginBottom: 5,
  },
  rowCardFooter: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 5,
  },
  rowCardPrice: {
    fontSize: 17,
    fontFamily: fonts.heading.extrabold,
    color: colors.primary.main,
  },
  rowCardStrike: {
    fontSize: 11,
    fontFamily: fonts.body.regular,
    color: colors.text.disabled,
    textDecorationLine: 'line-through',
  },

  // Mid banner
  midBan: {
    backgroundColor: colors.primary.main,
    paddingHorizontal: 24,
    paddingVertical: 34,
    marginTop: 28,
    overflow: 'hidden',
    position: 'relative',
  },
  blobA: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(255,255,255,0.055)',
    top: -80,
    right: -60,
  },
  blobB: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(201,151,90,0.10)',
    bottom: -60,
    left: -50,
  },
  midInner: {
    position: 'relative',
    zIndex: 2,
  },
  midEye: {
    fontFamily: fonts.body.bold,
    fontSize: 10,
    color: colors.secondary.light,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 12,
  },
  midH: {
    fontFamily: fonts.heading.extrabold,
    fontSize: 36,
    color: '#fff',
    lineHeight: 36,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  midHEm: {
    fontFamily: fonts.heading.italic,
    color: colors.secondary.light,
  },
  midSub: {
    fontFamily: fonts.heading.italic,
    fontSize: 15,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 26,
    lineHeight: 22,
  },
  midLine: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
    marginBottom: 22,
  },
  midStats: {
    flexDirection: 'row',
  },
  midStat: {
    flex: 1,
    alignItems: 'center',
  },
  midStatBorder: {
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255,255,255,0.12)',
  },
  midN: {
    fontFamily: fonts.heading.extrabold,
    fontSize: 32,
    color: '#fff',
    letterSpacing: -0.5,
  },
  midL: {
    fontFamily: fonts.body.semibold,
    fontSize: 10,
    color: 'rgba(255,255,255,0.45)',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 2,
  },

  // Achieve grid
  achieve: {
    paddingHorizontal: spacing.md,
    paddingTop: 28,
    paddingBottom: 10,
    backgroundColor: colors.background.default,
    marginTop: 28,
  },
  achieveEye: {
    fontFamily: fonts.body.bold,
    fontSize: 10,
    color: colors.secondary.main,
    textTransform: 'uppercase',
    letterSpacing: 1.8,
    marginBottom: 8,
  },
  achieveH: {
    fontFamily: fonts.heading.extrabold,
    fontSize: 27,
    color: colors.text.primary,
    letterSpacing: -0.3,
    marginBottom: 20,
    lineHeight: 31,
  },
  achieveGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  aItem: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.card.border,
    shadowColor: colors.primary.main,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 16,
    elevation: 2,
  },
  aNum: {
    fontFamily: fonts.heading.extrabold,
    fontSize: 32,
    color: colors.primary.main,
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  aLbl: {
    fontFamily: fonts.body.semibold,
    fontSize: 10,
    color: colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 4,
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
    color: colors.text.muted,
    textAlign: 'center',
  },
});

export default HomeScreen;
