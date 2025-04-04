import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import { PRODUCTS } from "../constants/Products";
import ProductCard from "../components/ProductCard";
import Button from "../components/Button";

export default function HomeScreen() {
  // Filter products to show only a few for the "fine favorites" section
  const favoriteProducts = PRODUCTS.slice(0, 2);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with search icon */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>HOME</Text>
        <Link href="/search" asChild>
          <TouchableOpacity style={styles.searchButton}>
            <Ionicons name="search" size={24} color={Colors.primary} />
          </TouchableOpacity>
        </Link>
      </View>

      {/* Hero Banner */}
      <View style={styles.heroBanner}>
        <Text style={styles.collectionTitle}>SEA COLLECTION</Text>
        <Text style={styles.heroTitle}>casual you.</Text>
        <Text style={styles.heroTitle}>wild you.</Text>
        <Button title="SHOP NEW" style={styles.shopButton} />
      </View>

      {/* Fine Favorites Section */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>fine favorites</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>SEE ALL</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.productsGrid}>
          {favoriteProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </View>
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
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  searchButton: {
    padding: 8,
  },
  heroBanner: {
    height: 300,
    padding: 20,
    backgroundColor: "#E0E0E0", // Light gray background for the banner
    justifyContent: "flex-end",
  },
  collectionTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "600",
    lineHeight: 34,
  },
  shopButton: {
    alignSelf: "flex-start",
    marginTop: 20,
    width: 120,
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
  },
});
