import { Stack } from 'expo-router';
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function TabLayout() {
  const { t, isInitialized } = useLanguage();

  // Don't render until language context is initialized
  if (!isInitialized) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
        <Stack.Screen
          name="homepage"
          options={{
            title: t('nav.home'),
          }}
        />
        <Stack.Screen
          name="index"
          options={{
            title: 'Dashboard',
          }}
        />
        <Stack.Screen
          name="explore"
          options={{
            title: t('nav.explore'),
          }}
        />
        <Stack.Screen
          name="applications"
          options={{
            title: t('nav.applications'),
          }}
        />
        <Stack.Screen
          name="notifications"
          options={{
            title: t('nav.notifications'),
          }}
        />
        <Stack.Screen
          name="profile"
          options={{
            title: t('nav.profile'),
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            title: t('nav.settings'),
          }}
        />
      </Stack>
  );
}
