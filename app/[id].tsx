import { Dimensions, StyleSheet, View, useWindowDimensions, NativeSyntheticEvent, NativeScrollEvent, SafeAreaView } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import ProductImageCarousel from '@/components/ui/ecommerce/ProductImageCarousel'
import GenericScrollView from '@/components/ui/GenericScrollView'
import { ThemedText } from '@/components/ThemedText'
import Button from '@/components/ui/Button'
import VariantSelector from '@/components/ui/ecommerce/VariantSelector'
import SizeGuide from '@/components/ui/ecommerce/SizeGuide'
import Footer from '@/components/ui/Footer'
import Accordion from '@/components/ui/Accordion'
import FloatingAddButton from '@/components/ui/ecommerce/FloatingAddButton'
import { router, useLocalSearchParams } from 'expo-router'
import * as Haptics from 'expo-haptics'
import { useProduct } from '@/lib/api/hooks/useProducts'
import { useCart } from '@/lib/api/hooks/useCart'
import RenderHTML from 'react-native-render-html'

const ProductDetails = () => {
  const { id } = useLocalSearchParams();
  const { data } = useProduct(parseInt(id as string))
  const [isAddButtonVisible, setIsAddButtonVisible] = useState(false);
  const addButtonRef = useRef<View>(null);
  const { height: windowHeight,width } = useWindowDimensions();
  const [selectedVariant, setSelectedVariant] = useState('');
  const { addToCart } = useCart();

  // Set the first available variant when data loads
  useEffect(() => {
    if (data?.variants) {
      const firstAvailableVariant = data.variants.find(variant => 
        !variant.inventory?.trackInventory || 
        (variant.inventory?.trackInventory && variant.inventory?.quantity && variant.inventory?.quantity > 0)
      );
      if (firstAvailableVariant?.title) {
        setSelectedVariant(firstAvailableVariant.title);
      }
    }
  }, [data]);

  const handleScroll = () => {
    if (!addButtonRef.current) return;

    addButtonRef.current.measureInWindow((_x, y, _width, height) => {
      const isVisible = y >= -60 && y + height <= (windowHeight + 60);
      setIsAddButtonVisible(isVisible);
    });
  };

  const handleAddToCart = () => {
    console.log("Adding to cart", selectedVariant)
    if (data) {
      addToCart({
        productId: data.id,
        variant: selectedVariant as string
      })

    }
    // Provide haptic feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Navigate to cart (optional)
    // router.push('/(tabs)/cart');
  };


  if (!data) return null;

  const hasComparePrice = data.compareAtPrice && data.compareAtPrice > data.price;
  return (
    <SafeAreaView style={styles.container}>
      <GenericScrollView onScroll={handleScroll} scrollEventThrottle={16}>
        <ProductImageCarousel images={data.images} showDots width={Dimensions.get("window").width} />
        <View style={styles.productDetailContainer}>
          <View>
            <ThemedText style={styles.productTitle}>{data.title}</ThemedText>
            <View style={styles.priceContainer}>
              {hasComparePrice && (
                <ThemedText numberOfLines={1} style={styles.comparePrice}>
                  Rs. {data.compareAtPrice?.toFixed(2)}
                </ThemedText>
              )}
              <ThemedText
                numberOfLines={1}
                type='title'
                style={hasComparePrice ? styles.salePrice : undefined}
              >
                Rs. {data.price.toFixed(2)}
              </ThemedText>
            </View>
            <ThemedText type='subtitle' style={styles.productTaxStatus}>Mrp inclusive of all taxes</ThemedText>
          </View>
          <View style={{ marginTop: 48, marginBottom: 30 }}>
            <VariantSelector variantTitle='SELECT SIZES' options={data.variants} selectedValue={selectedVariant as string | undefined} onSelect={setSelectedVariant} />
            <SizeGuide productId={data.id} />
          </View>
          <View ref={addButtonRef}>
            <Button title='ADD TO CART' onPress={handleAddToCart} fullWidth />
          </View>
          <View style={{ marginVertical: 50 }}>
            <Accordion title='DESCRIPTION & FIT' >
              <RenderHTML
                        contentWidth={width}
                        source={{ html: data.descriptionHtml || '' }}
                      />
            </Accordion>
            <Accordion title='DELIVERY & PAYMENT' >
              <ThemedText>Free delivery on orders above Rs. 999. Cash on delivery available.</ThemedText>
            </Accordion>
          </View>
        </View>
        <Footer />
      </GenericScrollView>
      <FloatingAddButton onPress={handleAddToCart} visible={!isAddButtonVisible} />
    </SafeAreaView>
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
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: "center"
  },
  comparePrice: {
    textDecorationLine: 'line-through',
    color: '#888',
    fontSize: 12,
  },
  salePrice: {
    color: '#EE3434',
    marginLeft: 10
  },
})
