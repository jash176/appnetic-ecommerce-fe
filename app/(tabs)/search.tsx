import React, { useCallback, useMemo, useEffect, useState } from 'react';
import { 
  FlatList, 
  ListRenderItem, 
  StyleSheet, 
  View, 
  TouchableOpacity, 
  Dimensions,
  StatusBar,
  ActivityIndicator,
  Pressable
} from 'react-native';
import SearchBar from '@/components/ui/SearchBar';
import { ThemedText } from '@/components/ThemedText';
import ProductCard from '@/components/ui/ecommerce/ProductCard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Footer from '@/components/ui/Footer';
import { router } from 'expo-router';
import { useCategories, useProducts } from '@/lib/api/hooks/useProducts';
import { Product, Category } from "../../lib/api/services/types"
import CategoryCard from '@/components/ui/ecommerce/CategoryCard';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  FadeIn, 
  FadeOut, 
  SlideInRight, 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  Layout
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PAGE_SIZE = 10;

export default function SearchScreenPage() {
  const { top: paddingTop } = useSafeAreaInsets();
  
  // Animation values
  const fadeAnim = useSharedValue(0);
  const slideAnim = useSharedValue(30);
  
  // Start entrance animation
  useEffect(() => {
    fadeAnim.value = withTiming(1, { duration: 600 });
    slideAnim.value = withTiming(0, { duration: 600 });
  }, []);

  // Animation styles
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
      transform: [{ translateY: slideAnim.value }]
    };
  });
  
  const handleSearch = (query: string) => {
    router.push({
      pathname: "/products",
      params: {query: query}
    });
  };

  const [isCategoriesPressed, setIsCategoriesPressed] = useState(false);
  const [isProductsPressed, setIsProductsPressed] = useState(false);
  
  // Animation styles for category button
  const categoryButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: isCategoriesPressed ? withTiming(0.96, { duration: 100 }) : withTiming(1, { duration: 200 }) }],
      backgroundColor: isCategoriesPressed ? withTiming('#e8eef8', { duration: 100 }) : withTiming('#f0f4f9', { duration: 200 }),
    };
  });
  
  // Animation styles for products button
  const productsButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: isProductsPressed ? withTiming(0.96, { duration: 100 }) : withTiming(1, { duration: 200 }) }],
      backgroundColor: isProductsPressed ? withTiming('#e8eef8', { duration: 100 }) : withTiming('#f0f4f9', { duration: 200 }),
    };
  });

  // Handle view all categories
  const handleViewAllCategories = () => {
    // Since there's no dedicated categories route, we'll use the products route
    // with a special parameter that can be handled to show all categories
    router.push({
      pathname: "/products",
      params: { view: "categories" }
    });
  };

  // Handle view all products
  const handleViewAllProducts = () => {
    router.push({
      pathname: "/products"
    });
  };

  const productParams = useMemo(() => ({
    page: 1,
    limit: PAGE_SIZE,
  }), []);

  const { data, isError, isLoading, refetch } = useProducts(productParams);
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  // Handle retry on error
  const handleRetry = () => {
    refetch();
  };

  const renderItem: ListRenderItem<Product> = useCallback(({ item, index }) => {
    // Animation delay based on index for staggered entrance
    const delay = index * 100;
    
    return (
      <Animated.View 
        entering={SlideInRight.duration(400).delay(delay)}
        layout={Layout.springify()}
      >
        <ProductCard item={item} onPress={() => router.push(`/${item.id}`)} />
      </Animated.View>
    );
  }, []);
  
  const renderCategoryItem = ({ item, index }: { item: Category, index: number }) => {
    const delay = index * 100;
    
    return (
      <Animated.View
        entering={FadeIn.duration(400).delay(delay)}
        style={styles.categoryCardContainer}
      >
        <CategoryCard
          width={SCREEN_WIDTH / 2.2}
          item={{ category: item }}
          onPress={() => router.push({
            pathname: '/category/[id]',
            params: { id: item.id.toString(), name: item.name },
          })}
        />
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <FlatList
        data={data ? data.docs : []}
        style={styles.list}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: 24 }} />}
        contentContainerStyle={[
          styles.listContent,
          { paddingTop: paddingTop + 8 }
        ]}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Animated.View style={animatedStyle}>
            <SearchBar
              placeholder="Search products"
              onSearch={handleSearch}
              initialValue={""}
            />
            
            <View style={styles.sectionHeader}>
              <ThemedText style={styles.searchHeading} type='heading'>Categories</ThemedText>
              <Animated.View style={categoryButtonStyle}>
                <Pressable 
                  style={styles.viewAllButton} 
                  onPressIn={() => setIsCategoriesPressed(true)}
                  onPressOut={() => setIsCategoriesPressed(false)}
                  onPress={handleViewAllCategories}
                  android_ripple={{ color: '#dce4f0', borderless: false }}
                >
                  <ThemedText type='title' style={styles.viewAllText}>View all</ThemedText>
                  <Ionicons name="chevron-forward" size={16} color="#4a6eb5" />
                </Pressable>
              </Animated.View>
            </View>
            
            {categoriesLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#4a6eb5" />
              </View>
            ) : (
              <FlatList
                data={categories}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                renderItem={renderCategoryItem}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesContainer}
                ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
              />
            )}
            
            <View style={styles.sectionHeader}>
              <ThemedText style={styles.searchHeading} type='heading'>Products</ThemedText>
              <Animated.View style={productsButtonStyle}>
                <Pressable 
                  style={styles.viewAllButton} 
                  onPressIn={() => setIsProductsPressed(true)}
                  onPressOut={() => setIsProductsPressed(false)}
                  onPress={handleViewAllProducts}
                  android_ripple={{ color: '#dce4f0', borderless: false }}
                >
                  <ThemedText type='title' style={styles.viewAllText}>View all</ThemedText>
                  <Ionicons name="chevron-forward" size={16} color="#4a6eb5" />
                </Pressable>
              </Animated.View>
            </View>
          </Animated.View>
        }
        ListFooterComponent={<Footer />}
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.emptyStateContainer}>
              <ActivityIndicator size="large" color="#4a6eb5" />
            </View>
          ) : (
            <Animated.View 
              entering={FadeIn.duration(600)}
              style={styles.emptyStateContainer}
            >
              <Ionicons name="search-outline" size={80} color="#dce4f0" />
              <ThemedText style={styles.emptyTitle}>No products found</ThemedText>
              <ThemedText style={styles.emptyText}>
                Try searching for something else or browse our categories
              </ThemedText>
              <TouchableOpacity 
                style={styles.exploreButton}
                onPress={() => router.push('/')}
                activeOpacity={0.8}
              >
                <Ionicons name="compass-outline" size={20} color="#fff" />
                <ThemedText style={styles.exploreButtonText}>EXPLORE</ThemedText>
              </TouchableOpacity>
            </Animated.View>
          )
        }
      />

      {/* Error state */}
      {isError && (
        <Animated.View 
          entering={FadeIn.duration(400)} 
          exiting={FadeOut.duration(300)}
          style={styles.errorContainer}
        >
          <Ionicons name="alert-circle-outline" size={24} color="#e74c3c" />
          <ThemedText style={styles.errorText}>Failed to load products</ThemedText>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={handleRetry}
            activeOpacity={0.7}
          >
            <Ionicons name="refresh-outline" size={16} color="#fff" />
            <ThemedText style={styles.retryText}>Retry</ThemedText>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    position: 'relative',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 90,
    minHeight: '100%',
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginHorizontal: 0,
    paddingHorizontal: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  searchHeading: {
    textTransform: "uppercase",
    color: '#333',
    fontWeight: '700',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewAllText: {
    color: '#4a6eb5',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
  categoriesContainer: {
    paddingRight: 16,
    paddingBottom: 8,
  },
  categoryCardContainer: {
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  errorContainer: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 16,
    backgroundColor: '#fdf1f0',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  errorText: {
    color: '#e74c3c',
    fontWeight: '500',
    flex: 1,
    marginLeft: 10,
  },
  retryButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 6,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
    fontSize: 16,
    lineHeight: 22,
    maxWidth: SCREEN_WIDTH * 0.7,
  },
  exploreButton: {
    backgroundColor: '#4a6eb5',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4a6eb5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
});