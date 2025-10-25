import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { Colors } from '@/constants/theme';
import { appInit } from '@/services/appInitialization';
import { safeNavigate } from '@/utils/navigation';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export default function ProtectedRoute({ children, requireAuth = true }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // Only navigate when not loading and app is ready
    if (!isLoading) {
      appInit.onInitialized(() => {
        // If authentication is required but user is not logged in
        if (requireAuth && !user) {
          console.log('ProtectedRoute: Redirecting to auth');
          safeNavigate('/auth');
          return;
        }

        // If user is logged in but trying to access auth pages
        if (!requireAuth && user) {
          console.log('ProtectedRoute: Redirecting to dashboard');
          safeNavigate('/(tabs)');
          return;
        }
      });
    }
  }, [isLoading, user, requireAuth]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  // If authentication is required but user is not logged in, show loading while navigating
  if (requireAuth && !user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  // If user is logged in but trying to access auth pages, show loading while navigating
  if (!requireAuth && user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
  },
});
