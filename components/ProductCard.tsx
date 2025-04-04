import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { Link } from 'expo-router';
import { Product } from '../types';
import Colors from '../constants/Colors';

interface ProductCardProps {
  product: Product;
  style?: object;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 40) / 2; // 2 cards per row with some margin

export default function ProductCard({ product, style }: ProductCardProps) {
  // Handle both URI and require() image sources
  const imageSource = typeof product.image === 'object' && product.image.uri
    ? { uri: product.image.uri }
    : product.image;

  return (
    <View style={[styles.container, style]}>
      <Link href={`/product/${product.id}`} asChild>
        <TouchableOpacity style={styles.cardContent}>
          <View style={styles.imageContainer}>
            <Image source={imageSource} style={styles.image} />
          </View>
          <Text style={styles.name}>{product.name}</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

// Platform-specific styles to ensure consistent layout across devices
const platformStyles = {
  container: Platform.select({
    ios: {
      width: cardWidth,
      flexBasis: '48%',
      maxWidth: '48%',
    },
    android: {
      width: cardWidth,
      flexBasis: '48%',
      maxWidth: '48%',
    },
    web: {
      width: cardWidth,
      flexBasis: '48%',
      maxWidth: '48%',
    }
  })
};

const styles = StyleSheet.create({
  container: {
    ...platformStyles.container,
    marginBottom: 20,
    marginHorizontal: 5,
    position: 'relative',
    minWidth: 140, // Minimum width to ensure readability
  },
  cardContent: {
    width: '100%',
    flexDirection: 'column',
  },
  imageContainer: {
    width: '100%',
    height: cardWidth,
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
  name: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    marginTop: 8,
    textAlign: 'left',
  },
});
