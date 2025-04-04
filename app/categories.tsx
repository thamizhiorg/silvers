import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { CATEGORIES } from '../constants/Products';
import CategoryCard from '../components/CategoryCard';

export default function CategoriesScreen() {
  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.searchHeader}>
        <Text style={styles.searchText}>SEARCH</Text>
        <TouchableOpacity style={styles.searchIcon}>
          <Ionicons name="search" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Categories List */}
      <ScrollView style={styles.categoriesContainer} showsVerticalScrollIndicator={false}>
        {CATEGORIES.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  searchText: {
    fontSize: 16,
    fontWeight: '500',
  },
  searchIcon: {
    padding: 8,
  },
  categoriesContainer: {
    flex: 1,
    padding: 20,
  },
});
