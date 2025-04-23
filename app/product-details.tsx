import { Dimensions, FlatList, StyleSheet, Text, View, useWindowDimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native'
import React, { useRef, useState } from 'react'
import ProductImageCarousel from '@/components/ui/ecommerce/ProductImageCarousel'
import GenericScrollView from '@/components/ui/GenericScrollView'
import { ThemedText } from '@/components/ThemedText'
import Button from '@/components/ui/ecommerce/Button'
import VariantSelector from '@/components/ui/ecommerce/VariantSelector'
import SizeGuide from '@/components/ui/ecommerce/SizeGuide'
import Footer from '@/components/ui/Footer'
import Accordion from '@/components/ui/Accordion'
import ProductCard from '@/components/ui/ecommerce/ProductCard'
import FloatingAddButton from '@/components/ui/ecommerce/FloatingAddButton'
import { useCartStore } from '@/store/cartStore'
import { router } from 'expo-router'
import * as Haptics from 'expo-haptics'

const variants = [
  { id: "1", label: "XSS", value: "XSS" },
  { id: "2", label: "XS", value: "XS" },
  { id: "3", label: "S", value: "S" },
  { id: "4", label: "M", value: "M" },
  { id: "5", label: "L", value: "L" },
  { id: "6", label: "XL", value: "Xl" },
  { id: "7", label: "XXL", value: "XXL" }
]

// Mock product data - in a real app, this would come from an API or route params
const productData = {
  id: "prod-1",
  title: "Tie-Belt Shirt Dress",
  price: 1999.00,
  image: "https://image.hm.com/content/dam/global_campaigns/season_01/women/startpage-assets/wk16/DS21G-2x3-women-startpage-wk16.jpg?imwidth=320",
  description: "A stylish shirt dress with a tie belt for a flattering silhouette."
}

const ProductDetails = () => {
  const [isAddButtonVisible, setIsAddButtonVisible] = useState(false);
  const addButtonRef = useRef<View>(null);
  const { height: windowHeight } = useWindowDimensions();
  const [selectedVariant, setSelectedVariant] = useState(variants[0].id);
  const { addItem } = useCartStore();

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!addButtonRef.current) return;

    addButtonRef.current.measureInWindow((x, y, width, height) => {
      const isVisible = y >= -60 && y + height <= (windowHeight + 60);
      setIsAddButtonVisible(isVisible);
    });
  };

  const handleAddToCart = () => {
    // Get the selected variant value
    const selectedVariantValue = variants.find(v => v.id === selectedVariant)?.value || '';
    
    // Add the product to cart
    addItem({
      id: `${productData.id}-${selectedVariantValue}`,
      title: productData.title,
      price: productData.price,
      image: productData.image,
      variant: selectedVariantValue
    });
    
    // Provide haptic feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // Navigate to cart (optional)
    // router.push('/(tabs)/cart');
  };

  return (
    <View style={styles.container}>
      <GenericScrollView onScroll={handleScroll} scrollEventThrottle={16}>
        <ProductImageCarousel showDots width={Dimensions.get("window").width} />
        <View style={styles.productDetailContainer}>
        <View>
          <ThemedText style={styles.productTitle}>{productData.title}</ThemedText>
          <ThemedText type='title'>Rs. {productData.price.toFixed(2)}</ThemedText>
          <ThemedText type='subtitle' style={styles.productTaxStatus}>Mrp inclusive of all taxes</ThemedText>
        </View>
        <View style={{marginTop: 48, marginBottom: 30}}>
          <VariantSelector variantTitle='SELECT SIZES' options={variants} selectedValue={selectedVariant} onSelect={setSelectedVariant} />
          <SizeGuide />
        </View>
        <View ref={addButtonRef}>
          <Button title='ADD TO CART' onPress={handleAddToCart} fullWidth />
        </View>
        <View style={{marginVertical: 50}}>
          <Accordion title='DESCRIPTION & FIT' >
            <ThemedText>{productData.description}</ThemedText>
          </Accordion>
          <Accordion title='DELIVERY & PAYMENT' >
            <ThemedText>Free delivery on orders above Rs. 999. Cash on delivery available.</ThemedText>
          </Accordion>
        </View>
        <View>
          <ThemedText type='title' style={{marginBottom: 20}}>Others Also Bought</ThemedText>
          <FlatList
            data={[1, 2, 3, 4, 5]}
            horizontal
            renderItem={({item}) => (
              <ProductCard width={Dimensions.get("window").width / 2.5} />
            )}
            showsHorizontalScrollIndicator={false}
          />
          </View>
        </View>
        <Footer />
      </GenericScrollView>
      <FloatingAddButton onPress={handleAddToCart} visible={!isAddButtonVisible} />
    </View>
  )
}

export default ProductDetails

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF"
  },
  productDetailContainer: {
    padding: 16
  },
  productTitle: {
    textTransform: "uppercase"
  },
  productTaxStatus: {
    textTransform: "uppercase"
  }
})