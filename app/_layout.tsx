import { Tabs } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}
      tabBar={({ navigation, state, descriptors }) => (
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
            <Ionicons name="heart-outline" size={24} color={Colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabItem}>
            <Ionicons name="person-outline" size={24} color={Colors.primary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.tabItem}>
            <Ionicons name="bag-outline" size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      )}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="categories" />
      <Tabs.Screen name="product/[id]" options={{ href: null }} />
      <Tabs.Screen name="search" options={{ href: null }} />
    </Tabs>
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
