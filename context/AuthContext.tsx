import React, { createContext, useContext, ReactNode, useCallback, useState, useEffect } from 'react';
import { init, User } from '@instantdb/react-native';
import 'react-native-get-random-values';
import AsyncStorage from '@react-native-async-storage/async-storage';

// You'll need to get an APP_ID from InstantDB dashboard
// Visit https://www.instantdb.com/dash to get your APP_ID
const APP_ID = '84f087af-f6a5-4a5f-acbc-bc4008e3a725'; // Replace with your actual App ID

// Import schema and permissions
import schema from '../instant.schema';
import perms from '../instant.perms';

// Initialize InstantDB
const db = init({
  appId: APP_ID,
  storage: AsyncStorage,
  schema,
  perms,
  // Enable debug mode for development
  debug: true,
  // Set a longer timeout for network requests
  timeout: 15000, // 15 seconds
  // Add retry logic for network requests
  retries: 3,
  // Add a delay between retries (in ms)
  retryDelay: 1000,
});

type AuthContextType = {
  isLoading: boolean;
  user: User | null;
  error: any | null; // Using any for error type to accommodate InstantDB's error format
  sendMagicCode: (email: string) => Promise<void>;
  signInWithMagicCode: (email: string, code: string) => Promise<void>;
  signOut: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Use local state to track authentication status
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const { isLoading: dbLoading, user, error } = db.useAuth();

  // Combine loading states
  const isLoading = dbLoading || isSigningOut || isInitializing;

  // Ensure user and error are never undefined
  const safeUser = user || null;
  const safeError = error || null;

  // Check if the user is already authenticated when the app starts
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Wait a moment for InstantDB to initialize
        await new Promise(resolve => setTimeout(resolve, 1000));

        // If we have a user, log it
        if (safeUser) {
          console.log('User already authenticated:', safeUser.id);
        } else {
          console.log('No authenticated user found');
        }
      } catch (err) {
        console.error('Error checking auth status:', err);
      } finally {
        setIsInitializing(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Reset isSigningOut when user changes
  useEffect(() => {
    if (isSigningOut && !safeUser) {
      setIsSigningOut(false);
    }
  }, [safeUser, isSigningOut]);

  const sendMagicCode = async (email: string) => {
    try {
      // Normalize email to lowercase to ensure consistency
      const normalizedEmail = email.toLowerCase().trim();
      console.log('Sending magic code to:', normalizedEmail);
      await db.auth.sendMagicCode({ email: normalizedEmail });
      console.log('Magic code sent successfully');
    } catch (err) {
      console.error('Error sending magic code:', err);
      throw err;
    }
  };

  const signInWithMagicCode = async (email: string, code: string) => {
    // Normalize email to lowercase and trim code to ensure consistency
    const normalizedEmail = email.toLowerCase().trim();
    const normalizedCode = code.trim();

    try {
      console.log('Signing in with magic code for:', normalizedEmail);

      // Add a small delay before attempting to sign in
      // This can help with race conditions in the InstantDB backend
      await new Promise(resolve => setTimeout(resolve, 500));

      // Try to sign in with the magic code
      await db.auth.signInWithMagicCode({
        email: normalizedEmail,
        code: normalizedCode
      });

      console.log('Magic code sign-in successful');
    } catch (err) {
      console.error('Error signing in with magic code:', err);

      // If we get the specific error about the record not found,
      // we'll try one more time after a longer delay
      if (typeof err === 'object' && err !== null && 'message' in err &&
          typeof err.message === 'string' &&
          err.message.includes('Record not found: app-user-magic-code')) {
        try {
          console.log('Retrying sign in after delay...');
          // Wait a bit longer before retrying
          await new Promise(resolve => setTimeout(resolve, 2000));

          // Try again
          await db.auth.signInWithMagicCode({
            email: normalizedEmail,
            code: normalizedCode
          });

          console.log('Magic code sign-in successful on retry');
          return; // Success on retry
        } catch (retryErr) {
          console.error('Error on retry:', retryErr);
          throw retryErr; // If retry fails, throw the retry error
        }
      }

      throw err; // If it's not the specific error or retry failed, throw the original error
    }
  };

  // Simple sign-out function that follows InstantDB documentation
  const signOut = useCallback(async () => {
    try {
      // Set signing out state to true to prevent redirects during sign-out
      setIsSigningOut(true);
      // Call the InstantDB signOut method
      await db.auth.signOut();
      // Reset signing out state
      setIsSigningOut(false);
      return true;
    } catch (err) {
      console.error('Error signing out:', err);
      setIsSigningOut(false);
      throw err;
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        user: safeUser,
        error: safeError,
        sendMagicCode,
        signInWithMagicCode,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Export the db instance for use in other parts of the app
export { db };
