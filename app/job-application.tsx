/**
 * Job Application Form - Form for applying to jobs
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ActionIcons, 
  IconContainer 
} from '@/components/ui/ProfessionalIcons';
import { jobService, JobPost } from '@/services/jobService';
import { isTablet, isLandscape, getResponsiveSpacing, getGridColumns, getCardWidth, getSafeAreaPadding } from '@/utils/responsive';

const { width } = Dimensions.get('window');

export default function JobApplicationScreen() {
  const { user } = useAuth();
  const { jobId } = useLocalSearchParams<{ jobId: string }>();
  const [job, setJob] = useState<JobPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    coverLetter: '',
    experience: '',
    availability: '',
    expectedPay: '',
    additionalInfo: '',
  });

  React.useEffect(() => {
    if (jobId) {
      const jobData = jobService.getJobById(jobId);
      setJob(jobData || null);
      setLoading(false);
    }
  }, [jobId]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!user || !job) return;

    // Validation
    if (!formData.coverLetter.trim()) {
      Alert.alert('Required Field', 'Please write a cover letter.');
      return;
    }

    if (!formData.experience.trim()) {
      Alert.alert('Required Field', 'Please describe your experience.');
      return;
    }

    if (!formData.availability.trim()) {
      Alert.alert('Required Field', 'Please specify your availability.');
      return;
    }

    setSubmitting(true);

    try {
      // Create application
      const application = await jobService.applyForJob({
        jobId: job.id,
        jobTitle: job.title,
        applicantId: user.id,
        applicantName: user.name || 'Unknown',
        applicantEmail: user.email || '',
        applicantPhone: user.phone || '',
        applicantSkills: formData.experience, // Using experience as skills for now
        applicantExperience: formData.experience,
        applicantImage: user.profileImage || '',
        status: 'pending',
        message: formData.coverLetter,
      });

      if (application) {
        Alert.alert(
          'Application Submitted!',
          'Your application has been submitted successfully. The employer will review it and get back to you.',
          [
            {
              text: 'OK',
              onPress: () => {
                router.back();
                router.back(); // Go back to job details, then back to explore
              }
            }
          ]
        );
      } else {
        Alert.alert('Error', 'Failed to submit application. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading application form...</Text>
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
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor={Colors.light.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ActionIcons.arrow_left size={24} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Apply for Job</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Job Info */}
        <View style={styles.jobInfo}>
          <Text style={styles.jobTitle}>{job.title}</Text>
          <Text style={styles.companyName}>{job.company}</Text>
          <View style={styles.jobDetails}>
            <View style={styles.detailItem}>
              <ActionIcons.location size={16} color={Colors.light.textSecondary} />
              <Text style={styles.detailText}>{job.location}</Text>
            </View>
            <View style={styles.detailItem}>
              <ActionIcons.money size={16} color={Colors.light.textSecondary} />
              <Text style={styles.detailText}>{job.pay}</Text>
            </View>
          </View>
        </View>

        {/* Application Form */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Application Details</Text>

          {/* Cover Letter */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Cover Letter *</Text>
            <TextInput
              style={[styles.textArea, styles.required]}
              placeholder="Tell the employer why you're the right fit for this job..."
              placeholderTextColor={Colors.light.textLight}
              value={formData.coverLetter}
              onChangeText={(value) => handleInputChange('coverLetter', value)}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>

          {/* Experience */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Your Experience *</Text>
            <TextInput
              style={[styles.textArea, styles.required]}
              placeholder="Describe your relevant work experience..."
              placeholderTextColor={Colors.light.textLight}
              value={formData.experience}
              onChangeText={(value) => handleInputChange('experience', value)}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Availability */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Availability *</Text>
            <TextInput
              style={[styles.textInput, styles.required]}
              placeholder="When can you start? (e.g., Immediately, 2 weeks notice)"
              placeholderTextColor={Colors.light.textLight}
              value={formData.availability}
              onChangeText={(value) => handleInputChange('availability', value)}
            />
          </View>

          {/* Expected Pay */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Expected Pay (Optional)</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Your expected salary/rate"
              placeholderTextColor={Colors.light.textLight}
              value={formData.expectedPay}
              onChangeText={(value) => handleInputChange('expectedPay', value)}
              keyboardType="numeric"
            />
          </View>

          {/* Additional Information */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Additional Information</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Any additional information you'd like to share..."
              placeholderTextColor={Colors.light.textLight}
              value={formData.additionalInfo}
              onChangeText={(value) => handleInputChange('additionalInfo', value)}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* User Info Display */}
          <View style={styles.userInfo}>
            <Text style={styles.userInfoTitle}>Your Information</Text>
            <View style={styles.userInfoItem}>
              <Text style={styles.userInfoLabel}>Name:</Text>
              <Text style={styles.userInfoValue}>{user?.name || 'Not provided'}</Text>
            </View>
            <View style={styles.userInfoItem}>
              <Text style={styles.userInfoLabel}>Email:</Text>
              <Text style={styles.userInfoValue}>{user?.email || 'Not provided'}</Text>
            </View>
            <View style={styles.userInfoItem}>
              <Text style={styles.userInfoLabel}>Phone:</Text>
              <Text style={styles.userInfoValue}>{user?.phone || 'Not provided'}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.submitContainer}>
        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={submitting}
        >
          <LinearGradient
            colors={[Colors.light.primary, Colors.light.primaryLight]}
            style={styles.submitButtonGradient}
          >
            {submitting ? (
              <>
                <ActionIcons.loading size={20} color={Colors.light.background} />
                <Text style={styles.submitButtonText}>Submitting...</Text>
              </>
            ) : (
              <>
                <ActionIcons.apply size={20} color={Colors.light.background} />
                <Text style={styles.submitButtonText}>Submit Application</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  placeholder: {
    width: 24,
  },
  scrollView: {
    flex: 1,
  },
  jobInfo: {
    backgroundColor: Colors.light.surface,
    padding: Spacing.lg,
    margin: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  jobTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: Spacing.xs,
  },
  companyName: {
    fontSize: 16,
    color: Colors.light.primary,
    marginBottom: Spacing.md,
  },
  jobDetails: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  detailText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  formContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: Spacing.lg,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: Spacing.sm,
  },
  textInput: {
    backgroundColor: Colors.light.surface,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: 16,
    color: Colors.light.text,
  },
  textArea: {
    backgroundColor: Colors.light.surface,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: 16,
    color: Colors.light.text,
    minHeight: 100,
  },
  required: {
    borderColor: Colors.light.primary,
  },
  userInfo: {
    backgroundColor: Colors.light.surface,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.md,
  },
  userInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: Spacing.md,
  },
  userInfoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  userInfoLabel: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  userInfoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.text,
  },
  submitContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.light.background,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  submitButton: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  submitButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.background,
  },
});
