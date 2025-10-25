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
  TextInput,
  RefreshControl,
  Alert,
  Image,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import ScreenWrapper from '@/components/ScreenWrapper';
import { isTablet, isLandscape, getResponsiveSpacing, getGridColumns, getCardWidth, getSafeAreaPadding } from '@/utils/responsive';
import { 
  JobCategoryIcons, 
  ActionIcons, 
  IconContainer 
} from '@/components/ui/ProfessionalIcons';
import { RichMedia } from '@/components/ui/RichMedia';
import { jobService } from '@/services/jobService';
import { JobPost } from '@/services/simpleJobService';
import { getJobImage, getCompanyLogo, getVideoThumbnail, getVideoUrl } from '@/services/imageService';

const { width, height } = Dimensions.get('window');

// Job categories for filtering
const jobCategories = [
  { id: 'all', name: 'All Jobs', icon: 'all' },
  { id: 'electrical', name: 'Electrical', icon: 'electrical' },
  { id: 'plumbing', name: 'Plumbing', icon: 'plumbing' },
  { id: 'cleaning', name: 'Cleaning', icon: 'cleaning' },
  { id: 'gardening', name: 'Gardening', icon: 'gardening' },
  { id: 'construction', name: 'Construction', icon: 'construction' },
];

// Fetch all available jobs from the job service
const getAvailableJobs = async (): Promise<any[]> => {
  try {
    const jobs = await jobService.getAllJobs();
    
    // Transform jobs to match the expected format for the explore page
    return jobs.map(job => ({
      id: job.id,
      title: job.title,
      description: job.description,
      location: job.location,
      pay: job.pay || job.salary || 'Not specified',
      duration: job.duration,
      skills: Array.isArray(job.skills) ? job.skills : (job.skills ? [job.skills] : []),
      workType: job.workType || job.jobType || 'full-time',
      urgency: job.urgency || 'normal',
      urgent: job.urgent || job.urgency === 'urgent' || job.urgency === 'high',
      company: job.company || job.employerName,
      companyLogo: job.companyLogo || '',
      image: job.image || '',
      rating: 4.5, // TODO: Get actual company rating
      distance: '2.5 km', // TODO: Calculate actual distance
      posted: new Date(job.createdAt).toLocaleDateString(),
      category: job.category || job.skills?.[0] || 'general',
    }));
  } catch (error) {
    console.error('Error fetching available jobs:', error);
    return [];
  }
};

export default function ExploreScreen() {
  const { user } = useAuth();
  const { t, isInitialized } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  React.useEffect(() => {
    filterJobs();
  }, [selectedCategory, searchQuery]);

  // Check applied jobs when filteredJobs changes
  React.useEffect(() => {
    const checkAppliedJobs = async () => {
      if (user && filteredJobs.length > 0) {
        const appliedIds = new Set<string>();
        for (const job of filteredJobs) {
          const applied = await jobService.hasUserAppliedForJob(job.id, user.id);
          if (applied) {
            appliedIds.add(job.id);
          }
        }
        setAppliedJobIds(appliedIds);
      }
    };
    checkAppliedJobs();
  }, [filteredJobs, user]);

  const filterJobs = async () => {
    let filtered = await getAvailableJobs();
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((job: any) => 
        job.category?.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        job.skills?.some((skill: string) => skill.toLowerCase().includes(selectedCategory.toLowerCase()))
      );
    }
    
    if (searchQuery) {
      filtered = filtered.filter((job: any) => 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.skills?.some((skill: string) => skill.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    setFilteredJobs(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await filterJobs();
    setRefreshing(false);
  };

  const handleJobApply = (jobId: string) => {
    // Show job details modal
    const job = filteredJobs.find(j => j.id === jobId);
    if (job) {
      setSelectedJob(job);
      setIsModalVisible(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedJob(null);
  };

  const handleApplyFromModal = () => {
    if (selectedJob) {
      // Add to applied jobs
      setAppliedJobIds(prev => new Set([...prev, selectedJob.id]));
      handleCloseModal();
      // Navigate to application form
      router.push({
        pathname: '/job-application',
        params: { jobId: selectedJob.id }
      });
    }
  };

  const renderCategoryFilter = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.categoryContainer}
      contentContainerStyle={styles.categoryContent}
    >
      {jobCategories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.categoryButton,
            selectedCategory === category.id && styles.activeCategory,
          ]}
          onPress={() => setSelectedCategory(category.id)}
        >
          <IconContainer
            backgroundColor={selectedCategory === category.id ? Colors.light.background : Colors.light.surface}
            size={24}
            borderRadius={12}
          >
            {(() => {
              const IconComponent = JobCategoryIcons[category.icon as keyof typeof JobCategoryIcons];
              return <IconComponent size={14} color={selectedCategory === category.id ? Colors.light.primary : Colors.light.textSecondary} />;
            })()}
          </IconContainer>
          <Text style={[
            styles.categoryText,
            selectedCategory === category.id && styles.activeCategoryText,
          ]}>
            {t(`explore.${category.id}`)}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderJobCard = ({ item }: { item: any }) => {
    const isApplied = appliedJobIds.has(item.id);
    
    return (
      <TouchableOpacity 
        style={[styles.jobCard, isApplied && styles.appliedJobCard]}
        onPress={() => handleJobApply(item.id)}
        activeOpacity={0.8}
      >
        {/* Rich Media Section */}
        <View style={styles.jobMediaSection}>
          <RichMedia
            type="image"
            source={item.image}
            title={item.title}
            aspectRatio={16/9}
            style={styles.jobMedia}
          />
          
          {/* Company Logo */}
          <View style={styles.companyLogoContainer}>
            <Image 
              source={{ uri: item.companyLogo }} 
              style={styles.companyLogo}
            />
          </View>
          
          {/* Urgent Badge */}
          {item.urgent && (
            <View style={styles.urgentBadge}>
              <ActionIcons.urgent size={12} color={Colors.light.background} />
              <Text style={styles.urgentText}>URGENT</Text>
            </View>
          )}
        </View>

        <View style={styles.jobContent}>
          <View style={styles.jobHeader}>
            <View style={styles.jobTitleContainer}>
              <Text style={styles.jobTitle}>{item.title}</Text>
            </View>
            <Text style={styles.jobPay}>{item.pay}</Text>
          </View>

          <View style={styles.jobCompany}>
            <Text style={styles.companyName}>{item.company}</Text>
            <View style={styles.ratingContainer}>
              <ActionIcons.rating size={16} color={Colors.light.warning} />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
          </View>

          <View style={styles.jobLocation}>
            <View style={styles.locationRow}>
              <ActionIcons.location size={14} color={Colors.light.textSecondary} />
              <Text style={styles.locationText}>{item.location}</Text>
            </View>
            <View style={styles.distanceRow}>
              <ActionIcons.distance size={14} color={Colors.light.textSecondary} />
              <Text style={styles.distanceText}>{item.distance}</Text>
            </View>
            <View style={styles.timeRow}>
              <ActionIcons.time size={14} color={Colors.light.textSecondary} />
              <Text style={styles.durationText}>{item.duration}</Text>
            </View>
          </View>

          <Text style={styles.jobDescription}>{item.description}</Text>

          <View style={styles.jobSkills}>
            {item.skills.map((skill: string, index: number) => (
              <View key={index} style={styles.skillTag}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>

          <View style={styles.jobFooter}>
            <Text style={styles.postedTime}>Posted {item.posted}</Text>
            <TouchableOpacity 
              style={[styles.applyButton, isApplied && styles.appliedButton]}
              onPress={() => handleJobApply(item.id)}
            >
              {isApplied ? (
                <View style={styles.appliedButtonContent}>
                  <ActionIcons.applied size={16} color={Colors.light.background} />
                  <Text style={styles.appliedButtonText}>{t('explore.applied')}</Text>
                </View>
              ) : (
                <View style={styles.applyButtonContent}>
                  <ActionIcons.apply size={16} color={Colors.light.background} />
                  <Text style={styles.applyButtonText}>{t('explore.apply_now')}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder={t('explore.search_placeholder')}
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor={Colors.light.textLight}
      />
      <TouchableOpacity style={styles.searchButton}>
        <ActionIcons.search size={20} color={Colors.light.textSecondary} />
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
    <ScreenWrapper title="nav.explore">
      <View style={styles.container}>
        <LinearGradient
          colors={[Colors.light.background, Colors.light.surface]}
          style={styles.background}
        >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{t('explore.title')}</Text>
            <Text style={styles.headerSubtitle}>{t('explore.subtitle')}</Text>
          </View>

          {renderSearchBar()}
          {renderCategoryFilter()}
          

          <FlatList
            data={filteredJobs}
            renderItem={renderJobCard}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={[
              styles.jobsList,
              isTablet && styles.jobsListTablet
            ]}
            numColumns={isTablet ? 2 : 1}
            key={isTablet ? 'tablet' : 'phone'}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <IconContainer
                  backgroundColor={Colors.light.surface}
                  size={80}
                  borderRadius={40}
                >
                  <ActionIcons.search size={40} color={Colors.light.textLight} />
                </IconContainer>
                <Text style={styles.emptyTitle}>No jobs found</Text>
                <Text style={styles.emptyMessage}>
                  Try adjusting your search or filters
                </Text>
              </View>
            )}
          />
        </Animated.View>
      </LinearGradient>
    </View>

    {/* Job Details Modal */}
    <Modal
      visible={isModalVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleCloseModal}
    >
      {selectedJob && (
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
              <ActionIcons.x size={24} color={Colors.light.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Job Details</Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Job Image */}
            {selectedJob.image && (
              <View style={styles.modalJobImageContainer}>
                <Image 
                  source={{ uri: selectedJob.image }} 
                  style={styles.modalJobImage}
                  resizeMode="cover"
                />
              </View>
            )}

            {/* Job Header */}
            <View style={styles.modalJobHeader}>
              <Text style={styles.modalJobTitle}>{selectedJob.title}</Text>
              <Text style={styles.modalJobPay}>{selectedJob.pay}</Text>
            </View>

            {/* Company Info */}
            <View style={styles.modalCompanyInfo}>
              <Text style={styles.modalCompanyName}>{selectedJob.company}</Text>
              <View style={styles.modalRatingContainer}>
                <ActionIcons.rating size={16} color={Colors.light.warning} />
                <Text style={styles.modalRatingText}>{selectedJob.rating}</Text>
              </View>
            </View>

            {/* Location and Details */}
            <View style={styles.modalJobDetails}>
              <View style={styles.modalDetailRow}>
                <ActionIcons.location size={16} color={Colors.light.textSecondary} />
                <Text style={styles.modalDetailText}>{selectedJob.location}</Text>
              </View>
              <View style={styles.modalDetailRow}>
                <ActionIcons.distance size={16} color={Colors.light.textSecondary} />
                <Text style={styles.modalDetailText}>{selectedJob.distance}</Text>
              </View>
              <View style={styles.modalDetailRow}>
                <ActionIcons.time size={16} color={Colors.light.textSecondary} />
                <Text style={styles.modalDetailText}>{selectedJob.duration}</Text>
              </View>
              <View style={styles.modalDetailRow}>
                <ActionIcons.calendar size={16} color={Colors.light.textSecondary} />
                <Text style={styles.modalDetailText}>Posted {selectedJob.posted}</Text>
              </View>
            </View>

            {/* Job Description */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Job Description</Text>
              <Text style={styles.modalDescription}>{selectedJob.description}</Text>
            </View>

            {/* Skills */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Required Skills</Text>
              <View style={styles.modalSkillsContainer}>
                {selectedJob.skills.map((skill: string, index: number) => (
                  <View key={index} style={styles.modalSkillTag}>
                    <Text style={styles.modalSkillText}>{skill}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Urgent Badge */}
            {selectedJob.urgent && (
              <View style={styles.modalUrgentBadge}>
                <ActionIcons.urgent size={16} color={Colors.light.background} />
                <Text style={styles.modalUrgentText}>URGENT</Text>
              </View>
            )}
          </ScrollView>

          {/* Modal Actions */}
          <View style={styles.modalActions}>
            <TouchableOpacity 
              style={styles.modalApplyButton}
              onPress={handleApplyFromModal}
            >
              <LinearGradient
                colors={[Colors.light.primary, Colors.light.primaryLight]}
                style={styles.modalApplyButtonGradient}
              >
                <ActionIcons.apply size={20} color={Colors.light.background} />
                <Text style={styles.modalApplyButtonText}>Apply Now</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Modal>
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
    padding: isTablet ? Spacing.xl : Spacing.lg,
    paddingHorizontal: isTablet ? Spacing.xxl : Spacing.lg,
    paddingTop: isLandscape ? Spacing.md : (isTablet ? Spacing.xl : Spacing.lg),
  },
  header: {
    marginBottom: Spacing.lg,
  },
  headerTitle: {
    ...Typography.h1,
    color: Colors.light.text,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    ...Typography.body,
    color: Colors.light.textSecondary,
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.light.background,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.lg,
    shadowColor: Colors.light.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    ...Typography.body,
    color: Colors.light.text,
  },
  searchButton: {
    padding: Spacing.sm,
  },
  searchIcon: {
    fontSize: 20,
  },
  categoryContainer: {
    marginBottom: Spacing.lg,
  },
  categoryContent: {
    paddingHorizontal: Spacing.xs,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.round,
    marginRight: Spacing.sm,
  },
  activeCategory: {
    backgroundColor: Colors.light.primary,
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: Spacing.xs,
  },
  categoryText: {
    ...Typography.caption,
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
  activeCategoryText: {
    color: Colors.light.background,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.light.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    shadowColor: Colors.light.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    ...Typography.h3,
    color: Colors.light.primary,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.light.textSecondary,
  },
  jobsList: {
    paddingBottom: Spacing.lg,
  },
  jobsListTablet: {
    paddingHorizontal: Spacing.lg,
    justifyContent: 'space-around',
  },
  jobCard: {
    backgroundColor: Colors.light.card,
    borderRadius: BorderRadius.lg,
    padding: getResponsiveSpacing(Spacing.lg, Spacing.xl, Spacing.xxl),
    marginBottom: getResponsiveSpacing(Spacing.md, Spacing.lg, Spacing.xl),
    marginHorizontal: isTablet ? getResponsiveSpacing(Spacing.sm, Spacing.md, Spacing.lg) : 0,
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
    maxWidth: isTablet ? getCardWidth() : undefined,
    alignSelf: isTablet ? 'center' : 'stretch',
    minHeight: getResponsiveSpacing(200, 220, 240),
  },
  jobMediaSection: {
    position: 'relative',
    marginBottom: Spacing.md,
  },
  jobMedia: {
    borderRadius: BorderRadius.md,
  },
  companyLogoContainer: {
    position: 'absolute',
    top: getResponsiveSpacing(Spacing.sm, Spacing.md, Spacing.lg),
    right: getResponsiveSpacing(Spacing.sm, Spacing.md, Spacing.lg),
    width: getResponsiveSpacing(40, 44, 48),
    height: getResponsiveSpacing(40, 44, 48),
    borderRadius: getResponsiveSpacing(20, 22, 24),
    backgroundColor: Colors.light.background,
    padding: getResponsiveSpacing(2, 3, 4),
    shadowColor: Colors.light.shadow,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  companyLogo: {
    width: getResponsiveSpacing(36, 40, 44),
    height: getResponsiveSpacing(36, 40, 44),
    borderRadius: getResponsiveSpacing(18, 20, 22),
  },
  jobContent: {
    paddingHorizontal: getResponsiveSpacing(Spacing.md, Spacing.lg, Spacing.xl),
    paddingBottom: getResponsiveSpacing(Spacing.md, Spacing.lg, Spacing.xl),
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  jobTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  urgentBadge: {
    backgroundColor: Colors.light.error,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
  },
  urgentText: {
    ...Typography.small,
    color: Colors.light.background,
    fontWeight: 'bold',
    marginLeft: Spacing.xs,
  },
  jobTitle: {
    ...Typography.h5,
    color: Colors.light.text,
    flex: 1,
    marginRight: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  jobPay: {
    ...Typography.h4,
    color: Colors.light.success,
    fontWeight: 'bold',
  },
  jobCompany: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  companyName: {
    ...Typography.body,
    color: Colors.light.textSecondary,
    fontWeight: '500',
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
  jobLocation: {
    marginBottom: Spacing.md,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    ...Typography.caption,
    color: Colors.light.textSecondary,
    marginLeft: Spacing.xs,
  },
  distanceText: {
    ...Typography.caption,
    color: Colors.light.textSecondary,
    marginLeft: Spacing.xs,
  },
  durationText: {
    ...Typography.caption,
    color: Colors.light.textSecondary,
    marginLeft: Spacing.xs,
  },
  jobDescription: {
    ...Typography.body,
    color: Colors.light.text,
    lineHeight: isTablet ? 24 : 20,
    marginBottom: Spacing.md,
    flexWrap: 'wrap',
  },
  jobSkills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Spacing.md,
  },
  skillTag: {
    backgroundColor: Colors.light.surface,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  skillText: {
    ...Typography.small,
    color: Colors.light.textSecondary,
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postedTime: {
    ...Typography.caption,
    color: Colors.light.textLight,
  },
  applyButton: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: getResponsiveSpacing(Spacing.sm, Spacing.md, Spacing.lg),
    paddingVertical: getResponsiveSpacing(Spacing.sm, Spacing.md, Spacing.lg),
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
    minHeight: getResponsiveSpacing(36, 40, 44),
  },
  applyButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appliedButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  applyButtonText: {
    ...Typography.captionMedium,
    color: Colors.light.background,
    fontWeight: '600',
    marginLeft: Spacing.xs,
  },
  appliedJobCard: {
    borderColor: Colors.light.success,
    borderWidth: 2,
  },
  appliedButton: {
    backgroundColor: Colors.light.success,
    paddingHorizontal: getResponsiveSpacing(Spacing.lg, Spacing.xl, Spacing.xxl),
    paddingVertical: getResponsiveSpacing(Spacing.sm, Spacing.md, Spacing.lg),
    borderRadius: BorderRadius.md,
    shadowColor: Colors.light.success,
    shadowOpacity: 0.2,
  },
  appliedButtonText: {
    ...Typography.captionMedium,
    color: Colors.light.background,
    fontWeight: '600',
    marginLeft: Spacing.xs,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyTitle: {
    ...Typography.h3,
    color: Colors.light.text,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptyMessage: {
    ...Typography.body,
    color: Colors.light.textSecondary,
    textAlign: 'center',
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
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  closeButton: {
    padding: Spacing.sm,
  },
  modalTitle: {
    fontSize: Typography.h3.fontSize,
    fontWeight: Typography.h3.fontWeight,
    color: Colors.light.text,
  },
  placeholder: {
    width: 40,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  modalJobImageContainer: {
    marginVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  modalJobImage: {
    width: '100%',
    height: 200,
    backgroundColor: Colors.light.surface,
  },
  modalJobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  modalJobTitle: {
    fontSize: Typography.h3.fontSize,
    fontWeight: Typography.h3.fontWeight,
    color: Colors.light.text,
    flex: 1,
    marginRight: Spacing.md,
  },
  modalJobPay: {
    fontSize: Typography.h4.fontSize,
    fontWeight: Typography.h4.fontWeight,
    color: Colors.light.success,
  },
  modalCompanyInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  modalCompanyName: {
    fontSize: Typography.body.fontSize,
    fontWeight: Typography.body.fontWeight,
    color: Colors.light.textSecondary,
  },
  modalRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalRatingText: {
    fontSize: Typography.caption.fontSize,
    color: Colors.light.textSecondary,
    marginLeft: Spacing.xs,
  },
  modalJobDetails: {
    marginBottom: Spacing.lg,
  },
  modalDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  modalDetailText: {
    fontSize: Typography.caption.fontSize,
    color: Colors.light.textSecondary,
    marginLeft: Spacing.sm,
  },
  modalSection: {
    marginBottom: Spacing.lg,
  },
  modalSectionTitle: {
    fontSize: Typography.h4.fontSize,
    fontWeight: Typography.h4.fontWeight,
    color: Colors.light.text,
    marginBottom: Spacing.sm,
  },
  modalDescription: {
    fontSize: Typography.body.fontSize,
    color: Colors.light.textSecondary,
    lineHeight: 22,
  },
  modalSkillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  modalSkillTag: {
    backgroundColor: Colors.light.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  modalSkillText: {
    fontSize: Typography.small.fontSize,
    color: Colors.light.textSecondary,
    fontWeight: Typography.small.fontWeight,
  },
  modalUrgentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.error,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
    marginBottom: Spacing.lg,
  },
  modalUrgentText: {
    fontSize: Typography.small.fontSize,
    fontWeight: Typography.small.fontWeight,
    color: Colors.light.background,
    marginLeft: Spacing.xs,
  },
  modalActions: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.light.background,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  modalApplyButton: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  modalApplyButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    gap: Spacing.sm,
  },
  modalApplyButtonText: {
    fontSize: Typography.body.fontSize,
    fontWeight: Typography.body.fontWeight,
    color: Colors.light.background,
  },
});