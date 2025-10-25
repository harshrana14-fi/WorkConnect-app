import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import ScreenWrapper from '@/components/ScreenWrapper';
import { 
  JobCategoryIcons, 
  ActionIcons, 
  QuickActionIcons, 
  IconContainer 
} from '@/components/ui/ProfessionalIcons';
import { RichMedia, ProfileAvatar } from '@/components/ui/RichMedia';
import { getJobImage, getCompanyLogo, getProfileImage, getPortfolioImage, getVideoThumbnail, getVideoUrl } from '@/services/imageService';
import { isTablet, isLandscape, getResponsiveSpacing, getGridColumns, getCardWidth, getSafeAreaPadding, getResponsiveFontSize } from '@/utils/responsive';

const { width } = Dimensions.get('window');

// TODO: Replace with actual data from API
const opportunities: any[] = [];
const mentors: any[] = [];

export default function HomepageScreen() {
  const { user, isAuthenticated } = useAuth();
  const { t, isInitialized } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

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

  const renderOpportunityCard = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.opportunityCard}>
      <View style={styles.cardHeader}>
        <IconContainer
          backgroundColor={Colors.light.surface}
          size={40}
          borderRadius={20}
        >
          {(() => {
            const IconComponent = JobCategoryIcons[item.category as keyof typeof JobCategoryIcons];
            return <IconComponent size={20} color={Colors.light.primary} />;
          })()}
        </IconContainer>
        {item.urgent && (
          <View style={styles.urgentBadge}>
            <ActionIcons.urgent size={12} color={Colors.light.background} />
            <Text style={styles.urgentText}>{t('homepage.urgent')}</Text>
          </View>
        )}
      </View>
      
      {/* Rich Media Section */}
      <View style={styles.mediaSection}>
        <RichMedia
          type="image"
          source={item.image}
          title={item.title}
          aspectRatio={4/3}
          style={styles.cardMedia}
        />
      </View>
      
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.cardCompany} numberOfLines={1}>{item.company}</Text>
        
        <View style={styles.locationRow}>
          <ActionIcons.location size={14} color={Colors.light.textLight} />
          <Text style={styles.cardLocation}>{item.location}</Text>
        </View>
        
        <View style={styles.cardDetails}>
          <Text style={styles.cardPay}>{item.pay}</Text>
          <Text style={styles.cardDuration}>{item.duration}</Text>
        </View>
        
        <Text style={styles.cardDescription} numberOfLines={2}>{item.description}</Text>
        
        <View style={styles.cardFooter}>
          <Text style={styles.applicantsCount}>{item.applicants} {t('homepage.applied')}</Text>
          <TouchableOpacity style={styles.applyButton}>
            <ActionIcons.apply size={16} color={Colors.light.background} />
            <Text style={styles.applyButtonText}>{t('homepage.apply')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderMentorCard = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.mentorCard}>
      <View style={styles.mentorHeader}>
        {item.available && (
          <View style={styles.availableBadge}>
            <Text style={styles.availableText}>{t('homepage.available')}</Text>
          </View>
        )}
        <View style={styles.ratingContainer}>
          <ActionIcons.rating size={16} color={Colors.light.warning} />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
      </View>
      
      <View style={styles.mentorImageContainer}>
        <ProfileAvatar
          source={item.image}
          name={item.name}
          size={60}
          style={styles.mentorAvatar}
        />
      </View>
      
      <View style={styles.mentorContent}>
        <Text style={styles.mentorName}>{item.name}</Text>
        <Text style={styles.mentorTitle}>{item.title}</Text>
        <Text style={styles.mentorCompany}>{item.company}</Text>
        <Text style={styles.mentorExperience}>{item.experience}</Text>
      </View>
      
      <TouchableOpacity style={styles.viewProfileButton}>
        <Text style={styles.viewProfileText}>{t('homepage.view_profile')}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderStatsCard = ({ item }: { item: any }) => (
    <View style={styles.statCard}>
      <View style={styles.statIconContainer}>
        <IconContainer
          backgroundColor={item.color + '20'}
          size={32}
          borderRadius={16}
        >
          {item.icon === 'briefcase' && <ActionIcons.applications size={16} color={item.color} />}
          {item.icon === 'dollar-sign' && <ActionIcons.money size={16} color={item.color} />}
          {item.icon === 'star' && <ActionIcons.rating size={16} color={item.color} />}
        </IconContainer>
      </View>
      <Text style={[styles.statNumber, { color: item.color }]}>{item.number}</Text>
      <Text style={styles.statLabel}>{item.label}</Text>
    </View>
  );

  return (
    <ScreenWrapper title="nav.home">
      <View style={styles.container}>
        <LinearGradient
          colors={[Colors.light.background, Colors.light.surface]}
          style={styles.background}
        >
          <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Text style={styles.logo}>WorkConnect</Text>
              </View>
              <View style={styles.headerRight}>
                {!isAuthenticated ? (
                  <View style={styles.authButtons}>
                    <TouchableOpacity 
                      style={styles.loginButton}
                      onPress={() => router.push('/auth')}
                    >
                      <Text style={styles.loginButtonText}>{t('homepage.login')}</Text>
                    </TouchableOpacity>
                    
                  </View>
                ) : (
                  <ProfileAvatar
                    source={user?.profileImage}
                    name={user?.name}
                    size={40}
                    onPress={() => router.push('/(tabs)/profile')}
                    style={styles.profileAvatar}
                  />
                )}
              </View>
            </View>

            {/* Greeting */}
            <View style={styles.greetingSection}>
              <Text style={styles.greetingText}>
                {isAuthenticated ? t('homepage.greeting').replace('{name}', user?.name || 'User') : t('homepage.welcome')}
              </Text>
              <Text style={styles.subtitleText}>
                {isAuthenticated ? t('homepage.subtitle_authenticated') : t('homepage.subtitle_guest')}
              </Text>
            </View>

            {/* Promotional Banner */}
            <View style={styles.bannerContainer}>
              <LinearGradient
                colors={[Colors.light.primary, Colors.light.secondary]}
                style={styles.banner}
              >
                <View style={styles.bannerContent}>
                  <Text style={styles.bannerTitle}>{t('homepage.build_future')}</Text>
                  <Text style={styles.bannerSubtitle}>{t('homepage.banner_subtitle')}</Text>
                  <TouchableOpacity style={styles.bannerButton}>
                    <Text style={styles.bannerButtonText}>{t('homepage.get_started')}</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.bannerImage}>
                  <IconContainer
                    backgroundColor="rgba(255,255,255,0.2)"
                    size={60}
                    borderRadius={30}
                  >
                    <JobCategoryIcons.construction size={32} color={Colors.light.background} />
                  </IconContainer>
                </View>
              </LinearGradient>
            </View>

          
           
            {/* Featured Jobs */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{t('homepage.featured_jobs')}</Text>
                <TouchableOpacity onPress={() => router.push('/(tabs)/explore')}>
                  <Text style={styles.viewAllText}>{t('homepage.view_all')}</Text>
                </TouchableOpacity>
              </View>
              
              <FlatList
                data={opportunities}
                renderItem={renderOpportunityCard}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.opportunitiesList}
              />
            </View>

            {/* Top Mentors */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{t('homepage.top_mentors')}</Text>
                <TouchableOpacity>
                  <Text style={styles.viewAllText}>{t('homepage.view_all')}</Text>
                </TouchableOpacity>
              </View>
              
              <FlatList
                data={mentors}
                renderItem={renderMentorCard}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.mentorsList}
              />
            </View>

            {/* Quick Actions - Only show for authenticated users */}
            {isAuthenticated && (
              <View style={styles.quickActionsSection}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>{t('homepage.quick_actions')}</Text>
                  <TouchableOpacity onPress={() => router.push('/(tabs)/profile')}>
                    <Text style={styles.viewAllText}>{t('homepage.view_all')}</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.actionsGrid}>
                  <TouchableOpacity 
                    style={styles.actionCard}
                    onPress={() => router.push('/(tabs)/explore')}
                  >
                    <IconContainer
                      backgroundColor={Colors.light.primary + '20'}
                      size={48}
                      borderRadius={24}
                    >
                      <QuickActionIcons.find_jobs size={24} color={Colors.light.primary} />
                    </IconContainer>
                    <Text style={styles.actionText} numberOfLines={2}>{t('homepage.find_jobs')}</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.actionCard}
                    onPress={() => router.push('/(tabs)/applications')}
                  >
                    <IconContainer
                      backgroundColor={Colors.light.success + '20'}
                      size={48}
                      borderRadius={24}
                    >
                      <QuickActionIcons.applications size={24} color={Colors.light.success} />
                    </IconContainer>
                    <Text style={styles.actionText} numberOfLines={2}>{t('homepage.my_applications')}</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.actionCard}
                    onPress={() => router.push('/(tabs)/notifications')}
                  >
                    <IconContainer
                      backgroundColor={Colors.light.warning + '20'}
                      size={48}
                      borderRadius={24}
                    >
                      <QuickActionIcons.notifications size={24} color={Colors.light.warning} />
                    </IconContainer>
                    <Text style={styles.actionText} numberOfLines={2}>{t('homepage.notifications')}</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.actionCard}
                    onPress={() => router.push('/(tabs)/profile')}
                  >
                    <IconContainer
                      backgroundColor={Colors.light.purple + '20'}
                      size={48}
                      borderRadius={24}
                    >
                      <QuickActionIcons.profile size={24} color={Colors.light.purple} />
                    </IconContainer>
                    <Text style={styles.actionText} numberOfLines={2}>{t('homepage.profile')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Call to Action for non-authenticated users */}
            {!isAuthenticated && (
              <View style={styles.ctaSection}>
                <Text style={styles.ctaTitle}>{t('homepage.ready_to_start')}</Text>
                <Text style={styles.ctaSubtitle}>{t('homepage.cta_subtitle')}</Text>
                <View style={styles.ctaButtons}>
                  <TouchableOpacity 
                    style={styles.primaryCtaButton}
                    onPress={() => {
                      // Stay on homepage, just scroll to top or show a message
                      Alert.alert('Welcome!', 'You can now explore WorkConnect and sign up when ready!');
                    }}
                  >
                    <Text style={styles.primaryCtaButtonText}>{t('homepage.get_started')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.secondaryCtaButton}
                    onPress={() => router.push('/auth')}
                  >
                    <Text style={styles.secondaryCtaButtonText}>{t('homepage.login')}</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.ctaNote}>
                  Join thousands of workers and employers already using WorkConnect
                </Text>
              </View>
            )}
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
    padding: getResponsiveSpacing(Spacing.md, Spacing.lg, Spacing.xl),
    paddingHorizontal: getResponsiveSpacing(Spacing.md, Spacing.lg, Spacing.xl),
    paddingTop: isLandscape ? Spacing.sm : getResponsiveSpacing(Spacing.md, Spacing.lg, Spacing.xl),
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  headerLeft: {
    flex: 1,
  },
  logo: {
    ...Typography.h3,
    color: Colors.light.primary,
    fontWeight: '700',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  loginButton: {
    backgroundColor: Colors.light.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  loginButtonText: {
    ...Typography.captionMedium,
    color: Colors.light.text,
    fontWeight: '600',
  },
  signupButton: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  signupButtonText: {
    ...Typography.captionMedium,
    color: Colors.light.background,
    fontWeight: '600',
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: Colors.light.border,
  },
  profileAvatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  profileAvatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.primary,
  },
  profileButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.primary,
  },
  greetingSection: {
    marginBottom: Spacing.xl,
  },
  greetingText: {
    ...Typography.h2,
    color: Colors.light.text,
    marginBottom: Spacing.xs,
  },
  subtitleText: {
    ...Typography.body,
    color: Colors.light.textSecondary,
  },
  bannerContainer: {
    marginBottom: Spacing.xl,
  },
  banner: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 120,
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    ...Typography.h4,
    color: Colors.light.background,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  bannerSubtitle: {
    ...Typography.body,
    color: Colors.light.background,
    opacity: 0.9,
    marginBottom: Spacing.md,
  },
  bannerButton: {
    backgroundColor: Colors.light.background,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    alignSelf: 'flex-start',
  },
  bannerButtonText: {
    ...Typography.captionMedium,
    color: Colors.light.primary,
    fontWeight: '600',
  },
  bannerImage: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerEmoji: {
    fontSize: 48,
  },
  statsSection: {
    marginBottom: getResponsiveSpacing(Spacing.xl, Spacing.xxl, Spacing.xxxl),
  },
  statsList: {
    paddingHorizontal: getResponsiveSpacing(Spacing.xs, Spacing.sm, Spacing.md),
  },
  statCard: {
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius.lg,
    padding: getResponsiveSpacing(Spacing.lg, Spacing.xl, Spacing.xxl),
    marginHorizontal: getResponsiveSpacing(Spacing.xs, Spacing.sm, Spacing.md),
    alignItems: 'center',
    minWidth: getResponsiveSpacing(100, 120, 140),
    shadowColor: Colors.light.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  statIconContainer: {
    marginBottom: getResponsiveSpacing(Spacing.sm, Spacing.md, Spacing.lg),
  },
  statNumber: {
    ...Typography.h3,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
  section: {
    marginBottom: Spacing.xl,
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
    fontWeight: '600',
  },
  viewAllText: {
    ...Typography.captionMedium,
    color: Colors.light.primary,
  },
  opportunitiesList: {
    paddingHorizontal: Spacing.xs,
  },
  opportunityCard: {
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius.lg,
    padding: getResponsiveSpacing(Spacing.md, Spacing.lg, Spacing.xl),
    marginHorizontal: getResponsiveSpacing(Spacing.xs, Spacing.sm, Spacing.md),
    shadowColor: Colors.light.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: Colors.light.border,
    width: getResponsiveSpacing(280, 320, 360),
    maxWidth: getResponsiveSpacing(280, 320, 360),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  mediaSection: {
    marginBottom: getResponsiveSpacing(Spacing.sm, Spacing.md, Spacing.lg),
    height: getResponsiveSpacing(120, 140, 160),
    overflow: 'hidden',
  },
  cardMedia: {
    borderRadius: BorderRadius.md,
    width: '100%',
    height: '100%',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  cardDescription: {
    ...Typography.caption,
    color: Colors.light.textSecondary,
    marginBottom: getResponsiveSpacing(Spacing.sm, Spacing.md, Spacing.lg),
    lineHeight: 18,
  },
  urgentBadge: {
    backgroundColor: Colors.light.error,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  urgentText: {
    ...Typography.smallMedium,
    color: Colors.light.background,
    marginLeft: Spacing.xs,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: getResponsiveFontSize(16, 18, 20),
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: getResponsiveSpacing(Spacing.xs, Spacing.sm, Spacing.md),
  },
  cardCompany: {
    fontSize: getResponsiveFontSize(14, 16, 18),
    color: Colors.light.textSecondary,
    marginBottom: getResponsiveSpacing(Spacing.xs, Spacing.sm, Spacing.md),
  },
  cardLocation: {
    ...Typography.caption,
    color: Colors.light.textLight,
    marginBottom: Spacing.sm,
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: getResponsiveSpacing(Spacing.sm, Spacing.md, Spacing.lg),
    alignItems: 'center',
  },
  cardPay: {
    ...Typography.captionMedium,
    color: Colors.light.primary,
    fontWeight: '600',
  },
  cardDuration: {
    ...Typography.caption,
    color: Colors.light.textSecondary,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  applicantsCount: {
    ...Typography.small,
    color: Colors.light.textLight,
  },
  applyButton: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: getResponsiveSpacing(Spacing.md, Spacing.lg, Spacing.xl),
    paddingVertical: getResponsiveSpacing(Spacing.xs, Spacing.sm, Spacing.md),
    borderRadius: BorderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: Colors.light.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  applyButtonText: {
    ...Typography.smallMedium,
    color: Colors.light.background,
    marginLeft: Spacing.xs,
  },
  mentorsList: {
    paddingHorizontal: Spacing.xs,
  },
  mentorCard: {
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginHorizontal: Spacing.xs,
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
  mentorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  availableBadge: {
    backgroundColor: Colors.light.success,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  availableText: {
    ...Typography.smallMedium,
    color: Colors.light.background,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    ...Typography.caption,
    color: Colors.light.textSecondary,
    marginLeft: Spacing.xs,
  },
  mentorImageContainer: {
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  mentorAvatar: {
    shadowColor: Colors.light.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  mentorContent: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  mentorName: {
    ...Typography.h5,
    color: Colors.light.text,
    marginBottom: Spacing.xs,
  },
  mentorTitle: {
    ...Typography.body,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.xs,
  },
  mentorCompany: {
    ...Typography.caption,
    color: Colors.light.textLight,
    marginBottom: Spacing.xs,
  },
  mentorExperience: {
    ...Typography.small,
    color: Colors.light.textLight,
  },
  viewProfileButton: {
    backgroundColor: Colors.light.surface,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  viewProfileText: {
    ...Typography.captionMedium,
    color: Colors.light.text,
    textAlign: 'center',
  },
  quickActionsSection: {
    marginBottom: getResponsiveSpacing(Spacing.xl, Spacing.xxl, Spacing.xxxl),
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: getResponsiveSpacing(Spacing.sm, Spacing.md, Spacing.lg),
  },
  actionCard: {
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius.lg,
    padding: getResponsiveSpacing(Spacing.lg, Spacing.xl, Spacing.xxl),
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
    minHeight: getResponsiveSpacing(120, 140, 160),
    shadowColor: Colors.light.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  actionText: {
    fontSize: getResponsiveFontSize(14, 16, 18),
    fontWeight: '600',
    color: Colors.light.text,
    textAlign: 'center',
    marginTop: getResponsiveSpacing(Spacing.sm, Spacing.md, Spacing.lg),
  },
  ctaSection: {
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.xl,
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
  ctaTitle: {
    ...Typography.h4,
    color: Colors.light.text,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  ctaSubtitle: {
    ...Typography.body,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  ctaButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  primaryCtaButton: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    flex: 1,
  },
  primaryCtaButtonText: {
    ...Typography.bodyMedium,
    color: Colors.light.background,
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryCtaButton: {
    backgroundColor: Colors.light.surface,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
    flex: 1,
  },
  secondaryCtaButtonText: {
    ...Typography.bodyMedium,
    color: Colors.light.text,
    fontWeight: '600',
    textAlign: 'center',
  },
  ctaNote: {
    ...Typography.caption,
    color: Colors.light.textLight,
    textAlign: 'center',
    marginTop: Spacing.md,
    fontStyle: 'italic',
  },
});
