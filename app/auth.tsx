/**
 * Authentication Page - Login and Signup with Role Selection
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import { appInit } from '@/services/appInitialization';
import { safeNavigate } from '@/utils/navigation';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ActionIcons } from '@/components/ui/ProfessionalIcons';

export default function AuthScreen() {
  const { user, isLoading, login, register } = useAuth();
  const { t } = useLanguage();
  const { role } = useLocalSearchParams();
  
  // Form states
  const [isLogin, setIsLogin] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'worker' | 'employer' | null>(role as 'worker' | 'employer' | null);
  const [showRoleSelection, setShowRoleSelection] = useState(!role);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Login form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Registration form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (user && !isLoading) {
      // Wait for app to be fully ready before navigating
      appInit.onInitialized(() => {
        console.log('App initialized, navigating to dashboard...');
        // Add a longer delay to ensure layout is mounted
        setTimeout(() => {
          safeNavigate('/(tabs)', 2000);
        }, 1000);
      });
      
      // Fallback: if app doesn't initialize within 8 seconds, navigate anyway
      setTimeout(() => {
        if (user && !isLoading) {
          console.log('Fallback navigation to dashboard...');
          safeNavigate('/(tabs)', 3000);
        }
      }, 8000);
    }
  }, [user, isLoading]);

  const handleLogin = async () => {
    try {
      console.log('=== LOGIN START ===');
      console.log('Login data:', { email: loginEmail, password: '***' });
      
      if (!loginEmail.trim() || !loginPassword.trim()) {
        Alert.alert('Missing Information', 'Please enter both email and password.');
        return;
      }
      
      const success = await login(loginEmail.trim(), loginPassword);
      if (success) {
        console.log('Login successful!');
        Alert.alert('Success', 'Login successful!');
        // Wait for app to be ready before navigating
        appInit.onInitialized(() => {
          setTimeout(() => {
            safeNavigate('/(tabs)', 2000);
          }, 1000);
        });
        
        // Fallback navigation
        setTimeout(() => {
          safeNavigate('/(tabs)', 3000);
        }, 5000);
      } else {
        console.log('Login failed');
        Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', `An error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleRegister = async () => {
    try {
      console.log('=== REGISTRATION START ===');
      console.log('Form data:', { name, email, phone, password: '***', selectedRole });
      
      // Validate required fields
      if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
        console.log('Validation failed: Missing required fields');
        Alert.alert('Missing Information', 'Please fill in all required fields (Name, Email, Phone, Password).');
        return;
      }
      
      if (password !== confirmPassword) {
        console.log('Validation failed: Passwords do not match');
        Alert.alert('Error', 'Passwords do not match');
        return;
      }
      
      if (!selectedRole) {
        console.log('Validation failed: No role selected');
        Alert.alert('Error', 'Please select your role');
        return;
      }
        
      const userData = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password: password,
        role: selectedRole,
        skillType: '',
        experience: '',
        location: '',
        organizationName: '',
        workType: '',
      };
      
      console.log('Calling register function with:', userData);
        
      const success = await register(userData);
      console.log('Register function returned:', success);
      
      if (success) {
        console.log('Registration successful!');
        Alert.alert('Success', 'Registration successful!');
        // Wait for app to be ready before navigating
        appInit.onInitialized(() => {
          setTimeout(() => {
            safeNavigate('/(tabs)', 2000);
          }, 1000);
        });
        
        // Fallback navigation
        setTimeout(() => {
          safeNavigate('/(tabs)', 3000);
        }, 5000);
      } else {
        console.log('Registration failed');
        Alert.alert('Registration Failed', 'Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', `An error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const renderRoleSelection = () => (
    <View style={styles.container}>
      <View style={styles.topHeader}>
        <Text style={styles.logo}>WorkConnect</Text>
      </View>
      
      <View style={styles.roleSelectionContainer}>
        <Text style={styles.roleSelectionTitle}>Choose Your Role</Text>
        <Text style={styles.roleSelectionSubtitle}>Select how you want to use WorkConnect</Text>
        
        <View style={styles.roleCards}>
          <TouchableOpacity
            style={[styles.roleCard, selectedRole === 'worker' && styles.selectedRoleCard]}
            onPress={() => setSelectedRole('worker')}
          >
            <View style={styles.roleIcon}>
              <Text style={styles.roleIconText}>👷</Text>
            </View>
            <Text style={styles.roleTitle}>Worker</Text>
            <Text style={styles.roleDescription}>Find jobs and earn money</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.roleCard, selectedRole === 'employer' && styles.selectedRoleCard]}
            onPress={() => setSelectedRole('employer')}
          >
            <View style={styles.roleIcon}>
              <Text style={styles.roleIconText}>🏢</Text>
            </View>
            <Text style={styles.roleTitle}>Employer</Text>
            <Text style={styles.roleDescription}>Hire workers for your projects</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => setShowRoleSelection(false)}
          disabled={!selectedRole}
        >
          <LinearGradient
            colors={selectedRole ? [Colors.light.primary, Colors.light.secondary] : [Colors.light.textLight, Colors.light.textLight]}
            style={styles.continueButtonGradient}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderLoginForm = () => (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={[Colors.light.background, Colors.light.surface]}
        style={styles.background}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.topHeader}>
            <Text style={styles.logo}>WorkConnect</Text>
          </View>
          
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Welcome Back!</Text>
            <Text style={styles.formSubtitle}>Sign in to continue your journey</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email Address *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={loginEmail}
                onChangeText={setLoginEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={Colors.light.textLight}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password *</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChangeText={setLoginPassword}
                  secureTextEntry={!showPassword}
                  placeholderTextColor={Colors.light.textLight}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <ActionIcons.eye size={20} color={Colors.light.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>
            
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <LinearGradient
                colors={[Colors.light.primary, Colors.light.secondary]}
                style={styles.loginButtonGradient}
              >
                <Text style={styles.loginButtonText}>
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <View style={styles.switchContainer}>
              <Text style={styles.switchText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => setIsLogin(false)}>
                <Text style={styles.switchLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );

  const renderRegistrationForm = () => (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={[Colors.light.background, Colors.light.surface]}
        style={styles.background}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.topHeader}>
            <Text style={styles.logo}>WorkConnect</Text>
          </View>
          
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Create Account</Text>
            <Text style={styles.formSubtitle}>Join as a {selectedRole}</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Full Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                value={name}
                onChangeText={setName}
                placeholderTextColor={Colors.light.textLight}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email Address *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={Colors.light.textLight}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Phone Number *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your phone number"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholderTextColor={Colors.light.textLight}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password *</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Create a password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholderTextColor={Colors.light.textLight}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <ActionIcons.eye size={20} color={Colors.light.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Confirm Password *</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  placeholderTextColor={Colors.light.textLight}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <ActionIcons.eye size={20} color={Colors.light.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>
            
            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegister}
              disabled={isLoading}
            >
              <LinearGradient
                colors={[Colors.light.primary, Colors.light.secondary]}
                style={styles.registerButtonGradient}
              >
                <Text style={styles.registerButtonText}>
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <View style={styles.switchContainer}>
              <Text style={styles.switchText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => setIsLogin(true)}>
                <Text style={styles.switchLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setShowRoleSelection(true)}
            >
              <Text style={styles.backButtonText}>← Back to Role Selection</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );

  return (
    <ProtectedRoute requireAuth={false}>
      {showRoleSelection ? renderRoleSelection() : (isLogin ? renderLoginForm() : renderRegistrationForm())}
    </ProtectedRoute>
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
  topHeader: {
    paddingTop: 60,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    alignItems: 'center',
  },
  logo: {
    ...Typography.h2,
    color: Colors.light.primary,
    fontWeight: 'bold',
  },
  roleSelectionContainer: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'center',
  },
  roleSelectionTitle: {
    ...Typography.h3,
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: Spacing.sm,
    fontWeight: 'bold',
  },
  roleSelectionSubtitle: {
    ...Typography.body,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  roleCards: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing.xl,
  },
  roleCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    width: '45%',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedRoleCard: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.primaryLight,
  },
  roleIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.light.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  roleIconText: {
    fontSize: 30,
  },
  roleTitle: {
    ...Typography.h5,
    color: Colors.light.text,
    fontWeight: 'bold',
    marginBottom: Spacing.xs,
  },
  roleDescription: {
    ...Typography.caption,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
  continueButton: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  continueButtonGradient: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
  },
  continueButtonText: {
    ...Typography.h5,
    color: Colors.light.background,
    fontWeight: 'bold',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  formTitle: {
    ...Typography.h3,
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: Spacing.sm,
    fontWeight: 'bold',
  },
  formSubtitle: {
    ...Typography.body,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  inputContainer: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    ...Typography.body,
    color: Colors.light.text,
    marginBottom: Spacing.xs,
    fontWeight: '600',
  },
  input: {
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    ...Typography.body,
    color: Colors.light.text,
    borderWidth: 1,
    borderColor: Colors.light.borderLight,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.light.borderLight,
  },
  passwordInput: {
    flex: 1,
    padding: Spacing.md,
    ...Typography.body,
    color: Colors.light.text,
  },
  eyeButton: {
    padding: Spacing.md,
  },
  loginButton: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  loginButtonGradient: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  loginButtonText: {
    ...Typography.h5,
    color: Colors.light.background,
    fontWeight: 'bold',
  },
  registerButton: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  registerButtonGradient: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  registerButtonText: {
    ...Typography.h5,
    color: Colors.light.background,
    fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  switchText: {
    ...Typography.body,
    color: Colors.light.textSecondary,
  },
  switchLink: {
    ...Typography.body,
    color: Colors.light.primary,
    fontWeight: 'bold',
  },
  backButton: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  backButtonText: {
    ...Typography.body,
    color: Colors.light.textSecondary,
  },
});