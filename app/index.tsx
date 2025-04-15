import React, { useEffect } from "react";
import { StyleSheet, ActivityIndicator, View } from "react-native";
import { Text } from "react-native";
import { router } from "expo-router";
import { useAuth } from "../context/AuthContext";

export default function IndexScreen() {
  const { isLoading, user } = useAuth();

  // Simple redirect to login screen
  useEffect(() => {
    if (!user) {
      const timer = setTimeout(() => {
        router.replace('/login');
      }, 500);

      return () => clearTimeout(timer);
    } else {
      // If user is already authenticated, redirect to home
      const timer = setTimeout(() => {
        router.replace('/(tabs)');
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [user]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: '#555555',
  },
});
