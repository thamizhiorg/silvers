import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import Header from '../components/Header';
import { useAppContext } from '../context/AppContext';

export default function FavoritesScreen() {
  const router = useRouter();
  const { favorites, toggleFavorite } = useAppContext();

  const removeFromFavorites = (product) => {
    toggleFavorite(product);
  };

  const navigateToProduct = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  const renderFavoriteItem = ({ item }) => (
    <TouchableOpacity
      style={styles.favoriteItem}
      onPress={() => navigateToProduct(item.id)}
    >
      {/* Handle both URI and require() image sources */}
      <Image
        source={
          typeof item.image === 'object' && item.image.uri
            ? { uri: item.image.uri }
            : item.image
        }
        style={styles.productImage}
      />

      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        {item.category && <Text style={styles.productOption}>Category: {item.category}</Text>}
        {item.materials && <Text style={styles.productOption}>Material: {item.materials}</Text>}
        {item.designs && item.designs.length > 0 && (
          <Text style={styles.productOption}>Design: {item.designs[0].name}</Text>
        )}
        {item.sizes && item.sizes.length > 0 && (
          <Text style={styles.productOption}>Sizes: {item.sizes.join(', ')}</Text>
        )}
      </View>

      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeFromFavorites(item)}
      >
        <Ionicons name="heart" size={24} color={Colors.primary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header title="My Favorites" showBackButton />

      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={80} color={Colors.lightGray} />
          <Text style={styles.emptyText}>No favorites yet</Text>
          <TouchableOpacity
            style={styles.exploreButton}
            onPress={() => router.push('/')}
          >
            <Text style={styles.exploreButtonText}>EXPLORE PRODUCTS</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderFavoriteItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.favoritesList}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  favoritesList: {
    padding: 15,
  },
  favoriteItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 4,
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
    color: Colors.text,
  },
  productOption: {
    fontSize: 14,
    color: Colors.darkGray,
    marginBottom: 2,
  },
  removeButton: {
    padding: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: Colors.darkGray,
    marginTop: 20,
    marginBottom: 30,
  },
  exploreButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
  },
  exploreButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
