import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, ActivityIndicator, View, Image } from 'react-native';
import { Text } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { EmailStep } from '../components/auth/EmailStep';
import { CodeStep } from '../components/auth/CodeStep';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const [sentEmail, setSentEmail] = useState('');
  const { isLoading, user, error } = useAuth();

  // Redirect to tabs if user is already authenticated
  // Use a ref to track if we've already redirected to avoid loops
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (user && !hasRedirected.current) {
      // Add a small delay to ensure navigation container is fully initialized
      const timer = setTimeout(() => {
        hasRedirected.current = true;
        // Navigate to tabs if authenticated
        router.replace('/(tabs)');
      }, 100);

      return () => clearTimeout(timer);
    } else if (!user) {
      // Reset the flag when user is null
      hasRedirected.current = false;
    }
  }, [user]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={24} color="#FF3B30" style={styles.errorIcon} />
        <Text style={styles.errorText}>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/images/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {!sentEmail ? (
          <EmailStep onEmailSent={setSentEmail} />
        ) : (
          <CodeStep email={sentEmail} onBack={() => setSentEmail('')} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    width: '100%',
  },
  contentContainer: {
    width: '100%',
    maxWidth: 350,
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: -20,
  },
  logo: {
    width: 70,
    height: 70,
  },
  loadingContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#555555',
  },
  errorContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 400,
    width: '100%',
    backgroundColor: '#FFFFFF',
  },
  errorIcon: {
    marginBottom: 10,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
});
