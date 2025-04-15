import React, { ReactNode, useEffect, useRef } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { Text } from 'react-native';

type ProtectedRouteProps = {
  children: ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoading, user, error } = useAuth();
  const hasRedirected = useRef(false);
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Skip the first render to avoid redirect loops during initialization
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Only redirect if not loading, no user, and we haven't already redirected
    // This handles cases where the user is not authenticated but tries to access protected routes
    if (!isLoading && !user && !hasRedirected.current) {
      // Add a small delay to ensure navigation container is fully initialized
      const timer = setTimeout(() => {
        hasRedirected.current = true;
        // Navigate to login page
        router.replace('/login');
      }, 100);

      return () => clearTimeout(timer);
    }

    // Reset the flag if the user is logged in
    if (user) {
      hasRedirected.current = false;
    }
  }, [isLoading, user]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error.message}</Text>
      </View>
    );
  }

  // If authenticated, render children
  if (user) {
    return <>{children}</>;
  }

  // This should not be visible as the useEffect will redirect
  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});
