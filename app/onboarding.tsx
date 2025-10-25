import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

const onboardingData = [
  {
    id: 1,
    title: 'Find Verified Jobs Nearby',
    description: 'Discover real-time job opportunities in your area with verified employers and fair wages.',
    icon: '🔍',
    gradient: [Colors.light.primary, '#1a4d80'] as const,
  },
  {
    id: 2,
    title: 'Earn, Upskill, and Grow',
    description: 'Access micro-learning courses to enhance your skills and increase your earning potential.',
    icon: '📈',
    gradient: [Colors.light.secondary, '#b8941f'] as const,
  },
  {
    id: 3,
    title: 'Hire Trusted Workers in Minutes',
    description: 'Connect with verified, skilled workers for your projects with AI-powered matching.',
    icon: '🤝',
    gradient: [Colors.light.success, '#2ecc71'] as const,
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      scrollViewRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true,
      });
    } else {
      // Navigate to homepage
      router.replace('/(tabs)/homepage');
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      scrollViewRef.current?.scrollTo({
        x: prevIndex * width,
        animated: true,
      });
    }
  };

  const handleSkip = () => {
    router.replace('/(tabs)/homepage');
  };

  const renderOnboardingItem = (item: typeof onboardingData[0], index: number) => (
    <View key={item.id} style={styles.slide}>
      <LinearGradient colors={item.gradient} style={styles.gradientContainer}>
        <View style={styles.content}>
          <Animated.View style={[styles.iconContainer, { opacity: fadeAnim }]}>
            <Text style={styles.icon}>{item.icon}</Text>
          </Animated.View>

          <Animated.View style={[styles.textContainer, { opacity: fadeAnim }]}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </Animated.View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleNext}
              activeOpacity={0.8}
            >
              <Text style={styles.nextButtonText}>
                {index === onboardingData.length - 1 ? 'Get Started' : 'Next'}
              </Text>
            </TouchableOpacity>

            {index > 0 && (
              <TouchableOpacity
                style={styles.previousButton}
                onPress={handlePrevious}
                activeOpacity={0.8}
              >
                <Text style={styles.previousButtonText}>Previous</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.skipButton}
              onPress={handleSkip}
              activeOpacity={0.8}
            >
              <Text style={styles.skipButtonText}>Skip</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        style={styles.scrollView}
      >
        {onboardingData.map((item, index) => renderOnboardingItem(item, index))}
      </ScrollView>

      {/* Dots indicator */}
      <View style={styles.dotsContainer}>
        {onboardingData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor: index === currentIndex
                  ? Colors.light.background
                  : 'rgba(255, 255, 255, 0.5)',
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width,
    height,
  },
  gradientContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  iconContainer: {
    marginBottom: Spacing.xxl,
  },
  icon: {
    fontSize: 80,
    textAlign: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  title: {
    ...Typography.h1,
    color: Colors.light.background,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  description: {
    ...Typography.body,
    color: Colors.light.background,
    opacity: 0.9,
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: Colors.light.background,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.round,
    marginBottom: Spacing.md,
    shadowColor: Colors.light.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButtonText: {
    ...Typography.h4,
    color: Colors.light.primary,
    fontWeight: '600',
  },
  previousButton: {
    marginBottom: Spacing.sm,
  },
  previousButtonText: {
    ...Typography.body,
    color: Colors.light.background,
    opacity: 0.8,
  },
  skipButton: {
    marginTop: Spacing.sm,
  },
  skipButtonText: {
    ...Typography.caption,
    color: Colors.light.background,
    opacity: 0.7,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});
