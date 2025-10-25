import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import ScreenWrapper from '@/components/ScreenWrapper';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');

// TODO: Replace with actual data from API
const userData = null;
const jobHistory: any[] = [];
const skills: any[] = [];

export default function ProfileScreen() {
  const { user, updateProfile, uploadProfileImage, logout } = useAuth();
  const { language, setLanguage, t, isInitialized } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(user);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  // Update editData when user changes
  React.useEffect(() => {
    if (user) {
      setEditData(user);
    }
  }, [user]);

  const handleEdit = () => {
    if (user) {
      setEditData({ ...user }); // Create a copy of user data
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    try {
      console.log('=== PROFILE SAVE DEBUG ===');
      console.log('Current user:', user);
      console.log('Edit data:', editData);
      console.log('User ID:', user?.id);
      console.log('User email:', user?.email);
      
      if (!editData || !user) {
        Alert.alert('Error', 'No data to save');
        return;
      }
      
      console.log('Saving profile with data:', editData);
      const success = await updateProfile(editData);
      
      if (success) {
        setIsEditing(false);
        Alert.alert('Success', 'Profile updated successfully!');
      } else {
        console.error('Profile update failed');
        Alert.alert('Error', 'Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      Alert.alert('Error', `An error occurred while updating profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (user) {
      setEditData({ ...user }); // Reset to current user data
    }
  };

  const handleLogout = () => {
    Alert.alert(
      t('auth.logout'),
      t('auth.logout_confirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { 
          text: t('auth.logout'), 
          style: 'destructive',
          onPress: logout
        },
      ]
    );
  };

  const handleImagePicker = () => {
    const options = [
      {
        text: 'Camera',
        onPress: () => handleCameraCapture(),
      },
      {
        text: 'Photo Library',
        onPress: () => handlePhotoLibrary(),
      },
    ];

    // Add remove option only if user has a profile image
    if (user?.profileImage) {
      options.push({
        text: 'Remove Photo',
        onPress: () => handleRemovePhoto(),
      });
    }

    options.push({
      text: 'Cancel',
      onPress: async () => {},
    });

    Alert.alert(
      'Update Profile Photo',
      'Choose how you want to update your profile photo',
      options
    );
  };

  const handleRemovePhoto = async () => {
    try {
      const success = await uploadProfileImage(''); // Empty string removes the image
      if (success) {
        Alert.alert(
          'Success', 
          'Profile photo removed successfully!',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Error', 
          'Failed to remove profile photo. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Remove photo error:', error);
      Alert.alert(
        'Error', 
        'Failed to remove profile photo. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleCameraCapture = async () => {
    try {
      // Request camera permissions
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      
      if (cameraPermission.granted === false) {
        Alert.alert(
          'Permission Required',
          'Please allow camera access to take a profile photo.',
          [{ text: 'OK' }]
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync();

      if (!result.canceled && result.assets[0]) {
        await uploadImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert(
        'Error', 
        'Failed to take photo. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handlePhotoLibrary = async () => {
    try {
      // Request photo library permissions
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert(
          'Permission Required',
          'Please allow access to your photo library to upload a profile image.',
          [{ text: 'OK' }]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync();

      if (!result.canceled && result.assets[0]) {
        await uploadImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Photo library error:', error);
        Alert.alert(
          'Error', 
          `Failed to pick image: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
          [{ text: 'OK' }]
        );
    }
  };

  const uploadImage = async (imageUri: string) => {
    try {
      const success = await uploadProfileImage(imageUri);
      if (success) {
        Alert.alert(
          'Success', 
          'Profile image updated successfully!',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Error', 
          'Failed to update profile image. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert(
        'Error', 
        'Failed to upload image. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const renderProfileHeader = () => (
    <LinearGradient
      colors={[Colors.light.primary, '#1a4d80']}
      style={styles.profileHeader}
    >
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          {user?.profileImage ? (
            <Image 
              source={{ uri: user.profileImage }} 
              style={styles.avatarImage}
              onError={() => {
                // Fallback to initials if image fails to load
                console.log('Image failed to load, using initials');
              }}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
               <Text style={styles.avatarText}>
                 {(user?.name || 'User').split(' ').map(n => n[0]).join('')}
               </Text>
            </View>
          )}
        </View>
        <TouchableOpacity 
          style={styles.editAvatarButton} 
          onPress={handleImagePicker}
          activeOpacity={0.7}
        >
          <Text style={styles.editAvatarText}>📷</Text>
        </TouchableOpacity>
      </View>

       <Text style={styles.userName}>{user?.name || 'User'}</Text>
       <Text style={styles.userRole}>{user?.role || 'worker'} • {user?.skillType || 'General'}</Text>
      
      <View style={styles.userStats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{user?.rating || 0}</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{user?.totalJobs || 0}</Text>
          <Text style={styles.statLabel}>Jobs Done</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>₹{user?.totalEarnings || 0}</Text>
          <Text style={styles.statLabel}>Earnings</Text>
        </View>
      </View>
    </LinearGradient>
  );

  const renderPersonalInfo = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{t('profile.personal_info')}</Text>
        <TouchableOpacity onPress={handleEdit}>
          <Text style={styles.editButtonText}>
            {isEditing ? t('common.cancel') : t('common.edit')}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>{t('auth.name')}</Text>
          {isEditing ? (
              <TextInput
                style={styles.infoInput}
                value={editData?.name || ''}
                onChangeText={(value) => setEditData(prev => prev ? { ...prev, name: value } : null)}
              />
          ) : (
            <Text style={styles.infoValue}>{user?.name || 'User'}</Text>
          )}
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>{t('auth.email')}</Text>
          {isEditing ? (
              <TextInput
                style={styles.infoInput}
                value={editData?.email || ''}
                onChangeText={(value) => setEditData(prev => prev ? { ...prev, email: value } : null)}
                keyboardType="email-address"
              />
          ) : (
            <Text style={styles.infoValue}>{user?.email || 'No email'}</Text>
          )}
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>{t('auth.phone')}</Text>
          {isEditing ? (
              <TextInput
                style={styles.infoInput}
                value={editData?.phone || ''}
                onChangeText={(value) => setEditData(prev => prev ? { ...prev, phone: value } : null)}
                keyboardType="phone-pad"
              />
          ) : (
            <Text style={styles.infoValue}>{user?.phone || 'No phone'}</Text>
          )}
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>{t('profile.location')}</Text>
          {isEditing ? (
              <TextInput
                style={styles.infoInput}
                value={editData?.location || ''}
                onChangeText={(value) => setEditData(prev => prev ? { ...prev, location: value } : null)}
              />
          ) : (
            <Text style={styles.infoValue}>{user?.location || 'No location'}</Text>
          )}
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>{t('profile.experience')}</Text>
          <Text style={styles.infoValue}>{user?.experience || 'No experience'}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>{t('profile.member_since')}</Text>
          <Text style={styles.infoValue}>{user?.memberSince || 'Recently joined'}</Text>
        </View>
      </View>

      {isEditing && (
        <View style={styles.editActions}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <LinearGradient
              colors={[Colors.light.success, '#2ecc71']}
              style={styles.saveButtonGradient}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderSkills = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{t('profile.skills_expertise')}</Text>
      <View style={styles.skillsContainer}>
        {skills.map((skill, index) => (
          <View key={index} style={styles.skillItem}>
            <View style={styles.skillInfo}>
              <Text style={styles.skillName}>{skill.name}</Text>
              <Text style={styles.skillLevel}>{skill.level}</Text>
            </View>
            <View style={styles.skillProgress}>
              <View 
                style={[
                  styles.skillProgressBar,
                  { 
                    width: skill.level === 'Expert' ? '100%' : 
                          skill.level === 'Advanced' ? '80%' : '60%'
                  }
                ]} 
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderJobHistory = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Recent Job History</Text>
      {jobHistory.map((job) => (
        <View key={job.id} style={styles.jobItem}>
          <View style={styles.jobHeader}>
            <Text style={styles.jobTitle}>{job.title}</Text>
            <Text style={styles.jobAmount}>₹{job.amount}</Text>
          </View>
          <Text style={styles.jobEmployer}>{job.employer}</Text>
          <Text style={styles.jobDate}>{job.date}</Text>
          <View style={styles.jobFooter}>
            <View style={styles.jobStatus}>
              <Text style={styles.jobStatusText}>{job.status}</Text>
            </View>
            <View style={styles.jobRating}>
              <Text style={styles.jobRatingText}>⭐ {job.rating}</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );

  const renderSettings = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{t('profile.settings')}</Text>
      
      <TouchableOpacity 
        style={styles.settingItem}
        onPress={() => {
          Alert.alert(
            t('profile.language_preference'),
            t('profile.select_language'),
            [
              {
                text: t('profile.english'),
                onPress: () => setLanguage('en')
              },
              {
                text: t('profile.hindi'),
                onPress: () => setLanguage('hi')
              },
              { text: t('common.cancel'), style: 'cancel' }
            ]
          );
        }}
      >
        <Text style={styles.settingText}>
          {t('profile.language_preference')}: {language === 'en' ? t('profile.english') : t('profile.hindi')}
        </Text>
        <Text style={styles.settingArrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.settingItem}>
        <Text style={styles.settingText}>{t('notifications.title')}</Text>
        <Text style={styles.settingArrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.settingItem}>
        <Text style={styles.settingText}>{t('profile.privacy_security')}</Text>
        <Text style={styles.settingArrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.settingItem}>
        <Text style={styles.settingText}>{t('profile.help_support')}</Text>
        <Text style={styles.settingArrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.settingItem}>
        <Text style={styles.settingText}>{t('profile.about')}</Text>
        <Text style={styles.settingArrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>{t('auth.logout')}</Text>
      </TouchableOpacity>
    </View>
  );

  if (!isInitialized) {
    return (
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
    );
  }

  return (
    <ScreenWrapper title="nav.profile">
      <View style={styles.container}>
        <LinearGradient
          colors={[Colors.light.background, Colors.light.surface]}
          style={styles.background}
        >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {renderProfileHeader()}
            {renderPersonalInfo()}
            {renderSkills()}
            {renderJobHistory()}
            {renderSettings()}
          </ScrollView>
        </Animated.View>
      </LinearGradient>
    </View>
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
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    padding: Spacing.lg,
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    shadowColor: Colors.light.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  profileStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    ...Typography.h5,
    color: Colors.light.primary,
    fontWeight: '600',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.light.background,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.light.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: {
    ...Typography.h1,
    color: Colors.light.primary,
    fontWeight: 'bold',
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.light.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.light.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editAvatarText: {
    fontSize: 16,
  },
  userName: {
    ...Typography.h2,
    color: Colors.light.background,
    marginBottom: Spacing.xs,
  },
  userRole: {
    ...Typography.body,
    color: Colors.light.background,
    opacity: 0.9,
    marginBottom: Spacing.lg,
  },
  userStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statValue: {
    ...Typography.h3,
    color: Colors.light.background,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.light.background,
    opacity: 0.8,
  },
  section: {
    backgroundColor: Colors.light.background,
    margin: Spacing.lg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    shadowColor: Colors.light.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
  },
  editButtonText: {
    ...Typography.body,
    color: Colors.light.primary,
    fontWeight: '600',
  },
  infoContainer: {
    marginBottom: Spacing.md,
  },
  infoItem: {
    marginBottom: Spacing.md,
  },
  infoLabel: {
    ...Typography.caption,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.xs,
  },
  infoValue: {
    ...Typography.body,
    color: Colors.light.text,
  },
  infoInput: {
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.light.border,
    ...Typography.body,
    color: Colors.light.text,
  },
  editActions: {
    marginTop: Spacing.md,
  },
  saveButton: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  saveButtonGradient: {
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  saveButtonText: {
    ...Typography.body,
    color: Colors.light.background,
    fontWeight: '600',
  },
  skillsContainer: {
    marginTop: Spacing.md,
  },
  skillItem: {
    marginBottom: Spacing.md,
  },
  skillInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  skillName: {
    ...Typography.body,
    color: Colors.light.text,
  },
  skillLevel: {
    ...Typography.caption,
    color: Colors.light.textSecondary,
  },
  skillProgress: {
    height: 4,
    backgroundColor: Colors.light.surface,
    borderRadius: 2,
    overflow: 'hidden',
  },
  skillProgressBar: {
    height: '100%',
    backgroundColor: Colors.light.success,
    borderRadius: 2,
  },
  jobItem: {
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  jobTitle: {
    ...Typography.body,
    color: Colors.light.text,
    flex: 1,
  },
  jobAmount: {
    ...Typography.body,
    color: Colors.light.success,
    fontWeight: 'bold',
  },
  jobEmployer: {
    ...Typography.caption,
    color: Colors.light.textSecondary,
    marginBottom: 2,
  },
  jobDate: {
    ...Typography.caption,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.sm,
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  jobStatus: {
    backgroundColor: Colors.light.success,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  jobStatusText: {
    ...Typography.small,
    color: Colors.light.background,
    fontWeight: '600',
  },
  jobRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  jobRatingText: {
    ...Typography.caption,
    color: Colors.light.textSecondary,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  settingText: {
    ...Typography.body,
    color: Colors.light.text,
  },
  settingArrow: {
    ...Typography.h4,
    color: Colors.light.textSecondary,
  },
  logoutButton: {
    backgroundColor: Colors.light.error,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  logoutButtonText: {
    ...Typography.body,
    color: Colors.light.background,
    fontWeight: '600',
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