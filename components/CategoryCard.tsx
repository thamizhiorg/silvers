import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Link } from 'expo-router';
import { Category } from '../types';
import Colors from '../constants/Colors';

interface CategoryCardProps {
  category: Category;
}

const { width } = Dimensions.get('window');

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/category/${category.id}`} asChild>
      <TouchableOpacity style={styles.container}>
        <View style={styles.imageContainer}>
          <Image source={category.image} style={styles.image} />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{category.name}</Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width - 40,
    height: 100,
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: Colors.background,
    overflow: 'hidden',
  },
  imageContainer: {
    width: 100,
    height: 100,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    textTransform: 'capitalize',
  },
});
