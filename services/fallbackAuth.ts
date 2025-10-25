// Fallback Authentication Service (for development/testing)
import * as SecureStore from 'expo-secure-store';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'worker' | 'employer';
  profileImage?: string;
  skillType?: string;
  experience?: string;
  location?: string;
  organizationName?: string;
  workType?: string;
  rating?: number;
  totalJobs?: number;
  totalEarnings?: number;
  memberSince?: string;
}

class FallbackAuthService {
  private users: User[] = [];
  private readonly USERS_STORAGE_KEY = 'fallback_users';

  constructor() {
    this.loadUsers();
    this.initializeTestUsers();
  }

  private async initializeTestUsers(): Promise<void> {
    // Add some test users if none exist
    if (this.users.length === 0) {
      const testUsers: User[] = [
        {
          id: 'test-worker-1',
          name: 'John Worker',
          email: 'worker@test.com',
          phone: '+1234567890',
          role: 'worker',
          profileImage: '',
          skillType: 'Construction',
          experience: '5 years',
          location: 'New York',
          organizationName: '',
          workType: 'full-time',
          rating: 4.5,
          totalJobs: 25,
          totalEarnings: 15000,
          memberSince: new Date().toISOString(),
        },
        {
          id: 'test-employer-1',
          name: 'Jane Employer',
          email: 'employer@test.com',
          phone: '+1234567891',
          role: 'employer',
          profileImage: '',
          skillType: '',
          experience: '',
          location: 'Los Angeles',
          organizationName: 'ABC Construction',
          workType: '',
          rating: 0,
          totalJobs: 0,
          totalEarnings: 0,
          memberSince: new Date().toISOString(),
        }
      ];
      
      this.users = testUsers;
      await this.saveUsers();
      console.log('Fallback Auth: Initialized with test users');
      console.log('Fallback Auth: Test users available:', testUsers.map(u => `${u.email} (${u.role})`).join(', '));
    }
  }

  private async loadUsers(): Promise<void> {
    try {
      const storedUsers = await SecureStore.getItemAsync(this.USERS_STORAGE_KEY);
      if (storedUsers) {
        this.users = JSON.parse(storedUsers);
        console.log('Fallback Auth: Loaded', this.users.length, 'users from storage');
      }
    } catch (error) {
      console.error('Fallback Auth: Error loading users from storage:', error);
    }
  }

  private async saveUsers(): Promise<void> {
    try {
      await SecureStore.setItemAsync(this.USERS_STORAGE_KEY, JSON.stringify(this.users));
      console.log('Fallback Auth: Saved', this.users.length, 'users to storage');
    } catch (error) {
      console.error('Fallback Auth: Error saving users to storage:', error);
    }
  }

  async register(userData: Partial<User> & { password: string }): Promise<User | null> {
    try {
      console.log('Fallback Auth: Starting registration...');
      
      // Check if user already exists
      const existingUser = this.users.find(u => u.email === userData.email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Create user
      const newUser: User = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: userData.name!,
        email: userData.email!,
        phone: userData.phone!,
        role: userData.role!,
        profileImage: userData.profileImage || '',
        skillType: userData.skillType || '',
        experience: userData.experience || '',
        location: userData.location || '',
        organizationName: userData.organizationName || '',
        workType: userData.workType || '',
        rating: 0,
        totalJobs: 0,
        totalEarnings: 0,
        memberSince: new Date().toISOString(),
      };

      this.users.push(newUser);
      await this.saveUsers();
      console.log('Fallback Auth: User registered successfully');
      return newUser;
    } catch (error) {
      console.error('Fallback Auth registration error:', error);
      throw error;
    }
  }

  async login(email: string, password: string): Promise<User | null> {
    try {
      console.log('Fallback Auth: Starting login...');
      
      const user = this.users.find(u => u.email === email);
      if (user) {
        console.log('Fallback Auth: Login successful');
        return user;
      } else {
        console.log('Fallback Auth: User not found');
        return null;
      }
    } catch (error) {
      console.error('Fallback Auth login error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    console.log('Fallback Auth: Logout successful');
  }

  async updateUserProfile(userId: string, updates: Partial<User>): Promise<boolean> {
    try {
      console.log('Fallback Auth: Updating profile for user ID:', userId);
      console.log('Fallback Auth: Updates:', updates);
      console.log('Fallback Auth: Current users:', this.users.map(u => ({ id: u.id, email: u.email })));
      
      let userIndex = this.users.findIndex(u => u.id === userId);
      console.log('Fallback Auth: User index found by ID:', userIndex);
      
      // If not found by ID, try to find by email (fallback)
      if (userIndex === -1) {
        console.log('Fallback Auth: Trying to find user by email:', userId);
        userIndex = this.users.findIndex(u => u.email === userId);
        console.log('Fallback Auth: User index found by email:', userIndex);
      }
      
      // If still not found, try to find by any matching field
      if (userIndex === -1) {
        console.log('Fallback Auth: Trying to find user by any matching field');
        userIndex = this.users.findIndex(u => 
          u.id === userId || 
          u.email === userId || 
          (updates.email && u.email === updates.email)
        );
        console.log('Fallback Auth: User index found by any field:', userIndex);
      }
      
      if (userIndex !== -1) {
        const oldUser = this.users[userIndex];
        this.users[userIndex] = { ...oldUser, ...updates };
        console.log('Fallback Auth: Updated user:', this.users[userIndex]);
        
        await this.saveUsers();
        console.log('Fallback Auth: Profile updated successfully');
        return true;
      } else {
        console.error('Fallback Auth: User not found with ID:', userId);
        console.error('Fallback Auth: Available user IDs:', this.users.map(u => u.id));
        console.error('Fallback Auth: Available user emails:', this.users.map(u => u.email));
        
        // If user is not found, create a new user entry (this shouldn't happen normally)
        console.log('Fallback Auth: Creating new user entry as fallback');
        const newUser: User = {
          id: userId,
          name: updates.name || 'Unknown User',
          email: updates.email || '',
          phone: updates.phone || '',
          role: updates.role || 'worker',
          profileImage: updates.profileImage || '',
          skillType: updates.skillType || '',
          experience: updates.experience || '',
          location: updates.location || '',
          organizationName: updates.organizationName || '',
          workType: updates.workType || '',
          rating: updates.rating || 0,
          totalJobs: updates.totalJobs || 0,
          totalEarnings: updates.totalEarnings || 0,
          memberSince: updates.memberSince || new Date().toISOString(),
        };
        
        this.users.push(newUser);
        await this.saveUsers();
        console.log('Fallback Auth: Created new user entry');
        return true;
      }
    } catch (error) {
      console.error('Fallback Auth update profile error:', error);
      return false;
    }
  }

  async getUserById(userId: string): Promise<User | null> {
    try {
      const user = this.users.find(u => u.id === userId);
      return user || null;
    } catch (error) {
      console.error('Fallback Auth get user error:', error);
      return null;
    }
  }

  async clearAllUsers(): Promise<void> {
    try {
      this.users = [];
      await SecureStore.deleteItemAsync(this.USERS_STORAGE_KEY);
      console.log('Fallback Auth: All users cleared');
    } catch (error) {
      console.error('Fallback Auth clear users error:', error);
    }
  }

  async getAllUsers(): Promise<User[]> {
    console.log('Fallback Auth: Getting all users:', this.users.map(u => ({ id: u.id, email: u.email, name: u.name })));
    return [...this.users];
  }

  async syncUserData(userData: User): Promise<boolean> {
    try {
      console.log('Fallback Auth: Syncing user data:', userData.id);
      
      // Check if user already exists
      let userIndex = this.users.findIndex(u => u.id === userData.id);
      
      if (userIndex !== -1) {
        // Update existing user
        this.users[userIndex] = { ...this.users[userIndex], ...userData };
        console.log('Fallback Auth: Updated existing user');
      } else {
        // Add new user
        this.users.push(userData);
        console.log('Fallback Auth: Added new user');
      }
      
      await this.saveUsers();
      console.log('Fallback Auth: User data synced successfully');
      return true;
    } catch (error) {
      console.error('Fallback Auth sync user data error:', error);
      return false;
    }
  }
}

export const fallbackAuthService = new FallbackAuthService();
