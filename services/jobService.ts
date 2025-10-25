/**
 * Job Service - Manages job postings, applications, and employer data with local storage
 */

import { simpleJobService } from './simpleJobService';
import { JobPost, JobApplication } from './simpleJobService';

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

class JobService {
  constructor() {
    // Simple local storage integration
  }

  // Job Management Methods
  async getAllJobs(): Promise<JobPost[]> {
    try {
      console.log('Job Service: Fetching all jobs...');
      const jobs = await simpleJobService.getAllJobs();
      console.log('Job Service: Retrieved', jobs.length, 'jobs');
      return jobs;
    } catch (error) {
      console.error('Job Service: Error fetching jobs:', error);
      return [];
    }
  }

  async getJobById(id: string): Promise<JobPost | undefined> {
    try {
      console.log('Job Service: Fetching job by ID:', id);
      const job = await simpleJobService.getJobById(id);
      return job || undefined;
    } catch (error) {
      console.error('Job Service: Error fetching job by ID:', error);
      return undefined;
    }
  }

  async getJobsByCategory(category: string): Promise<JobPost[]> {
    try {
      console.log('Job Service: Fetching jobs by category:', category);
      const allJobs = await simpleJobService.getJobPosts();
      const filteredJobs = allJobs.filter(job => 
        job.skills?.some(skill => skill.toLowerCase().includes(category.toLowerCase())) ||
        job.description?.toLowerCase().includes(category.toLowerCase())
      );
      console.log('Job Service: Retrieved', filteredJobs.length, 'jobs for category:', category);
      return filteredJobs;
    } catch (error) {
      console.error('Job Service: Error fetching jobs by category:', error);
      return [];
    }
  }

  async getJobsByEmployer(employerId: string): Promise<JobPost[]> {
    try {
      console.log('Job Service: Fetching jobs by employer:', employerId);
      const jobs = await simpleJobService.getJobsByEmployer(employerId);
      console.log('Job Service: Retrieved', jobs.length, 'jobs for employer');
      return jobs;
    } catch (error) {
      console.error('Job Service: Error fetching jobs by employer:', error);
      return [];
    }
  }

  async createJobPost(job: Omit<JobPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<JobPost | null> {
    try {
      console.log('Job Service: Creating job post...');
      const createdJob = await simpleJobService.createJobPost(job);
      if (createdJob) {
        console.log('Job Service: Job post created successfully');
        return createdJob;
      }
      return null;
    } catch (error) {
      console.error('Job Service: Error creating job post:', error);
      return null;
    }
  }

  async updateJobPost(id: string, updates: Partial<JobPost>): Promise<JobPost | null> {
    try {
      console.log('Job Service: Updating job post:', id);
      const updatedJob = await simpleJobService.updateJobPost(id, updates);
      if (updatedJob) {
        console.log('Job Service: Job post updated successfully');
        return updatedJob;
      }
      return null;
    } catch (error) {
      console.error('Job Service: Error updating job post:', error);
      return null;
    }
  }

  async deleteJobPost(id: string): Promise<boolean> {
    try {
      console.log('Job Service: Deleting job post:', id);
      const success = await simpleJobService.deleteJobPost(id);
      console.log('Job Service: Delete job post result:', success);
      return success;
    } catch (error) {
      console.error('Job Service: Error deleting job post:', error);
      return false;
    }
  }

  // Application Management Methods
  async applyForJob(application: Omit<JobApplication, 'id' | 'appliedDate'>): Promise<JobApplication | null> {
    try {
      console.log('Job Service: Applying for job:', application.jobId);
      const newApplication = await simpleJobService.applyForJob(application);
      if (newApplication) {
        console.log('Job Service: Application submitted successfully');
        return newApplication;
      }
      return null;
    } catch (error) {
      console.error('Job Service: Error applying for job:', error);
      return null;
    }
  }

  async getApplicationsByApplicant(applicantId: string): Promise<JobApplication[]> {
    try {
      console.log('Job Service: Fetching applications by applicant:', applicantId);
      const applications = await simpleJobService.getApplicationsByApplicant(applicantId);
      console.log('Job Service: Retrieved', applications.length, 'applications');
      return applications;
    } catch (error) {
      console.error('Job Service: Error fetching applications by applicant:', error);
      return [];
    }
  }

  async getApplicationsByJob(jobId: string): Promise<JobApplication[]> {
    try {
      console.log('Job Service: Fetching applications by job:', jobId);
      const applications = await simpleJobService.getApplicationsByJob(jobId);
      console.log('Job Service: Retrieved', applications.length, 'applications');
      return applications;
    } catch (error) {
      console.error('Job Service: Error fetching applications by job:', error);
      return [];
    }
  }

  async getApplicationsByEmployer(employerId: string): Promise<JobApplication[]> {
    try {
      console.log('Job Service: Fetching applications by employer:', employerId);
      const applications = await simpleJobService.getApplicationsByEmployer(employerId);
      console.log('Job Service: Retrieved', applications.length, 'applications');
      return applications;
    } catch (error) {
      console.error('Job Service: Error fetching applications by employer:', error);
      return [];
    }
  }

  async updateApplicationStatus(applicationId: string, status: JobApplication['status'], notes?: string): Promise<JobApplication | null> {
    try {
      console.log('Job Service: Updating application status:', applicationId, 'to', status);
      const updatedApplication = await simpleJobService.updateApplicationStatus(applicationId, status);
      if (updatedApplication) {
        console.log('Job Service: Application status updated successfully');
        return updatedApplication;
      }
      return null;
    } catch (error) {
      console.error('Job Service: Error updating application status:', error);
      return null;
    }
  }

  // Employer Management Methods
  async getAllEmployers(): Promise<Employer[]> {
    try {
      console.log('Job Service: Fetching all employers...');
      // TODO: Implement get all employers in Firebase service
      console.log('Job Service: Get all employers not yet implemented');
      return [];
    } catch (error) {
      console.error('Job Service: Error fetching employers:', error);
      return [];
    }
  }

  async getEmployerById(id: string): Promise<Employer | undefined> {
    try {
      console.log('Job Service: Fetching employer by ID:', id);
      // TODO: Implement get employer by ID in Firebase service
      console.log('Job Service: Get employer by ID not yet implemented');
      return undefined;
    } catch (error) {
      console.error('Job Service: Error fetching employer by ID:', error);
      return undefined;
    }
  }

  async createEmployer(employer: Omit<Employer, 'id'>): Promise<Employer> {
    try {
      console.log('Job Service: Creating employer...');
      // TODO: Implement create employer in Firebase service
      console.log('Job Service: Create employer not yet implemented');
      return {
      ...employer,
      id: `emp_${Date.now()}`,
    };
    } catch (error) {
      console.error('Job Service: Error creating employer:', error);
      throw error;
    }
  }

  // Utility Methods
  async searchJobs(query: string): Promise<JobPost[]> {
    try {
      console.log('Job Service: Searching jobs with query:', query);
      const allJobs = await simpleJobService.getJobPosts();
    const lowercaseQuery = query.toLowerCase();
      const filteredJobs = allJobs.filter(job => 
        job.title?.toLowerCase().includes(lowercaseQuery) ||
        job.location?.toLowerCase().includes(lowercaseQuery) ||
        job.description?.toLowerCase().includes(lowercaseQuery) ||
        job.skills?.some(skill => skill.toLowerCase().includes(lowercaseQuery))
      );
      console.log('Job Service: Found', filteredJobs.length, 'jobs matching query');
      return filteredJobs;
    } catch (error) {
      console.error('Job Service: Error searching jobs:', error);
      return [];
    }
  }

  async getJobCategories(): Promise<string[]> {
    try {
      console.log('Job Service: Fetching job categories...');
      const allJobs = await simpleJobService.getJobPosts();
      const categories = [...new Set(allJobs.flatMap(job => job.skills || []))];
      console.log('Job Service: Retrieved', categories.length, 'categories');
    return categories;
    } catch (error) {
      console.error('Job Service: Error fetching job categories:', error);
      return [];
    }
  }

  async hasUserAppliedForJob(jobId: string, applicantId: string): Promise<boolean> {
    try {
      console.log('Job Service: Checking if user applied for job:', jobId);
      const hasApplied = await simpleJobService.hasUserAppliedForJob(jobId, applicantId);
      console.log('Job Service: User has applied:', hasApplied);
      return hasApplied;
    } catch (error) {
      console.error('Job Service: Error checking if user applied for job:', error);
      return false;
    }
  }
}

export const jobService = new JobService();
export default jobService;