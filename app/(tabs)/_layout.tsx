import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";
import Colors from "../../constants/Colors";
import CustomTabBar from "../../components/CustomTabBar";
import { ProtectedRoute } from "../../components/auth/ProtectedRoute";

export default function TabsLayout() {
  return (
    <ProtectedRoute>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: styles.tabBar,
        }}
        tabBar={props => <CustomTabBar {...props} />}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="categories" />
        <Tabs.Screen name="favorites" />
        <Tabs.Screen name="profile" />
        <Tabs.Screen name="product/[id]" options={{ href: null }} />
        <Tabs.Screen name="category/[id]" options={{ href: null }} />
        <Tabs.Screen name="search" options={{ href: null }} />
        <Tabs.Screen name="cart" />
      </Tabs>
    </ProtectedRoute>
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
});
