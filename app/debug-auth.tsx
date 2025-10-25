/**
 * Debug Authentication Screen
 * This screen helps debug authentication issues
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { fallbackAuthService, User } from '@/services/fallbackAuth';
import { useAuth } from '@/contexts/AuthContext';

export default function DebugAuthScreen() {
  const { login, register } = useAuth();
  const [users, setUsers] = useState<any[]>([]);

  const loadUsers = async () => {
    try {
      const allUsers = await fallbackAuthService.getAllUsers();
      setUsers(allUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const testLogin = async (email: string, password: string) => {
    try {
      console.log('Testing login with:', email);
      const success = await login(email, password);
      Alert.alert('Login Test', success ? 'Login successful!' : 'Login failed!');
    } catch (error) {
      Alert.alert('Login Test Error', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const testRegister = async () => {
    try {
      const testUser = {
        name: 'Test User',
        email: 'test@example.com',
        phone: '+1234567890',
        password: 'password123',
        role: 'worker' as const,
        skillType: 'Testing',
        experience: '1 year',
        location: 'Test City',
        organizationName: '',
        workType: 'part-time',
      };
      
      const success = await register(testUser);
      Alert.alert('Registration Test', success ? 'Registration successful!' : 'Registration failed!');
      if (success) {
        loadUsers();
      }
    } catch (error) {
      Alert.alert('Registration Test Error', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const clearUsers = async () => {
    try {
      await fallbackAuthService.clearAllUsers();
      Alert.alert('Success', 'All users cleared!');
      loadUsers();
    } catch (error) {
      Alert.alert('Error', 'Failed to clear users');
    }
  };

  React.useEffect(() => {
    loadUsers();
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.light.background, Colors.light.surface]}
        style={styles.background}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <Text style={styles.title}>Debug Authentication</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Test Users</Text>
            <Text style={styles.sectionSubtitle}>
              worker@test.com (password: any)
            </Text>
            <Text style={styles.sectionSubtitle}>
              employer@test.com (password: any)
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            
            <TouchableOpacity
              style={styles.button}
              onPress={() => testLogin('worker@test.com', 'any')}
            >
              <LinearGradient
                colors={[Colors.light.primary, Colors.light.secondary]}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Test Worker Login</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => testLogin('employer@test.com', 'any')}
            >
              <LinearGradient
                colors={[Colors.light.primary, Colors.light.secondary]}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Test Employer Login</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={testRegister}
            >
              <LinearGradient
                colors={[Colors.light.secondary, Colors.light.primary]}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Test Registration</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={loadUsers}
            >
              <LinearGradient
                colors={[Colors.light.textSecondary, Colors.light.textSecondary]}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Refresh Users</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={clearUsers}
            >
              <LinearGradient
                colors={[Colors.light.error, Colors.light.error]}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Clear All Users</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Stored Users ({users.length})</Text>
            {users.map((user, index) => (
              <View key={user.id || index} style={styles.userCard}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
                <Text style={styles.userRole}>Role: {user.role}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  background: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    alignItems: 'center',
  },
  title: {
    ...Typography.h2,
    color: Colors.light.primary,
    fontWeight: 'bold',
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.h4,
    color: Colors.light.text,
    fontWeight: 'bold',
    marginBottom: Spacing.sm,
  },
  sectionSubtitle: {
    ...Typography.body,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.xs,
  },
  button: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  buttonGradient: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
  },
  buttonText: {
    ...Typography.h5,
    color: Colors.light.background,
    fontWeight: 'bold',
  },
  userCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.light.borderLight,
  },
  userName: {
    ...Typography.h5,
    color: Colors.light.text,
    fontWeight: 'bold',
  },
  userEmail: {
    ...Typography.body,
    color: Colors.light.textSecondary,
    marginTop: Spacing.xs,
  },
  userRole: {
    ...Typography.caption,
    color: Colors.light.primary,
    marginTop: Spacing.xs,
  },
});
