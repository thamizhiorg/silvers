import { Stack } from "expo-router";
import { StyleSheet } from "react-native";
import Colors from "../constants/Colors";
import { useEffect, useState } from "react";
import { loadFonts } from "../utils/fonts";
import * as SplashScreen from 'expo-splash-screen';
import { AppProvider } from "../context/AppContext";
import { AuthProvider } from "../context/AuthContext";
import 'react-native-get-random-values';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

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

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <AppProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="sign-out" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="product/[id]" />
          <Stack.Screen name="category/[id]" />
          <Stack.Screen name="search" />
          <Stack.Screen name="cart" />
          <Stack.Screen name="categories" />
          <Stack.Screen name="favorites" />
          <Stack.Screen name="profile" />
        </Stack>
      </AppProvider>
    </AuthProvider>
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
