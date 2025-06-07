import { Dimensions, StyleSheet, View, useWindowDimensions, NativeSyntheticEvent, NativeScrollEvent, SafeAreaView, Animated, Easing, Image } from 'react-native'
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
import CommonHeader from '@/components/ui/CommonHeader'
import { getFullImageUrl } from '@/utils/functions'

const ProductDetails = () => {
  const { id } = useLocalSearchParams();
  const { data, isLoading, isError, refetch } = useProduct(parseInt(id as string))
  const [isAddButtonVisible, setIsAddButtonVisible] = useState(false);
  const addButtonRef = useRef<View>(null);
  const { height: windowHeight } = useWindowDimensions();
  const [selectedVariant, setSelectedVariant] = useState('');
  const { addToCart } = useCart();
  const productImageRef = useRef<View>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Animation state
  const [flyAnim, setFlyAnim] = useState({
    visible: false,
    x: new Animated.Value(0),
    y: new Animated.Value(0),
    scale: new Animated.Value(1),
    opacity: new Animated.Value(1),
    imgW: 0,
    imgH: 0,
    imgUri: '',
  });

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

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!addButtonRef.current) return;

    addButtonRef.current.measureInWindow((x, y, width, height) => {
      const isVisible = y >= -60 && y + height <= (windowHeight + 60);
      setIsAddButtonVisible(isVisible);
    });
  };

  const handleAddToCart = () => {
    // setIsAdding(true);
    if (productImageRef.current && data?.images && data.images[0] && (data.images[0].image as any)?.filename) {
      const filename = (data.images[0].image as any).filename;
      const imgUrl = getFullImageUrl(filename);
      productImageRef.current.measureInWindow((imgX, imgY, imgW, imgH) => {
        setFlyAnim(f => ({
          ...f,
          visible: true,
          imgW,
          imgH,
          imgUri: imgUrl,
        }));
        flyAnim.x.setValue(imgX);
        flyAnim.y.setValue(imgY);
        flyAnim.scale.setValue(1);
        flyAnim.opacity.setValue(1);
        // Main fly-up animation (slower)
        Animated.parallel([
          Animated.timing(flyAnim.y, {
            toValue: imgY - 120, // fly up
            duration: 1200,
            useNativeDriver: false,
            easing: Easing.inOut(Easing.quad),
          }),
          Animated.timing(flyAnim.scale, {
            toValue: 0.7,
            duration: 1200,
            useNativeDriver: false,
            easing: Easing.inOut(Easing.quad),
          }),
          Animated.timing(flyAnim.opacity, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: false,
            easing: Easing.inOut(Easing.quad),
          }),
        ]).start(() => {
          // Success effect: scale up and fade out
          Animated.parallel([
            Animated.timing(flyAnim.scale, {
              toValue: 1.2,
              duration: 300,
              useNativeDriver: false,
              easing: Easing.out(Easing.quad),
            }),
            Animated.timing(flyAnim.opacity, {
              toValue: 0,
              duration: 300,
              useNativeDriver: false,
              easing: Easing.out(Easing.quad),
            }),
          ]).start(() => {
            setFlyAnim(f => ({ ...f, visible: false }));
          });
        });
      });
    }
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
      {/* Animated flying image */}
      {flyAnim.visible && (
        <Animated.Image
          source={{ uri: flyAnim.imgUri }}
          style={{
            position: 'absolute',
            left: flyAnim.x,
            top: flyAnim.y,
            width: flyAnim.imgW || 120,
            height: flyAnim.imgH || 120,
            borderRadius: 12,
            zIndex: 1000,
            transform: [{ scale: flyAnim.scale }],
            opacity: flyAnim.opacity,
          }}
        />
      )}
      <GenericScrollView onScroll={handleScroll} scrollEventThrottle={16}>
        <CommonHeader title='Products' showBack onBackPress={() =>router.back()}/>
        <View ref={productImageRef} collapsable={false}>
          <ProductImageCarousel images={data.images} showDots width={Dimensions.get("window").width} />
        </View>
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
            <SizeGuide />
          </View>
          <View ref={addButtonRef}>
            <Button title='ADD TO CART' onPress={handleAddToCart} fullWidth loading={isAdding && !flyAnim.visible} />
          </View>
          <View style={{ marginVertical: 50 }}>
            <Accordion title='DESCRIPTION & FIT' >
              <ThemedText>Hello World</ThemedText>
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
