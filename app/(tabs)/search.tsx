import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, ListRenderItem, StyleSheet, View } from 'react-native';
import SearchBar from '@/components/ui/SearchBar';
import { ThemedText } from '@/components/ThemedText';
import ProductCard from '@/components/ui/ecommerce/ProductCard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Footer from '@/components/ui/Footer';
import { router } from 'expo-router';
import { useProducts } from '@/lib/api/hooks/useProducts';
import {Product} from "../../lib/api/services/types"
const PAGE_SIZE = 10;

export default function SearchScreenPage() {
  const {top: paddingTop} = useSafeAreaInsets();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Apply debounce to search query
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setPage(1); // Reset to first page when searching
    }, 500);
    
    return () => clearTimeout(timerId);
  }, [searchQuery]);

  // Construct the 'where' query for search functionality
  const searchFilter = debouncedQuery 
    ? {
        or: [
          { name: { contains: debouncedQuery } },
          { description: { contains: debouncedQuery } }
        ]
      }
    : undefined;
  
  const productParams = useMemo(() => ({
    page,
    limit: PAGE_SIZE,
    where: searchFilter,
  }), [page, searchFilter]);
  
    // Use our products hook
  const { data, isLoading, isError, refetch } = useProducts(productParams);

  // Handle retry on error
  const handleRetry = () => {
    refetch();
  };

  const renderItem: ListRenderItem<Product> = useCallback(({item, index}) => {
    return(
      <ProductCard item={item} onPress={() => router.push(`/${item.id}`)}/>
    )
  }, [])

  return (
    <FlatList
      data={data}
      style={{backgroundColor: "#FFF"}}
      renderItem={renderItem}
      ItemSeparatorComponent={() => <View style={{height: 50}} />}
      contentContainerStyle={{paddingBottom: 90, paddingTop}}
      numColumns={2}
      ListHeaderComponent={<View>
        <SearchBar
        placeholder="Search"
        onSearch={() => { }}
        initialValue={""}
      />
         <ThemedText type='heading'>{"EXPLORE"}</ThemedText>
      </View>}
      ListFooterComponent={<Footer />}
    />
  );
}

const styles = StyleSheet.create({

})