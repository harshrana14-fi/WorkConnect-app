/**
 * Video Showcase Component - Displays worker video showcases and job previews
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { MediaIcons, IconContainer } from './ProfessionalIcons';

const { width } = Dimensions.get('window');

interface VideoShowcaseProps {
  videoUrl: string;
  thumbnailUrl?: string;
  title: string;
  description?: string;
  duration?: string;
  workerName?: string;
  workerTitle?: string;
  workerImage?: string;
  onPress?: () => void;
  style?: any;
}

export const VideoShowcase: React.FC<VideoShowcaseProps> = ({
  videoUrl,
  thumbnailUrl,
  title,
  description,
  duration,
  workerName,
  workerTitle,
  workerImage,
  onPress,
  style,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<Video>(null);

  const handleVideoPress = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
        setIsPlaying(false);
      } else {
        await videoRef.current.playAsync();
        setIsPlaying(true);
      }
    }
    onPress?.();
  };

  const handleVideoError = () => {
    setHasError(true);
    setIsLoading(false);
    Alert.alert('Video Error', 'Unable to load video. Please try again later.');
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={handleVideoPress}
      activeOpacity={0.9}
    >
      <View style={styles.videoContainer}>
        <Video
          ref={videoRef}
          source={{ uri: videoUrl }}
          style={styles.video}
          resizeMode={ResizeMode.COVER}
          shouldPlay={isPlaying}
          isLooping={false}
          isMuted={true}
          onLoad={() => setIsLoading(false)}
          onError={handleVideoError}
        />
        
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.light.primary} />
            <Text style={styles.loadingText}>Loading video...</Text>
          </View>
        )}
        
        {hasError && (
          <View style={styles.errorContainer}>
            <MediaIcons.video size={48} color={Colors.light.textLight} />
            <Text style={styles.errorText}>Video unavailable</Text>
          </View>
        )}
        
        {!isPlaying && !hasError && (
          <View style={styles.playButtonContainer}>
            <IconContainer
              backgroundColor="rgba(0,0,0,0.7)"
              size={80}
              borderRadius={40}
            >
              <MediaIcons.play size={40} color={Colors.light.background} />
            </IconContainer>
          </View>
        )}
        
        {duration && (
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{duration}</Text>
          </View>
        )}
        
        {/* Worker Info Overlay */}
        {workerName && (
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.workerInfoOverlay}
          >
            <View style={styles.workerInfo}>
              {workerImage && (
                <View style={styles.workerAvatar}>
                  <Text style={styles.workerInitials}>
                    {workerName.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </Text>
                </View>
              )}
              <View style={styles.workerDetails}>
                <Text style={styles.workerName}>{workerName}</Text>
                {workerTitle && (
                  <Text style={styles.workerTitle}>{workerTitle}</Text>
                )}
              </View>
            </View>
          </LinearGradient>
        )}
      </View>
      
      {/* Content Section */}
      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        
        {description && (
          <Text style={styles.description} numberOfLines={3}>
            {description}
          </Text>
        )}
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <MediaIcons.video size={16} color={Colors.light.textLight} />
            <Text style={styles.statText}>Job Preview</Text>
          </View>
          
          <View style={styles.statItem}>
            <MediaIcons.gallery size={16} color={Colors.light.textLight} />
            <Text style={styles.statText}>Portfolio</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Video Gallery Component
interface VideoGalleryProps {
  videos: {
    id: string;
    title: string;
    videoUrl: string;
    thumbnailUrl?: string;
    duration?: string;
    workerName?: string;
    workerTitle?: string;
  }[];
  onVideoPress?: (videoId: string) => void;
  maxDisplay?: number;
  style?: any;
}

export const VideoGallery: React.FC<VideoGalleryProps> = ({
  videos,
  onVideoPress,
  maxDisplay = 2,
  style,
}) => {
  const displayVideos = videos.slice(0, maxDisplay);
  const remainingCount = videos.length - maxDisplay;

  return (
    <View style={[styles.galleryContainer, style]}>
      {displayVideos.map((video, index) => (
        <VideoShowcase
          key={video.id}
          videoUrl={video.videoUrl}
          thumbnailUrl={video.thumbnailUrl}
          title={video.title}
          duration={video.duration}
          workerName={video.workerName}
          workerTitle={video.workerTitle}
          onPress={() => onVideoPress?.(video.id)}
          style={[
            styles.galleryItem,
            index === 0 && styles.firstGalleryItem,
            index === maxDisplay - 1 && remainingCount > 0 && styles.lastGalleryItem,
          ]}
        />
      ))}
      
      {remainingCount > 0 && (
        <TouchableOpacity
          style={[styles.remainingItem, styles.lastGalleryItem]}
          onPress={() => onVideoPress?.('more')}
          activeOpacity={0.8}
        >
          <View style={styles.remainingOverlay}>
            <MediaIcons.video size={32} color={Colors.light.background} />
            <Text style={styles.remainingText}>+{remainingCount}</Text>
            <Text style={styles.remainingSubtext}>More Videos</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.background,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    shadowColor: Colors.light.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  videoContainer: {
    position: 'relative',
    aspectRatio: 16 / 9,
    backgroundColor: Colors.light.surface,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
  },
  loadingText: {
    marginTop: Spacing.sm,
    color: Colors.light.textLight,
    fontSize: 14,
  },
  errorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
  },
  errorText: {
    marginTop: Spacing.sm,
    color: Colors.light.textLight,
    fontSize: 14,
  },
  playButtonContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -40 }, { translateY: -40 }],
  },
  durationBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  durationText: {
    color: Colors.light.background,
    fontSize: 12,
    fontWeight: '600',
  },
  workerInfoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.md,
  },
  workerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  workerInitials: {
    color: Colors.light.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  workerDetails: {
    flex: 1,
  },
  workerName: {
    color: Colors.light.background,
    fontSize: 16,
    fontWeight: '600',
  },
  workerTitle: {
    color: Colors.light.background,
    fontSize: 14,
    opacity: 0.9,
  },
  contentContainer: {
    padding: Spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: Spacing.sm,
  },
  description: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statText: {
    fontSize: 12,
    color: Colors.light.textLight,
  },
  galleryContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  galleryItem: {
    flex: 1,
  },
  firstGalleryItem: {
    borderTopLeftRadius: BorderRadius.lg,
    borderBottomLeftRadius: BorderRadius.lg,
  },
  lastGalleryItem: {
    borderTopRightRadius: BorderRadius.lg,
    borderBottomRightRadius: BorderRadius.lg,
  },
  remainingItem: {
    flex: 1,
    aspectRatio: 16 / 9,
    backgroundColor: Colors.light.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  remainingOverlay: {
    alignItems: 'center',
  },
  remainingText: {
    color: Colors.light.background,
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: Spacing.sm,
  },
  remainingSubtext: {
    color: Colors.light.background,
    fontSize: 12,
    marginTop: Spacing.xs,
  },
});

export default VideoShowcase;
