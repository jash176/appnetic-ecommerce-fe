import { Image, StyleSheet, Platform, Text, ScrollView, View } from 'react-native';
import CategoryCard from '@/components/ui/ecommerce/CategoryCard';
import GenericScrollView from '@/components/ui/GenericScrollView';
import Accordion from '@/components/ui/Accordian';

export default function HomeScreen() {
  return (
    <GenericScrollView>
      <View style={{flexDirection: 'row'}}>
      <CategoryCard title='TOPS' />
      <CategoryCard title='LINEN' />
      </View>
      <Accordion title="Clothing">
        <Accordion.Item 
            label="T-shirts" 
            onPress={() => {}} 
          />
          <Accordion.Item 
            label="Jeans" 
            onPress={() => {}} 
          />
      </Accordion>
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
