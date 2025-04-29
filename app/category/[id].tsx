import { FlatList, ListRenderItem, StyleSheet, Text, View } from 'react-native'
import React, { useCallback } from 'react'
import { useCateogryProductsCount, useProductsByCategory } from '@/lib/api/hooks/useProducts'
import { router, useLocalSearchParams } from 'expo-router'
import { Product } from '@/lib/api/services/types'
import ProductCard from '@/components/ui/ecommerce/ProductCard'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ThemedText } from '@/components/ThemedText'
import Footer from '@/components/ui/Footer'
import Header from '@/components/ui/Header'
import SortAndFilter from '@/components/SortAndFilter'
import SearchBar from '@/components/ui/SearchBar'

const CategoryProducts = () => {
  const { id, name } = useLocalSearchParams();
  const { top: paddingTop } = useSafeAreaInsets();
  const { count } = useCateogryProductsCount(id as string)
  const { data, isLoading, isError } = useProductsByCategory(parseInt(id as string));
  const renderItem: ListRenderItem<Product> = useCallback(({ item, index }) => {
    return (
      <View >
        <ProductCard item={item} onPress={() => router.push(`/${item.id}`)} />
      </View>
    )
  }, [])
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        style={{ backgroundColor: "#FFF" }}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: 50 }} />}
        contentContainerStyle={[
          styles.listContent,
          { paddingTop }
        ]}
        numColumns={2}
        ListHeaderComponent={
          <View>
            <Header onPress={() => router.back()} />
            {count > 10 && <SearchBar
              placeholder="Search products"
              onSearch={() => {}}
              initialValue={""}
            />}
            <ThemedText style={styles.searchHeading} type='heading'>{name}</ThemedText>
            {count > 10 && <SortAndFilter
              onSortChange={(sort) => console.log('Sort:', sort)}
              onFilterChange={(range) => console.log('Range:', range)}
              filterRange={[0, 5000]}
              initialSort="price_asc"
              initialRange={[100, 1000]}
            />}
          </View>
        }
        ListFooterComponent={<Footer />}
      />
    </View>
  )
}

export default CategoryProducts

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    position: 'relative',
  },
  listContent: {
    paddingBottom: 90,
    minHeight: '100%', // Ensure empty state fills the screen
  },
  searchHeading: {
    textTransform: "uppercase",
    marginBottom: 16,
  },
})