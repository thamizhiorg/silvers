import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";
import Colors from "../constants/Colors";
import { useEffect, useState } from "react";
import { loadFonts } from "../utils/fonts";
import * as SplashScreen from 'expo-splash-screen';
import { AppProvider } from "../context/AppContext";
import CustomTabBar from "../components/CustomTabBar";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Load fonts
        await loadFonts();
        setFontsLoaded(true);
      } catch (e) {
        console.warn(e);
      } finally {
        // Hide splash screen
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  return (
    <AppProvider>
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
    </AppProvider>
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
