import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Text } from 'react-native';
import { router } from 'expo-router';

export default function SignOutScreen() {
  const { signOut } = useAuth();

  // Handle sign-out as soon as this screen loads
  useEffect(() => {
    const performSignOut = async () => {
      try {
        // Sign out from InstantDB
        await signOut();
        // Navigate to login page
        router.replace('/login');
      } catch (error) {
        console.error('Error signing out:', error);
        // If there's an error, still try to navigate to login
        router.replace('/login');
      }
    };

    performSignOut();
  }, [signOut]);

  // Show a loading indicator while signing out
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={styles.text}>Signing out...</Text>
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
