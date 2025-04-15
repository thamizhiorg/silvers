import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Text } from 'react-native';
import { useAuth } from '../../context/AuthContext';

type CodeStepProps = {
  email: string;
  onBack: () => void;
};

export function CodeStep({ email, onBack }: CodeStepProps) {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(60); // 60 seconds countdown for resend
  const { signInWithMagicCode, sendMagicCode } = useAuth();

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSubmit = async () => {
    if (!code) {
      setError('Please enter the verification code');
      return;
    }

    // Validate code format - should be 6 digits
    if (!/^\d{6}$/.test(code.trim())) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Add a small delay before submitting to ensure UI feedback
      await new Promise(resolve => setTimeout(resolve, 300));

      await signInWithMagicCode(email, code);
      // No need to navigate here, the AuthContext will handle that
    } catch (err: any) {
      console.error('Sign in error:', err);
      if (err.message && err.message.includes('Record not found: app-user-magic-code')) {
        setError('Invalid or expired verification code. Please request a new code.');
      } else {
        setError(err.message || 'Invalid verification code');
      }
      setCode('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>VERIFICATION CODE</Text>
        <Text style={styles.subtitle}>We sent a code to</Text>
        <Text style={styles.emailText}>{email}</Text>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Enter code"
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        autoCapitalize="none"
        autoFocus={true}
        maxLength={6}
      />

      <Text style={styles.helperText}>
        Please enter the 6-digit code sent to your email. If you don't see it, check your spam folder.
      </Text>

      {isLoading ? (
        <View style={styles.button}>
          <ActivityIndicator color="white" />
        </View>
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>
      )}

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>Back to Email</Text>
        </TouchableOpacity>

        {countdown === 0 ? (
          <TouchableOpacity
            style={[styles.resendButton, isResending && styles.disabledButton]}
            onPress={async () => {
              if (!isResending) {
                setIsResending(true);
                setError(null);
                try {
                  await sendMagicCode(email);
                  setCountdown(60); // Reset countdown
                } catch (err: any) {
                  setError('Failed to resend code. Please try again.');
                } finally {
                  setIsResending(false);
                }
              }
            }}
            disabled={isResending}
          >
            <Text style={styles.resendButtonText}>
              {isResending ? 'Sending...' : 'Resend Code'}
            </Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.countdownText}>Resend in {countdown}s</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 16,
    maxWidth: 350,
    alignSelf: 'center',
  },
  headerContainer: {
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#000000',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
    color: '#555555',
    paddingHorizontal: 10,
  },
  emailText: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    color: '#555555',
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    textAlign: 'center',
    letterSpacing: 2,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  resendButton: {
    padding: 8,
  },
  resendButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  disabledButton: {
    opacity: 0.5,
  },
  countdownText: {
    fontSize: 16,
    color: '#888888',
    padding: 8,
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
  },
  helperText: {
    fontSize: 14,
    color: '#555555',
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 10,
  },
});
