import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

export type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isInitialized: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation keys
const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.explore': 'Explore',
    'nav.applications': 'Applications',
    'nav.notifications': 'Notifications',
    'nav.profile': 'Profile',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.confirm': 'Confirm',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.finish': 'Finish',
    'common.apply': 'Apply',
    'common.withdraw': 'Withdraw',
    'common.view': 'View',
    'common.close': 'Close',
    
    // Auth
    'auth.welcome_back': 'Welcome Back!',
    'auth.join_workconnect': 'Join WorkConnect',
    'auth.sign_in_continue': 'Sign in to continue your journey',
    'auth.create_account_start': 'Create your account to get started',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirm_password': 'Confirm Password',
    'auth.name': 'Name',
    'auth.phone': 'Phone Number',
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.switch_to_login': 'Already have an account? Login',
    'auth.switch_to_register': "Don't have an account? Register",
    'auth.login_success': 'Login successful!',
    'auth.register_success': 'Registration successful!',
    'auth.logout': 'Logout',
    'auth.logout_confirm': 'Are you sure you want to logout?',
    
    // Home
    'home.greeting': 'Good morning',
    'home.welcome_back': 'Welcome back',
    'home.ready_to_find_job': 'Ready to find your next job?',
    'home.quick_actions': 'Quick Actions',
    'home.find_jobs': 'Find Jobs',
    'home.my_applications': 'My Applications',
    'home.learn': 'Learn',
    'home.badges': 'Badges',
    'home.recent_jobs': 'Recent Jobs',
    'home.view_all': 'View All',
    
    // Explore
    'explore.title': 'Explore Jobs',
    'explore.subtitle': 'Find your next opportunity',
    'explore.all_jobs': 'All Jobs',
    'explore.electrical': 'Electrical',
    'explore.plumbing': 'Plumbing',
    'explore.cleaning': 'Cleaning',
    'explore.carpentry': 'Carpentry',
    'explore.painting': 'Painting',
    'explore.search_placeholder': 'Search jobs...',
    'explore.filter_by': 'Filter by',
    'explore.all_categories': 'All Categories',
    'explore.apply_now': 'Apply Now',
    'explore.applied': '✓ Applied',
    // Homepage
    'homepage.welcome': 'Welcome to WorkConnect',
    'homepage.greeting': 'Hello, {name}!',
    'homepage.subtitle_authenticated': 'Find your next opportunity',
    'homepage.subtitle_guest': 'Connect with skilled workers and find jobs',
    'homepage.login': 'Login',
    'homepage.build_future': 'Build Your Future',
    'homepage.banner_subtitle': 'Join thousands of skilled workers earning daily',
    'homepage.get_started': 'Get Started',
    'homepage.featured_jobs': 'Featured Jobs',
    'homepage.top_mentors': 'Top Mentors',
    'homepage.quick_actions': 'Quick Actions',
    'homepage.find_jobs': 'Find Jobs',
    'homepage.my_applications': 'My Applications',
    'homepage.notifications': 'Notifications',
    'homepage.profile': 'Profile',
    'homepage.ready_to_start': 'Ready to Get Started?',
    'homepage.cta_subtitle': 'Join thousands of skilled workers and employers',
    'homepage.view_all': 'View all',
    'homepage.apply': 'Apply',
    'homepage.view_profile': 'View Profile',
    'homepage.available': 'Available',
    'homepage.urgent': 'Urgent',
    'homepage.applied': 'Applied',
    'homepage.jobs_available': 'Jobs Available',
    'homepage.active_workers': 'Active Workers',
    'homepage.companies': 'Companies',
    'explore.description': 'Description',
    'explore.apply_confirmation': 'Apply for this job?',
    'explore.application_submitted': 'Application Submitted',
    'explore.application_success': 'Your application has been submitted successfully! The employer will review your profile and get back to you.',
    'explore.view_applications': 'View Applications',
    
    // Applications
    'applications.title': 'My Applications',
    'applications.subtitle': 'Track your job application status',
    'applications.total_applications': 'Total Applications',
    'applications.under_review': 'Under Review',
    'applications.in_progress': 'In Progress',
    'applications.applied_date': 'Applied',
    'applications.job_posted': 'Posted',
    'applications.withdraw_application': 'Withdraw Application',
    'applications.withdraw_confirm': 'Are you sure you want to withdraw this application?',
    'applications.no_applications': 'No Applications Yet',
    'applications.no_applications_message': "You haven't applied to any jobs yet. Start exploring available opportunities!",
    'applications.explore_jobs': 'Explore Jobs',
    'applications.status': {
      'open': 'Open',
      'under_review': 'Under Review',
      'in_progress': 'In Progress',
      'completed': 'Completed',
      'cancelled': 'Cancelled'
    },
    
    // Profile
    'profile.title': 'Profile',
    'profile.edit_profile': 'Edit Profile',
    'profile.personal_info': 'Personal Information',
    'profile.professional_info': 'Professional Information',
    'profile.skills_expertise': 'Skills & Expertise',
    'profile.settings': 'Settings',
    'profile.change_image': 'Change Image',
    'profile.skill_type': 'Skill Type',
    'profile.experience': 'Experience',
    'profile.location': 'Location',
    'profile.organization_name': 'Organization Name',
    'profile.work_type': 'Work Type',
    'profile.rating': 'Rating',
    'profile.total_jobs': 'Total Jobs',
    'profile.total_earnings': 'Total Earnings',
    'profile.member_since': 'Member Since',
    'profile.language_preference': 'Language Preference',
    'profile.select_language': 'Select Language',
    'profile.english': 'English',
    'profile.hindi': 'हिंदी',
    'profile.privacy_security': 'Privacy & Security',
    'profile.help_support': 'Help & Support',
    'profile.about': 'About WorkConnect',
    
    // Notifications
    'notifications.title': 'Notifications',
    'notifications.subtitle': 'Stay updated with your job applications',
    'notifications.mark_all_read': 'Mark All as Read',
    'notifications.no_notifications': 'No notifications yet',
    'notifications.no_notifications_message': 'You will receive notifications about your job applications here.',
    
    // Role Selection
    'role.title': 'Choose Your Role',
    'role.subtitle': 'How would you like to use WorkConnect?',
    'role.worker': 'I am a Worker',
    'role.worker_desc': 'Looking for job opportunities',
    'role.employer': 'I am an Employer',
    'role.employer_desc': 'Looking to hire workers',
    
    // Onboarding
    'onboarding.welcome': 'Welcome to WorkConnect',
    'onboarding.subtitle': 'Empowering the Hands That Build Our World',
    'onboarding.get_started': 'Get Started',
    'onboarding.skip': 'Skip',
    
    // Splash
    'splash.tagline': 'Empowering the Hands That Build Our World',
  },
  hi: {
    // Navigation
    'nav.home': 'होम',
    'nav.explore': 'खोजें',
    'nav.applications': 'आवेदन',
    'nav.notifications': 'सूचनाएं',
    'nav.profile': 'प्रोफ़ाइल',
    
    // Common
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'त्रुटि',
    'common.success': 'सफल',
    'common.cancel': 'रद्द करें',
    'common.save': 'सहेजें',
    'common.edit': 'संपादित करें',
    'common.delete': 'हटाएं',
    'common.confirm': 'पुष्टि करें',
    'common.back': 'वापस',
    'common.next': 'अगला',
    'common.finish': 'समाप्त',
    'common.apply': 'आवेदन करें',
    'common.withdraw': 'वापस लें',
    'common.view': 'देखें',
    'common.close': 'बंद करें',
    
    // Auth
    'auth.welcome_back': 'वापस स्वागत है!',
    'auth.join_workconnect': 'WorkConnect में शामिल हों',
    'auth.sign_in_continue': 'अपनी यात्रा जारी रखने के लिए साइन इन करें',
    'auth.create_account_start': 'शुरू करने के लिए अपना खाता बनाएं',
    'auth.email': 'ईमेल',
    'auth.password': 'पासवर्ड',
    'auth.confirm_password': 'पासवर्ड की पुष्टि करें',
    'auth.name': 'नाम',
    'auth.phone': 'फोन नंबर',
    'auth.login': 'लॉगिन',
    'auth.register': 'रजिस्टर',
    'auth.switch_to_login': 'पहले से खाता है? लॉगिन करें',
    'auth.switch_to_register': 'खाता नहीं है? रजिस्टर करें',
    'auth.login_success': 'लॉगिन सफल!',
    'auth.register_success': 'रजिस्ट्रेशन सफल!',
    'auth.logout': 'लॉगआउट',
    'auth.logout_confirm': 'क्या आप वाकई लॉगआउट करना चाहते हैं?',
    
    // Home
    'home.greeting': 'सुप्रभात',
    'home.welcome_back': 'वापस स्वागत है',
    'home.ready_to_find_job': 'अपनी अगली नौकरी खोजने के लिए तैयार हैं?',
    'home.quick_actions': 'त्वरित कार्य',
    'home.find_jobs': 'नौकरी खोजें',
    'home.my_applications': 'मेरे आवेदन',
    'home.learn': 'सीखें',
    'home.badges': 'बैज',
    'home.recent_jobs': 'हाल की नौकरियां',
    'home.view_all': 'सभी देखें',
    
    // Explore
    'explore.title': 'नौकरियां खोजें',
    'explore.subtitle': 'अपना अगला अवसर खोजें',
    'explore.all_jobs': 'सभी नौकरियां',
    'explore.electrical': 'इलेक्ट्रिकल',
    'explore.plumbing': 'प्लंबिंग',
    'explore.cleaning': 'सफाई',
    'explore.carpentry': 'बढ़ईगीरी',
    'explore.painting': 'पेंटिंग',
    'explore.search_placeholder': 'नौकरियां खोजें...',
    'explore.filter_by': 'फिल्टर करें',
    'explore.all_categories': 'सभी श्रेणियां',
    'explore.apply_now': 'अभी आवेदन करें',
    'explore.applied': '✓ आवेदन किया',
    // Homepage
    'homepage.welcome': 'WorkConnect में आपका स्वागत है',
    'homepage.greeting': 'नमस्ते, {name}!',
    'homepage.subtitle_authenticated': 'अपना अगला अवसर खोजें',
    'homepage.subtitle_guest': 'कुशल कर्मचारियों से जुड़ें और नौकरियां खोजें',
    'homepage.login': 'लॉगिन',
    'homepage.build_future': 'अपना भविष्य बनाएं',
    'homepage.banner_subtitle': 'हजारों कुशल कर्मचारियों के साथ जुड़ें जो दैनिक कमाई कर रहे हैं',
    'homepage.get_started': 'शुरू करें',
    'homepage.featured_jobs': 'विशेष नौकरियां',
    'homepage.top_mentors': 'शीर्ष मेंटर',
    'homepage.quick_actions': 'त्वरित कार्य',
    'homepage.find_jobs': 'नौकरियां खोजें',
    'homepage.my_applications': 'मेरे आवेदन',
    'homepage.notifications': 'सूचनाएं',
    'homepage.profile': 'प्रोफाइल',
    'homepage.ready_to_start': 'शुरू करने के लिए तैयार हैं?',
    'homepage.cta_subtitle': 'हजारों कुशल कर्मचारियों और नियोक्ताओं के साथ जुड़ें',
    'homepage.view_all': 'सभी देखें',
    'homepage.apply': 'आवेदन करें',
    'homepage.view_profile': 'प्रोफाइल देखें',
    'homepage.available': 'उपलब्ध',
    'homepage.urgent': 'जरूरी',
    'homepage.applied': 'आवेदन किया',
    'homepage.jobs_available': 'नौकरियां उपलब्ध',
    'homepage.active_workers': 'सक्रिय कर्मचारी',
    'homepage.companies': 'कंपनियां',
    'explore.description': 'विवरण',
    'explore.apply_confirmation': 'इस नौकरी के लिए आवेदन करें?',
    'explore.application_submitted': 'आवेदन जमा किया गया',
    'explore.application_success': 'आपका आवेदन सफलतापूर्वक जमा कर दिया गया है! नियोक्ता आपकी प्रोफ़ाइल की समीक्षा करेगा और आपसे संपर्क करेगा।',
    'explore.view_applications': 'आवेदन देखें',
    
    // Applications
    'applications.title': 'मेरे आवेदन',
    'applications.subtitle': 'अपने नौकरी आवेदन की स्थिति को ट्रैक करें',
    'applications.total_applications': 'कुल आवेदन',
    'applications.under_review': 'समीक्षा में',
    'applications.in_progress': 'प्रगति में',
    'applications.applied_date': 'आवेदन किया',
    'applications.job_posted': 'पोस्ट किया',
    'applications.withdraw_application': 'आवेदन वापस लें',
    'applications.withdraw_confirm': 'क्या आप वाकई इस आवेदन को वापस लेना चाहते हैं?',
    'applications.no_applications': 'अभी तक कोई आवेदन नहीं',
    'applications.no_applications_message': 'आपने अभी तक किसी नौकरी के लिए आवेदन नहीं किया है। उपलब्ध अवसरों की खोज शुरू करें!',
    'applications.explore_jobs': 'नौकरियां खोजें',
    'applications.status': {
      'open': 'खुला',
      'under_review': 'समीक्षा में',
      'in_progress': 'प्रगति में',
      'completed': 'पूरा',
      'cancelled': 'रद्द'
    },
    
    // Profile
    'profile.title': 'प्रोफ़ाइल',
    'profile.edit_profile': 'प्रोफ़ाइल संपादित करें',
    'profile.personal_info': 'व्यक्तिगत जानकारी',
    'profile.professional_info': 'व्यावसायिक जानकारी',
    'profile.skills_expertise': 'कौशल और विशेषज्ञता',
    'profile.settings': 'सेटिंग्स',
    'profile.change_image': 'छवि बदलें',
    'profile.skill_type': 'कौशल प्रकार',
    'profile.experience': 'अनुभव',
    'profile.location': 'स्थान',
    'profile.organization_name': 'संगठन का नाम',
    'profile.work_type': 'काम का प्रकार',
    'profile.rating': 'रेटिंग',
    'profile.total_jobs': 'कुल नौकरियां',
    'profile.total_earnings': 'कुल कमाई',
    'profile.member_since': 'सदस्यता',
    'profile.language_preference': 'भाषा वरीयता',
    'profile.select_language': 'भाषा चुनें',
    'profile.english': 'English',
    'profile.hindi': 'हिंदी',
    'profile.privacy_security': 'गोपनीयता और सुरक्षा',
    'profile.help_support': 'सहायता और समर्थन',
    'profile.about': 'WorkConnect के बारे में',
    
    // Notifications
    'notifications.title': 'सूचनाएं',
    'notifications.subtitle': 'अपने नौकरी आवेदन के साथ अपडेट रहें',
    'notifications.mark_all_read': 'सभी को पढ़ा हुआ मार्क करें',
    'notifications.no_notifications': 'अभी तक कोई सूचना नहीं',
    'notifications.no_notifications_message': 'आपको अपने नौकरी आवेदन के बारे में यहां सूचनाएं मिलेंगी।',
    
    // Role Selection
    'role.title': 'अपनी भूमिका चुनें',
    'role.subtitle': 'आप WorkConnect का उपयोग कैसे करना चाहते हैं?',
    'role.worker': 'मैं एक कर्मचारी हूं',
    'role.worker_desc': 'नौकरी के अवसर खोज रहे हैं',
    'role.employer': 'मैं एक नियोक्ता हूं',
    'role.employer_desc': 'कर्मचारियों को काम पर रखना चाहते हैं',
    
    // Onboarding
    'onboarding.welcome': 'WorkConnect में आपका स्वागत है',
    'onboarding.subtitle': 'उन हाथों को सशक्त बनाना जो हमारी दुनिया बनाते हैं',
    'onboarding.get_started': 'शुरू करें',
    'onboarding.skip': 'छोड़ें',
    
    // Splash
    'splash.tagline': 'उन हाथों को सशक्त बनाना जो हमारी दुनिया बनाते हैं',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await SecureStore.getItemAsync('app_language');
      if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'hi')) {
        setLanguageState(savedLanguage as Language);
      }
      setIsInitialized(true);
    } catch (error) {
      console.error('Error loading language:', error);
      setIsInitialized(true);
    }
  };

  const setLanguage = async (lang: Language) => {
    try {
      setLanguageState(lang);
      await SecureStore.setItemAsync('app_language', lang);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const t = (key: string): string => {
    try {
      if (!isInitialized) {
        return key;
      }
      
      // Direct key lookup since our translations are flat
      const value = (translations[language] as any)?.[key];
      return value || key;
    } catch (error) {
      console.error('Translation error for key:', key, error);
      return key;
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isInitialized }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
