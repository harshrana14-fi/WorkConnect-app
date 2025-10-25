# Firebase Setup Guide for WorkConnect

## Prerequisites
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication and Firestore Database in your Firebase project

## Configuration Steps

### 1. Get Firebase Configuration
1. Go to Project Settings in Firebase Console
2. Scroll down to "Your apps" section
3. Click "Add app" and select Web app
4. Copy the Firebase configuration object

### 2. Update Firebase Config
Replace the placeholder values in `WorkConnect/config/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-actual-app-id"
};
```

### 3. Enable Authentication
1. Go to Authentication > Sign-in method in Firebase Console
2. Enable "Email/Password" provider
3. Optionally enable other providers (Google, Facebook, etc.)

### 4. Set up Firestore Database
1. Go to Firestore Database in Firebase Console
2. Click "Create database"
3. Choose "Start in test mode" for development
4. Select a location for your database

### 5. Set up Firestore Security Rules
Add these rules to your Firestore Database > Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Job posts are readable by all authenticated users
    // Only employers can create/update their own job posts
    match /jobPosts/{jobId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && 
        request.auth.uid == resource.data.employerId;
      allow update, delete: if request.auth != null && 
        request.auth.uid == resource.data.employerId;
    }
    
    // Job applications are readable by applicant and job owner
    // Only authenticated users can create applications
    match /jobApplications/{applicationId} {
      allow read: if request.auth != null && 
        (request.auth.uid == resource.data.applicantId || 
         request.auth.uid == resource.data.employerId);
      allow create: if request.auth != null && 
        request.auth.uid == resource.data.applicantId;
      allow update: if request.auth != null && 
        request.auth.uid == resource.data.employerId;
    }
  }
}
```

### 6. Test the Integration
1. Run the app: `npm start`
2. Try registering a new user
3. Check Firebase Console to see if user appears in Authentication and Firestore

## Features Implemented

### Authentication
- ✅ User registration with email/password
- ✅ User login/logout
- ✅ Profile management
- ✅ Role-based access (worker/employer)

### Job Management
- ✅ Create job posts (employers)
- ✅ View all job posts
- ✅ Search jobs
- ✅ Apply to jobs (workers)
- ✅ View applications (employers)

### Data Structure

#### Users Collection (`users`)
```typescript
{
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
```

#### Job Posts Collection (`jobPosts`)
```typescript
{
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
  image?: string;
  createdAt: string;
  updatedAt: string;
}
```

#### Job Applications Collection (`jobApplications`)
```typescript
{
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
```

## Next Steps
1. Configure your Firebase project with the actual credentials
2. Test user registration and login
3. Test job posting and application features
4. Customize Firestore security rules as needed
5. Add Firebase Storage for image uploads (optional)
