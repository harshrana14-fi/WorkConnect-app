import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import ScreenWrapper from '@/components/ScreenWrapper';
import { ActionIcons, IconContainer } from '@/components/ui/ProfessionalIcons';
import { mediaCaptureService } from '@/services/mediaCaptureService';
import { jobService } from '@/services/jobService';

export default function CreateJobScreen() {
  const { user } = useAuth();
  const { t } = useLanguage();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    salary: '',
    duration: '',
    skills: '',
    workType: 'full-time',
    urgency: 'normal',
    image: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImagePicker = async () => {
    try {
      console.log('Starting image picker...');
      
      // Import ImagePicker directly (same as profile.tsx)
      const ImagePicker = await import('expo-image-picker');
      
      // Request permissions first (same as profile.tsx)
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert(
          'Permission Required',
          'Please allow access to your photo library to select images.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Launch image picker with NO options (same as profile.tsx)
      const result = await ImagePicker.launchImageLibraryAsync();

      console.log('Image picker result:', result);

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        setFormData(prev => ({ ...prev, image: asset.uri }));
        console.log('Image selected successfully:', asset.uri);
        Alert.alert('Success', 'Image selected successfully!');
      } else {
        console.log('No image selected or picker was cancelled');
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', `Failed to pick image: ${error.message || 'Unknown error'}`);
    }
  };

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!formData.title || !formData.description || !formData.location || !formData.salary) {
        Alert.alert('Missing Information', 'Please fill in all required fields (Title, Description, Location, Salary).');
        return;
      }

      if (!user || user.role !== 'employer') {
        Alert.alert('Access Denied', 'Only employers can create job posts.');
        return;
      }

      setIsLoading(true);
      
      // Create job post using the job service
      const jobData = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        salary: formData.salary,
        duration: formData.duration,
        skills: formData.skills ? formData.skills.split(',').map(s => s.trim()) : [],
        workType: formData.workType as 'full-time' | 'part-time' | 'contract' | 'freelance',
        urgency: formData.urgency as 'low' | 'normal' | 'high' | 'urgent',
        status: 'active' as const,
        employerId: user.id,
        employerName: user.name,
        employerEmail: user.email,
        employerPhone: user.phone,
        image: formData.image,
        company: user.organizationName || user.name,
        category: formData.skills ? formData.skills.split(',')[0].trim() : 'general',
        pay: formData.salary,
      };

      console.log('Creating job post:', jobData);
      
      const createdJob = await jobService.createJobPost(jobData);
      
      if (createdJob) {
        Alert.alert('Success', 'Job post created successfully!', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } else {
        Alert.alert('Error', 'Failed to create job post. Please try again.');
      }
      
    } catch (error) {
      console.error('Error creating job post:', error);
      Alert.alert('Error', 'Failed to create job post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderInputField = (label: string, field: string, placeholder: string, required: boolean = false, multiline: boolean = false) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      <TextInput
        style={[styles.input, multiline && styles.multilineInput]}
        placeholder={placeholder}
        value={formData[field as keyof typeof formData]}
        onChangeText={(value) => handleInputChange(field, value)}
        placeholderTextColor={Colors.light.textLight}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
      />
    </View>
  );

  const renderSelectField = (label: string, field: string, options: { value: string; label: string }[]) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.selectContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.selectOption,
              formData[field as keyof typeof formData] === option.value && styles.selectedOption
            ]}
            onPress={() => handleInputChange(field, option.value)}
          >
            <Text style={[
              styles.selectOptionText,
              formData[field as keyof typeof formData] === option.value && styles.selectedOptionText
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <ScreenWrapper title="Create Job">
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <ActionIcons.arrow_left size={24} color={Colors.light.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create Job Post</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {renderInputField('Job Title', 'title', 'e.g., Senior Electrician', true)}
            {renderInputField('Job Description', 'description', 'Describe the job requirements, responsibilities, and what you\'re looking for...', true, true)}
            {renderInputField('Location', 'location', 'e.g., Mumbai, Maharashtra', true)}
            {renderInputField('Salary', 'salary', 'e.g., ₹500-800 per day', true)}
            {renderInputField('Duration', 'duration', 'e.g., 1 week, 2 months', false)}
            {renderInputField('Required Skills', 'skills', 'e.g., Electrical work, Safety training', false)}

            {renderSelectField('Work Type', 'workType', [
              { value: 'full-time', label: 'Full Time' },
              { value: 'part-time', label: 'Part Time' },
              { value: 'contract', label: 'Contract' },
              { value: 'freelance', label: 'Freelance' },
            ])}

            {renderSelectField('Urgency', 'urgency', [
              { value: 'low', label: 'Low' },
              { value: 'normal', label: 'Normal' },
              { value: 'high', label: 'High' },
              { value: 'urgent', label: 'Urgent' },
            ])}

            {/* Image Upload */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Job Image (Optional)</Text>
              <View style={styles.imageUploadContainer}>
                <TouchableOpacity style={styles.imageUploadButton} onPress={handleImagePicker}>
                  {formData.image ? (
                    <Image source={{ uri: formData.image }} style={styles.uploadedImage} />
                  ) : (
                    <View style={styles.imageUploadContent}>
                      <IconContainer size={40} backgroundColor={Colors.light.primary}>
                        <ActionIcons.camera size={20} color={Colors.light.background} />
                      </IconContainer>
                      <Text style={styles.imageUploadText}>Tap to add image</Text>
                    </View>
                  )}
                </TouchableOpacity>
                {formData.image && (
                  <TouchableOpacity 
                    style={styles.removeImageButton} 
                    onPress={() => setFormData(prev => ({ ...prev, image: '' }))}
                  >
                    <Text style={styles.removeImageText}>Remove</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              <LinearGradient
                colors={[Colors.light.primary, Colors.light.secondary]}
                style={styles.submitButtonGradient}
              >
                <Text style={styles.submitButtonText}>
                  {isLoading ? 'Creating Job Post...' : 'Create Job Post'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollView: {
    flex: 1,
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
  formContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  inputContainer: {
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    fontSize: Typography.small.fontSize,
    fontWeight: Typography.small.fontWeight,
    color: Colors.light.text,
    marginBottom: Spacing.sm,
  },
  required: {
    color: Colors.light.error,
  },
  input: {
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: Typography.body.fontSize,
    color: Colors.light.text,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  selectContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  selectOption: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.card,
  },
  selectedOption: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  selectOptionText: {
    fontSize: Typography.small.fontSize,
    color: Colors.light.text,
  },
  selectedOptionText: {
    color: Colors.light.background,
    fontWeight: Typography.small.fontWeight,
  },
  imageUploadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  imageUploadButton: {
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderStyle: 'dashed',
    minHeight: 120,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageUploadContent: {
    alignItems: 'center',
  },
  imageUploadText: {
    fontSize: Typography.small.fontSize,
    color: Colors.light.textSecondary,
    marginTop: Spacing.sm,
  },
  uploadedImage: {
    width: '100%',
    height: 120,
    borderRadius: BorderRadius.md,
  },
  removeImageButton: {
    backgroundColor: Colors.light.error,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  removeImageText: {
    color: Colors.light.background,
    fontSize: Typography.small.fontSize,
    fontWeight: Typography.small.fontWeight,
  },
  submitButton: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginTop: Spacing.lg,
  },
  submitButtonGradient: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: Typography.body.fontSize,
    fontWeight: Typography.body.fontWeight,
    color: Colors.light.background,
  },
});
