import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/common/Header';
import ProductCard from '../components/products/ProductCard';
import Loading from '../components/common/Loading';
import { colors, spacing, fontSize, borderRadius, shadows, fonts } from '../config/theme';
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

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (categoryId) setSelectedCategory(categoryId);
  }, [categoryId]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        apiService.getProducts(),
        apiService.getCategories(),
      ]);

      const prods = productsRes.data || productsRes || [];
      setProducts(prods.filter(p => p.isActive));

      const cats = categoriesRes.data || categoriesRes || [];
      setCategories([{ id: null, name: 'All Spices' }, ...cats.filter(c => c.isActive)]);
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

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = selectedCategory ? p.categoryId === selectedCategory : true;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  if (isLoading && !refreshing) return <Loading fullScreen />;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1B4D3E" />
      <Header title="Our Catalog" showBack />

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
        // Inlined the header to prevent component remounting and keyboard closing
        ListHeaderComponent={
          <View style={styles.filterSection}>
            <View style={styles.searchRow}>
              <View style={styles.searchBar}>
                <Ionicons name="search" size={18} color={colors.text.muted} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search premium spices..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholderTextColor={colors.text.muted}
                  autoCorrect={false}
                />
                {searchQuery !== '' && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <Ionicons name="close-circle" size={18} color={colors.text.muted} />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipList}>
              {categories.map((item) => (
                <TouchableOpacity
                  key={item.id?.toString() || 'all'}
                  style={[
                    styles.chip,
                    selectedCategory === item.id && styles.chipActive,
                  ]}
                  onPress={() => setSelectedCategory(item.id)}
                >
                  <Text style={[styles.chipText, selectedCategory === item.id && styles.chipTextActive]}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.resultsHeader}>
              <Text style={styles.resultsCount}>{filteredProducts.length} Products Found</Text>
            </View>
          </View>
        }
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.row}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary.main]} />}
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
  container: { flex: 1, backgroundColor: colors.background.default },
  filterSection: { paddingBottom: spacing.md },
  searchRow: { paddingHorizontal: spacing.md, marginTop: spacing.sm },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 50,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    ...shadows.light,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 14, fontFamily: fonts.body.medium, color: colors.text.primary },
  chipList: { paddingHorizontal: spacing.md, marginTop: spacing.md, paddingBottom: 4 },
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: borderRadius.full,
    backgroundColor: '#fff',
    marginRight: 10,
    ...shadows.light,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  chipActive: { backgroundColor: colors.primary.main, borderColor: colors.primary.main },
  chipText: { fontSize: 13, fontFamily: fonts.body.semibold, color: colors.text.secondary },
  chipTextActive: { color: '#fff', fontFamily: fonts.body.extrabold },
  resultsHeader: { paddingHorizontal: spacing.md, marginTop: spacing.lg },
  resultsCount: { fontSize: 12, fontFamily: fonts.body.bold, color: colors.text.muted, textTransform: 'uppercase', letterSpacing: 1 },
  listContainer: { paddingBottom: 100 },
  row: { justifyContent: 'space-between', paddingHorizontal: spacing.md, marginTop: spacing.md },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 80 },
  emptyIconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.background.muted, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  emptyTitle: { fontSize: 18, fontFamily: fonts.heading.bold, color: colors.text.primary },
  emptySubtitle: { fontSize: 14, fontFamily: fonts.body.regular, color: colors.text.secondary, marginTop: 4 },
});

export default ProductsScreen;
