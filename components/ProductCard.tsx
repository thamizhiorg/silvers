import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
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
  return (
    <Link href={`/product/${product.id}`} asChild>
      <TouchableOpacity style={[styles.container, style]}>
        <Image source={product.image} style={styles.image} />
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>$ {product.price}</Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: cardWidth,
    resizeMode: 'cover',
    backgroundColor: Colors.lightGray,
  },
  infoContainer: {
    paddingTop: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.text,
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.text,
  },
});
