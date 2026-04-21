import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ScrollView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ProductCard from '../components/products/ProductCard';
import Loading from '../components/common/Loading';
import { colors, spacing, fontSize, borderRadius, fonts } from '../config/theme';
import apiService from '../services/api';

const ProductsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const categoryId = route.params?.categoryId;

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(categoryId || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { loadData(); }, []);
  useEffect(() => { if (categoryId) setSelectedCategory(categoryId); }, [categoryId]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        apiService.getProducts(),
        apiService.getCategories(),
      ]);
      setProducts((productsRes.data || productsRes || []).filter(p => p.isActive));
      const cats = categoriesRes.data || categoriesRes || [];
      setCategories([{ id: null, name: 'All' }, ...cats.filter(c => c.isActive)]);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const filteredProducts = useMemo(() => products.filter(p => {
    const matchesCategory = selectedCategory ? p.categoryId === selectedCategory : true;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }), [products, selectedCategory, searchQuery]);

  if (isLoading && !refreshing) return <Loading fullScreen />;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary.main} />

      {/* Green header */}
      <View style={styles.header}>
        <View style={styles.blobA} />
        <View style={styles.headerInner}>
          <Text style={styles.headerEye}>✦ Our collection</Text>
          <Text style={styles.headerTitle}>All Products</Text>
          <Text style={styles.headerSub}>{filteredProducts.length} premium spices</Text>
        </View>
        <View style={styles.headerWave} />
      </View>

      <FlatList
        data={filteredProducts}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => navigation.navigate('ProductDetails', { productId: item.id })}
          />
        )}
        ListHeaderComponent={
          <View style={styles.filterSection}>
            {/* Search */}
            <View style={styles.searchBar}>
              <Ionicons name="search-outline" size={16} color={colors.text.muted} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search premium spices…"
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor={colors.text.disabled}
                autoCorrect={false}
              />
              {searchQuery !== '' && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={16} color={colors.text.muted} />
                </TouchableOpacity>
              )}
            </View>

            {/* Category chips */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipList}
            >
              {categories.map((item) => (
                <TouchableOpacity
                  key={item.id?.toString() || 'all'}
                  style={[styles.chip, selectedCategory === item.id && styles.chipActive]}
                  onPress={() => setSelectedCategory(item.id)}
                >
                  <Text style={[styles.chipText, selectedCategory === item.id && styles.chipTextActive]}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              ))}
              <View style={{ width: 8 }} />
            </ScrollView>
          </View>
        }
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.row}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary.main]} tintColor={colors.primary.main} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="search-outline" size={40} color={colors.text.disabled} />
            </View>
            <Text style={styles.emptyTitle}>No results found</Text>
            <Text style={styles.emptySubtitle}>Try adjusting your search or filters</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },

  // Green header
  header: {
    backgroundColor: colors.primary.main,
    paddingTop: Platform.OS === 'ios' ? 54 : 38,
    paddingHorizontal: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  blobA: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.055)',
    top: -60,
    right: -40,
  },
  headerInner: {
    position: 'relative',
    zIndex: 2,
    paddingBottom: 30,
  },
  headerEye: {
    fontFamily: fonts.body.bold,
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    letterSpacing: 1.8,
    marginBottom: 4,
  },
  headerTitle: {
    fontFamily: fonts.heading.extrabold,
    fontSize: 32,
    color: '#fff',
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  headerSub: {
    fontFamily: fonts.body.regular,
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
  },
  headerWave: {
    height: 24,
    backgroundColor: colors.background.default,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginHorizontal: -20,
    position: 'relative',
    zIndex: 3,
  },

  // Filters
  filterSection: {
    paddingBottom: spacing.sm,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 46,
    borderRadius: borderRadius.full,
    paddingHorizontal: 18,
    paddingRight: 12,
    gap: 10,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.card.border,
    shadowColor: colors.primary.main,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSize.sm,
    fontFamily: fonts.body.regular,
    color: colors.text.primary,
  },
  chipList: {
    paddingLeft: spacing.md,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
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
    fontSize: 12,
    fontFamily: fonts.body.semibold,
    color: colors.text.secondary,
  },
  chipTextActive: {
    color: '#fff',
    fontFamily: fonts.body.extrabold,
  },

  // Grid
  listContainer: {
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
  },

  // Empty
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.card.border,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: fonts.heading.bold,
    color: colors.text.primary,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: fonts.body.regular,
    color: colors.text.muted,
    marginTop: 4,
  },
});

export default ProductsScreen;
