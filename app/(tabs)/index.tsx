import { Image, StyleSheet, Platform, Text, ScrollView, View } from 'react-native';
import CategoryCard from '@/components/ui/ecommerce/CategoryCard';
import GenericScrollView from '@/components/ui/GenericScrollView';
import CollectionCard from '@/components/ui/ecommerce/CollectionCard';
import FeaturedProduct from '@/components/ui/ecommerce/FeaturedProduct';
import Footer from '@/components/ui/Footer';

export default function HomeScreen() {
  return (
    <GenericScrollView>
      <CollectionCard title={"RIVERA\nMOOD"} />
      <FeaturedProduct price='Rs. 1,999.00' />
      
      <View style={{flexDirection: 'row', marginTop: 70}}>
        <CategoryCard title='TOPS' />
        <CategoryCard title='LINEN' />
      </View>
      <View style={{flexDirection: 'row', marginTop: 70}}>
        <CategoryCard title='TOPS' />
        <CategoryCard title='LINEN' />
      </View>
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
