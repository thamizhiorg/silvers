import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator, FlatList, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { PRODUCTS } from '../../constants/Products';
import Header from '../../components/Header';
import Button from '../../components/Button';
import { getProducts } from '../../utils/api';
import { Product } from '../../types';
import { useAppContext } from '../../context/AppContext';

const { width } = Dimensions.get('window');

export default function ProductScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { addToCart, toggleFavorite, isFavorite: checkIsFavorite } = useAppContext();
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedDesign, setSelectedDesign] = useState<number>(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const products = await getProducts();
        const foundProduct = products.find((p) => p.id === id);

        if (foundProduct) {
          setProduct(foundProduct);
          setError(null);
          // Check if product is in favorites
          setIsFavorite(checkIsFavorite(foundProduct.id));
        } else {
          // Fallback to mock products if API product not found
          const mockProduct = PRODUCTS.find((p) => p.id === id);
          if (mockProduct) {
            setProduct(mockProduct);
            setError(null);
            // Check if product is in favorites
            setIsFavorite(checkIsFavorite(mockProduct.id));
          } else {
            setError('Product not found');
          }
        }
      } catch (err) {
        console.error('Error loading product:', err);
        setError('Failed to load product. Please try again later.');

        // Fallback to mock products if API fails
        const mockProduct = PRODUCTS.find((p) => p.id === id);
        if (mockProduct) {
          setProduct(mockProduct);
          // Check if product is in favorites
          setIsFavorite(checkIsFavorite(mockProduct.id));
        }
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, checkIsFavorite]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Header showBackButton />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.container}>
        <Header showBackButton />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'Product not found'}</Text>
        </View>
      </View>
    );
  }

  const incrementQuantity = () => setQuantity(quantity + 1);
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        showBackButton
        rightComponent={
          <TouchableOpacity>
            <Ionicons name="share-outline" size={24} color={Colors.primary} />
          </TouchableOpacity>
        }
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        {product.designs && product.designs.length > 0 ? (
          <Image
            source={{ uri: product.designs[selectedDesign]?.image || product.image.uri }}
            style={styles.productImage}
          />
        ) : (
          <Image source={product.image} style={styles.productImage} />
        )}

        {/* Design Selector */}
        {product.designs && product.designs.length > 1 && (
          <View style={styles.designContainer}>
            <Text style={styles.sectionTitle}>DESIGNS</Text>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={product.designs}
              keyExtractor={(item, index) => `design-${index}`}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={[
                    styles.designItem,
                    selectedDesign === index && styles.selectedDesignItem
                  ]}
                  onPress={() => setSelectedDesign(index)}
                >
                  <Image
                    source={{ uri: item.image }}
                    style={styles.designImage}
                  />
                  <Text style={styles.designName}>{item.name}</Text>
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.designList}
            />
          </View>
        )}

        {/* Product Info */}
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.name}</Text>

          {/* Ring Size Selector */}
          {product.sizes && product.sizes.length > 0 && (
            <View style={styles.sizeContainer}>
              <Text style={styles.sectionTitle}>RING SIZE</Text>
              <View style={styles.sizeOptions}>
                {product.sizes.map((size) => (
                  <TouchableOpacity
                    key={size}
                    style={[
                      styles.sizeOption,
                      selectedSize === size && styles.selectedSizeOption,
                    ]}
                    onPress={() => setSelectedSize(size)}
                  >
                    <Text style={styles.sizeText}>{size}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Quantity Selector */}
          <View style={styles.quantityContainer}>
            <Text style={styles.sectionTitle}>QUANTITY</Text>
            <View style={styles.quantitySelector}>
              <TouchableOpacity onPress={decrementQuantity} style={styles.quantityButton}>
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity onPress={incrementQuantity} style={styles.quantityButton}>
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Materials */}
          <View style={styles.materialsContainer}>
            <Text style={styles.sectionTitle}>MATERIALS</Text>
            <Text style={styles.materialsText}>{product.materials}</Text>
            {product.weight && (
              <Text style={styles.materialsText}>Weight: {product.weight}</Text>
            )}
          </View>

          {/* Description */}
          <View style={styles.descriptionContainer}>
            <TouchableOpacity style={styles.descriptionHeader}>
              <Text style={styles.sectionTitle}>DESCRIPTION & DETAILS</Text>
              <Ionicons name="chevron-down" size={20} color={Colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Add to Cart Button */}
          <View style={styles.addToCartContainer}>
            <Button
              title="ADD TO CART"
              style={styles.addToCartButton}
              onPress={() => {
                if (product.sizes && product.sizes.length > 0 && !selectedSize) {
                  Alert.alert('Please select a size');
                  return;
                }
                addToCart(product, quantity, selectedSize || undefined);
                Alert.alert('Success', 'Product added to cart!');
              }}
            />
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={() => {
                toggleFavorite(product);
                setIsFavorite(!isFavorite);
              }}
            >
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={24}
                color={isFavorite ? Colors.primary : Colors.darkGray}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  notFoundText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: Colors.error,
    textAlign: 'center',
  },
  productImage: {
    width: width,
    height: width,
    resizeMode: 'cover',
    backgroundColor: Colors.lightGray,
  },
  designContainer: {
    padding: 20,
    paddingBottom: 0,
  },
  designList: {
    paddingVertical: 10,
  },
  designItem: {
    marginRight: 15,
    alignItems: 'center',
    width: 80,
  },
  selectedDesignItem: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  designImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 5,
  },
  designName: {
    fontSize: 12,
    textAlign: 'center',
    color: Colors.darkGray,
  },
  productInfo: {
    padding: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: '400',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 10,
  },
  sizeContainer: {
    marginBottom: 20,
  },
  sizeOptions: {
    flexDirection: 'row',
  },
  sizeOption: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.lightGray,
    marginRight: 10,
  },
  selectedSizeOption: {
    borderColor: Colors.primary,
    backgroundColor: Colors.lightGray,
  },
  sizeText: {
    fontSize: 14,
  },
  quantityContainer: {
    marginBottom: 20,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  quantityButtonText: {
    fontSize: 16,
  },
  quantityText: {
    fontSize: 16,
    paddingHorizontal: 20,
  },
  materialsContainer: {
    marginBottom: 20,
  },
  materialsText: {
    fontSize: 14,
    color: Colors.darkGray,
  },
  descriptionContainer: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    paddingBottom: 20,
  },
  descriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addToCartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  addToCartButton: {
    flex: 1,
    marginRight: 20,
  },
  favoriteButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
