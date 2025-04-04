import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Link } from 'expo-router';
import { Product } from '../types';
import Colors from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';

interface ProductCardProps {
  product: Product;
  style?: object;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 40) / 2; // 2 cards per row with some margin

export default function ProductCard({ product, style }: ProductCardProps) {
  const { toggleFavorite, isFavorite } = useAppContext();
  const isProductFavorite = isFavorite(product.id);

  // Handle both URI and require() image sources
  const imageSource = typeof product.image === 'object' && product.image.uri
    ? { uri: product.image.uri }
    : product.image;

  return (
    <View style={[styles.container, style]}>
      <Link href={`/product/${product.id}`} asChild>
        <TouchableOpacity style={styles.imageContainer}>
          <Image source={imageSource} style={styles.image} />
          <View style={styles.overlay}>
            <View style={styles.infoContainer}>
              <Text style={styles.name}>{product.name}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Link>
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={() => {
          toggleFavorite(product);
        }}
      >
        <Ionicons
          name={isProductFavorite ? "heart" : "heart-outline"}
          size={20}
          color={isProductFavorite ? Colors.primary : Colors.darkGray}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    height: cardWidth,
    marginBottom: 15,
    marginHorizontal: 5,
    position: 'relative',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 0,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: Colors.lightGray,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-end',
  },
  infoContainer: {
    padding: 10,
  },
  name: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});
