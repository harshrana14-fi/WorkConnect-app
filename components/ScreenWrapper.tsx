import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';

import Header from './Header';
import Sidebar from './Sidebar';
import { useLanguage } from '@/contexts/LanguageContext';
import { isTablet, isLandscape, getResponsiveSpacing, getSafeAreaPadding } from '@/utils/responsive';

interface ScreenWrapperProps {
  children: React.ReactNode;
  title: string;
}

export default function ScreenWrapper({ children, title }: ScreenWrapperProps) {
  const { t } = useLanguage();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const slideAnim = useSharedValue(0);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    slideAnim.value = withTiming(isSidebarOpen ? 1 : 0, {
      duration: 300,
    });
  }, [isSidebarOpen, slideAnim]);

  const displayTitle = title && typeof title === 'string' && title.startsWith('nav.') ? t(title) : title;

  return (
    <View style={styles.container}>
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        slideAnim={slideAnim}
      />
      
      <Header
        title={displayTitle}
        onMenuPress={toggleSidebar}
      />
      
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
