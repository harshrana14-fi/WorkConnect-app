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
import { jobService } from '@/services/jobService';

const { width } = Dimensions.get('window');

export default function EmployerDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [jobPosts, setJobPosts] = useState<any[]>([]);
  const [totalApplications, setTotalApplications] = useState(0);
  const [activeJobs, setActiveJobs] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
    
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      if (!user || user.role !== 'employer') {
        return;
      }

      // Load employer's job posts
      const employerJobs = await jobService.getJobsByEmployer(user.id);
      setJobPosts(employerJobs);
      setActiveJobs(employerJobs.filter(job => job.status === 'active').length);

      // Load applications for employer's jobs
      const applications = await jobService.getApplicationsByEmployer(user.id);
      setTotalApplications(applications.length);

      // Calculate total earnings (mock calculation for now)
      const acceptedApplications = applications.filter(app => app.status === 'accepted');
      setTotalEarnings(acceptedApplications.length * 1000); // Mock earnings calculation

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const handleCreateJobPost = () => {
    router.push('/create-job');
  };

  const handleViewApplications = () => {
    router.push('/job-applications');
  };

  const handleViewJobPosts = () => {
    router.push('/my-job-posts');
  };

  const renderStatCard = (title: string, value: string | number, icon: React.ReactNode, color: string) => (
    <Animated.View style={[styles.statCard, { opacity: fadeAnim }]}>
      <LinearGradient
        colors={[color, color + '80']}
        style={styles.statCardGradient}
      >
        <View style={styles.statContent}>
          <View style={styles.statIconContainer}>
            {icon}
          </View>
          <View style={styles.statTextContainer}>
            <Text style={styles.statNumber}>{value}</Text>
            <Text style={styles.statLabel}>{title}</Text>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );

  const renderActionCard = (title: string, description: string, icon: React.ReactNode, onPress: () => void, color: string) => (
    <TouchableOpacity style={styles.actionCard} onPress={onPress}>
      <LinearGradient
        colors={[color, color + '80']}
        style={styles.actionCardGradient}
      >
        <View style={styles.actionContent}>
          <IconContainer size={32} backgroundColor={Colors.light.background}>
            {icon}
          </IconContainer>
          <View style={styles.actionTextContainer}>
            <Text style={styles.actionTitle}>{title}</Text>
            <Text style={styles.actionDescription}>{description}</Text>
          </View>
          <ActionIcons.arrow_right size={20} color={Colors.light.textSecondary} />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper title="Employer Dashboard">
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName}>{user?.name || 'Employer'}</Text>
            <Text style={styles.roleText}>Employer Dashboard</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <IconContainer size={40} backgroundColor={Colors.light.primary}>
              <Text style={styles.profileInitial}>
                {(user?.name || 'E').split(' ').map((n: string) => n[0]).join('')}
              </Text>
            </IconContainer>
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          {renderStatCard(
            'Active Jobs',
            activeJobs,
            <ActionIcons.briefcase size={24} color={Colors.light.background} />,
            Colors.light.primary
          )}
          {renderStatCard(
            'Applications',
            totalApplications,
            <ActionIcons.users size={24} color={Colors.light.background} />,
            Colors.light.secondary
          )}
          {renderStatCard(
            'Total Posts',
            jobPosts.length,
            <ActionIcons.file_text size={24} color={Colors.light.background} />,
            '#10B981'
          )}
          {renderStatCard(
            'Earnings',
            `₹${totalEarnings}`,
            <ActionIcons.dollar_sign size={24} color={Colors.light.background} />,
            '#F59E0B'
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          {renderActionCard(
            'Create Job Post',
            'Post a new job opportunity',
            <ActionIcons.plus size={20} color={Colors.light.primary} />,
            handleCreateJobPost,
            Colors.light.surface
          )}
          
          {renderActionCard(
            'View Applications',
            'Manage job applications',
            <ActionIcons.users size={20} color={Colors.light.secondary} />,
            handleViewApplications,
            Colors.light.surface
          )}
          
          {renderActionCard(
            'My Job Posts',
            'Manage your job postings',
            <ActionIcons.briefcase size={20} color={Colors.light.primary} />,
            handleViewJobPosts,
            Colors.light.surface
          )}
        </View>

        {/* Recent Activity */}
        <View style={styles.recentActivityContainer}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            <Text style={styles.activityText}>No recent activity</Text>
            <Text style={styles.activitySubtext}>Start by creating your first job post!</Text>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerContent: {
    flex: 1,
  },
  welcomeText: {
    fontSize: Typography.body.fontSize,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.xs,
  },
  userName: {
    fontSize: Typography.h3.fontSize,
    fontWeight: Typography.h3.fontWeight,
    color: Colors.light.text,
    marginBottom: Spacing.xs,
  },
  roleText: {
    fontSize: Typography.small.fontSize,
    color: Colors.light.primary,
    fontWeight: Typography.small.fontWeight,
  },
  profileButton: {
    marginLeft: Spacing.md,
  },
  profileInitial: {
    fontSize: Typography.h4.fontSize,
    fontWeight: Typography.h4.fontWeight,
    color: Colors.light.background,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - Spacing.lg * 3) / 2,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  statCardGradient: {
    padding: Spacing.md,
    height: getResponsiveSpacing(75, 85, 95),
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statIconContainer: {
    marginRight: Spacing.md,
  },
  statTextContainer: {
    flex: 1,
  },
  statNumber: {
    fontSize: getResponsiveFontSize(18, 20, 22),
    fontWeight: Typography.h4.fontWeight,
    color: Colors.light.background,
    marginTop: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: getResponsiveFontSize(10, 12, 14),
    color: Colors.light.background,
    opacity: 0.9,
  },
  quickActionsContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.h4.fontSize,
    fontWeight: Typography.h4.fontWeight,
    color: Colors.light.text,
    marginBottom: Spacing.md,
  },
  actionCard: {
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  actionCardGradient: {
    padding: Spacing.md,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionTextContainer: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  actionTitle: {
    fontSize: Typography.body.fontSize,
    fontWeight: Typography.body.fontWeight,
    color: Colors.light.text,
    marginBottom: Spacing.xs,
  },
  actionDescription: {
    fontSize: Typography.small.fontSize,
    color: Colors.light.textSecondary,
  },
  recentActivityContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  activityCard: {
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  activityText: {
    fontSize: Typography.body.fontSize,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.xs,
  },
  activitySubtext: {
    fontSize: Typography.small.fontSize,
    color: Colors.light.textLight,
  },
});
