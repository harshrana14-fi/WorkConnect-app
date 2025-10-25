import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect } from 'react';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { setLayoutMounted } from '@/utils/navigation';

export const unstable_settings = {
  anchor: '(tabs)',
  initialRouteName: 'homepage',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Set layout as mounted after a short delay to ensure everything is ready
    const timer = setTimeout(() => {
      setLayoutMounted(true);
      console.log('Root Layout mounted and ready for navigation');
    }, 500); // Increased delay to ensure everything is properly mounted

    return () => clearTimeout(timer);
  }, []);

  return (
    <LanguageProvider>
      <AuthProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="splash" options={{ headerShown: false }} />
            <Stack.Screen name="onboarding" options={{ headerShown: false }} />
            <Stack.Screen name="auth" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="create-job" options={{ headerShown: false }} />
            <Stack.Screen name="job-applications" options={{ headerShown: false }} />
            <Stack.Screen name="my-job-posts" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
