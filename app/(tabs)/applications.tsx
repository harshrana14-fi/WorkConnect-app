/**
 * Applications Page - Shows user's job applications
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Alert,
  StatusBar,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import ScreenWrapper from '@/components/ScreenWrapper';
import { isTablet, isLandscape, getResponsiveSpacing, getGridColumns, getCardWidth, getSafeAreaPadding } from '@/utils/responsive';
import { 
  ActionIcons, 
  IconContainer 
} from '@/components/ui/ProfessionalIcons';
import { jobService, JobApplication, JobPost } from '@/services/jobService';

const { width } = Dimensions.get('window');

export default function ApplicationsScreen() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<(JobApplication & { job: JobPost })[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, [user]);

  const loadApplications = async () => {
    if (!user) return;

    try {
      const userApplications = await jobService.getApplicationsByApplicant(user.id);
      const applicationsWithJobs = await Promise.all(
        userApplications.map(async (app: any) => {
          const job = await jobService.getJobById(app.jobId);
          return {
            ...app,
            job
          };
        })
      );
      
      const validApplications = applicationsWithJobs.filter((app: any) => app.job);
      setApplications(validApplications);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadApplications();
    setRefreshing(false);
  };

  const getStatusColor = (status: JobApplication['status']) => {
    switch (status) {
      case 'pending': return Colors.light.warning;
      case 'reviewed': return Colors.light.info;
      case 'accepted': return Colors.light.success;
      case 'rejected': return Colors.light.error;
      default: return Colors.light.textSecondary;
    }
  };

  const getStatusIcon = (status: JobApplication['status']) => {
    switch (status) {
      case 'pending': return ActionIcons.time;
      case 'reviewed': return ActionIcons.eye;
      case 'accepted': return ActionIcons.success;
      case 'rejected': return ActionIcons.error;
      default: return ActionIcons.time;
    }
  };

  const handleViewJob = (jobId: string) => {
    router.push({
      pathname: '/job-details',
      params: { jobId }
    });
  };

  const handleWithdrawApplication = (applicationId: string) => {
    Alert.alert(
      'Withdraw Application',
      'Are you sure you want to withdraw this application?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Withdraw',
          style: 'destructive',
          onPress: () => {
            // In a real app, you'd call an API to withdraw the application
            Alert.alert('Success', 'Application withdrawn successfully.');
            loadApplications();
          }
        }
      ]
    );
  };

  const renderApplicationItem = ({ item }: { item: JobApplication & { job: JobPost } }) => {
    const StatusIcon = getStatusIcon(item.status);
    const statusColor = getStatusColor(item.status);

    return (
      <TouchableOpacity 
        style={styles.applicationCard}
        onPress={() => handleViewJob(item.jobId)}
        activeOpacity={0.8}
      >
        <View style={styles.cardHeader}>
          <View style={styles.jobInfo}>
            <Text style={styles.jobTitle}>{item.job.title}</Text>
            <Text style={styles.companyName}>{item.job.company}</Text>
            <View style={styles.jobDetails}>
              <View style={styles.detailItem}>
                <ActionIcons.location size={14} color={Colors.light.textSecondary} />
                <Text style={styles.detailText}>{item.job.location}</Text>
              </View>
              <View style={styles.detailItem}>
                <ActionIcons.money size={14} color={Colors.light.textSecondary} />
                <Text style={styles.detailText}>{item.job.pay}</Text>
              </View>
            </View>
          </View>
          
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
            <StatusIcon size={16} color={statusColor} />
            <Text style={[styles.statusText, { color: statusColor }]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
        </View>

        <View style={styles.applicationInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Applied Date:</Text>
            <Text style={styles.infoValue}>{item.appliedDate}</Text>
          </View>
          
          {item.expectedPay && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Expected Pay:</Text>
              <Text style={styles.infoValue}>{item.expectedPay}</Text>
            </View>
          )}
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Availability:</Text>
            <Text style={styles.infoValue}>{item.availability}</Text>
          </View>
        </View>

        {item.coverLetter && (
          <View style={styles.coverLetterSection}>
            <Text style={styles.coverLetterLabel}>Cover Letter:</Text>
            <Text style={styles.coverLetterText} numberOfLines={3}>
              {item.coverLetter}
            </Text>
          </View>
        )}

        {item.employerNotes && (
          <View style={styles.employerNotesSection}>
            <Text style={styles.employerNotesLabel}>Employer Notes:</Text>
            <Text style={styles.employerNotesText}>{item.employerNotes}</Text>
          </View>
        )}

        <View style={styles.cardActions}>
          <TouchableOpacity 
            style={styles.viewJobButton}
            onPress={() => handleViewJob(item.jobId)}
          >
            <ActionIcons.eye size={16} color={Colors.light.primary} />
            <Text style={styles.viewJobText}>View Job</Text>
          </TouchableOpacity>
          
          {item.status === 'pending' && (
            <TouchableOpacity 
              style={styles.withdrawButton}
              onPress={() => handleWithdrawApplication(item.id)}
            >
              <ActionIcons.cancel size={16} color={Colors.light.error} />
              <Text style={styles.withdrawText}>Withdraw</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <ActionIcons.applications size={48} color={Colors.light.textLight} />
      </View>
      <Text style={styles.emptyTitle}>No Applications Yet</Text>
      <Text style={styles.emptyMessage}>
        You haven&apos;t applied for any jobs yet. Start exploring jobs and apply to positions that interest you.
      </Text>
      <TouchableOpacity 
        style={styles.exploreButton}
        onPress={() => router.push('/(tabs)/explore')}
      >
        <LinearGradient
          colors={[Colors.light.primary, Colors.light.primaryLight]}
          style={styles.exploreButtonGradient}
        >
          <ActionIcons.search size={20} color={Colors.light.background} />
          <Text style={styles.exploreButtonText}>Explore Jobs</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading applications...</Text>
      </View>
    );
  }

  return (
    <ScreenWrapper title="Applications">
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.light.background} />
        
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Applications</Text>
          <Text style={styles.headerSubtitle}>
            Track your job applications and their status
          </Text>
        </View>

        {applications.length > 0 ? (
          <FlatList
            data={applications}
            renderItem={renderApplicationItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl 
                refreshing={refreshing} 
                onRefresh={onRefresh}
                tintColor={Colors.light.primary}
                colors={[Colors.light.primary]}
              />
            }
          />
        ) : (
          renderEmptyState()
        )}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: Colors.light.textSecondary,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.light.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
  },
  listContainer: {
    padding: Spacing.lg,
  },
  applicationCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    elevation: 2,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  jobInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: Spacing.xs,
  },
  companyName: {
    fontSize: 16,
    color: Colors.light.primary,
    marginBottom: Spacing.sm,
  },
  jobDetails: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  detailText: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  applicationInfo: {
    marginBottom: Spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.text,
  },
  coverLetterSection: {
    marginBottom: Spacing.md,
  },
  coverLetterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: Spacing.xs,
  },
  coverLetterText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
  },
  employerNotesSection: {
    backgroundColor: Colors.light.primary + '10',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  employerNotesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.primary,
    marginBottom: Spacing.xs,
  },
  employerNotesText: {
    fontSize: 14,
    color: Colors.light.text,
    lineHeight: 20,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewJobButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  viewJobText: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: '500',
  },
  withdrawButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  withdrawText: {
    fontSize: 14,
    color: Colors.light.error,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.light.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.xl,
  },
  exploreButton: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  exploreButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  exploreButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.background,
  },
});