import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { PRODUCTS } from '../../constants/Products';
import Header from '../../components/Header';
import Button from '../../components/Button';

const { width } = Dimensions.get('window');

export default function ProductScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Find the product by id
  const product = PRODUCTS.find((p) => p.id === id);

  if (!product) {
    return (
      <View style={styles.container}>
        <Header showBackButton />
        <Text style={styles.notFoundText}>Product not found</Text>
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
        <Image source={product.image} style={styles.productImage} />

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
            <Button title="ADD TO CART" style={styles.addToCartButton} />
            <Text style={styles.priceText}>$ {product.price}</Text>
            <TouchableOpacity style={styles.favoriteButton}>
              <Ionicons name="heart-outline" size={24} color={Colors.primary} />
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
  productImage: {
    width: width,
    height: width,
    resizeMode: 'cover',
    backgroundColor: Colors.lightGray,
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
  },
  addToCartButton: {
    flex: 1,
    marginRight: 20,
  },
  priceText: {
    fontSize: 18,
    fontWeight: '500',
    marginRight: 20,
  },
  favoriteButton: {
    padding: 8,
  },
});
