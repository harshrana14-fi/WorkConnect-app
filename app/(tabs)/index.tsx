import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  FlatList,
  RefreshControl,
  Alert,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import ScreenWrapper from '@/components/ScreenWrapper';
import { isTablet, isLandscape, getResponsiveSpacing, getGridColumns, getCardWidth, getSafeAreaPadding, getResponsiveFontSize } from '@/utils/responsive';
import { ActionIcons, QuickActionIcons, IconContainer } from '@/components/ui/ProfessionalIcons';

const { width } = Dimensions.get('window');

// Import employer dashboard
import EmployerDashboard from './employer-dashboard';

export default function HomeScreen() {
  const { user, isAuthenticated } = useAuth();
  const { t, isInitialized } = useLanguage();

  // Route to appropriate dashboard based on user role
  if (isAuthenticated && user) {
    if (user.role === 'employer') {
      return <EmployerDashboard />;
    }
    // If user.role === 'worker', continue with worker dashboard
  }

  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const handleActionPress = (action: string) => {
    switch (action) {
      case 'Find Jobs':
        router.push('/(tabs)/explore');
        break;
      case 'My Applications':
        router.push('/(tabs)/applications');
        break;
      case 'Wallet':
        Alert.alert('Wallet', 'Wallet feature coming soon!');
        break;
      case 'Learn':
        Alert.alert('Learning', 'Learning section coming soon!');
        break;
      case 'Badges':
        Alert.alert('Badges', 'Badges feature coming soon!');
        break;
      case 'Post Job':
        Alert.alert('Post Job', 'Job posting feature coming soon!');
        break;
      case 'Find Workers':
        router.push('/(tabs)/explore');
        break;
      case 'Analytics':
        Alert.alert('Analytics', 'Analytics feature coming soon!');
        break;
      case 'Payments':
        Alert.alert('Payments', 'Payment feature coming soon!');
        break;
      default:
        Alert.alert('Feature', `${action} feature coming soon!`);
    }
  };

  const renderWorkerHome = () => (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.light.background, Colors.light.surface]}
        style={styles.background}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Unstop-style header with gradient */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.greeting}>{t('home.greeting')}, {user?.name || 'User'}!</Text>
              <Text style={styles.subtitle}>{t('home.ready_to_find_job')}</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity 
                style={styles.profileAvatar}
                onPress={() => router.push('/(tabs)/profile')}
              >
                {user?.profileImage ? (
                  <Image 
                    source={{ uri: user.profileImage }} 
                    style={styles.profileAvatarImage}
                  />
                ) : (
                  <Text style={styles.profileAvatarText}>
                    {(user?.name || 'User').split(' ').map((n: string) => n[0]).join('')}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView 
            style={styles.scrollView} 
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {/* Quick Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <IconContainer
                  backgroundColor={Colors.light.primary + '20'}
                  size={28}
                  borderRadius={16}
                >
                  <ActionIcons.applications size={16} color={Colors.light.primary} />
                </IconContainer>
                <Text style={[styles.statNumber, { color: Colors.light.primary }]}>12</Text>
                <Text style={styles.statLabel}>Jobs Available</Text>
              </View>
              <View style={styles.statCard}>
                <IconContainer
                  backgroundColor={Colors.light.success + '20'}
                  size={28}
                  borderRadius={16}
                >
                  <ActionIcons.money size={16} color={Colors.light.success} />
                </IconContainer>
                <Text style={[styles.statNumber, { color: Colors.light.success }]}>₹8,500</Text>
                <Text style={styles.statLabel}>This Month</Text>
              </View>
              <View style={styles.statCard}>
                <IconContainer
                  backgroundColor={Colors.light.warning + '20'}
                  size={28}
                  borderRadius={16}
                >
                  <ActionIcons.rating size={16} color={Colors.light.warning} />
                </IconContainer>
                <Text style={[styles.statNumber, { color: Colors.light.warning }]}>4.8</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
            </View>

          {/* Unstop-style quick actions */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t('home.quick_actions')}</Text>
              <TouchableOpacity>
                <Text style={styles.sectionAction}>View All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.actionsGrid}>
              <TouchableOpacity style={styles.actionCard} onPress={() => handleActionPress('Find Jobs')}>
                <IconContainer
                  backgroundColor={Colors.light.primary + '20'}
                  size={32}
                  borderRadius={16}
                >
                  <ActionIcons.search size={16} color={Colors.light.primary} />
                </IconContainer>
                <Text style={styles.actionText} numberOfLines={1}>{t('home.find_jobs')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionCard} onPress={() => handleActionPress('My Applications')}>
                <IconContainer
                  backgroundColor={Colors.light.success + '20'}
                  size={32}
                  borderRadius={16}
                >
                  <ActionIcons.applications size={16} color={Colors.light.success} />
                </IconContainer>
                <Text style={styles.actionText} numberOfLines={1}>{t('home.my_applications')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionCard} onPress={() => handleActionPress('Learn')}>
                <IconContainer
                  backgroundColor={Colors.light.warning + '20'}
                  size={32}
                  borderRadius={16}
                >
                  <ActionIcons.eye size={16} color={Colors.light.warning} />
                </IconContainer>
                <Text style={styles.actionText} numberOfLines={1}>{t('home.learn')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionCard} onPress={() => handleActionPress('Badges')}>
                <IconContainer
                  backgroundColor={Colors.light.purple + '20'}
                  size={32}
                  borderRadius={16}
                >
                  <ActionIcons.rating size={16} color={Colors.light.purple} />
                </IconContainer>
                <Text style={styles.actionText} numberOfLines={1}>{t('home.badges')}</Text>
              </TouchableOpacity>
            </View>
          </View>

            {/* Recent Activity */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              <View style={styles.activityList}>
                <View style={styles.activityItem}>
                  <Text style={styles.activityIcon}>✅</Text>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>Job Completed</Text>
                    <Text style={styles.activitySubtitle}>Electrical work at TechCorp</Text>
                    <Text style={styles.activityTime}>2 hours ago</Text>
                  </View>
                  <Text style={styles.activityAmount}>₹2,500</Text>
                </View>
                <View style={styles.activityItem}>
                  <Text style={styles.activityIcon}>💼</Text>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>New Job Available</Text>
                    <Text style={styles.activitySubtitle}>Plumbing work near you</Text>
                    <Text style={styles.activityTime}>4 hours ago</Text>
                  </View>
                  <Text style={styles.activityAmount}>₹1,200</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </Animated.View>
      </LinearGradient>
    </View>
  );

  const renderEmployerHome = () => (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.light.background, Colors.light.surface]}
        style={styles.background}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <View style={styles.header}>
            <Text style={styles.greeting}>{t('home.welcome_back')}, {user?.name || 'User'}!</Text>
            <Text style={styles.subtitle}>Manage your workforce efficiently</Text>
          </View>

          <ScrollView 
            style={styles.scrollView} 
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {/* Quick Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <IconContainer
                  backgroundColor={Colors.light.primary + '20'}
                  size={32}
                  borderRadius={16}
                >
                  <ActionIcons.applications size={16} color={Colors.light.primary} />
                </IconContainer>
                <Text style={[styles.statNumber, { color: Colors.light.primary }]}>8</Text>
                <Text style={styles.statLabel}>Active Jobs</Text>
              </View>
              <View style={styles.statCard}>
                <IconContainer
                  backgroundColor={Colors.light.success + '20'}
                  size={32}
                  borderRadius={16}
                >
                  <ActionIcons.search size={16} color={Colors.light.success} />
                </IconContainer>
                <Text style={[styles.statNumber, { color: Colors.light.success }]}>24</Text>
                <Text style={styles.statLabel}>Workers Hired</Text>
              </View>
              <View style={styles.statCard}>
                <IconContainer
                  backgroundColor={Colors.light.warning + '20'}
                  size={32}
                  borderRadius={16}
                >
                  <ActionIcons.money size={16} color={Colors.light.warning} />
                </IconContainer>
                <Text style={[styles.statNumber, { color: Colors.light.warning }]}>₹45K</Text>
                <Text style={styles.statLabel}>This Month</Text>
              </View>
            </View>

            {/* Quick Actions */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{t('home.quick_actions')}</Text>
                <TouchableOpacity onPress={() => router.push('/(tabs)/explore')}>
                  <Text style={styles.viewAllText}>{t('home.view_all')}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.actionsGrid}>
                <TouchableOpacity style={styles.actionCard} onPress={() => handleActionPress('Post Job')}>
                  <IconContainer
                    backgroundColor={Colors.light.primary + '20'}
                    size={48}
                    borderRadius={24}
                  >
                    <ActionIcons.edit size={24} color={Colors.light.primary} />
                  </IconContainer>
                  <Text style={styles.actionText} numberOfLines={2}>Post Job</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionCard} onPress={() => handleActionPress('Find Workers')}>
                  <IconContainer
                    backgroundColor={Colors.light.success + '20'}
                    size={48}
                    borderRadius={24}
                  >
                    <ActionIcons.search size={24} color={Colors.light.success} />
                  </IconContainer>
                  <Text style={styles.actionText} numberOfLines={2}>Find Workers</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionCard} onPress={() => handleActionPress('Analytics')}>
                  <IconContainer
                    backgroundColor={Colors.light.warning + '20'}
                    size={48}
                    borderRadius={24}
                  >
                    <ActionIcons.eye size={24} color={Colors.light.warning} />
                  </IconContainer>
                  <Text style={styles.actionText} numberOfLines={2}>Analytics</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionCard} onPress={() => handleActionPress('Payments')}>
                  <IconContainer
                    backgroundColor={Colors.light.purple + '20'}
                    size={48}
                    borderRadius={24}
                  >
                    <ActionIcons.money size={24} color={Colors.light.purple} />
                  </IconContainer>
                  <Text style={styles.actionText} numberOfLines={2}>Payments</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Recent Activity */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              <View style={styles.activityList}>
                <View style={styles.activityItem}>
                  <Text style={styles.activityIcon}>✅</Text>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>Job Completed</Text>
                    <Text style={styles.activitySubtitle}>Office cleaning by Raj Kumar</Text>
                    <Text style={styles.activityTime}>1 hour ago</Text>
                  </View>
                  <Text style={styles.activityAmount}>₹2,500</Text>
                </View>
                <View style={styles.activityItem}>
                  <Text style={styles.activityIcon}>👤</Text>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>New Worker Applied</Text>
                    <Text style={styles.activitySubtitle}>Priya Sharma for plumbing work</Text>
                    <Text style={styles.activityTime}>3 hours ago</Text>
                  </View>
                  <Text style={styles.activityAmount}>4.9★</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </Animated.View>
      </LinearGradient>
    </View>
  );

  if (!isInitialized) {
    return (
      <ScreenWrapper title="Dashboard">
        <View style={styles.container}>
          <LinearGradient
            colors={[Colors.light.background, Colors.light.surface]}
            style={styles.background}
          >
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          </LinearGradient>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper title="Dashboard">
      {user?.role === 'worker' ? renderWorkerHome() : renderEmployerHome()}
    </ScreenWrapper>
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
    padding: getResponsiveSpacing(Spacing.lg, Spacing.xl, Spacing.xxl),
    paddingHorizontal: getResponsiveSpacing(Spacing.lg, Spacing.xl, Spacing.xxl),
    paddingTop: isLandscape ? Spacing.md : getResponsiveSpacing(Spacing.lg, Spacing.xl, Spacing.xxl),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xl,
    paddingTop: Spacing.sm,
  },
  headerContent: {
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: Colors.light.border,
  },
  profileAvatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  profileAvatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.primary,
  },
  greeting: {
    ...Typography.h1,
    color: Colors.light.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.light.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: getResponsiveSpacing(Spacing.lg, Spacing.sm, Spacing.sm),
    gap: getResponsiveSpacing(Spacing.sm, Spacing.md, Spacing.lg),
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius.lg,
    padding: getResponsiveSpacing(Spacing.xs, Spacing.sm, Spacing.sm),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: getResponsiveSpacing(Spacing.xs, Spacing.sm, Spacing.md),
    shadowColor: Colors.light.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: Colors.light.border,
    height: getResponsiveSpacing(75, 85, 95),
  },
  statNumber: {
    fontSize: getResponsiveFontSize(18, 20, 22),
    fontWeight: '700',
    marginTop: getResponsiveSpacing(Spacing.xs, Spacing.sm, Spacing.sm),
    marginBottom: getResponsiveSpacing(Spacing.xs, Spacing.xs, Spacing.sm),
  },
  statLabel: {
    fontSize: getResponsiveFontSize(10, 12, 14),
    color: Colors.light.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.h4,
    color: Colors.light.text,
    fontWeight: '600',
  },
  sectionAction: {
    ...Typography.captionMedium,
    color: Colors.light.primary,
  },
  viewAllText: {
    ...Typography.captionMedium,
    color: Colors.light.primary,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: getResponsiveSpacing(Spacing.sm, Spacing.md, Spacing.lg),
  },
  actionCard: {
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius.lg,
    padding: getResponsiveSpacing(Spacing.sm, Spacing.md, Spacing.lg),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    shadowColor: Colors.light.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.light.border,
    width: '48%',
    minHeight: getResponsiveSpacing(50, 55, 60),
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  actionIcon: {
    fontSize: 24,
  },
  actionText: {
    fontSize: getResponsiveFontSize(12, 14, 16),
    fontWeight: '600',
    color: Colors.light.text,
    textAlign: 'left',
    marginLeft: getResponsiveSpacing(Spacing.sm, Spacing.md, Spacing.lg),
    flex: 1,
  },
  activityList: {
    backgroundColor: Colors.light.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    shadowColor: Colors.light.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  activityIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    ...Typography.body,
    color: Colors.light.text,
    fontWeight: '500',
    marginBottom: 2,
  },
  activitySubtitle: {
    ...Typography.caption,
    color: Colors.light.textSecondary,
    marginBottom: 2,
  },
  activityTime: {
    ...Typography.small,
    color: Colors.light.textLight,
  },
  activityAmount: {
    ...Typography.body,
    color: Colors.light.success,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...Typography.body,
    color: Colors.light.textSecondary,
  },
});