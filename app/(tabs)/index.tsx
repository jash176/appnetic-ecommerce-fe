import { StyleSheet, View, FlatList } from 'react-native';
import CategoryCard from '@/components/ui/ecommerce/CategoryCard';
import GenericScrollView from '@/components/ui/GenericScrollView';
import CollectionCard from '@/components/ui/ecommerce/CollectionCard';
import FeaturedProduct from '@/components/ui/ecommerce/FeaturedProduct';
import Footer from '@/components/ui/Footer';
import { useHomeLayout } from '@/lib/api/hooks/useHomeLayout';
import { router } from 'expo-router';
import { Category, Product } from '@/lib/api/services/types';

export default function HomeScreen() {
  const { data, isLoading } = useHomeLayout();
  if (isLoading || !data) return null;
  return (
    <GenericScrollView>
      {data.featuredCollections?.map((item, index) => {
        return (
          <CollectionCard key={`collection_${item.id}`} item={item} />
        )
      })}
      {
        data.featuredProducts?.map((item, index) => {
          const product = item.product as Product;
          return (
            <FeaturedProduct key={`product_${item.id}`} item={item} onPress={() => router.push(`/${product.id}`)} />
          )
        })
      }
      <FlatList
        data={(data.categoryDisplay || []).slice(0, (data.categoryDisplay || []).length - ((data.categoryDisplay || []).length % 2))}
        keyExtractor={item => `category_${item.id}`}
        numColumns={2}
        scrollEnabled={false}
        contentContainerStyle={{ marginTop: 70 }}
        renderItem={({ item }) => {
          const category = item.category as Category;
          return (
            <CategoryCard item={item} onPress={() => router.push({
              pathname: '/category/[id]',
              params: { id: category.id, name: category.name },
            })} />
          )
        }}
        ItemSeparatorComponent={() => <View style={{ marginTop: 70 }} />}
      />
      <Footer />
    </GenericScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
