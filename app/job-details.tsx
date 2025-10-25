/**
 * Job Details Page - Shows full job description and details
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import ScreenWrapper from '@/components/ScreenWrapper';
import { isTablet, isLandscape, getResponsiveSpacing, getGridColumns, getCardWidth, getSafeAreaPadding } from '@/utils/responsive';
import { 
  ActionIcons, 
  JobCategoryIcons, 
  IconContainer 
} from '@/components/ui/ProfessionalIcons';
import { RichMedia } from '@/components/ui/RichMedia';
import { jobService } from '@/services/jobService';
import { JobPost } from '@/services/simpleJobService';
import { getJobImage, getCompanyLogo } from '@/services/imageService';

const { width } = Dimensions.get('window');

export default function JobDetailsScreen() {
  const { user } = useAuth();
  const { jobId } = useLocalSearchParams<{ jobId: string }>();
  const [job, setJob] = useState<JobPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);

  React.useEffect(() => {
    const fetchJob = async () => {
      if (jobId) {
        const jobData = await jobService.getJobById(jobId);
        setJob(jobData || null);
        setLoading(false);
      }
    };
    fetchJob();
  }, [jobId]);

  React.useEffect(() => {
    const checkApplied = async () => {
      if (user && job) {
        const applied = await jobService.hasUserAppliedForJob(job.id, user.id);
        setHasApplied(applied);
      }
    };
    checkApplied();
  }, [user, job]);

  const handleApply = async () => {
    if (!user) {
      Alert.alert('Login Required', 'Please login to apply for jobs.');
      return;
    }
    
    if (!job) return;

    if (hasApplied) {
      Alert.alert('Already Applied', 'You have already applied for this job.');
      return;
    }

    // Navigate to application form
    router.push({
      pathname: '/job-application',
      params: { jobId: job.id }
    });
  };

  const handleContactEmployer = () => {
    if (!job) return;
    
    Alert.alert(
      'Contact Employer',
      `Contact ${job.employerName} at ${job.employerEmail}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Email', onPress: () => console.log('Open email client') },
        { text: 'Call', onPress: () => console.log('Open phone dialer') }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading job details...</Text>
      </View>
    );
  }

  if (!job) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Job not found</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.light.background} />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ActionIcons.arrow_left size={24} color={Colors.light.text} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.shareButton}
            onPress={() => Alert.alert('Share', 'Job sharing feature coming soon!')}
          >
            <ActionIcons.share size={24} color={Colors.light.text} />
          </TouchableOpacity>
        </View>

        {/* Job Media */}
        {job.image && (
          <View style={styles.mediaContainer}>
            <RichMedia
              type="image"
              source={job.image}
              title={job.title}
              aspectRatio={16/9}
              style={styles.jobImage}
            />
          </View>
        )}

        {/* Job Info */}
        <View style={styles.content}>
          <View style={styles.jobHeader}>
            <View style={styles.titleSection}>
              <Text style={styles.jobTitle}>{job.title}</Text>
              <View style={styles.companySection}>
                <Text style={styles.companyName}>{job.company || job.employerName}</Text>
                <View style={styles.locationRow}>
                  <ActionIcons.location size={16} color={Colors.light.textSecondary} />
                  <Text style={styles.locationText}>{job.location}</Text>
                </View>
              </View>
            </View>
            
            {(job.companyLogo || job.image) && (
              <View style={styles.companyLogoContainer}>
                <RichMedia
                  type="image"
                  source={job.companyLogo || job.image || ''}
                  style={styles.companyLogo}
                />
              </View>
            )}
          </View>

          {/* Job Stats */}
          <View style={styles.jobStats}>
            <View style={styles.statItem}>
              <IconContainer size={40} backgroundColor={Colors.light.primary}>
                {(() => {
                  const category = job.category || job.skills?.[0] || 'general';
                  const IconComponent = JobCategoryIcons[category as keyof typeof JobCategoryIcons];
                  return <IconComponent size={20} color={Colors.light.background} />;
                })()}
              </IconContainer>
              <Text style={styles.statLabel}>Category</Text>
              <Text style={styles.statValue}>{job.category || job.skills?.[0] || 'General'}</Text>
            </View>
            
            <View style={styles.statItem}>
              <IconContainer size={40} backgroundColor={Colors.light.success}>
                <ActionIcons.money size={20} color={Colors.light.background} />
              </IconContainer>
              <Text style={styles.statLabel}>Pay</Text>
              <Text style={styles.statValue}>{job.pay || job.salary}</Text>
            </View>
            
            <View style={styles.statItem}>
              <IconContainer size={40} backgroundColor={Colors.light.warning}>
                <ActionIcons.time size={20} color={Colors.light.background} />
              </IconContainer>
              <Text style={styles.statLabel}>Duration</Text>
              <Text style={styles.statValue}>{job.duration}</Text>
            </View>
          </View>

          {/* Urgent Badge */}
          {(job.urgent || job.urgency === 'urgent' || job.urgency === 'high') && (
            <View style={styles.urgentBadge}>
              <ActionIcons.urgent size={16} color={Colors.light.background} />
              <Text style={styles.urgentText}>Urgent</Text>
            </View>
          )}

          {/* Job Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Job Description</Text>
            <Text style={styles.description}>{job.description}</Text>
          </View>

          {/* Requirements */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Requirements</Text>
            {(job.requirements && job.requirements.length > 0) ? (
              job.requirements.map((req: string, index: number) => (
                <View key={index} style={styles.listItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.listText}>{req}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noDataText}>No specific requirements listed</Text>
            )}
          </View>

          {/* Benefits */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Benefits</Text>
            {(job.benefits && job.benefits.length > 0) ? (
              job.benefits.map((benefit: string, index: number) => (
                <View key={index} style={styles.listItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.listText}>{benefit}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noDataText}>No benefits listed</Text>
            )}
          </View>

          {/* Skills */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Required Skills</Text>
            <View style={styles.skillsContainer}>
              {job.skills && Array.isArray(job.skills) ? job.skills.map((skill: string, index: number) => (
                <View key={index} style={styles.skillTag}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              )) : (
                <Text style={styles.noDataText}>No skills listed</Text>
              )}
            </View>
          </View>

          {/* Job Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Job Details</Text>
            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Experience Required</Text>
                <Text style={styles.detailValue}>{job.experience || 'Not specified'}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Job Type</Text>
                <Text style={styles.detailValue}>{job.jobType || job.workType}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Posted Date</Text>
                <Text style={styles.detailValue}>{job.postedDate || new Date(job.createdAt).toLocaleDateString()}</Text>
              </View>
              {job.deadline && (
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Application Deadline</Text>
                  <Text style={styles.detailValue}>{job.deadline}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Employer Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Employer Information</Text>
            <View style={styles.employerCard}>
              <Text style={styles.employerName}>{job.employerName}</Text>
              <Text style={styles.employerCompany}>{job.company || job.employerName}</Text>
              <Text style={styles.employerEmail}>{job.employerEmail}</Text>
              {job.employerPhone && (
                <Text style={styles.employerPhone}>{job.employerPhone}</Text>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity 
          style={styles.contactButton}
          onPress={handleContactEmployer}
        >
          <ActionIcons.message size={20} color={Colors.light.primary} />
          <Text style={styles.contactButtonText}>Contact</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.applyButton, hasApplied && styles.appliedButton]}
          onPress={handleApply}
          disabled={hasApplied}
        >
          <LinearGradient
            colors={hasApplied ? [Colors.light.success, Colors.light.success] : [Colors.light.primary, Colors.light.primaryLight]}
            style={styles.applyButtonGradient}
          >
            {hasApplied ? (
              <>
                <ActionIcons.success size={20} color={Colors.light.background} />
                <Text style={styles.applyButtonText}>Applied</Text>
              </>
            ) : (
              <>
                <ActionIcons.apply size={20} color={Colors.light.background} />
                <Text style={styles.applyButtonText}>Apply Now</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  errorText: {
    fontSize: 18,
    color: Colors.light.text,
    marginBottom: Spacing.lg,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  backButton: {
    padding: Spacing.sm,
  },
  backButtonText: {
    fontSize: Typography.body.fontSize,
    color: Colors.light.text,
    fontWeight: Typography.body.fontWeight,
  },
  shareButton: {
    padding: Spacing.sm,
  },
  mediaContainer: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  jobImage: {
    borderRadius: BorderRadius.lg,
  },
  content: {
    paddingHorizontal: Spacing.lg,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  titleSection: {
    flex: 1,
    marginRight: Spacing.md,
  },
  jobTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: Spacing.sm,
    lineHeight: 32,
  },
  companySection: {
    marginBottom: Spacing.sm,
  },
  companyName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.primary,
    marginBottom: Spacing.xs,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  locationText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  companyLogoContainer: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  companyLogo: {
    width: '100%',
    height: '100%',
  },
  jobStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing.lg,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginTop: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
    textAlign: 'center',
  },
  urgentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.error,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
    marginBottom: Spacing.lg,
    gap: Spacing.xs,
  },
  urgentText: {
    color: Colors.light.background,
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: Spacing.md,
  },
  description: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    lineHeight: 24,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  bullet: {
    fontSize: 16,
    color: Colors.light.primary,
    marginRight: Spacing.sm,
    marginTop: 2,
  },
  listText: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    lineHeight: 24,
    flex: 1,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  skillTag: {
    backgroundColor: Colors.light.primary + '20',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  skillText: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: '500',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  detailItem: {
    width: '48%',
    backgroundColor: Colors.light.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  detailLabel: {
    fontSize: 12,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.xs,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
  },
  employerCard: {
    backgroundColor: Colors.light.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  employerName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: Spacing.xs,
  },
  employerCompany: {
    fontSize: 14,
    color: Colors.light.primary,
    marginBottom: Spacing.sm,
  },
  employerEmail: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.xs,
  },
  employerPhone: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  actionContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.light.background,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    gap: Spacing.md,
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.primary,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.primary,
  },
  applyButton: {
    flex: 2,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  appliedButton: {
    opacity: 0.7,
  },
  applyButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.background,
  },
  noDataText: {
    ...Typography.body,
    color: Colors.light.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
});
