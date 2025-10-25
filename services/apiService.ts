import { 
  authenticateUser, 
  createUser, 
  updateUser, 
  connectDB 
} from './sqlite';
import jobService from './jobService';
import { 
  createNotification,
  getUserNotifications,
  markNotificationAsRead
} from './sqlite';

// Authentication API
export const authAPI = {
  login: async (email: string, password: string) => {
    try {
      await connectDB();
      const user = await authenticateUser(email, password);
      if (!user) {
        throw new Error('Invalid credentials');
      }
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (userData: any) => {
    try {
      await connectDB();
      const user = await createUser(userData);
      return user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  updateProfile: async (userId: string, updateData: any) => {
    try {
      await connectDB();
      const user = await updateUser(userId, updateData);
      return user;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  }
};

// Job Posts API
export const jobAPI = {
  create: async (jobData: any) => {
    try {
      return await jobService.createJobPost(jobData);
    } catch (error) {
      console.error('Create job error:', error);
      throw error;
    }
  },

  getAll: async (filters: any = {}) => {
    try {
      return await jobService.getAllJobs();
    } catch (error) {
      console.error('Get jobs error:', error);
      throw error;
    }
  },

  getById: async (jobId: string) => {
    try {
      return await jobService.getJobById(jobId);
    } catch (error) {
      console.error('Get job by ID error:', error);
      throw error;
    }
  },

  update: async (jobId: string, updateData: any) => {
    try {
      return await jobService.updateJobPost(jobId, updateData);
    } catch (error) {
      console.error('Update job error:', error);
      throw error;
    }
  },

  delete: async (jobId: string) => {
    try {
      return await jobService.deleteJobPost(jobId);
    } catch (error) {
      console.error('Delete job error:', error);
      throw error;
    }
  },

  apply: async (applicationData: any) => {
    try {
      return await jobService.applyForJob(applicationData);
    } catch (error) {
      console.error('Apply to job error:', error);
      throw error;
    }
  },

  search: async (searchQuery: string, filters: any = {}) => {
    try {
      return await jobService.searchJobs(searchQuery);
    } catch (error) {
      console.error('Search jobs error:', error);
      throw error;
    }
  },

  getByCategory: async (category: string) => {
    try {
      return await jobService.getJobsByCategory(category);
    } catch (error) {
      console.error('Get jobs by category error:', error);
      throw error;
    }
  }
};

// Notifications API
export const notificationAPI = {
  create: async (notificationData: any) => {
    try {
      return await createNotification(notificationData);
    } catch (error) {
      console.error('Create notification error:', error);
      throw error;
    }
  },

  getUserNotifications: async (userId: string) => {
    try {
      return await getUserNotifications(userId);
    } catch (error) {
      console.error('Get notifications error:', error);
      throw error;
    }
  },

  markAsRead: async (notificationId: string) => {
    try {
      return await markNotificationAsRead(notificationId);
    } catch (error) {
      console.error('Mark notification as read error:', error);
      throw error;
    }
  },

  markAllAsRead: async (userId: string) => {
    try {
      // This would need to be implemented in SQLite service
      console.log('Mark all notifications as read not yet implemented');
      return true;
    } catch (error) {
      console.error('Mark all notifications as read error:', error);
      throw error;
    }
  }
};

// Utility functions
export const initializeDatabase = async () => {
  try {
    await connectDB();
    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Database initialization error:', error);
    return false;
  }
};

export const healthCheck = async () => {
  try {
    await connectDB();
    return { status: 'healthy', timestamp: new Date().toISOString() };
  } catch (error) {
    return { status: 'unhealthy', error: (error as Error).message, timestamp: new Date().toISOString() };
  }
};
