import * as SQLite from 'expo-sqlite';
import bcrypt from 'bcryptjs';

// SQLite database connection
const db = SQLite.openDatabaseSync('workconnect.db');

// Test function to verify database is working
export const testDatabase = async () => {
  try {
    console.log('Testing database connection...');
    
    // Test basic query
    const testResult = db.getAllSync('SELECT 1 as test');
    console.log('Database test query result:', testResult);
    
    // Test table creation
    const tables = db.getAllSync("SELECT name FROM sqlite_master WHERE type='table'");
    console.log('Existing tables:', tables);
    
    return true;
  } catch (error) {
    console.error('Database test failed:', error);
    return false;
  }
};

// Database connection
export const connectDB = async () => {
  try {
    // Create tables
    db.execSync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        profileImage TEXT,
        skillType TEXT,
        experience TEXT,
        location TEXT,
        organizationName TEXT,
        workType TEXT,
        rating REAL DEFAULT 0,
        totalJobs INTEGER DEFAULT 0,
        totalEarnings REAL DEFAULT 0,
        memberSince TEXT,
        createdAt TEXT,
        updatedAt TEXT
      )
    `);
    
    db.execSync(`
      CREATE TABLE IF NOT EXISTS jobPosts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        employerId INTEGER NOT NULL,
        skillType TEXT NOT NULL,
        location TEXT NOT NULL,
        pay REAL NOT NULL,
        duration TEXT NOT NULL,
        status TEXT DEFAULT 'open',
        hiredWorker INTEGER,
        createdAt TEXT,
        updatedAt TEXT,
        FOREIGN KEY (employerId) REFERENCES users (id),
        FOREIGN KEY (hiredWorker) REFERENCES users (id)
      )
    `);
    
    db.execSync(`
      CREATE TABLE IF NOT EXISTS jobApplicants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        jobId INTEGER NOT NULL,
        userId INTEGER NOT NULL,
        appliedAt TEXT,
        FOREIGN KEY (jobId) REFERENCES jobPosts (id),
        FOREIGN KEY (userId) REFERENCES users (id)
      )
    `);
    
    db.execSync(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        isRead INTEGER DEFAULT 0,
        priority TEXT DEFAULT 'medium',
        action TEXT,
        createdAt TEXT,
        FOREIGN KEY (userId) REFERENCES users (id)
      )
    `);
    
    console.log('Database tables created successfully');
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};

// Authentication functions
export const authenticateUser = async (email: string, password: string) => {
  try {
    const result = db.getAllSync('SELECT * FROM users WHERE email = ?', [email]);
    if (result.length > 0) {
      const user = result[0];
      if (await bcrypt.compare(password, user.password)) {
        // Remove password from returned user
        const { password: _, ...userWithoutPassword } = user;
        return { ...userWithoutPassword, id: user.id.toString() };
      }
    }
    return null;
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
};

export const createUser = async (userData: any) => {
  try {
    console.log('createUser called with:', {
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      role: userData.role,
      hasPassword: !!userData.password
    });
    
    // Check if user already exists
    const existingUser = db.getAllSync('SELECT * FROM users WHERE email = ?', [userData.email]);
    if (existingUser.length > 0) {
      console.error('User with this email already exists');
      throw new Error('User with this email already exists');
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    console.log('Password hashed successfully');
    
    const now = new Date().toISOString();
    const result = db.runSync(
      `INSERT INTO users (name, email, phone, password, role, profileImage, skillType, experience, location, organizationName, workType, rating, totalJobs, totalEarnings, memberSince, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userData.name,
        userData.email,
        userData.phone,
        hashedPassword,
        userData.role,
        userData.profileImage || null,
        userData.skillType || null,
        userData.experience || null,
        userData.location || null,
        userData.organizationName || null,
        userData.workType || null,
        userData.rating || 0,
        userData.totalJobs || 0,
        userData.totalEarnings || 0,
        userData.memberSince || now,
        now,
        now
      ]
    );
    
    console.log('User inserted with ID:', result.lastInsertRowId);
    
    const newUser = db.getFirstSync('SELECT * FROM users WHERE id = ?', [result.lastInsertRowId]);
    console.log('Retrieved user:', newUser);
    
    if (!newUser) {
      console.error('Failed to retrieve created user');
      return null;
    }
    
    const { password: _, ...userWithoutPassword } = newUser;
    const formattedUser = { ...userWithoutPassword, id: newUser.id.toString() };
    console.log('Formatted user:', formattedUser);
    
    return formattedUser;
  } catch (error) {
    console.error('User creation error:', error);
    console.error('Error details:', {
      message: (error as Error).message,
      stack: (error as Error).stack
    });
    throw error;
  }
};

export const updateUser = async (userId: string, updateData: any) => {
  try {
    const now = new Date().toISOString();
    const fields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updateData) as (string | number)[];
    
    const result = db.runSync(
      `UPDATE users SET ${fields}, updatedAt = ? WHERE id = ?`,
      [...values, now, parseInt(userId)]
    );
    
    if (result.changes > 0) {
      const updatedUser = db.getFirstSync('SELECT * FROM users WHERE id = ?', [parseInt(userId)]);
      const { password: _, ...userWithoutPassword } = updatedUser;
      return { ...userWithoutPassword, id: updatedUser.id.toString() };
    }
    return null;
  } catch (error) {
    console.error('User update error:', error);
    throw error;
  }
};

export const getUserById = async (userId: string) => {
  try {
    const user = db.getFirstSync('SELECT * FROM users WHERE id = ?', [parseInt(userId)]);
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      return { ...userWithoutPassword, id: user.id.toString() };
    }
    return null;
  } catch (error) {
    console.error('Get user error:', error);
    throw error;
  }
};

// Job Post functions
export const createJobPost = async (jobData: any) => {
  try {
    const now = new Date().toISOString();
    const result = db.runSync(
      `INSERT INTO jobPosts (title, description, employerId, skillType, location, pay, duration, status, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        jobData.title,
        jobData.description,
        jobData.employerId,
        jobData.skillType,
        jobData.location,
        jobData.pay,
        jobData.duration,
        jobData.status || 'open',
        now,
        now
      ]
    );
    
    const newJob = db.getFirstSync('SELECT * FROM jobPosts WHERE id = ?', [result.lastInsertRowId]);
    return { ...newJob, id: newJob.id.toString() };
  } catch (error) {
    console.error('Job post creation error:', error);
    throw error;
  }
};

export const getJobPosts = async (filters: any = {}) => {
  try {
    let query = 'SELECT * FROM jobPosts';
    const conditions = [];
    const params = [];
    
    if (filters.status) {
      conditions.push('status = ?');
      params.push(filters.status);
    }
    if (filters.skillType) {
      conditions.push('skillType = ?');
      params.push(filters.skillType);
    }
    if (filters.location) {
      conditions.push('location LIKE ?');
      params.push(`%${filters.location}%`);
    }
    if (filters.employerId) {
      conditions.push('employerId = ?');
      params.push(filters.employerId);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY createdAt DESC';
    
    const jobs = db.getAllSync(query, params);
    return jobs.map(job => ({ ...job, id: job.id.toString() }));
  } catch (error) {
    console.error('Get job posts error:', error);
    throw error;
  }
};

export const getJobById = async (jobId: string) => {
  try {
    const job = db.getFirstSync('SELECT * FROM jobPosts WHERE id = ?', [parseInt(jobId)]);
    if (job) {
      return { ...job, id: job.id.toString() };
    }
    return null;
  } catch (error) {
    console.error('Get job by ID error:', error);
    throw error;
  }
};

export const updateJobPost = async (jobId: string, updateData: any) => {
  try {
    const now = new Date().toISOString();
    const fields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updateData) as (string | number)[];
    
    const result = db.runSync(
      `UPDATE jobPosts SET ${fields}, updatedAt = ? WHERE id = ?`,
      [...values, now, parseInt(jobId)]
    );
    
    if (result.changes > 0) {
      const updatedJob = db.getFirstSync('SELECT * FROM jobPosts WHERE id = ?', [parseInt(jobId)]);
      return { ...updatedJob, id: updatedJob.id.toString() };
    }
    return null;
  } catch (error) {
    console.error('Update job post error:', error);
    throw error;
  }
};

export const deleteJobPost = async (jobId: string) => {
  try {
    const result = db.runSync('DELETE FROM jobPosts WHERE id = ?', [parseInt(jobId)]);
    return result.changes > 0;
  } catch (error) {
    console.error('Delete job post error:', error);
    throw error;
  }
};

export const applyToJob = async (jobId: string, userId: string) => {
  try {
    const now = new Date().toISOString();
    const result = db.runSync(
      'INSERT INTO jobApplicants (jobId, userId, appliedAt) VALUES (?, ?, ?)',
      [parseInt(jobId), parseInt(userId), now]
    );
    return { id: result.lastInsertRowId.toString(), jobId, userId, appliedAt: now };
  } catch (error) {
    console.error('Job application error:', error);
    throw error;
  }
};

export const getApplicationsByJob = async (jobId: string) => {
  try {
    const applications = db.getAllSync(
      'SELECT * FROM jobApplicants WHERE jobId = ? ORDER BY appliedAt DESC',
      [parseInt(jobId)]
    );
    return applications.map(app => ({ ...app, id: app.id.toString() }));
  } catch (error) {
    console.error('Get applications by job error:', error);
    throw error;
  }
};

export const getApplicationsByEmployer = async (employerId: string) => {
  try {
    const applications = db.getAllSync(`
      SELECT ja.*, jp.title, jp.description, jp.skillType, jp.location, jp.pay, jp.duration, jp.status
      FROM jobApplicants ja
      JOIN jobPosts jp ON ja.jobId = jp.id
      WHERE jp.employerId = ?
      ORDER BY ja.appliedAt DESC
    `, [parseInt(employerId)]);
    
    return applications.map(app => ({ ...app, id: app.id.toString() }));
  } catch (error) {
    console.error('Get applications by employer error:', error);
    throw error;
  }
};

export const updateApplicationStatus = async (applicationId: string, status: string, notes?: string) => {
  try {
    const now = new Date().toISOString();
    const result = db.runSync(
      'UPDATE jobApplicants SET status = ?, employerNotes = ?, updatedAt = ? WHERE id = ?',
      [status, notes, now, parseInt(applicationId)]
    );
    
    if (result.changes > 0) {
      const updatedApplication = db.getFirstSync('SELECT * FROM jobApplicants WHERE id = ?', [parseInt(applicationId)]);
      return { ...updatedApplication, id: updatedApplication.id.toString() };
    }
    return null;
  } catch (error) {
    console.error('Update application status error:', error);
    throw error;
  }
};

// Notification functions
export const createNotification = async (notificationData: any) => {
  try {
    const now = new Date().toISOString();
    const result = db.runSync(
      `INSERT INTO notifications (userId, type, title, message, isRead, priority, action, createdAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        notificationData.userId,
        notificationData.type,
        notificationData.title,
        notificationData.message,
        notificationData.isRead || 0,
        notificationData.priority || 'medium',
        notificationData.action || null,
        now
      ]
    );
    return { ...notificationData, id: result.lastInsertRowId.toString(), createdAt: now };
  } catch (error) {
    console.error('Notification creation error:', error);
    throw error;
  }
};

export const getUserNotifications = async (userId: string) => {
  try {
    const notifications = db.getAllSync(
      'SELECT * FROM notifications WHERE userId = ? ORDER BY createdAt DESC',
      [parseInt(userId)]
    );
    return notifications.map(notification => ({ ...notification, id: notification.id.toString() }));
  } catch (error) {
    console.error('Get notifications error:', error);
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const result = db.runSync('UPDATE notifications SET isRead = 1 WHERE id = ?', [parseInt(notificationId)]);
    if (result.changes > 0) {
      const notification = db.getFirstSync('SELECT * FROM notifications WHERE id = ?', [parseInt(notificationId)]);
      return { ...notification, id: notification.id.toString() };
    }
    return null;
  } catch (error) {
    console.error('Mark notification as read error:', error);
    throw error;
  }
};

// Get user's applied jobs
export const getUserAppliedJobs = async (userId: string) => {
  try {
    const applications = db.getAllSync(`
      SELECT 
        ja.*,
        jp.title,
        jp.description,
        jp.skillType,
        jp.location,
        jp.pay,
        jp.duration,
        jp.status,
        jp.createdAt as jobPostedAt,
        u.name as employerName,
        u.organizationName
      FROM jobApplicants ja
      JOIN jobPosts jp ON ja.jobId = jp.id
      JOIN users u ON jp.employerId = u.id
      WHERE ja.userId = ?
      ORDER BY ja.appliedAt DESC
    `, [parseInt(userId)]);
    
    return applications.map(app => ({ ...app, id: app.id.toString() }));
  } catch (error) {
    console.error('Get user applied jobs error:', error);
    throw error;
  }
};

// Close database connection
export const closeDB = async () => {
  try {
    // SQLite doesn't need explicit closing in expo-sqlite
    console.log('SQLite database connection closed');
  } catch (error) {
    console.error('Error closing database connection:', error);
  }
};