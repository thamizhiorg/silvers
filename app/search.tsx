import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import Header from '../components/Header';

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <View style={styles.container}>
      <Header showBackButton />
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="SEARCH"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoFocus
          placeholderTextColor={Colors.darkGray}
        />
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 60,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  searchButton: {
    padding: 8,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.lightGray,
    marginHorizontal: 20,
  },
});
