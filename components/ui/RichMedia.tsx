import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { MediaIcons, IconContainer } from './ProfessionalIcons';

const { width } = Dimensions.get('window');

interface RichMediaProps {
  type: 'image' | 'video';
  source: string;
  thumbnail?: string;
  title?: string;
  description?: string;
  aspectRatio?: number;
  style?: any;
  onPress?: () => void;
  showPlayButton?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
}

export const RichMedia: React.FC<RichMediaProps> = ({
  type,
  source,
  thumbnail,
  title,
  description,
  aspectRatio = 16 / 9,
  style,
  onPress,
  showPlayButton = true,
  autoPlay = false,
  muted = true,
  loop = false,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const videoRef = useRef<Video>(null);

  const handleImageError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

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

  const renderImage = () => (
    <View style={[styles.mediaContainer, { aspectRatio }, style]}>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
        </View>
      )}
      
      {hasError ? (
        <View style={styles.errorContainer}>
          <MediaIcons.image size={48} color={Colors.light.textLight} />
          <Text style={styles.errorText}>Image unavailable</Text>
        </View>
      ) : (
        <Image
          source={{ uri: source }}
          style={styles.media}
          onLoad={handleImageLoad}
          onError={handleImageError}
          resizeMode="cover"
        />
      )}
      
      {title && (
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.titleOverlay}
        >
          <Text style={styles.titleText} numberOfLines={2}>
            {title}
          </Text>
        </LinearGradient>
      )}
    </View>
  );

  const renderVideo = () => (
    <TouchableOpacity
      style={[styles.mediaContainer, { aspectRatio }, style]}
      onPress={handleVideoPress}
      activeOpacity={0.9}
    >
      <Video
        ref={videoRef}
        source={{ uri: source }}
        style={styles.media}
        resizeMode={ResizeMode.COVER}
        shouldPlay={isPlaying}
        isLooping={loop}
        isMuted={muted}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
      />
      
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
        </View>
      )}
      
      {hasError && (
        <View style={styles.errorContainer}>
          <MediaIcons.video size={48} color={Colors.light.textLight} />
          <Text style={styles.errorText}>Video unavailable</Text>
        </View>
      )}
      
      {showPlayButton && !isPlaying && !hasError && (
        <View style={styles.playButtonContainer}>
          <IconContainer
            backgroundColor="rgba(0,0,0,0.6)"
            size={60}
            borderRadius={30}
          >
            <MediaIcons.play size={32} color={Colors.light.background} />
          </IconContainer>
        </View>
      )}
      
      {title && (
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.titleOverlay}
        >
          <Text style={styles.titleText} numberOfLines={2}>
            {title}
          </Text>
        </LinearGradient>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {type === 'image' ? renderImage() : renderVideo()}
      
      {description && (
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>{description}</Text>
        </View>
      )}
    </View>
  );
};

// Image Gallery Component
interface ImageGalleryProps {
  images: string[];
  onImagePress?: (index: number) => void;
  maxDisplay?: number;
  style?: any;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  onImagePress,
  maxDisplay = 3,
  style,
}) => {
  const displayImages = images.slice(0, maxDisplay);
  const remainingCount = images.length - maxDisplay;

  return (
    <View style={[styles.galleryContainer, style]}>
      {displayImages.map((image, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.galleryItem,
            index === 0 && styles.firstGalleryItem,
            index === maxDisplay - 1 && remainingCount > 0 && styles.lastGalleryItem,
          ]}
          onPress={() => onImagePress?.(index)}
          activeOpacity={0.8}
        >
          <Image
            source={{ uri: image }}
            style={styles.galleryImage}
            resizeMode="cover"
          />
          
          {index === maxDisplay - 1 && remainingCount > 0 && (
            <View style={styles.remainingOverlay}>
              <Text style={styles.remainingText}>+{remainingCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

// Profile Avatar Component
interface ProfileAvatarProps {
  source?: string;
  name?: string;
  size?: number;
  style?: any;
  onPress?: () => void;
  showEditButton?: boolean;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  source,
  name,
  size = 100,
  style,
  onPress,
  showEditButton = false,
}) => {
  const [hasError, setHasError] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <TouchableOpacity
      style={[styles.avatarContainer, { width: size, height: size }, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {source && !hasError ? (
        <Image
          source={{ uri: source }}
          style={[styles.avatarImage, { width: size, height: size, borderRadius: size / 2 }]}
          onError={() => setHasError(true)}
        />
      ) : (
        <View style={[styles.avatarPlaceholder, { width: size, height: size, borderRadius: size / 2 }]}>
          <Text style={[styles.avatarText, { fontSize: size * 0.4 }]}>
            {name ? getInitials(name) : '?'}
          </Text>
        </View>
      )}
      
      {showEditButton && (
        <View style={styles.editButton}>
          <IconContainer
            backgroundColor={Colors.light.secondary}
            size={32}
            borderRadius={16}
          >
            <MediaIcons.camera size={16} color={Colors.light.background} />
          </IconContainer>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  mediaContainer: {
    position: 'relative',
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    shadowColor: Colors.light.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  media: {
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
    fontSize: 12,
  },
  playButtonContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -30 }, { translateY: -30 }],
  },
  titleOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.md,
  },
  titleText: {
    color: Colors.light.background,
    fontSize: 16,
    fontWeight: '600',
  },
  descriptionContainer: {
    padding: Spacing.md,
    backgroundColor: Colors.light.background,
  },
  descriptionText: {
    color: Colors.light.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  galleryContainer: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  galleryItem: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  firstGalleryItem: {
    borderTopLeftRadius: BorderRadius.lg,
    borderBottomLeftRadius: BorderRadius.lg,
  },
  lastGalleryItem: {
    borderTopRightRadius: BorderRadius.lg,
    borderBottomRightRadius: BorderRadius.lg,
  },
  galleryImage: {
    width: '100%',
    height: '100%',
  },
  remainingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  remainingText: {
    color: Colors.light.background,
    fontSize: 18,
    fontWeight: '600',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarImage: {
    borderRadius: 50,
  },
  avatarPlaceholder: {
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: Colors.light.background,
    fontWeight: 'bold',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});

export default RichMedia;
