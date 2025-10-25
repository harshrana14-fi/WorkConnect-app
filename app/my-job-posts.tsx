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

export default function MyJobPostsScreen() {
  const { user } = useAuth();
  const { t } = useLanguage();
  
  const [jobPosts, setJobPosts] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadJobPosts();
  }, []);

  const loadJobPosts = async () => {
    try {
      if (!user || user.role !== 'employer') {
        console.log('User not authenticated or not an employer');
        setJobPosts([]);
        return;
      }

      // Fetch jobs created by the current employer
      const employerJobs = await jobService.getJobsByEmployer(user.id);
      
      // Transform the jobs to match the expected format
      const formattedJobs = employerJobs.map(job => ({
        id: job.id,
        title: job.title,
        description: job.description,
        location: job.location,
        salary: job.salary || job.pay || 'Not specified',
        duration: job.duration,
        skills: Array.isArray(job.skills) ? job.skills.join(', ') : job.skills || '',
        workType: job.workType || job.jobType || 'full-time',
        urgency: job.urgency || 'normal',
        status: job.status || 'active',
        applicationsCount: 0, // TODO: Get actual application count
        postedDate: job.postedDate || new Date(job.createdAt).toLocaleDateString(),
        image: job.image || '',
      }));
      
      setJobPosts(formattedJobs);
    } catch (error) {
      console.error('Failed to load job posts:', error);
      setJobPosts([]);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadJobPosts();
    setRefreshing(false);
  };

  const handleEditJob = (jobId: string) => {
    // TODO: Navigate to edit job page
    Alert.alert('Edit Job', 'Edit functionality will be implemented');
  };

  const handleDeleteJob = (jobId: string) => {
    Alert.alert(
      'Delete Job Post',
      'Are you sure you want to delete this job post? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteJobPost(jobId),
        },
      ]
    );
  };

  const deleteJobPost = async (jobId: string) => {
    try {
      console.log('Deleting job post:', jobId);
      
      const success = await jobService.deleteJobPost(jobId);
      
      if (success) {
        // Update local state
        setJobPosts(prev => prev.filter(job => job.id !== jobId));
        Alert.alert('Success', 'Job post deleted successfully!');
      } else {
        Alert.alert('Error', 'Failed to delete job post');
      }
    } catch (error) {
      console.error('Error deleting job post:', error);
      Alert.alert('Error', 'Failed to delete job post');
    }
  };

  const handleViewApplications = (jobId: string) => {
    router.push('/job-applications');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10B981';
      case 'completed': return '#6B7280';
      case 'paused': return '#F59E0B';
      case 'cancelled': return '#EF4444';
      default: return Colors.light.textSecondary;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return '#EF4444';
      case 'high': return '#F59E0B';
      case 'normal': return '#10B981';
      case 'low': return '#6B7280';
      default: return Colors.light.textSecondary;
    }
  };

  const renderJobPostCard = ({ item }: { item: any }) => (
    <View style={styles.jobPostCard}>
      <View style={styles.jobPostHeader}>
        <View style={styles.jobPostInfo}>
          <Text style={styles.jobTitle}>{item.title}</Text>
          <Text style={styles.jobLocation}>{item.location}</Text>
          <Text style={styles.jobSalary}>{item.salary}</Text>
        </View>
        <View style={styles.jobPostBadges}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
          <View style={[styles.urgencyBadge, { backgroundColor: getUrgencyColor(item.urgency) }]}>
            <Text style={styles.urgencyText}>{item.urgency}</Text>
          </View>
        </View>
      </View>

      {/* Job Image */}
      {item.image && (
        <View style={styles.jobImageContainer}>
          <Image 
            source={{ uri: item.image }} 
            style={styles.jobImage}
            resizeMode="cover"
          />
        </View>
      )}

      <Text style={styles.jobDescription} numberOfLines={2}>
        {item.description}
      </Text>

      <View style={styles.jobDetails}>
        <View style={styles.detailRow}>
          <ActionIcons.clock size={16} color={Colors.light.textSecondary} />
          <Text style={styles.detailText}>{item.duration}</Text>
        </View>
        <View style={styles.detailRow}>
          <ActionIcons.briefcase size={16} color={Colors.light.textSecondary} />
          <Text style={styles.detailText}>{item.workType}</Text>
        </View>
        <View style={styles.detailRow}>
          <ActionIcons.users size={16} color={Colors.light.textSecondary} />
          <Text style={styles.detailText}>{item.applicationsCount} applications</Text>
        </View>
        <View style={styles.detailRow}>
          <ActionIcons.calendar size={16} color={Colors.light.textSecondary} />
          <Text style={styles.detailText}>Posted {item.postedDate}</Text>
        </View>
      </View>

      <View style={styles.jobActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.viewButton]}
          onPress={() => handleViewApplications(item.id)}
        >
          <ActionIcons.users size={16} color={Colors.light.primary} />
          <Text style={styles.actionButtonText}>View Applications</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleEditJob(item.id)}
        >
          <ActionIcons.edit size={16} color={Colors.light.secondary} />
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteJob(item.id)}
        >
          <ActionIcons.trash size={16} color={Colors.light.error} />
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <IconContainer size={60} backgroundColor={Colors.light.surface}>
        <ActionIcons.briefcase size={30} color={Colors.light.textSecondary} />
      </IconContainer>
      <Text style={styles.emptyStateTitle}>No Job Posts Yet</Text>
      <Text style={styles.emptyStateText}>
        Create your first job post to start hiring workers.
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
    <ScreenWrapper title="My Job Posts">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ActionIcons.arrow_left size={24} color={Colors.light.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Job Posts</Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => router.push('/create-job')}
          >
            <ActionIcons.plus size={24} color={Colors.light.primary} />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{jobPosts.length}</Text>
            <Text style={styles.statLabel}>Total Posts</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {jobPosts.filter(job => job.status === 'active').length}
            </Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {jobPosts.reduce((sum, job) => sum + job.applicationsCount, 0)}
            </Text>
            <Text style={styles.statLabel}>Applications</Text>
          </View>
        </View>

        {/* Job Posts List */}
        {jobPosts.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={jobPosts}
            renderItem={renderJobPostCard}
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
  createButton: {
    padding: Spacing.sm,
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
  jobPostCard: {
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  jobPostHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  jobPostInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: Typography.h4.fontSize,
    fontWeight: Typography.h4.fontWeight,
    color: Colors.light.text,
    marginBottom: Spacing.xs,
  },
  jobLocation: {
    fontSize: Typography.small.fontSize,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.xs,
  },
  jobSalary: {
    fontSize: Typography.small.fontSize,
    color: Colors.light.primary,
    fontWeight: Typography.small.fontWeight,
  },
  jobPostBadges: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  jobImageContainer: {
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  jobImage: {
    width: '100%',
    height: 120,
    backgroundColor: Colors.light.surface,
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
    textTransform: 'capitalize',
  },
  urgencyBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  urgencyText: {
    fontSize: Typography.small.fontSize,
    fontWeight: Typography.small.fontWeight,
    color: Colors.light.background,
    textTransform: 'capitalize',
  },
  jobDescription: {
    fontSize: Typography.body.fontSize,
    color: Colors.light.text,
    marginBottom: Spacing.md,
    lineHeight: 20,
  },
  jobDetails: {
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
  },
  jobActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: Spacing.xs,
  },
  viewButton: {
    backgroundColor: Colors.light.surface,
    borderColor: Colors.light.primary,
  },
  editButton: {
    backgroundColor: Colors.light.surface,
    borderColor: Colors.light.secondary,
  },
  deleteButton: {
    backgroundColor: Colors.light.surface,
    borderColor: Colors.light.error,
  },
  actionButtonText: {
    fontSize: Typography.small.fontSize,
    fontWeight: Typography.small.fontWeight,
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
