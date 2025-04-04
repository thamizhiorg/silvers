import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';

interface TabBarProps {
  state: any;
  navigation: any;
}

export default function CustomTabBar({ state, navigation }: TabBarProps) {

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

      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => navigation.navigate("favorites")}
      >
        <Ionicons
          name={state.index === 2 ? "heart" : "heart-outline"}
          size={24}
          color={Colors.primary}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => navigation.navigate("profile")}
      >
        <Ionicons
          name={state.index === 3 ? "person" : "person-outline"}
          size={24}
          color={Colors.primary}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => navigation.navigate("cart")}
      >
        <View>
          <Ionicons
            name={state.index === 5 ? "cart" : "cart-outline"}
            size={24}
            color={Colors.primary}
          />
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

});
