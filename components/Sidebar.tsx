import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { useRouter, usePathname } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { isTablet, isLandscape, getResponsiveSpacing, getSafeAreaPadding } from '@/utils/responsive';

const { width: screenWidth } = Dimensions.get('window');

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  slideAnim: SharedValue<number>;
}

interface NavItem {
  name: string;
  title: string;
  icon: string;
  iconFilled: string;
  requiresAuth?: boolean;
}

const navItems: NavItem[] = [
  {
    name: 'homepage',
    title: 'nav.home',
    icon: 'house',
    iconFilled: 'house.fill',
    requiresAuth: false,
  },
  {
    name: 'index',
    title: 'Dashboard',
    icon: 'chart.bar',
    iconFilled: 'chart.bar.fill',
    requiresAuth: true,
  },
  {
    name: 'explore',
    title: 'nav.explore',
    icon: 'magnifyingglass.circle',
    iconFilled: 'magnifyingglass.circle.fill',
    requiresAuth: false,
  },
  {
    name: 'applications',
    title: 'nav.applications',
    icon: 'doc.text',
    iconFilled: 'doc.text.fill',
    requiresAuth: true,
  },
  {
    name: 'notifications',
    title: 'nav.notifications',
    icon: 'bell',
    iconFilled: 'bell.fill',
    requiresAuth: true,
  },
  {
    name: 'profile',
    title: 'nav.profile',
    icon: 'person.circle',
    iconFilled: 'person.circle.fill',
    requiresAuth: true,
  },
];

export default function Sidebar({ isOpen, onClose, slideAnim }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const colorScheme = useColorScheme();
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();

  const handleNavigation = (routeName: string) => {
    if (routeName === 'index') {
      router.push('/(tabs)/' as any);
    } else {
      router.push(`/(tabs)/${routeName}` as any);
    }
    onClose();
  };

  const sidebarWidth = screenWidth * 0.8;

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: slideAnim.value === 1 ? 0 : -sidebarWidth,
        },
      ],
    };
  });

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
      )}
      
      {/* Sidebar */}
      <Animated.View
        style={[
          styles.sidebar,
          {
            backgroundColor: Colors[colorScheme ?? 'light'].background,
            borderRightColor: Colors[colorScheme ?? 'light'].border,
          },
          animatedStyle,
        ]}
      >
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: Colors[colorScheme ?? 'light'].border }]}>
          <Text style={[styles.headerTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            WorkConnect
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <IconSymbol name={"chevron.right" as any} size={24} color={Colors[colorScheme ?? 'light'].text} />
          </TouchableOpacity>
        </View>

        {/* Navigation Items */}
        <View style={styles.navContainer}>
          {navItems
            .filter(item => !item.requiresAuth || isAuthenticated)
            .map((item) => {
            const isActive = pathname.includes(item.name);
            const displayTitle = item.title && typeof item.title === 'string' && item.title.startsWith('nav.') ? t(item.title) : item.title;
            
            return (
              <TouchableOpacity
                key={item.name}
                style={[
                  styles.navItem,
                  {
                    backgroundColor: isActive 
                      ? Colors[colorScheme ?? 'light'].tint + '20' 
                      : 'transparent',
                    borderLeftColor: isActive 
                      ? Colors[colorScheme ?? 'light'].tint 
                      : 'transparent',
                  },
                ]}
                onPress={() => handleNavigation(item.name)}
                activeOpacity={0.7}
              >
                <View style={styles.navItemContent}>
                  <IconSymbol
                    name={(isActive ? item.iconFilled : item.icon) as any}
                    size={24}
                    color={isActive ? Colors[colorScheme ?? 'light'].tint : Colors[colorScheme ?? 'light'].text}
                  />
                  <Text
                    style={[
                      styles.navItemText,
                      {
                        color: isActive 
                          ? Colors[colorScheme ?? 'light'].tint 
                          : Colors[colorScheme ?? 'light'].text,
                        fontWeight: isActive ? '600' : '500',
                      },
                    ]}
                  >
                    {displayTitle}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Footer */}
        <View style={[styles.footer, { borderTopColor: Colors[colorScheme ?? 'light'].border }]}>
          <Text style={[styles.footerText, { color: Colors[colorScheme ?? 'light'].textSecondary }]}>
            WorkConnect v1.0
          </Text>
        </View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 998,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: '80%',
    borderRightWidth: 1,
    zIndex: 999,
    shadowColor: '#000',
    shadowOffset: {
      width: 4,
      height: 0,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 2,
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 4 : 4,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
  },
  navContainer: {
    flex: 1,
    paddingTop: 10,
  },
  navItem: {
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 12,
    borderLeftWidth: 4,
  },
  navItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  navItemText: {
    fontSize: 16,
    marginLeft: 16,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
  },
});
