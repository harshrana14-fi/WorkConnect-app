import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { isTablet, isLandscape, getResponsiveSpacing, getGridColumns, getCardWidth, getSafeAreaPadding } from '@/utils/responsive';

const settingsSections = [
  {
    title: 'Account',
    items: [
      {
        id: 'profile',
        title: 'Edit Profile',
        subtitle: 'Update your personal information',
        icon: '👤',
        type: 'navigation',
      },
      {
        id: 'verification',
        title: 'Verification Status',
        subtitle: 'ID verified • Skills verified',
        icon: '✅',
        type: 'info',
      },
      {
        id: 'wallet',
        title: 'Wallet Settings',
        subtitle: 'Manage your earnings and payments',
        icon: '💰',
        type: 'navigation',
      },
    ],
  },
  {
    title: 'Preferences',
    items: [
      {
        id: 'language',
        title: 'Language',
        subtitle: 'English',
        icon: '🌐',
        type: 'navigation',
        value: 'English',
      },
      {
        id: 'notifications',
        title: 'Push Notifications',
        subtitle: 'Job alerts, payments, updates',
        icon: '🔔',
        type: 'toggle',
        value: true,
      },
      {
        id: 'location',
        title: 'Location Services',
        subtitle: 'Find nearby jobs',
        icon: '📍',
        type: 'toggle',
        value: true,
      },
      {
        id: 'voice',
        title: 'Voice Commands',
        subtitle: 'Use voice for registration and navigation',
        icon: '🎤',
        type: 'toggle',
        value: false,
      },
    ],
  },
  {
    title: 'Privacy & Security',
    items: [
      {
        id: 'privacy',
        title: 'Privacy Settings',
        subtitle: 'Control your data sharing',
        icon: '🔒',
        type: 'navigation',
      },
      {
        id: 'security',
        title: 'Security',
        subtitle: 'Two-factor authentication, PIN',
        icon: '🛡️',
        type: 'navigation',
      },
      {
        id: 'data',
        title: 'Data & Storage',
        subtitle: 'Manage your app data',
        icon: '💾',
        type: 'navigation',
      },
    ],
  },
  {
    title: 'Support',
    items: [
      {
        id: 'help',
        title: 'Help Center',
        subtitle: 'FAQs, guides, tutorials',
        icon: '❓',
        type: 'navigation',
      },
      {
        id: 'contact',
        title: 'Contact Support',
        subtitle: 'Get help from our team',
        icon: '📞',
        type: 'navigation',
      },
      {
        id: 'feedback',
        title: 'Send Feedback',
        subtitle: 'Help us improve the app',
        icon: '💬',
        type: 'navigation',
      },
    ],
  },
  {
    title: 'About',
    items: [
      {
        id: 'version',
        title: 'App Version',
        subtitle: '1.0.0',
        icon: '📱',
        type: 'info',
      },
      {
        id: 'terms',
        title: 'Terms of Service',
        subtitle: 'Read our terms and conditions',
        icon: '📄',
        type: 'navigation',
      },
      {
        id: 'privacy_policy',
        title: 'Privacy Policy',
        subtitle: 'How we handle your data',
        icon: '🔐',
        type: 'navigation',
      },
    ],
  },
];

export default function SettingsScreen() {
  const [settings, setSettings] = useState({
    notifications: true,
    location: true,
    voice: false,
  });
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleToggle = (id: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [id]: value }));
    
    if (id === 'voice' && value) {
      Alert.alert(
        'Voice Commands',
        'Voice commands are now enabled! You can use voice for registration and navigation.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleNavigation = (id: string) => {
    switch (id) {
      case 'profile':
        router.push('/(tabs)/profile');
        break;
      case 'language':
        showLanguageSelector();
        break;
      case 'help':
        Alert.alert('Help Center', 'Help center will be available soon!');
        break;
      case 'contact':
        Alert.alert('Contact Support', 'Contact support feature will be available soon!');
        break;
      case 'feedback':
        Alert.alert('Send Feedback', 'Feedback feature will be available soon!');
        break;
      default:
        Alert.alert('Coming Soon', 'This feature will be available in a future update!');
    }
  };

  const showLanguageSelector = () => {
    Alert.alert(
      'Select Language',
      'Choose your preferred language',
      [
        { text: 'English', onPress: () => console.log('English selected') },
        { text: 'Hindi', onPress: () => console.log('Hindi selected') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => router.replace('/splash')
        },
      ]
    );
  };

  const renderSettingItem = (item: any) => (
    <TouchableOpacity
      key={item.id}
      style={styles.settingItem}
      onPress={() => item.type !== 'info' && handleNavigation(item.id)}
      disabled={item.type === 'info'}
    >
      <View style={styles.settingContent}>
        <View style={styles.settingLeft}>
          <Text style={styles.settingIcon}>{item.icon}</Text>
          <View style={styles.settingText}>
            <Text style={styles.settingTitle}>{item.title}</Text>
            <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
          </View>
        </View>
        
        <View style={styles.settingRight}>
          {item.type === 'toggle' ? (
            <Switch
              value={settings[item.id as keyof typeof settings]}
              onValueChange={(value) => handleToggle(item.id, value)}
              trackColor={{ false: Colors.light.border, true: Colors.light.primary }}
              thumbColor={Colors.light.background}
            />
          ) : item.type === 'navigation' ? (
            <Text style={styles.settingArrow}>›</Text>
          ) : item.value ? (
            <Text style={styles.settingValue}>{item.value}</Text>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderSection = (section: any) => (
    <View key={section.title} style={styles.section}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <View style={styles.sectionContent}>
        {section.items.map(renderSettingItem)}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.light.background, Colors.light.surface]}
        style={styles.background}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Settings</Text>
            <Text style={styles.headerSubtitle}>Customize your WorkConnect experience</Text>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {settingsSections.map(renderSection)}
            
            <View style={styles.logoutSection}>
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <LinearGradient
                  colors={[Colors.light.error, '#c0392b']}
                  style={styles.logoutButtonGradient}
                >
                  <Text style={styles.logoutButtonText}>Logout</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Animated.View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  headerTitle: {
    ...Typography.h1,
    color: Colors.light.text,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    ...Typography.body,
    color: Colors.light.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.h4,
    color: Colors.light.text,
    marginBottom: Spacing.md,
    paddingLeft: Spacing.sm,
  },
  sectionContent: {
    backgroundColor: Colors.light.background,
    borderRadius: BorderRadius.lg,
    shadowColor: Colors.light.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingItem: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  settingContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
    width: 32,
    textAlign: 'center',
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    ...Typography.body,
    color: Colors.light.text,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingSubtitle: {
    ...Typography.caption,
    color: Colors.light.textSecondary,
  },
  settingRight: {
    marginLeft: Spacing.md,
  },
  settingArrow: {
    ...Typography.h4,
    color: Colors.light.textSecondary,
  },
  settingValue: {
    ...Typography.caption,
    color: Colors.light.textSecondary,
    backgroundColor: Colors.light.surface,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  logoutSection: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  logoutButton: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    shadowColor: Colors.light.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutButtonGradient: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  logoutButtonText: {
    ...Typography.h4,
    color: Colors.light.background,
    fontWeight: '600',
  },
});
