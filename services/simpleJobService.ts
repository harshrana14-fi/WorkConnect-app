/**
 * Simple Job Service - Local job management without Firebase
 */

import * as SecureStore from 'expo-secure-store';

export interface JobPost {
  id: string;
  title: string;
  description: string;
  location: string;
  salary: string;
  duration: string;
  skills: string[];
  workType: 'full-time' | 'part-time' | 'contract' | 'freelance';
  urgency: 'low' | 'normal' | 'high' | 'urgent';
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  employerId: string;
  employerName: string;
  employerEmail: string;
  employerPhone?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  company?: string;
  companyLogo?: string;
  category?: string;
  pay?: string;
  urgent?: boolean;
  requirements?: string[];
  benefits?: string[];
  experience?: string;
  jobType?: 'full-time' | 'part-time' | 'contract' | 'freelance';
  postedDate?: string;
  deadline?: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  applicantSkills: string;
  applicantExperience: string;
  applicantImage?: string;
  status: 'pending' | 'accepted' | 'rejected';
  appliedDate: string;
  message?: string;
}

export interface Employer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company: string;
  companyLogo?: string;
  description?: string;
  location?: string;
  website?: string;
}

class SimpleJobService {
  private jobs: JobPost[] = [];
  private applications: JobApplication[] = [];
  private employers: Employer[] = [];
  private readonly JOBS_STORAGE_KEY = 'simple_jobs';
  private readonly APPLICATIONS_STORAGE_KEY = 'simple_applications';
  private readonly EMPLOYERS_STORAGE_KEY = 'simple_employers';

  constructor() {
    this.loadData();
    this.initializeSampleData();
  }

  private async loadData(): Promise<void> {
    try {
      // Load jobs
      const storedJobs = await SecureStore.getItemAsync(this.JOBS_STORAGE_KEY);
      if (storedJobs) {
        this.jobs = JSON.parse(storedJobs);
      }

      // Load applications
      const storedApplications = await SecureStore.getItemAsync(this.APPLICATIONS_STORAGE_KEY);
      if (storedApplications) {
        this.applications = JSON.parse(storedApplications);
      }

      // Load employers
      const storedEmployers = await SecureStore.getItemAsync(this.EMPLOYERS_STORAGE_KEY);
      if (storedEmployers) {
        this.employers = JSON.parse(storedEmployers);
      }

      console.log('Simple Job Service: Loaded data from storage');
    } catch (error) {
      console.error('Simple Job Service: Error loading data:', error);
    }
  }

  private async saveData(): Promise<void> {
    try {
      await SecureStore.setItemAsync(this.JOBS_STORAGE_KEY, JSON.stringify(this.jobs));
      await SecureStore.setItemAsync(this.APPLICATIONS_STORAGE_KEY, JSON.stringify(this.applications));
      await SecureStore.setItemAsync(this.EMPLOYERS_STORAGE_KEY, JSON.stringify(this.employers));
      console.log('Simple Job Service: Saved data to storage');
    } catch (error) {
      console.error('Simple Job Service: Error saving data:', error);
    }
  }

  private async initializeSampleData(): Promise<void> {
    if (this.jobs.length === 0) {
      const sampleJobs: JobPost[] = [
        {
          id: 'job-1',
          title: 'Frontend Developer',
          description: 'We are looking for a skilled frontend developer to join our team.',
          location: 'New York, NY',
          salary: '$80,000 - $120,000',
          duration: 'Full-time',
          skills: ['React', 'TypeScript', 'CSS', 'HTML'],
          workType: 'full-time',
          urgency: 'normal',
          status: 'active',
          employerId: 'emp-1',
          employerName: 'Tech Corp',
          employerEmail: 'hr@techcorp.com',
          employerPhone: '+1-555-0123',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          company: 'Tech Corp',
          category: 'Technology',
          experience: '3-5 years',
          postedDate: new Date().toISOString(),
        },
        {
          id: 'job-2',
          title: 'Construction Worker',
          description: 'Experienced construction worker needed for commercial project.',
          location: 'Los Angeles, CA',
          salary: '$25 - $35/hour',
          duration: '6 months',
          skills: ['Construction', 'Safety', 'Teamwork'],
          workType: 'contract',
          urgency: 'high',
          status: 'active',
          employerId: 'emp-2',
          employerName: 'BuildCo',
          employerEmail: 'jobs@buildco.com',
          employerPhone: '+1-555-0456',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          company: 'BuildCo',
          category: 'Construction',
          experience: '2+ years',
          postedDate: new Date().toISOString(),
        }
      ];

      this.jobs = sampleJobs;
      await this.saveData();
      console.log('Simple Job Service: Initialized with sample data');
    }
  }

  // Job Management Methods
  async getAllJobs(): Promise<JobPost[]> {
    try {
      console.log('Simple Job Service: Fetching all jobs...');
      return this.jobs.filter(job => job.status === 'active');
    } catch (error) {
      console.error('Simple Job Service: Error fetching jobs:', error);
      return [];
    }
  }

  async getJobById(id: string): Promise<JobPost | undefined> {
    try {
      console.log('Simple Job Service: Fetching job by ID:', id);
      return this.jobs.find(job => job.id === id);
    } catch (error) {
      console.error('Simple Job Service: Error fetching job by ID:', error);
      return undefined;
    }
  }

  async getJobsByCategory(category: string): Promise<JobPost[]> {
    try {
      console.log('Simple Job Service: Fetching jobs by category:', category);
      return this.jobs.filter(job => 
        job.category?.toLowerCase().includes(category.toLowerCase()) ||
        job.skills?.some(skill => skill.toLowerCase().includes(category.toLowerCase()))
      );
    } catch (error) {
      console.error('Simple Job Service: Error fetching jobs by category:', error);
      return [];
    }
  }

  async getJobsByEmployer(employerId: string): Promise<JobPost[]> {
    try {
      console.log('Simple Job Service: Fetching jobs by employer:', employerId);
      return this.jobs.filter(job => job.employerId === employerId);
    } catch (error) {
      console.error('Simple Job Service: Error fetching jobs by employer:', error);
      return [];
    }
  }

  async createJobPost(job: Omit<JobPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<JobPost | null> {
    try {
      console.log('Simple Job Service: Creating job post...');
      const newJob: JobPost = {
        ...job,
        id: `job-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      this.jobs.push(newJob);
      await this.saveData();
      console.log('Simple Job Service: Job post created successfully');
      return newJob;
    } catch (error) {
      console.error('Simple Job Service: Error creating job post:', error);
      return null;
    }
  }

  async updateJobPost(id: string, updates: Partial<JobPost>): Promise<JobPost | null> {
    try {
      console.log('Simple Job Service: Updating job post:', id);
      const jobIndex = this.jobs.findIndex(job => job.id === id);
      if (jobIndex !== -1) {
        this.jobs[jobIndex] = {
          ...this.jobs[jobIndex],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        await this.saveData();
        return this.jobs[jobIndex];
      }
      return null;
    } catch (error) {
      console.error('Simple Job Service: Error updating job post:', error);
      return null;
    }
  }

  async deleteJobPost(id: string): Promise<boolean> {
    try {
      console.log('Simple Job Service: Deleting job post:', id);
      const jobIndex = this.jobs.findIndex(job => job.id === id);
      if (jobIndex !== -1) {
        this.jobs.splice(jobIndex, 1);
        await this.saveData();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Simple Job Service: Error deleting job post:', error);
      return false;
    }
  }

  // Application Management Methods
  async applyForJob(application: Omit<JobApplication, 'id' | 'appliedDate'>): Promise<JobApplication | null> {
    try {
      console.log('Simple Job Service: Applying for job:', application.jobId);
      const newApplication: JobApplication = {
        ...application,
        id: `app-${Date.now()}`,
        appliedDate: new Date().toISOString(),
      };
      
      this.applications.push(newApplication);
      await this.saveData();
      console.log('Simple Job Service: Application submitted successfully');
      return newApplication;
    } catch (error) {
      console.error('Simple Job Service: Error applying for job:', error);
      return null;
    }
  }

  async getApplicationsByApplicant(applicantId: string): Promise<JobApplication[]> {
    try {
      console.log('Simple Job Service: Fetching applications by applicant:', applicantId);
      return this.applications.filter(app => app.applicantId === applicantId);
    } catch (error) {
      console.error('Simple Job Service: Error fetching applications by applicant:', error);
      return [];
    }
  }

  async getApplicationsByJob(jobId: string): Promise<JobApplication[]> {
    try {
      console.log('Simple Job Service: Fetching applications by job:', jobId);
      return this.applications.filter(app => app.jobId === jobId);
    } catch (error) {
      console.error('Simple Job Service: Error fetching applications by job:', error);
      return [];
    }
  }

  async getApplicationsByEmployer(employerId: string): Promise<JobApplication[]> {
    try {
      console.log('Simple Job Service: Fetching applications by employer:', employerId);
      const employerJobs = this.jobs.filter(job => job.employerId === employerId);
      const jobIds = employerJobs.map(job => job.id);
      return this.applications.filter(app => jobIds.includes(app.jobId));
    } catch (error) {
      console.error('Simple Job Service: Error fetching applications by employer:', error);
      return [];
    }
  }

  async updateApplicationStatus(applicationId: string, status: JobApplication['status'], notes?: string): Promise<JobApplication | null> {
    try {
      console.log('Simple Job Service: Updating application status:', applicationId, 'to', status);
      const appIndex = this.applications.findIndex(app => app.id === applicationId);
      if (appIndex !== -1) {
        this.applications[appIndex] = {
          ...this.applications[appIndex],
          status,
        };
        await this.saveData();
        return this.applications[appIndex];
      }
      return null;
    } catch (error) {
      console.error('Simple Job Service: Error updating application status:', error);
      return null;
    }
  }

  // Employer Management Methods
  async getAllEmployers(): Promise<Employer[]> {
    try {
      console.log('Simple Job Service: Fetching all employers...');
      return this.employers;
    } catch (error) {
      console.error('Simple Job Service: Error fetching employers:', error);
      return [];
    }
  }

  async getEmployerById(id: string): Promise<Employer | undefined> {
    try {
      console.log('Simple Job Service: Fetching employer by ID:', id);
      return this.employers.find(emp => emp.id === id);
    } catch (error) {
      console.error('Simple Job Service: Error fetching employer by ID:', error);
      return undefined;
    }
  }

  async createEmployer(employer: Omit<Employer, 'id'>): Promise<Employer> {
    try {
      console.log('Simple Job Service: Creating employer...');
      const newEmployer: Employer = {
        ...employer,
        id: `emp-${Date.now()}`,
      };
      
      this.employers.push(newEmployer);
      await this.saveData();
      return newEmployer;
    } catch (error) {
      console.error('Simple Job Service: Error creating employer:', error);
      throw error;
    }
  }

  // Utility Methods
  async searchJobs(query: string): Promise<JobPost[]> {
    try {
      console.log('Simple Job Service: Searching jobs with query:', query);
      const lowercaseQuery = query.toLowerCase();
      return this.jobs.filter(job => 
        job.title?.toLowerCase().includes(lowercaseQuery) ||
        job.location?.toLowerCase().includes(lowercaseQuery) ||
        job.description?.toLowerCase().includes(lowercaseQuery) ||
        job.skills?.some(skill => skill.toLowerCase().includes(lowercaseQuery))
      );
    } catch (error) {
      console.error('Simple Job Service: Error searching jobs:', error);
      return [];
    }
  }

  async getJobCategories(): Promise<string[]> {
    try {
      console.log('Simple Job Service: Fetching job categories...');
      const categories = [...new Set(this.jobs.flatMap(job => job.skills || []))];
      return categories;
    } catch (error) {
      console.error('Simple Job Service: Error fetching job categories:', error);
      return [];
    }
  }

  async hasUserAppliedForJob(jobId: string, applicantId: string): Promise<boolean> {
    try {
      console.log('Simple Job Service: Checking if user applied for job:', jobId);
      return this.applications.some(app => app.jobId === jobId && app.applicantId === applicantId);
    } catch (error) {
      console.error('Simple Job Service: Error checking if user applied for job:', error);
      return false;
    }
  }
}

export const simpleJobService = new SimpleJobService();
export default simpleJobService;
