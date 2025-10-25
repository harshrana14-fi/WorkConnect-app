# WorkConnect - AI-Driven Workforce Platform

WorkConnect is a comprehensive mobile application that connects verified workers with real-time job opportunities, empowering India's informal workforce through AI-driven matching and skill development.

## 🚀 Features

### Core Functionality
- **Dual Role System**: Separate interfaces for Workers and Employers
- **AI-Powered Matching**: Smart job-worker matching based on skills and location
- **Real-time Notifications**: Push notifications for job offers, payments, and updates
- **Voice Support**: Voice registration and commands in English and Hindi
- **Location Services**: GPS-based job discovery and mapping
- **Gamification**: XP system, badges, and achievement tracking
- **Upskill Platform**: Micro-learning courses for skill development

### Worker Features
- **Job Discovery**: Browse available jobs with pay, distance, and requirements
- **Wallet Management**: Track earnings, pending payments, and financial analytics
- **Skill Profile**: Build and showcase your expertise
- **Job History**: Complete record of past work and ratings
- **Learning Path**: Access to skill development courses

### Employer Features
- **Job Posting**: Create detailed job listings with requirements
- **Worker Discovery**: Find and hire verified skilled workers
- **Contract Management**: Track job progress and manage payments
- **Analytics Dashboard**: Performance metrics and spending insights
- **Worker Ratings**: Rate and review worker performance

## 🎨 Design System

### Color Palette
- **Primary Blue**: #003366 (Deep professional blue)
- **Golden Accent**: #D4AF37 (Premium gold for highlights)
- **Light Gray**: #F5F5F5 (Clean background)
- **Success Green**: #27AE60 (Positive actions)
- **Warning Orange**: #F39C12 (Attention items)
- **Error Red**: #E74C3C (Error states)

### Typography
- **Headings**: Bold, clear hierarchy
- **Body Text**: Readable, accessible sizing
- **Captions**: Subtle, informative

## 🛠️ Technology Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router
- **Animations**: React Native Reanimated
- **UI Components**: Custom components with LinearGradient
- **State Management**: React Hooks
- **Styling**: StyleSheet with theme system
- **Maps**: React Native Maps (mock implementation)
- **Voice**: Expo Speech (mock implementation)

## 📱 App Structure

```
WorkConnect/
├── app/
│   ├── splash.tsx              # Animated splash screen
│   ├── onboarding.tsx          # 3-screen onboarding flow
│   ├── role-selection.tsx      # Worker/Employer selection
│   ├── auth.tsx                 # Authentication with voice support
│   └── (tabs)/
│       ├── worker-dashboard.tsx    # Worker main interface
│       ├── employer-dashboard.tsx   # Employer main interface
│       ├── profile.tsx              # User profile management
│       ├── notifications.tsx         # Push notifications
│       └── settings.tsx             # App settings
├── components/
│   ├── voice-support.tsx       # Voice input component
│   └── job-map.tsx              # Interactive job map
├── constants/
│   └── theme.ts                 # Design system
└── assets/
    └── images/                  # App icons and images
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (for testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd WorkConnect
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

4. **Run on device/simulator**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   
   # Web
   npm run web
   ```

## 📱 App Flow

### 1. Splash Screen
- Animated logo with tagline
- 3-second loading with progress bar
- Automatic navigation to onboarding

### 2. Onboarding
- **Screen 1**: "Find Verified Jobs Nearby"
- **Screen 2**: "Earn, Upskill, and Grow"
- **Screen 3**: "Hire Trusted Workers in Minutes"
- Role selection (Worker/Employer)

### 3. Authentication
- Email/Phone registration
- Separate flows for Workers and Employers
- Voice registration support
- Form validation and error handling

### 4. Worker Dashboard
- Available jobs with cards
- Active jobs with progress tracking
- Wallet overview with earnings
- Badges and achievements
- Upskill learning section

### 5. Employer Dashboard
- Post new jobs
- Browse available workers
- Manage contracts
- Analytics and performance metrics
- Payment tracking

### 6. Profile Management
- Personal information editing
- Skills and experience
- Job history and ratings
- Settings and preferences

## 🎯 Key Features Implementation

### Voice Support
- Multi-language voice recognition (English/Hindi)
- Voice-to-text form filling
- Voice navigation commands
- Accessibility features

### Location Services
- GPS-based job discovery
- Interactive map with job markers
- Distance calculations
- Location-based filtering

### Gamification
- XP system for completed jobs
- Achievement badges
- Progress tracking
- Leaderboards (future feature)

### Notifications
- Push notification system
- Job alerts and updates
- Payment notifications
- Skill development reminders

## 🔧 Customization

### Theme Customization
Edit `constants/theme.ts` to modify:
- Color palette
- Typography settings
- Spacing and border radius
- Component styling

### Adding New Features
1. Create new components in `components/`
2. Add new screens in `app/`
3. Update navigation in `app/_layout.tsx`
4. Follow the established design system

## 📊 Mock Data

The app includes comprehensive mock data for:
- Job listings with various skills
- Worker profiles and ratings
- Contract management
- Payment history
- Notification system
- Analytics data

## 🚀 Future Enhancements

### Planned Features
- **Real-time Chat**: Worker-employer communication
- **Video Calls**: Interview scheduling
- **Payment Integration**: UPI, wallet integration
- **Offline Mode**: Cached data for poor connectivity
- **Advanced Analytics**: ML-powered insights
- **Social Features**: Worker communities
- **Certification System**: Skill verification
- **Multi-language Support**: Regional language support

### Technical Improvements
- **Backend Integration**: Real API endpoints
- **Database**: User and job data persistence
- **Authentication**: Firebase Auth integration
- **Push Notifications**: Expo Notifications setup
- **Maps Integration**: Real map services
- **Voice Recognition**: Actual speech-to-text
- **Performance**: Code splitting and optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🎉 Acknowledgments

- Design inspiration from modern Indian tech startups
- Color palette inspired by professional workforce platforms
- UI/UX patterns from leading job marketplace apps
- Accessibility guidelines from WCAG standards

---

**WorkConnect** - Empowering the Hands That Build Our World 🏗️