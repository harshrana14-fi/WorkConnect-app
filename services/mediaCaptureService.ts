/**
 * Media Capture Service - Handles image picker and video recording capabilities
 */

import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { Alert, Platform } from 'react-native';

export interface MediaCaptureOptions {
  allowsEditing?: boolean;
  quality?: number;
  aspect?: [number, number];
  videoMaxDuration?: number;
  videoQuality?: ImagePicker.UIImagePickerControllerQualityType;
}

export interface CapturedMedia {
  uri: string;
  type: 'image' | 'video';
  width?: number;
  height?: number;
  duration?: number;
  size?: number;
}

class MediaCaptureService {
  private async requestPermissions(): Promise<boolean> {
    try {
      // Request camera permissions
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      if (cameraPermission.status !== 'granted') {
        Alert.alert(
          'Camera Permission Required',
          'Please allow camera access to take photos and record videos.',
          [{ text: 'OK' }]
        );
        return false;
      }

      // Request media library permissions
      const mediaPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (mediaPermission.status !== 'granted') {
        Alert.alert(
          'Media Library Permission Required',
          'Please allow media library access to save photos and videos.',
          [{ text: 'OK' }]
        );
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return false;
    }
  }

  // Fallback method - simplest possible image picker
  async pickImageSimple(): Promise<string | null> {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        return result.assets[0].uri;
      }

      return null;
    } catch (error) {
      console.error('Simple image picker error:', error);
      return null;
    }
  }

  // Simple image picker method for quick use
  async pickImage(): Promise<CapturedMedia | null> {
    try {
      // Request permissions first
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please allow access to your photo library to select images.',
          [{ text: 'OK' }]
        );
        return null;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        return {
          uri: asset.uri,
          type: 'image',
          width: asset.width,
          height: asset.height,
          size: asset.fileSize,
        };
      }

      return null;
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
      return null;
    }
  }

  // Simple camera capture method
  async captureImage(): Promise<CapturedMedia | null> {
    try {
      // Request camera permissions first
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please allow access to your camera to take photos.',
          [{ text: 'OK' }]
        );
        return null;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        return {
          uri: asset.uri,
          type: 'image',
          width: asset.width,
          height: asset.height,
          size: asset.fileSize,
        };
      }

      return null;
    } catch (error) {
      console.error('Error capturing image:', error);
      Alert.alert('Error', 'Failed to capture image. Please try again.');
      return null;
    }
  }

  async pickImageFromGallery(options: MediaCaptureOptions = {}): Promise<CapturedMedia | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return null;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: options.allowsEditing ?? true,
        aspect: options.aspect ?? [1, 1],
        quality: options.quality ?? 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        return {
          uri: asset.uri,
          type: 'image',
          width: asset.width,
          height: asset.height,
          size: asset.fileSize,
        };
      }

      return null;
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
      return null;
    }
  }

  async recordVideo(options: MediaCaptureOptions = {}): Promise<CapturedMedia | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return null;

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: options.allowsEditing ?? true,
        videoMaxDuration: options.videoMaxDuration ?? 60,
        videoQuality: options.videoQuality ?? ImagePicker.UIImagePickerControllerQualityType.Medium,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        return {
          uri: asset.uri,
          type: 'video',
          width: asset.width,
          height: asset.height,
          duration: asset.duration,
          size: asset.fileSize,
        };
      }

      return null;
    } catch (error) {
      console.error('Error recording video:', error);
      Alert.alert('Error', 'Failed to record video. Please try again.');
      return null;
    }
  }

  async pickVideoFromGallery(options: MediaCaptureOptions = {}): Promise<CapturedMedia | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return null;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: options.allowsEditing ?? true,
        videoMaxDuration: options.videoMaxDuration ?? 60,
        videoQuality: options.videoQuality ?? ImagePicker.UIImagePickerControllerQualityType.Medium,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        return {
          uri: asset.uri,
          type: 'video',
          width: asset.width,
          height: asset.height,
          duration: asset.duration,
          size: asset.fileSize,
        };
      }

      return null;
    } catch (error) {
      console.error('Error picking video:', error);
      Alert.alert('Error', 'Failed to pick video. Please try again.');
      return null;
    }
  }

  async showMediaPicker(): Promise<CapturedMedia | null> {
    return new Promise((resolve) => {
      Alert.alert(
        'Select Media',
        'Choose how you want to add media to your profile',
        [
          {
            text: 'Take Photo',
            onPress: async () => {
              const result = await this.captureImage();
              resolve(result);
            },
          },
          {
            text: 'Choose from Gallery',
            onPress: async () => {
              const result = await this.pickImageFromGallery();
              resolve(result);
            },
          },
          {
            text: 'Record Video',
            onPress: async () => {
              const result = await this.recordVideo();
              resolve(result);
            },
          },
          {
            text: 'Choose Video',
            onPress: async () => {
              const result = await this.pickVideoFromGallery();
              resolve(result);
            },
          },
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => resolve(null),
          },
        ]
      );
    });
  }

  async saveToGallery(uri: string, type: 'image' | 'video'): Promise<boolean> {
    try {
      const hasPermission = await MediaLibrary.requestPermissionsAsync();
      if (hasPermission.status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please allow media library access to save the file.',
          [{ text: 'OK' }]
        );
        return false;
      }

      const asset = await MediaLibrary.createAssetAsync(uri);
      
      if (asset) {
        Alert.alert('Success', `${type === 'image' ? 'Photo' : 'Video'} saved to gallery!`);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error saving to gallery:', error);
      Alert.alert('Error', 'Failed to save to gallery. Please try again.');
      return false;
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    if (minutes > 0) {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    return `${remainingSeconds}s`;
  }
}

export const mediaCaptureService = new MediaCaptureService();
export default mediaCaptureService;
