import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

interface JobLocation {
  id: string;
  title: string;
  pay: string;
  distance: string;
  coordinates: { latitude: number; longitude: number };
  skills: string[];
}

interface JobMapProps {
  jobs: JobLocation[];
  onJobSelect?: (job: JobLocation) => void;
  userLocation?: { latitude: number; longitude: number };
}

export default function JobMap({ jobs, onJobSelect, userLocation }: JobMapProps) {
  const [selectedJob, setSelectedJob] = useState<JobLocation | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleJobPress = (job: JobLocation) => {
    setSelectedJob(job);
    if (onJobSelect) {
      onJobSelect(job);
    }
  };

  const renderJobMarker = (job: JobLocation, index: number) => {
    const isSelected = selectedJob?.id === job.id;
    const left = 50 + (index * 80) % (width - 100);
    const top = 100 + (index * 60) % (height - 200);

    return (
      <Animated.View
        key={job.id}
        style={[
          styles.jobMarker,
          {
            left,
            top,
            opacity: fadeAnim,
            transform: [
              {
                scale: isSelected ? 1.2 : 1,
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.markerButton,
            isSelected && styles.selectedMarker,
          ]}
          onPress={() => handleJobPress(job)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={isSelected ? [Colors.light.primary, '#1a4d80'] : [Colors.light.success, '#2ecc71']}
            style={styles.markerGradient}
          >
            <Text style={styles.markerText}>💼</Text>
          </LinearGradient>
        </TouchableOpacity>
        
        {isSelected && (
          <View style={styles.jobInfo}>
            <Text style={styles.jobTitle}>{job.title}</Text>
            <Text style={styles.jobPay}>{job.pay}</Text>
            <Text style={styles.jobDistance}>{job.distance}</Text>
            <View style={styles.jobSkills}>
              {job.skills.map((skill, skillIndex) => (
                <View key={skillIndex} style={styles.skillTag}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </Animated.View>
    );
  };

  const renderUserLocation = () => {
    if (!userLocation) return null;

    return (
      <Animated.View
        style={[
          styles.userLocation,
          {
            left: width / 2 - 15,
            top: height / 2 - 15,
            opacity: fadeAnim,
          },
        ]}
      >
        <LinearGradient
          colors={[Colors.light.primary, '#1a4d80']}
          style={styles.userLocationGradient}
        >
          <Text style={styles.userLocationText}>📍</Text>
        </LinearGradient>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#E8F5E8', '#F0F8F0']}
        style={styles.mapBackground}
      >
        {/* Map Grid */}
        <View style={styles.mapGrid}>
          {Array.from({ length: 20 }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.gridLine,
                {
                  left: (index * width) / 20,
                  opacity: 0.1,
                },
              ]}
            />
          ))}
          {Array.from({ length: 15 }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.gridLine,
                {
                  top: (index * height) / 15,
                  width: '100%',
                  height: 1,
                  opacity: 0.1,
                },
              ]}
            />
          ))}
        </View>

        {/* Job Markers */}
        {jobs.map(renderJobMarker)}

        {/* User Location */}
        {renderUserLocation()}

        {/* Map Controls */}
        <View style={styles.mapControls}>
          <TouchableOpacity style={styles.controlButton}>
            <Text style={styles.controlText}>🔍</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton}>
            <Text style={styles.controlText}>📍</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton}>
            <Text style={styles.controlText}>🗺️</Text>
          </TouchableOpacity>
        </View>

        {/* Map Legend */}
        <View style={styles.mapLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendMarker, { backgroundColor: Colors.light.success }]} />
            <Text style={styles.legendText}>Available Jobs</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendMarker, { backgroundColor: Colors.light.primary }]} />
            <Text style={styles.legendText}>Your Location</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapBackground: {
    flex: 1,
    position: 'relative',
  },
  mapGrid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gridLine: {
    position: 'absolute',
    width: 1,
    height: '100%',
    backgroundColor: Colors.light.textLight,
  },
  jobMarker: {
    position: 'absolute',
    width: 40,
    height: 40,
  },
  markerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    shadowColor: Colors.light.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  selectedMarker: {
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  markerGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerText: {
    fontSize: 20,
  },
  jobInfo: {
    position: 'absolute',
    top: 45,
    left: -50,
    width: 140,
    backgroundColor: Colors.light.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    shadowColor: Colors.light.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  jobTitle: {
    ...Typography.caption,
    color: Colors.light.text,
    fontWeight: '600',
    marginBottom: 2,
  },
  jobPay: {
    ...Typography.small,
    color: Colors.light.success,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  jobDistance: {
    ...Typography.small,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.xs,
  },
  jobSkills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillTag: {
    backgroundColor: Colors.light.surface,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: BorderRadius.sm,
    marginRight: 2,
    marginBottom: 2,
  },
  skillText: {
    ...Typography.small,
    color: Colors.light.textSecondary,
    fontSize: 8,
  },
  userLocation: {
    position: 'absolute',
    width: 30,
    height: 30,
  },
  userLocationGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
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
  userLocationText: {
    fontSize: 16,
  },
  mapControls: {
    position: 'absolute',
    top: Spacing.lg,
    right: Spacing.lg,
  },
  controlButton: {
    width: 40,
    height: 40,
    backgroundColor: Colors.light.background,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    shadowColor: Colors.light.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  controlText: {
    fontSize: 18,
  },
  mapLegend: {
    position: 'absolute',
    bottom: Spacing.lg,
    left: Spacing.lg,
    backgroundColor: Colors.light.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    shadowColor: Colors.light.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  legendMarker: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: Spacing.sm,
  },
  legendText: {
    ...Typography.caption,
    color: Colors.light.text,
  },
});
