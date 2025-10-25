import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
  RefreshControl,
  Alert,
  StatusBar,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import ScreenWrapper from '@/components/ScreenWrapper';
import { isTablet, isLandscape, getResponsiveSpacing, getGridColumns, getCardWidth, getSafeAreaPadding } from '@/utils/responsive';
import { 
  NotificationIcons, 
  ActionIcons, 
  IconContainer 
} from '@/components/ui/ProfessionalIcons';

const { width, height } = Dimensions.get('window');

// Enhanced color palette
const EnhancedColors = {
  primary: '#4F46E5',
  primaryLight: '#6366F1',
  primaryDark: '#4338CA',
  secondary: '#10B981',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceElevated: '#FEFEFE',
  text: '#0F172A',
  textSecondary: '#64748B',
  textLight: '#94A3B8',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  error: '#EF4444',
  warning: '#F59E0B',
  success: '#10B981',
  info: '#06B6D4',
  purple: '#8B5CF6',
  pink: '#EC4899',
  shadow: '#000000',
};

// TODO: Replace with actual data from API
const notifications: any[] = [];

const notificationTypes = [
  { id: 'all', label: 'All', iconType: 'all' },
  { id: 'unread', label: 'Unread', iconType: 'unread' },
  { id: 'jobs', label: 'Jobs', iconType: 'jobs' },
  { id: 'payments', label: 'Payments', iconType: 'payments' },
];

export default function NotificationsScreen() {
  const { user } = useAuth();
  const { t, isInitialized } = useLanguage();
  const [selectedType, setSelectedType] = useState('all');
  const [notificationsList, setNotificationsList] = useState(notifications);
  const [refreshing, setRefreshing] = useState(false);

  const filteredNotifications = notificationsList.filter(notification => {
    if (selectedType === 'all') return true;
    if (selectedType === 'unread') return !notification.isRead;
    if (selectedType === 'jobs') return notification.type.includes('job');
    if (selectedType === 'payments') return notification.type === 'payment';
    return true;
  });

  const unreadCount = notificationsList.filter(n => !n.isRead).length;

  const getTypeCount = (typeId: string) => {
    if (typeId === 'all') return notificationsList.length;
    if (typeId === 'unread') return unreadCount;
    if (typeId === 'jobs') return notificationsList.filter(n => n.type.includes('job')).length;
    if (typeId === 'payments') return notificationsList.filter(n => n.type === 'payment').length;
    return 0;
  };

  const markAsRead = (id: string) => {
    setNotificationsList(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotificationsList(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
    Alert.alert('Success', 'All notifications marked as read');
  };

  const deleteNotification = (id: string) => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setNotificationsList(prev => prev.filter(n => n.id !== id));
          },
        },
      ]
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const handleNotificationAction = (notification: any) => {
    markAsRead(notification.id);
    Alert.alert(
      notification.action,
      `Processing: ${notification.title}`,
      [{ text: 'OK' }]
    );
  };

  const renderNotificationItem = ({ item, index }: { item: typeof notifications[0], index: number }) => {
    return (
      <TouchableOpacity
        style={[
          styles.notificationItem,
          !item.isRead && styles.unreadNotification,
        ]}
        onPress={() => markAsRead(item.id)}
        onLongPress={() => deleteNotification(item.id)}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={[item.color + '12', item.color + '05']}
          start={[0, 0]}
          end={[1, 1]}
          style={styles.notificationGradient}
        >
          <View style={styles.notificationContent}>
            {/* Icon Container */}
            <View style={[
              styles.notificationIcon,
              { 
                backgroundColor: item.color + '20',
                borderColor: item.color + '40',
              }
            ]}>
              {(() => {
                const IconComponent = NotificationIcons[item.iconType as keyof typeof NotificationIcons];
                return <IconComponent size={isTablet ? 30 : 28} color={item.color} />;
              })()}
              {!item.isRead && (
                <View style={[styles.unreadDot, { backgroundColor: item.color }]} />
              )}
            </View>
            
            {/* Content */}
            <View style={styles.notificationText}>
              <Text style={[
                styles.notificationTitle,
                !item.isRead && styles.unreadTitle,
              ]} numberOfLines={2}>
                {item.title}
              </Text>
              
              <Text style={styles.notificationMessage} numberOfLines={3}>
                {item.message}
              </Text>
              
              <View style={styles.notificationFooter}>
                <View style={styles.timeContainer}>
                  <ActionIcons.time size={12} color={Colors.light.textLight} />
                  <Text style={styles.notificationTime}>{item.time}</Text>
                </View>
                
                {item.action && (
                  <TouchableOpacity 
                    style={[styles.actionButton, { backgroundColor: item.color }]}
                    onPress={() => handleNotificationAction(item)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.actionButtonText}>{item.action}</Text>
                    <ActionIcons.apply size={14} color={Colors.light.background} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const renderTypeFilter = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.filterScrollView}
      contentContainerStyle={styles.filterContent}
    >
      {notificationTypes.map((type) => {
        const isActive = selectedType === type.id;
        const count = getTypeCount(type.id);
        
        return (
          <TouchableOpacity
            key={type.id}
            style={[
              styles.filterButton,
              isActive && styles.activeFilter,
            ]}
            onPress={() => setSelectedType(type.id)}
            activeOpacity={0.7}
          >
            {isActive && (
              <LinearGradient
                colors={[EnhancedColors.primary, EnhancedColors.primaryLight]}
                start={[0, 0]}
                end={[1, 0]}
                style={styles.filterGradient}
              />
            )}
            {(() => {
              const IconComponent = NotificationIcons[type.iconType as keyof typeof NotificationIcons];
              return <IconComponent size={12} color={isActive ? Colors.light.background : Colors.light.textSecondary} />;
            })()}
            <Text style={[
              styles.filterText,
              isActive && styles.activeFilterText,
            ]}>
              {type.label}
            </Text>
            <View style={[
              styles.filterBadge,
              isActive && styles.activeFilterBadge,
            ]}>
              <Text style={[
                styles.filterBadgeText,
                isActive && styles.activeFilterBadgeText,
              ]}>
                {count}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>
            {t('notifications.title') || 'Notifications'}
          </Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{unreadCount} new</Text>
            </View>
          )}
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllAsRead} style={styles.markAllButton}>
            <LinearGradient
              colors={[EnhancedColors.primary, EnhancedColors.primaryLight]}
              start={[0, 0]}
              end={[1, 0]}
              style={styles.markAllGradient}
            >
              <ActionIcons.success size={13} color={Colors.light.background} />
              <Text style={styles.markAllText}>Mark all</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.headerSubtitle}>
        {user?.name 
          ? `Welcome back, ${user.name}` 
          : 'Stay updated with your latest activities'}
      </Text>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Text style={styles.emptyIcon}>🔔</Text>
      </View>
      <Text style={styles.emptyTitle}>All caught up!</Text>
      <Text style={styles.emptyMessage}>
        You have no {selectedType === 'all' ? '' : selectedType} notifications at the moment
      </Text>
    </View>
  );

  if (!isInitialized) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[EnhancedColors.background, EnhancedColors.surface]}
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
    <ScreenWrapper title="Notifications">
      <View style={styles.container}>
        <StatusBar 
          barStyle="dark-content" 
          backgroundColor={EnhancedColors.background}
          translucent={false}
        />
        <LinearGradient
          colors={[EnhancedColors.background, EnhancedColors.surface]}
          style={styles.background}
        >
          <View style={styles.content}>
            {renderHeader()}
            {renderTypeFilter()}
            
            <FlatList
              data={filteredNotifications}
              renderItem={renderNotificationItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.notificationsList}
              style={styles.notificationsContainer}
              refreshControl={
                <RefreshControl 
                  refreshing={refreshing} 
                  onRefresh={onRefresh}
                  tintColor={EnhancedColors.primary}
                  colors={[EnhancedColors.primary]}
                />
              }
              ListEmptyComponent={renderEmptyState}
              removeClippedSubviews={true}
              maxToRenderPerBatch={10}
              windowSize={10}
              initialNumToRender={5}
              getItemLayout={(data, index) => ({
                length: 100,
                offset: 100 * index,
                index,
              })}
            />
          </View>
        </LinearGradient>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: EnhancedColors.background,
  },
  background: {
    flex: 1,
  },
 
  content: {
    flex: 1,
    paddingTop: 0,
  },
  header: {
    paddingHorizontal: isTablet ? Spacing.xxl : Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xs,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  headerTitle: {
    fontSize: isTablet ? 32 : 28,
    fontWeight: '700',
    color: EnhancedColors.text,
    marginRight: Spacing.md,
  },
  unreadBadge: {
    backgroundColor: EnhancedColors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: BorderRadius.round,
    marginTop: 4,
  },
  unreadBadgeText: {
    fontSize: 11,
    color: EnhancedColors.surface,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: EnhancedColors.textSecondary,
    marginTop: 2,
  },
  markAllButton: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: EnhancedColors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  markAllGradient: {
    paddingHorizontal: isTablet ? Spacing.lg : Spacing.md,
    paddingVertical: Spacing.sm,
  },
  markAllText: {
    fontSize: 13,
    color: EnhancedColors.surface,
    fontWeight: '600',
  },
  
  filterScrollView: {
    maxHeight: 50,
  },
  filterContent: {
    paddingHorizontal: isTablet ? Spacing.md : Spacing.lg,
    paddingVertical: Spacing.xs,
    flexDirection: 'row',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: EnhancedColors.surface,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.xs,
    borderWidth: 1,
    borderColor: EnhancedColors.borderLight,
    position: 'relative',
    overflow: 'hidden',
    elevation: 1,
    shadowColor: EnhancedColors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    minHeight: 32,
    flexShrink: 0,
  },
  filterGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  filterIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  activeFilter: {
    borderColor: 'transparent',
    elevation: 4,
    shadowColor: EnhancedColors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  filterText: {
    fontSize: 11,
    color: EnhancedColors.textSecondary,
    marginRight: Spacing.xs,
    fontWeight: '500',
  },
  activeFilterText: {
    color: EnhancedColors.surface,
    fontWeight: '600',
  },
  filterBadge: {
    backgroundColor: EnhancedColors.borderLight,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: BorderRadius.sm,
    minWidth: 16,
    alignItems: 'center',
  },
  activeFilterBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  filterBadgeText: {
    fontSize: 9,
    color: EnhancedColors.textSecondary,
    fontWeight: '700',
  },
  activeFilterBadgeText: {
    color: EnhancedColors.surface,
  },
  notificationsContainer: {
    flex: 1,
  },
  notificationsList: {
    paddingHorizontal: isTablet ? Spacing.md : Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xl,
  },
  notificationItem: {
    marginBottom: Spacing.sm,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    backgroundColor: EnhancedColors.surface,
    elevation: 3,
    shadowColor: EnhancedColors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: EnhancedColors.primary,
    elevation: 5,
    shadowOpacity: 0.15,
  },
  notificationGradient: {
    padding: isTablet ? Spacing.xl : Spacing.lg,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificationIcon: {
    width: isTablet ? 60 : 56,
    height: isTablet ? 60 : 56,
    borderRadius: isTablet ? 18 : 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: isTablet ? Spacing.lg : Spacing.md,
    borderWidth: 2,
    position: 'relative',
  },
  iconText: {
    fontSize: isTablet ? 30 : 28,
  },
  unreadDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: EnhancedColors.surface,
  },
  notificationText: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: isTablet ? 17 : 16,
    color: EnhancedColors.text,
    fontWeight: '600',
    marginBottom: 6,
    lineHeight: 22,
  },
  unreadTitle: {
    fontWeight: '700',
  },
  notificationMessage: {
    fontSize: 14,
    color: EnhancedColors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  notificationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xs,
    gap: Spacing.sm,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    flex: 1,
  },
  timeIcon: {
    fontSize: 12,
    marginRight: 2,
  },
  notificationTime: {
    fontSize: 12,
    color: EnhancedColors.textLight,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: isTablet ? Spacing.lg : Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    elevation: 2,
    shadowColor: EnhancedColors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  actionButtonText: {
    fontSize: 13,
    color: EnhancedColors.surface,
    fontWeight: '600',
    marginRight: 4,
  },
  actionArrow: {
    fontSize: 14,
    color: EnhancedColors.surface,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xxl * 2,
    paddingHorizontal: Spacing.xl,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: EnhancedColors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    elevation: 4,
    shadowColor: EnhancedColors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  emptyIcon: {
    fontSize: 64,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: EnhancedColors.text,
    marginBottom: Spacing.sm,
  },
  emptyMessage: {
    fontSize: 15,
    color: EnhancedColors.textSecondary,
    textAlign: 'center',
    maxWidth: 300,
    lineHeight: 22,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: EnhancedColors.textSecondary,
  },
});