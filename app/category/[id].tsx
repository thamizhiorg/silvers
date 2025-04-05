import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import Colors from '../../constants/Colors';
import Header from '../../components/Header';
import { CATEGORIES } from '../../constants/Products';
import { Category } from '../../types';

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<Category | null>(null);

  useEffect(() => {
    // Find the category by id
    const foundCategory = CATEGORIES.find(cat => cat.id === id);
    
    if (foundCategory) {
      setCategory(foundCategory);
    }
    
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Category" showBackButton />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </View>
    );
  }

  if (!category) {
    return (
      <View style={styles.container}>
        <Header title="Category" showBackButton />
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Category not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title={category.name} showBackButton />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.upcomingContainer}>
          <Text style={styles.upcomingText}>UPCOMING</Text>
          <Text style={styles.descriptionText}>
            Our {category.name} collection is coming soon. Stay tuned for beautiful silver jewelry pieces.
          </Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContainer: {
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
  contentContainer: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  upcomingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    width: '100%',
  },
  upcomingText: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  descriptionText: {
    fontSize: 16,
    textAlign: 'center',
    color: Colors.darkGray,
    lineHeight: 24,
  },
});
