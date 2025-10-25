import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { isTablet, isLandscape, getResponsiveSpacing, getSafeAreaPadding } from '@/utils/responsive';

interface HeaderProps {
  title: string;
  onMenuPress: () => void;
}

export default function Header({ title, onMenuPress }: HeaderProps) {
  const colorScheme = useColorScheme();

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
          borderBottomColor: Colors[colorScheme ?? 'light'].border,
        },
      ]}
    >
      <StatusBar
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={Colors[colorScheme ?? 'light'].background}
      />
      
      <View style={styles.headerContent}>
        <TouchableOpacity
          style={[
            styles.menuButton,
            {
              backgroundColor: Colors[colorScheme ?? 'light'].background,
              borderColor: Colors[colorScheme ?? 'light'].border,
            },
          ]}
          onPress={onMenuPress}
          activeOpacity={0.7}
        >
          <IconSymbol
            name="chevron.left.forwardslash.chevron.right"
            size={20}
            color={Colors[colorScheme ?? 'light'].text}
          />
        </TouchableOpacity>
        
        <Text
          style={[
            styles.headerTitle,
            { color: Colors[colorScheme ?? 'light'].text },
          ]}
        >
          {title}
        </Text>
        
        <View style={styles.headerSpacer} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: StatusBar.currentHeight || 0,
    borderBottomWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: getResponsiveSpacing(Spacing.md, Spacing.lg, Spacing.xl),
    paddingVertical: getResponsiveSpacing(Spacing.sm, Spacing.md, Spacing.lg),
    minHeight: getResponsiveSpacing(56, 64, 72),
  },
  menuButton: {
    width: getResponsiveSpacing(40, 44, 48),
    height: getResponsiveSpacing(40, 44, 48),
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: getResponsiveSpacing(Spacing.sm, Spacing.md, Spacing.lg),
  },
  headerTitle: {
    ...Typography.h4,
    flex: 1,
    fontWeight: '600',
  },
  headerSpacer: {
    width: getResponsiveSpacing(40, 44, 48),
  },
});
