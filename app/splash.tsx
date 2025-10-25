import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { isTablet, isLandscape, getResponsiveSpacing, getResponsiveFontSize } from '@/utils/responsive';
import { safeNavigate } from '@/utils/navigation';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const { user, isLoading } = useAuth();
  const { t } = useLanguage();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Start animations with improved timing
    Animated.sequence([
      // First, fade in the logo
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      // Then slide in the text
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate based on authentication state
    const timer = setTimeout(() => {
      if (!isLoading) {
        if (user) {
          // User is already logged in, go to main app
          safeNavigate('/(tabs)', 2000);
        } else {
          // User is not logged in, go to onboarding
          safeNavigate('/onboarding', 2000);
        }
      }
    }, 4000); // Increased delay

    return () => clearTimeout(timer);
  }, [user, isLoading]);

  return (
    <LinearGradient
      colors={[Colors.light.primary, '#1a4d80', '#0f3460']}
      locations={[0, 0.6, 1]}
      style={styles.container}
    >
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.logo}>
            <Text style={styles.logoText}>WC</Text>
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.appName}>WorkConnect</Text>
          <Text style={styles.tagline}>
            {t('splash.tagline')}
          </Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.loadingContainer,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <View style={styles.loadingBar}>
            <Animated.View
              style={[
                styles.loadingProgress,
                {
                  transform: [
                    {
                      scaleX: scaleAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1],
                      }),
                    },
                  ],
                },
              ]}
            />
          </View>
          <Text style={styles.loadingText}>Loading...</Text>
        </Animated.View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: getResponsiveSpacing(Spacing.lg, Spacing.xl, Spacing.xxl),
    paddingVertical: getResponsiveSpacing(Spacing.xl, Spacing.xxl, Spacing.xxxl),
  },
  logoContainer: {
    marginBottom: Spacing.xxl,
  },
  logo: {
    width: getResponsiveSpacing(120, 140, 160),
    height: getResponsiveSpacing(120, 140, 160),
    borderRadius: getResponsiveSpacing(60, 70, 80),
    backgroundColor: Colors.light.background,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.light.shadow,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  logoText: {
    fontSize: getResponsiveFontSize(48, 56, 64),
    fontWeight: 'bold',
    color: Colors.light.primary,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  appName: {
    fontSize: getResponsiveFontSize(36, 42, 48),
    fontWeight: '700',
    color: Colors.light.background,
    marginBottom: getResponsiveSpacing(Spacing.sm, Spacing.md, Spacing.lg),
    textAlign: 'center',
    letterSpacing: 1,
  },
  tagline: {
    fontSize: getResponsiveFontSize(16, 18, 20),
    color: Colors.light.background,
    opacity: 0.9,
    textAlign: 'center',
    paddingHorizontal: getResponsiveSpacing(Spacing.lg, Spacing.xl, Spacing.xxl),
    lineHeight: getResponsiveFontSize(24, 28, 32),
    fontWeight: '400',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: getResponsiveSpacing(Spacing.xl, Spacing.xxl, Spacing.xxxl),
  },
  loadingBar: {
    height: getResponsiveSpacing(6, 8, 10),
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
    width: '100%',
    marginBottom: getResponsiveSpacing(Spacing.md, Spacing.lg, Spacing.xl),
  },
  loadingProgress: {
    height: '100%',
    backgroundColor: Colors.light.background,
    borderRadius: BorderRadius.sm,
    width: '100%',
  },
  loadingText: {
    fontSize: getResponsiveFontSize(14, 16, 18),
    color: Colors.light.background,
    opacity: 0.8,
    fontWeight: '500',
  },
});
