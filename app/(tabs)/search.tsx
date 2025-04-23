import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import SearchBar from '@/components/ui/SearchBar';
import { ThemedText } from '@/components/ThemedText';
import ProductCard from '@/components/ui/ecommerce/ProductCard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Footer from '@/components/ui/Footer';
import { router } from 'expo-router';

export default function SearchScreenPage() {
  const {top: paddingTop} = useSafeAreaInsets()

  return (
    <FlatList
      data={Array(6).map((_, i) => i)}
      style={{backgroundColor: "#FFF"}}
      renderItem={({}) => (
        <ProductCard onPress={() => router.push("/product-details")}/>
      )}
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