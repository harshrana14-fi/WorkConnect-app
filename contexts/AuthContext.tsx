import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import { appInit } from '@/services/appInitialization';
import { fallbackAuthService, User } from '@/services/fallbackAuth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Partial<User> & { password: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
  uploadProfileImage: (imageUri: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize app first
    appInit.initialize();
    
    // Check for existing user data in SecureStore
    const checkExistingUser = async () => {
      try {
        const userData = await SecureStore.getItemAsync('userData');
        if (userData) {
          const user = JSON.parse(userData);
          setUser(user);
          console.log('Auth: Found existing user data');
          
          // Sync user data with fallbackAuthService
          await fallbackAuthService.syncUserData(user);
        }
      } catch (error) {
        console.error('Auth: Error loading existing user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingUser();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      console.log('Auth: Starting login...');
      console.log('Auth: Email:', email);
      
      // Use only fallback authentication
      const userData = await fallbackAuthService.login(email, password);
      console.log('Auth: Login result:', userData ? 'Success' : 'Failed');
      
      if (userData) {
        setUser(userData);
        await SecureStore.setItemAsync('authToken', 'auth-token');
        await SecureStore.setItemAsync('userData', JSON.stringify(userData));
        
        // Sync user data with fallbackAuthService
        await fallbackAuthService.syncUserData(userData);
        
        console.log('Auth: Login successful');
        return true;
      }
      
      console.log('Auth: Login failed - no user data returned');
      Alert.alert('Login Failed', 'Invalid email or password. Please check your credentials or try registering a new account.');
      return false;
    } catch (error) {
      console.error('Auth login error:', error);
      Alert.alert('Login Error', 'An error occurred during login. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Partial<User> & { password: string }): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      console.log('=== AUTH REGISTER START ===');
      console.log('Registration attempt:', { 
        email: userData.email, 
        role: userData.role,
        name: userData.name,
        phone: userData.phone 
      });
      
      // Validate required fields
      if (!userData.email || !userData.password || !userData.name || !userData.phone) {
        console.error('Missing required fields:', {
          email: !!userData.email,
          password: !!userData.password,
          name: !!userData.name,
          phone: !!userData.phone
        });
        Alert.alert('Error', 'Missing required fields. Please check your input.');
        return false;
      }
      
      // Use only fallback authentication
      const newUser = await fallbackAuthService.register(userData);
      console.log('Auth: Registration result:', newUser ? 'Success' : 'Failed');
      
      if (newUser) {
        console.log('User registered successfully, setting state...');
        setUser(newUser);
        await SecureStore.setItemAsync('authToken', 'auth-token');
        await SecureStore.setItemAsync('userData', JSON.stringify(newUser));
        
        // Sync user data with fallbackAuthService
        await fallbackAuthService.syncUserData(newUser);
        
        console.log('Auth: Registration successful');
        return true;
      }
      
      console.error('Registration failed - no user returned');
      Alert.alert('Error', 'Failed to create user account. Please try again.');
      return false;
      
    } catch (error) {
      console.error('Auth registration error:', error);
      Alert.alert('Registration Error', 'An error occurred during registration. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Use only fallback logout
      await fallbackAuthService.logout();
      
      setUser(null);
      await SecureStore.deleteItemAsync('authToken');
      await SecureStore.deleteItemAsync('userData');
      console.log('Auth: Logout successful');
      router.replace('/auth');
    } catch (error) {
      console.error('Auth logout error:', error);
      Alert.alert('Logout Error', 'An error occurred during logout');
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    try {
      if (!user) {
        console.error('Auth: No user logged in for profile update');
        return false;
      }
      
      console.log('Auth: Updating profile for user:', user.id);
      console.log('Auth: Updates to apply:', updates);
      
      // Try to update in fallbackAuthService first
      let success = await fallbackAuthService.updateUserProfile(user.id, updates);
      
      // If that fails, try updating by email as fallback
      if (!success && user.email) {
        console.log('Auth: Trying to update by email as fallback:', user.email);
        success = await fallbackAuthService.updateUserProfile(user.email, updates);
      }
      
      if (success) {
        // Update local user state
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        await SecureStore.setItemAsync('userData', JSON.stringify(updatedUser));
        console.log('Auth: Profile updated successfully');
      } else {
        console.error('Auth: Profile update failed in service');
        // Even if service update fails, update local state for better UX
        if (user) {
          const updatedUser = { ...user, ...updates };
          setUser(updatedUser);
          await SecureStore.setItemAsync('userData', JSON.stringify(updatedUser));
          console.log('Auth: Updated local state despite service failure');
          return true; // Return true for better UX
        }
        return false;
      }
      return success;
    } catch (error) {
      console.error('Auth update profile error:', error);
      // Even if there's an error, try to update local state
      try {
        if (user) {
          const updatedUser = { ...user, ...updates };
          setUser(updatedUser);
          await SecureStore.setItemAsync('userData', JSON.stringify(updatedUser));
          console.log('Auth: Updated local state despite error');
          return true;
        }
        return false;
      } catch (localError) {
        console.error('Auth: Failed to update local state:', localError);
        return false;
      }
    }
  };

  const uploadProfileImage = async (imageUri: string): Promise<boolean> => {
    try {
      if (!user) return false;
      
      const success = await updateProfile({ profileImage: imageUri });
      console.log('Auth: Profile image uploaded successfully');
      return success;
    } catch (error) {
      console.error('Auth upload profile image error:', error);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
    uploadProfileImage,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};