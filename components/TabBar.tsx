import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { useAppContext } from '../context/AppContext';

interface TabBarProps {
  navigation: any;
  state: any;
}

export default function TabBar({ navigation, state }: TabBarProps) {
  const { favorites, getCartItemCount } = useAppContext();
  const cartItemCount = getCartItemCount();

  return (
    <View style={styles.tabBar}>
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => navigation.navigate("index")}
      >
        <Ionicons
          name={state.index === 0 ? "home" : "home-outline"}
          size={24}
          color={Colors.primary}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => navigation.navigate("categories")}
      >
        <Ionicons
          name={state.index === 1 ? "grid" : "grid-outline"}
          size={24}
          color={Colors.primary}
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem}>
        <Ionicons
          name={favorites.length > 0 ? "heart" : "heart-outline"}
          size={24}
          color={Colors.primary}
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem}>
        <Ionicons name="person-outline" size={24} color={Colors.primary} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem}>
        <View>
          <Ionicons name="bag-outline" size={24} color={Colors.primary} />
          {cartItemCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartItemCount}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    height: 60,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    backgroundColor: Colors.background,
  },
  tabItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    position: 'absolute',
    right: -6,
    top: -3,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
