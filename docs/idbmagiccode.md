# InstantDB Authentication Documentation

This document provides comprehensive documentation for the InstantDB authentication implementation in this project, including the current code, setup instructions, and usage examples.

## Table of Contents

1. [Overview](#overview)
2. [Current Implementation](#current-implementation)
   - [Dependencies](#dependencies)
   - [Authentication Context](#authentication-context)
   - [Authentication Components](#authentication-components)
   - [Schema and Permissions](#schema-and-permissions)
3. [Authentication Flow](#authentication-flow)
4. [Implementation Guide](#implementation-guide)
   - [Step 1: Install Dependencies](#step-1-install-dependencies)
   - [Step 2: Configure InstantDB](#step-2-configure-instantdb)
   - [Step 3: Create Authentication Components](#step-3-create-authentication-components)
   - [Step 4: Protect Routes](#step-4-protect-routes)
   - [Step 5: Set Up Sign-In and Sign-Out](#step-5-set-up-sign-in-and-sign-out)
5. [Usage Examples](#usage-examples)
6. [Troubleshooting](#troubleshooting)
7. [Quick Reference](#quick-reference)

## Overview

This application uses InstantDB for authentication with a magic code (passwordless) authentication flow. InstantDB provides a simple, secure way to authenticate users without requiring password management.

The authentication system consists of:
- An authentication context provider that manages the auth state
- Components for email input and code verification
- A protected route wrapper for securing authenticated routes
- Sign-in and sign-out screens

## Current Implementation

### Dependencies

The current implementation uses the following dependencies:

```json
{
  "@instantdb/react-native": "^0.18.2",
  "react-native-get-random-values": "^1.11.0"
}
```

### Authentication Context

The authentication context (`context/AuthContext.tsx`) provides authentication state and methods to the entire application:

```typescript
import React, { createContext, useContext, ReactNode, useCallback, useState, useEffect } from 'react';
import { init, User } from '@instantdb/react-native';
// Navigation is handled by components
import 'react-native-get-random-values';

// You'll need to get an APP_ID from InstantDB dashboard
// Visit https://www.instantdb.com/dash to get your APP_ID
const APP_ID = '84f087af-f6a5-4a5f-acbc-bc4008e3a725'; // Replace with your actual App ID

// Initialize InstantDB
const db = init({ appId: APP_ID });

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
  const { isLoading: dbLoading, user, error } = db.useAuth();

  // Combine loading states
  const isLoading = dbLoading || isSigningOut;

  // Ensure user and error are never undefined
  const safeUser = user || null;
  const safeError = error || null;

  // Reset isSigningOut when user changes
  useEffect(() => {
    if (isSigningOut && !safeUser) {
      setIsSigningOut(false);
    }
  }, [safeUser, isSigningOut]);

  const sendMagicCode = async (email: string) => {
    try {
      await db.auth.sendMagicCode({ email });
    } catch (err) {
      console.error('Error sending magic code:', err);
      throw err;
    }
  };

  const signInWithMagicCode = async (email: string, code: string) => {
    try {
      await db.auth.signInWithMagicCode({ email, code });
    } catch (err) {
      console.error('Error signing in with magic code:', err);
      throw err;
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
```

### Authentication Components

#### Email Step Component (`components/auth/EmailStep.tsx`)

This component handles the first step of the authentication flow, where the user enters their email address:

```typescript
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useAuth } from '@/context/AuthContext';

type EmailStepProps = {
  onEmailSent: (email: string) => void;
};

export function EmailStep({ onEmailSent }: EmailStepProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { sendMagicCode } = useAuth();

  const handleSubmit = async () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await sendMagicCode(email);
      onEmailSent(email);
    } catch (err: any) {
      setError(err.message || 'Failed to send verification code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <ThemedText style={styles.title}>SIGN IN</ThemedText>
        <ThemedText style={styles.subtitle}>
          Enter your email to receive a verification code
        </ThemedText>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Email address"
        placeholderTextColor="#888"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        editable={!isLoading}
      />

      {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <ThemedText style={styles.buttonText}>Continue</ThemedText>
        )}
      </TouchableOpacity>
    </View>
  );
}

// Styles omitted for brevity
```

#### Code Step Component (`components/auth/CodeStep.tsx`)

This component handles the second step of the authentication flow, where the user enters the verification code:

```typescript
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useAuth } from '@/context/AuthContext';

type CodeStepProps = {
  email: string;
  onBack: () => void;
};

export function CodeStep({ email, onBack }: CodeStepProps) {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signInWithMagicCode } = useAuth();

  const handleSubmit = async () => {
    if (!code) {
      setError('Please enter the verification code');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await signInWithMagicCode(email, code);
      // No need to navigate here, the AuthContext will handle that
    } catch (err: any) {
      setError(err.message || 'Invalid verification code');
      setCode('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <ThemedText style={styles.title}>VERIFICATION CODE</ThemedText>
        <ThemedText style={styles.subtitle}>
          We sent a code to
        </ThemedText>
        <ThemedText style={styles.emailText}>
          {email}
        </ThemedText>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Enter code"
        placeholderTextColor="#888"
        keyboardType="number-pad"
        value={code}
        onChangeText={setCode}
        editable={!isLoading}
      />

      {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <ThemedText style={styles.buttonText}>Verify</ThemedText>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backButton}
        onPress={onBack}
        disabled={isLoading}
      >
        <ThemedText style={styles.backButtonText}>Back to Email</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

// Styles omitted for brevity
```

#### Protected Route Component (`components/auth/ProtectedRoute.tsx`)

This component protects routes that require authentication:

```typescript
import React, { ReactNode, useEffect, useRef } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { ThemedText } from '@/components/ThemedText';

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
        // Navigate to sign-in page
        router.replace('/');
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
        <ThemedText style={styles.text}>Loading...</ThemedText>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <ThemedText style={styles.errorText}>Error: {error.message}</ThemedText>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <ThemedText style={styles.text}>Please sign in to continue</ThemedText>
      </View>
    );
  }

  return <>{children}</>;
}

// Styles omitted for brevity
```

### Schema and Permissions

#### Schema Configuration (`instant.schema.ts`)

```typescript
// Docs: https://www.instantdb.com/docs/modeling-data

import { i } from "@instantdb/react-native";

const _schema = i.schema({
  entities: {
    $files: i.entity({
      path: i.string().unique().indexed(),
      url: i.any(),
    }),
    $users: i.entity({
      email: i.string().unique().indexed(),
    }),
    // Other entities omitted for brevity
  },
  links: {
    // Links between entities
    settings$users: {
      forward: {
        on: "settings",
        has: "one",
        label: "$users",
      },
      reverse: {
        on: "$users",
        has: "one",
        label: "settings",
      },
    },
    // Other links omitted for brevity
  },
  rooms: {},
});

export default _schema;
```

#### Permissions Configuration (`instant.perms.ts`)

```typescript
// Docs: https://www.instantdb.com/docs/permissions

import type { InstantRules } from "@instantdb/react-native";

const rules = {
  $files: {
    allow: {
      view: "true",
      create: "true",
      delete: "true",
    },
  },
  // Add other entity permissions as needed
} satisfies InstantRules;

export default rules;
```

## Authentication Flow

The authentication flow consists of two main steps:

1. **Email Step**: User enters their email address and requests a magic code
2. **Code Step**: User enters the magic code sent to their email to complete authentication

### Flow Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Email Step │     │  Code Step  │     │  Protected  │
│  Enter Email│────▶│ Enter Code  │────▶│   Content   │
└─────────────┘     └─────────────┘     └─────────────┘
```

### Sign-In Screen (`app/index.tsx`)

The sign-in screen orchestrates the authentication flow:

```typescript
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, ActivityIndicator, View, Image } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { EmailStep } from '@/components/auth/EmailStep';
import { CodeStep } from '@/components/auth/CodeStep';
import { useAuth } from '@/context/AuthContext';

export default function SignInScreen() {
  const [sentEmail, setSentEmail] = useState('');
  const { isLoading, user, error } = useAuth();

  // Redirect to workspace if user is already authenticated
  // Use a ref to track if we've already redirected to avoid loops
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (user && !hasRedirected.current) {
      // Add a small delay to ensure navigation container is fully initialized
      const timer = setTimeout(() => {
        hasRedirected.current = true;
        // Navigate to workspace if authenticated
        router.replace('/(tabs)/workspace');
      }, 100);

      return () => clearTimeout(timer);
    } else if (!user) {
      // Reset the flag when user is null
      hasRedirected.current = false;
    }
  }, [user]);

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <ThemedText style={styles.loadingText}>Loading...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={24} color="#FF3B30" style={styles.errorIcon} />
          <ThemedText style={styles.errorText}>Error: {error.message}</ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
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
    </ThemedView>
  );
}

// Styles omitted for brevity
```

### Sign-Out Screen (`app/sign-out.tsx`)

The sign-out screen handles user sign-out:

```typescript
import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { useAuth } from '@/context/AuthContext';

export default function SignOutScreen() {
  const { signOut } = useAuth();

  // Handle sign-out as soon as this screen loads
  useEffect(() => {
    const performSignOut = async () => {
      try {
        // Sign out from InstantDB
        await signOut();
        
        // Navigate to sign-in page
        router.replace('/');
      } catch (error) {
        console.error('Error signing out:', error);
        // If there's an error, still try to navigate to sign-in
        router.replace('/');
      }
    };

    performSignOut();
  }, [signOut]);

  // Show a loading indicator while signing out
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007AFF" />
      <ThemedText style={styles.text}>Signing out...</ThemedText>
    </View>
  );
}

// Styles omitted for brevity
```

## Implementation Guide

### Step 1: Install Dependencies

Using bun (recommended):

```bash
bun add @instantdb/react-native react-native-get-random-values
```

Or using npm:

```bash
npm install @instantdb/react-native react-native-get-random-values
```

### Step 2: Configure InstantDB

1. **Create an InstantDB Account**
   - Visit [instantdb.com/dash](https://www.instantdb.com/dash) to create an account
   - Create a new app and get your APP_ID

2. **Set Up Schema and Permissions**
   - Create `instant.schema.ts` to define your data model
   - Create `instant.perms.ts` to define access rules

3. **Create Authentication Context**
   - Create `context/AuthContext.tsx` to manage authentication state
   - Initialize InstantDB with your APP_ID
   - Implement authentication methods (sendMagicCode, signInWithMagicCode, signOut)

### Step 3: Create Authentication Components

1. **Email Step Component**
   - Create `components/auth/EmailStep.tsx` for email input
   - Implement email validation and magic code request

2. **Code Step Component**
   - Create `components/auth/CodeStep.tsx` for code verification
   - Implement code validation and authentication

3. **Protected Route Component**
   - Create `components/auth/ProtectedRoute.tsx` to protect authenticated routes
   - Implement redirect logic for unauthenticated users

### Step 4: Protect Routes

1. **Set Up Root Layout**
   - Wrap your app with `AuthProvider` in your root layout
   - Example: `app/_layout.tsx`

2. **Protect Tab Routes**
   - Wrap tab routes with `ProtectedRoute` component
   - Example: `app/(tabs)/_layout.tsx`

### Step 5: Set Up Sign-In and Sign-Out

1. **Create Sign-In Screen**
   - Create `app/index.tsx` as your sign-in screen
   - Implement the two-step authentication flow (email and code)

2. **Create Sign-Out Screen**
   - Create `app/sign-out.tsx` to handle sign-out
   - Implement sign-out logic and redirection

## Usage Examples

### 1. Setting up the AuthProvider

In your root layout (`app/_layout.tsx`):

```typescript
import { AuthProvider } from '@/context/AuthContext';

export default function RootLayout() {
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        {/* Other providers and components */}
      </AuthProvider>
    </ThemeProvider>
  );
}
```

### 2. Protecting Routes

Use the `ProtectedRoute` component to protect routes that require authentication:

```typescript
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function TabLayout() {
  return (
    <ProtectedRoute>
      <Tabs>
        {/* Tab screens */}
      </Tabs>
    </ProtectedRoute>
  );
}
```

### 3. Accessing User Data

Use the `useAuth` hook to access authentication state and methods:

```typescript
import { useAuth } from '@/context/AuthContext';

function MyComponent() {
  const { user, isLoading, error, signOut } = useAuth();

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  return (
    <View>
      <Text>Welcome, {user?.email}</Text>
      <Button title="Sign Out" onPress={signOut} />
    </View>
  );
}
```

### 4. Custom User Data

To store additional user data beyond the default fields:

```typescript
const updateUserProfile = async (userId: string, data: any) => {
  await db.transact([
    {
      type: 'update',
      entity: '$users',
      id: userId,
      values: data,
    },
  ]);
};
```

## Troubleshooting

### Common Issues

1. **Magic Code Not Received**
   - Check that the email address is correct
   - Check spam/junk folders
   - Verify that InstantDB is properly configured with the correct APP_ID

2. **Authentication Errors**
   - Ensure the magic code is entered correctly
   - Verify that the code hasn't expired (typically valid for 15 minutes)
   - Check network connectivity

3. **Redirect Loops**
   - Ensure that the authentication state is properly managed in the `useEffect` hooks
   - Use refs to track redirect state to prevent multiple redirects

### Debugging

To debug authentication issues:

1. Check the console logs for error messages
2. Verify that the InstantDB APP_ID is correct
3. Ensure that the necessary permissions are configured in `instant.perms.ts`
4. Check network connectivity to InstantDB services

## Quick Reference

### Authentication Methods

```typescript
// Send magic code to email
const { sendMagicCode } = useAuth();
await sendMagicCode(email);

// Authenticate with magic code
const { signInWithMagicCode } = useAuth();
await signInWithMagicCode(email, code);

// Sign out
const { signOut } = useAuth();
await signOut();
```

### Authentication State

```typescript
const { isLoading, user, error } = useAuth();
```

### Schema Configuration

```typescript
// instant.schema.ts
import { i } from "@instantdb/react-native";

const _schema = i.schema({
  entities: {
    $users: i.entity({
      email: i.string().unique().indexed(),
      // Add custom fields
    }),
    // Other entities
  },
  links: {
    // Define relationships
  },
});

export default _schema;
```

### Permissions Configuration

```typescript
// instant.perms.ts
import type { InstantRules } from "@instantdb/react-native";

const rules = {
  $users: {
    allow: {
      view: "auth != null && auth.id == this.id",
      update: "auth != null && auth.id == this.id",
    },
  },
  // Other entity permissions
} satisfies InstantRules;

export default rules;
```

### Resources

- [InstantDB Documentation](https://www.instantdb.com/docs)
- [InstantDB React Native SDK](https://www.instantdb.com/docs/react-native)
- [Magic Code Authentication Best Practices](https://www.instantdb.com/docs/auth)
