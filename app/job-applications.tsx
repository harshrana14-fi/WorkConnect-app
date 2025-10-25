import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
  Image,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import ScreenWrapper from '@/components/ScreenWrapper';
import { ActionIcons, IconContainer } from '@/components/ui/ProfessionalIcons';
import { jobService } from '@/services/jobService';

export default function JobApplicationsScreen() {
  const { user } = useAuth();
  const { t } = useLanguage();
  
  const [applications, setApplications] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      if (!user || user.role !== 'employer') {
        console.log('User not authenticated or not an employer');
        setApplications([]);
        return;
      }

      // Fetch applications for jobs created by this employer
      const employerApplications = await jobService.getApplicationsByEmployer(user.id);
      
      // Transform applications to match the expected format
      const formattedApplications = employerApplications.map(app => ({
        id: app.id,
        jobId: app.jobId,
        jobTitle: app.jobTitle,
        applicantName: app.applicantName,
        applicantEmail: app.applicantEmail,
        applicantPhone: app.applicantPhone,
        applicantSkills: app.applicantSkills || 'Not specified',
        applicantExperience: app.applicantExperience || 'Not specified',
        status: app.status,
        appliedDate: new Date(app.appliedDate).toLocaleDateString(),
        applicantImage: app.applicantImage || '',
        message: app.message || '',
      }));
      
      setApplications(formattedApplications);
    } catch (error) {
      console.error('Failed to load applications:', error);
      setApplications([]);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadApplications();
    setRefreshing(false);
  };

  const handleApplicationAction = (applicationId: string, action: 'accept' | 'reject') => {
    Alert.alert(
      `${action === 'accept' ? 'Accept' : 'Reject'} Application`,
      `Are you sure you want to ${action} this application?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: action === 'accept' ? 'Accept' : 'Reject',
          style: action === 'accept' ? 'default' : 'destructive',
          onPress: () => updateApplicationStatus(applicationId, action),
        },
      ]
    );
  };

  const updateApplicationStatus = async (applicationId: string, action: 'accept' | 'reject') => {
    try {
      console.log(`${action}ing application:`, applicationId);
      
      const newStatus = action === 'accept' ? 'accepted' : 'rejected';
      const updatedApplication = await jobService.updateApplicationStatus(applicationId, newStatus);
      
      if (updatedApplication) {
        // Update local state
        setApplications(prev => 
          prev.map(app => 
            app.id === applicationId 
              ? { ...app, status: newStatus }
              : app
          )
        );
        
        Alert.alert('Success', `Application ${action}ed successfully!`);
      } else {
        Alert.alert('Error', 'Failed to update application status');
      }
    } catch (error) {
      console.error('Error updating application status:', error);
      Alert.alert('Error', 'Failed to update application status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return '#10B981';
      case 'rejected': return '#EF4444';
      case 'pending': return '#F59E0B';
      default: return Colors.light.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'accepted': return 'Accepted';
      case 'rejected': return 'Rejected';
      case 'pending': return 'Pending';
      default: return 'Unknown';
    }
  };

  const renderApplicationCard = ({ item }: { item: any }) => (
    <View style={styles.applicationCard}>
      <View style={styles.applicationHeader}>
        <View style={styles.applicantInfo}>
          <View style={styles.applicantAvatar}>
            <Text style={styles.applicantInitial}>
              {item.applicantName.split(' ').map((n: string) => n[0]).join('')}
            </Text>
          </View>
          <View style={styles.applicantDetails}>
            <Text style={styles.applicantName}>{item.applicantName}</Text>
            <Text style={styles.jobTitle}>{item.jobTitle}</Text>
            <Text style={styles.appliedDate}>Applied on {item.appliedDate}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>

      <View style={styles.applicationDetails}>
        <View style={styles.detailRow}>
          <ActionIcons.mail size={16} color={Colors.light.textSecondary} />
          <Text style={styles.detailText}>{item.applicantEmail}</Text>
        </View>
        <View style={styles.detailRow}>
          <ActionIcons.phone size={16} color={Colors.light.textSecondary} />
          <Text style={styles.detailText}>{item.applicantPhone}</Text>
        </View>
        <View style={styles.detailRow}>
          <ActionIcons.briefcase size={16} color={Colors.light.textSecondary} />
          <Text style={styles.detailText}>{item.applicantExperience}</Text>
        </View>
        <View style={styles.detailRow}>
          <ActionIcons.tag size={16} color={Colors.light.textSecondary} />
          <Text style={styles.detailText}>{item.applicantSkills}</Text>
        </View>
      </View>

      {item.status === 'pending' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.acceptButton]}
            onPress={() => handleApplicationAction(item.id, 'accept')}
          >
            <ActionIcons.check size={16} color={Colors.light.background} />
            <Text style={styles.actionButtonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.rejectButton]}
            onPress={() => handleApplicationAction(item.id, 'reject')}
          >
            <ActionIcons.x size={16} color={Colors.light.background} />
            <Text style={styles.actionButtonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <IconContainer size={60} backgroundColor={Colors.light.surface}>
        <ActionIcons.users size={30} color={Colors.light.textSecondary} />
      </IconContainer>
      <Text style={styles.emptyStateTitle}>No Applications Yet</Text>
      <Text style={styles.emptyStateText}>
        When workers apply for your jobs, they'll appear here.
      </Text>
      <TouchableOpacity
        style={styles.createJobButton}
        onPress={() => router.push('/create-job')}
      >
        <LinearGradient
          colors={[Colors.light.primary, Colors.light.secondary]}
          style={styles.createJobButtonGradient}
        >
          <Text style={styles.createJobButtonText}>Create Job Post</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScreenWrapper title="Job Applications">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ActionIcons.arrow_left size={24} color={Colors.light.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Job Applications</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{applications.length}</Text>
            <Text style={styles.statLabel}>Total Applications</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {applications.filter(app => app.status === 'pending').length}
            </Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {applications.filter(app => app.status === 'accepted').length}
            </Text>
            <Text style={styles.statLabel}>Accepted</Text>
          </View>
        </View>

        {/* Applications List */}
        {applications.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={applications}
            renderItem={renderApplicationCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            showsVerticalScrollIndicator={false}
          />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  backButton: {
    padding: Spacing.sm,
  },
  headerTitle: {
    fontSize: Typography.h3.fontSize,
    fontWeight: Typography.h3.fontWeight,
    color: Colors.light.text,
  },
  placeholder: {
    width: 40,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.light.surface,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: Typography.h4.fontSize,
    fontWeight: Typography.h4.fontWeight,
    color: Colors.light.text,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: Typography.small.fontSize,
    color: Colors.light.textSecondary,
  },
  listContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  applicationCard: {
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  applicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  applicantInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  applicantAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  applicantInitial: {
    fontSize: Typography.h4.fontSize,
    fontWeight: Typography.h4.fontWeight,
    color: Colors.light.background,
  },
  applicantDetails: {
    flex: 1,
  },
  applicantName: {
    fontSize: Typography.body.fontSize,
    fontWeight: Typography.body.fontWeight,
    color: Colors.light.text,
    marginBottom: Spacing.xs,
  },
  jobTitle: {
    fontSize: Typography.small.fontSize,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.xs,
  },
  appliedDate: {
    fontSize: Typography.small.fontSize,
    color: Colors.light.textLight,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    fontSize: Typography.small.fontSize,
    fontWeight: Typography.small.fontWeight,
    color: Colors.light.background,
  },
  applicationDetails: {
    marginBottom: Spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  detailText: {
    fontSize: Typography.small.fontSize,
    color: Colors.light.text,
    marginLeft: Spacing.sm,
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  acceptButton: {
    backgroundColor: '#10B981',
  },
  rejectButton: {
    backgroundColor: '#EF4444',
  },
  actionButtonText: {
    fontSize: Typography.small.fontSize,
    fontWeight: Typography.small.fontWeight,
    color: Colors.light.background,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emptyStateTitle: {
    fontSize: Typography.h4.fontSize,
    fontWeight: Typography.h4.fontWeight,
    color: Colors.light.text,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptyStateText: {
    fontSize: Typography.body.fontSize,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  createJobButton: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  createJobButtonGradient: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  createJobButtonText: {
    fontSize: Typography.body.fontSize,
    fontWeight: Typography.body.fontWeight,
    color: Colors.light.background,
  },
});
