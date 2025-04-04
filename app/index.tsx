import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import { PRODUCTS } from "../constants/Products";
import ProductCard from "../components/ProductCard";
import Button from "../components/Button";
import CatalogueButton from "../components/CatalogueButton";
import { fontFamily } from "../utils/fonts";
import { getProducts } from "../utils/api";
import { Product } from "../types";

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const fetchedProducts = await getProducts();
        setProducts(fetchedProducts);
        setError(null);
      } catch (err) {
        console.error('Error loading products:', err);
        setError('Failed to load products. Please try again later.');
        // Fallback to mock products if API fails
        setProducts(PRODUCTS);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Filter products to show only a few for the "fine favorites" section
  const favoriteProducts = products.slice(0, 2);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with search icon */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>SKJ SILVERS</Text>
        <Link href="/search" asChild>
          <TouchableOpacity style={styles.searchButton}>
            <Ionicons name="search" size={24} color={Colors.primary} />
          </TouchableOpacity>
        </Link>
      </View>

      {/* Hero Banner */}
      <ImageBackground
        source={require('../assets/images/header2.png')}
        style={styles.heroBanner}
        resizeMode="cover"
      >
        <View style={styles.heroContent}>
          <Text style={styles.collectionTitle}>SILVER COLLECTIONS</Text>
          <Text style={styles.heroTitle}>perfectly</Text>
          <Text style={styles.heroTitle}>handcrafted for you.</Text>
          <CatalogueButton style={styles.shopButton} />
        </View>
      </ImageBackground>

      {/* Favourites Section */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>favourites</Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <View style={styles.productsGrid}>
            {favoriteProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </View>
        )}
      </View>

      {/* All Products Section */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>all products</Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <View style={styles.productsGrid}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    flex: 1,
    textAlign: "left",
    fontFamily: fontFamily.playfairBold,
    letterSpacing: 1,
  },
  searchButton: {
    padding: 8,
  },
  heroBanner: {
    height: 300,
    justifyContent: "flex-end",
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay to darken the image
  },
  heroContent: {
    padding: 20,
    width: '100%',
  },
  collectionTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    color: "white",
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "600",
    lineHeight: 34,
    color: "white",
  },
  shopButton: {
    alignSelf: "flex-start",
    marginTop: 20,
    width: 150,
  },
  sectionContainer: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "400",
  },
  seeAllText: {
    fontSize: 12,
    color: Colors.darkGray,
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: '100%',
    alignItems: 'flex-start', // Ensure items align at the top
    paddingHorizontal: 5, // Add some padding to account for card margins
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  errorText: {
    color: Colors.error,
    textAlign: 'center',
    fontSize: 16,
  },
});
