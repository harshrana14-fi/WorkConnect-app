import React from 'react';
import { View, StyleSheet } from 'react-native';
import { 
  Ionicons, 
  MaterialIcons, 
  MaterialCommunityIcons, 
  AntDesign,
  Feather,
  FontAwesome5
} from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

interface IconProps {
  size?: number;
  color?: string;
  style?: any;
}

// Job Category Icons
export const JobCategoryIcons = {
  electrical: (props: IconProps) => (
    <MaterialIcons name="electrical-services" size={props.size || 24} color={props.color || Colors.light.primary} />
  ),
  plumbing: (props: IconProps) => (
    <MaterialCommunityIcons name="pipe-wrench" size={props.size || 24} color={props.color || Colors.light.primary} />
  ),
  cleaning: (props: IconProps) => (
    <MaterialCommunityIcons name="broom" size={props.size || 24} color={props.color || Colors.light.primary} />
  ),
  gardening: (props: IconProps) => (
    <MaterialCommunityIcons name="flower" size={props.size || 24} color={props.color || Colors.light.primary} />
  ),
  construction: (props: IconProps) => (
    <MaterialCommunityIcons name="hard-hat" size={props.size || 24} color={props.color || Colors.light.primary} />
  ),
  carpentry: (props: IconProps) => (
    <MaterialCommunityIcons name="hammer-screwdriver" size={props.size || 24} color={props.color || Colors.light.primary} />
  ),
  all: (props: IconProps) => (
    <MaterialIcons name="work" size={props.size || 24} color={props.color || Colors.light.primary} />
  ),
};

// Action Icons
export const ActionIcons = {
  search: (props: IconProps) => (
    <Ionicons name="search" size={props.size || 24} color={props.color || Colors.light.textSecondary} />
  ),
  apply: (props: IconProps) => (
    <MaterialIcons name="send" size={props.size || 24} color={props.color || Colors.light.background} />
  ),
  applied: (props: IconProps) => (
    <MaterialIcons name="check-circle" size={props.size || 24} color={props.color || Colors.light.success} />
  ),
  urgent: (props: IconProps) => (
    <MaterialIcons name="priority-high" size={props.size || 24} color={props.color || Colors.light.error} />
  ),
  location: (props: IconProps) => (
    <Ionicons name="location" size={props.size || 24} color={props.color || Colors.light.textSecondary} />
  ),
  distance: (props: IconProps) => (
    <MaterialIcons name="straighten" size={props.size || 24} color={props.color || Colors.light.textSecondary} />
  ),
  time: (props: IconProps) => (
    <Ionicons name="time" size={props.size || 24} color={props.color || Colors.light.textSecondary} />
  ),
  rating: (props: IconProps) => (
    <MaterialIcons name="star" size={props.size || 24} color={props.color || Colors.light.warning} />
  ),
  camera: (props: IconProps) => (
    <Ionicons name="camera" size={props.size || 24} color={props.color || Colors.light.secondary} />
  ),
  edit: (props: IconProps) => (
    <Ionicons name="create" size={props.size || 24} color={props.color || Colors.light.primary} />
  ),
  save: (props: IconProps) => (
    <MaterialIcons name="save" size={props.size || 24} color={props.color || Colors.light.success} />
  ),
  success: (props: IconProps) => (
    <MaterialIcons name="check-circle" size={props.size || 24} color={props.color || Colors.light.success} />
  ),
  error: (props: IconProps) => (
    <MaterialIcons name="error" size={props.size || 24} color={props.color || Colors.light.error} />
  ),
  cancel: (props: IconProps) => (
    <MaterialIcons name="cancel" size={props.size || 24} color={props.color || Colors.light.error} />
  ),
  money: (props: IconProps) => (
    <MaterialIcons name="attach-money" size={props.size || 24} color={props.color || Colors.light.textSecondary} />
  ),
  eye: (props: IconProps) => (
    <MaterialIcons name="visibility" size={props.size || 24} color={props.color || Colors.light.textSecondary} />
  ),
  applications: (props: IconProps) => (
    <MaterialIcons name="assignment" size={props.size || 24} color={props.color || Colors.light.textSecondary} />
  ),
  arrow_left: (props: IconProps) => (
    <MaterialIcons name="arrow-back" size={props.size || 24} color={props.color || Colors.light.textSecondary} />
  ),
  share: (props: IconProps) => (
    <MaterialIcons name="share" size={props.size || 24} color={props.color || Colors.light.textSecondary} />
  ),
  message: (props: IconProps) => (
    <MaterialIcons name="message" size={props.size || 24} color={props.color || Colors.light.textSecondary} />
  ),
  loading: (props: IconProps) => (
    <MaterialIcons name="refresh" size={props.size || 24} color={props.color || Colors.light.primary} />
  ),
  arrow_right: (props: IconProps) => (
    <MaterialIcons name="arrow-forward" size={props.size || 24} color={props.color || Colors.light.textSecondary} />
  ),
  briefcase: (props: IconProps) => (
    <MaterialIcons name="work" size={props.size || 24} color={props.color || Colors.light.textSecondary} />
  ),
  users: (props: IconProps) => (
    <MaterialIcons name="people" size={props.size || 24} color={props.color || Colors.light.textSecondary} />
  ),
  file_text: (props: IconProps) => (
    <MaterialIcons name="description" size={props.size || 24} color={props.color || Colors.light.textSecondary} />
  ),
  dollar_sign: (props: IconProps) => (
    <MaterialIcons name="attach-money" size={props.size || 24} color={props.color || Colors.light.textSecondary} />
  ),
  plus: (props: IconProps) => (
    <MaterialIcons name="add" size={props.size || 24} color={props.color || Colors.light.textSecondary} />
  ),
  clock: (props: IconProps) => (
    <MaterialIcons name="access-time" size={props.size || 24} color={props.color || Colors.light.textSecondary} />
  ),
  calendar: (props: IconProps) => (
    <MaterialIcons name="event" size={props.size || 24} color={props.color || Colors.light.textSecondary} />
  ),
  trash: (props: IconProps) => (
    <MaterialIcons name="delete" size={props.size || 24} color={props.color || Colors.light.textSecondary} />
  ),
  mail: (props: IconProps) => (
    <MaterialIcons name="email" size={props.size || 24} color={props.color || Colors.light.textSecondary} />
  ),
  phone: (props: IconProps) => (
    <MaterialIcons name="phone" size={props.size || 24} color={props.color || Colors.light.textSecondary} />
  ),
  tag: (props: IconProps) => (
    <MaterialIcons name="local-offer" size={props.size || 24} color={props.color || Colors.light.textSecondary} />
  ),
  check: (props: IconProps) => (
    <MaterialIcons name="check" size={props.size || 24} color={props.color || Colors.light.textSecondary} />
  ),
  x: (props: IconProps) => (
    <MaterialIcons name="close" size={props.size || 24} color={props.color || Colors.light.textSecondary} />
  ),
};

// Navigation Icons
export const NavigationIcons = {
  home: (props: IconProps) => (
    <Ionicons name="home" size={props.size || 24} color={props.color || Colors.light.tabIconDefault} />
  ),
  explore: (props: IconProps) => (
    <Ionicons name="compass" size={props.size || 24} color={props.color || Colors.light.tabIconDefault} />
  ),
  applications: (props: IconProps) => (
    <MaterialIcons name="assignment" size={props.size || 24} color={props.color || Colors.light.tabIconDefault} />
  ),
  notifications: (props: IconProps) => (
    <Ionicons name="notifications" size={props.size || 24} color={props.color || Colors.light.tabIconDefault} />
  ),
  profile: (props: IconProps) => (
    <Ionicons name="person" size={props.size || 24} color={props.color || Colors.light.tabIconDefault} />
  ),
  settings: (props: IconProps) => (
    <Ionicons name="settings" size={props.size || 24} color={props.color || Colors.light.tabIconDefault} />
  ),
};

// Status Icons
export const StatusIcons = {
  success: (props: IconProps) => (
    <MaterialIcons name="check-circle" size={props.size || 24} color={props.color || Colors.light.success} />
  ),
  error: (props: IconProps) => (
    <MaterialIcons name="error" size={props.size || 24} color={props.color || Colors.light.error} />
  ),
  warning: (props: IconProps) => (
    <MaterialIcons name="warning" size={props.size || 24} color={props.color || Colors.light.warning} />
  ),
  info: (props: IconProps) => (
    <MaterialIcons name="info" size={props.size || 24} color={props.color || Colors.light.info} />
  ),
  loading: (props: IconProps) => (
    <MaterialIcons name="refresh" size={props.size || 24} color={props.color || Colors.light.primary} />
  ),
};

// Notification Icons
export const NotificationIcons = {
  job_offer: (props: IconProps) => (
    <MaterialIcons name="work" size={props.size || 24} color={props.color || Colors.light.primary} />
  ),
  payment: (props: IconProps) => (
    <MaterialIcons name="payment" size={props.size || 24} color={props.color || Colors.light.success} />
  ),
  job_approved: (props: IconProps) => (
    <MaterialIcons name="check-circle" size={props.size || 24} color={props.color || Colors.light.info} />
  ),
  skill_badge: (props: IconProps) => (
    <MaterialIcons name="emoji-events" size={props.size || 24} color={props.color || Colors.light.warning} />
  ),
  reminder: (props: IconProps) => (
    <MaterialIcons name="schedule" size={props.size || 24} color={props.color || Colors.light.purple} />
  ),
  upskill: (props: IconProps) => (
    <MaterialIcons name="school" size={props.size || 24} color={props.color || Colors.light.pink} />
  ),
  all: (props: IconProps) => (
    <MaterialIcons name="notifications" size={props.size || 24} color={props.color || Colors.light.textSecondary} />
  ),
  unread: (props: IconProps) => (
    <MaterialIcons name="mark-email-unread" size={props.size || 24} color={props.color || Colors.light.textSecondary} />
  ),
  jobs: (props: IconProps) => (
    <MaterialIcons name="work" size={props.size || 24} color={props.color || Colors.light.textSecondary} />
  ),
  payments: (props: IconProps) => (
    <MaterialIcons name="payment" size={props.size || 24} color={props.color || Colors.light.textSecondary} />
  ),
};

// Profile Icons
export const ProfileIcons = {
  avatar: (props: IconProps) => (
    <Ionicons name="person-circle" size={props.size || 24} color={props.color || Colors.light.primary} />
  ),
  skills: (props: IconProps) => (
    <MaterialIcons name="psychology" size={props.size || 24} color={props.color || Colors.light.primary} />
  ),
  experience: (props: IconProps) => (
    <MaterialIcons name="timeline" size={props.size || 24} color={props.color || Colors.light.primary} />
  ),
  earnings: (props: IconProps) => (
    <MaterialIcons name="account-balance-wallet" size={props.size || 24} color={props.color || Colors.light.success} />
  ),
  jobs_done: (props: IconProps) => (
    <MaterialIcons name="assignment-turned-in" size={props.size || 24} color={props.color || Colors.light.primary} />
  ),
  rating: (props: IconProps) => (
    <MaterialIcons name="star-rate" size={props.size || 24} color={props.color || Colors.light.warning} />
  ),
};

// Quick Action Icons
export const QuickActionIcons = {
  find_jobs: (props: IconProps) => (
    <Ionicons name="search" size={props.size || 32} color={props.color || Colors.light.primary} />
  ),
  applications: (props: IconProps) => (
    <MaterialIcons name="assignment" size={props.size || 32} color={props.color || Colors.light.primary} />
  ),
  notifications: (props: IconProps) => (
    <Ionicons name="notifications" size={props.size || 32} color={props.color || Colors.light.primary} />
  ),
  profile: (props: IconProps) => (
    <Ionicons name="person" size={props.size || 32} color={props.color || Colors.light.primary} />
  ),
  learn: (props: IconProps) => (
    <MaterialIcons name="school" size={props.size || 32} color={props.color || Colors.light.primary} />
  ),
  badges: (props: IconProps) => (
    <MaterialIcons name="emoji-events" size={props.size || 32} color={props.color || Colors.light.primary} />
  ),
};

// Media Icons
export const MediaIcons = {
  image: (props: IconProps) => (
    <MaterialIcons name="image" size={props.size || 24} color={props.color || Colors.light.textSecondary} />
  ),
  video: (props: IconProps) => (
    <MaterialIcons name="videocam" size={props.size || 24} color={props.color || Colors.light.textSecondary} />
  ),
  play: (props: IconProps) => (
    <MaterialIcons name="play-circle-filled" size={props.size || 24} color={props.color || Colors.light.primary} />
  ),
  pause: (props: IconProps) => (
    <MaterialIcons name="pause-circle-filled" size={props.size || 24} color={props.color || Colors.light.primary} />
  ),
  gallery: (props: IconProps) => (
    <MaterialIcons name="photo-library" size={props.size || 24} color={props.color || Colors.light.textSecondary} />
  ),
  camera: (props: IconProps) => (
    <MaterialIcons name="camera-alt" size={props.size || 24} color={props.color || Colors.light.textSecondary} />
  ),
};

// Utility Icons
export const UtilityIcons = {
  arrow_right: (props: IconProps) => (
    <MaterialIcons name="arrow-forward" size={props.size || 24} color={props.color || Colors.light.textSecondary} />
  ),
  arrow_left: (props: IconProps) => (
    <MaterialIcons name="arrow-back" size={props.size || 24} color={props.color || Colors.light.textSecondary} />
  ),
  close: (props: IconProps) => (
    <MaterialIcons name="close" size={props.size || 24} color={props.color || Colors.light.textSecondary} />
  ),
  menu: (props: IconProps) => (
    <MaterialIcons name="menu" size={props.size || 24} color={props.color || Colors.light.textSecondary} />
  ),
  more: (props: IconProps) => (
    <MaterialIcons name="more-horiz" size={props.size || 24} color={props.color || Colors.light.textSecondary} />
  ),
  filter: (props: IconProps) => (
    <MaterialIcons name="filter-list" size={props.size || 24} color={props.color || Colors.light.textSecondary} />
  ),
  sort: (props: IconProps) => (
    <MaterialIcons name="sort" size={props.size || 24} color={props.color || Colors.light.textSecondary} />
  ),
};

// Icon Container Component
interface IconContainerProps {
  children: React.ReactNode;
  backgroundColor?: string;
  size?: number;
  borderRadius?: number;
  style?: any;
}

export const IconContainer: React.FC<IconContainerProps> = ({
  children,
  backgroundColor = Colors.light.surface,
  size = 40,
  borderRadius = 20,
  style,
}) => (
  <View style={[
    styles.iconContainer,
    {
      backgroundColor,
      width: size,
      height: size,
      borderRadius: borderRadius,
    },
    style,
  ]}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.light.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});

export default {
  JobCategoryIcons,
  ActionIcons,
  NavigationIcons,
  StatusIcons,
  NotificationIcons,
  ProfileIcons,
  QuickActionIcons,
  MediaIcons,
  UtilityIcons,
  IconContainer,
};
