// App Initialization Service
import { setAppReady } from '../utils/navigation';

class AppInitializationService {
  private static instance: AppInitializationService;
  private isInitialized = false;
  private initCallbacks: (() => void)[] = [];

  static getInstance(): AppInitializationService {
    if (!AppInitializationService.instance) {
      AppInitializationService.instance = new AppInitializationService();
    }
    return AppInitializationService.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      console.log('App initialization started...');
      
      // Wait for a minimum time to ensure all components are mounted
      await new Promise(resolve => setTimeout(resolve, 2000)); // Increased delay
      
      // Additional initialization tasks can be added here
      console.log('App initialization completed');
      
      this.isInitialized = true;
      setAppReady(true);
      
      // Execute any queued callbacks with a small delay
      setTimeout(() => {
        this.initCallbacks.forEach(callback => {
          try {
            callback();
          } catch (error) {
            console.error('Error executing initialization callback:', error);
          }
        });
        this.initCallbacks = [];
      }, 100);
      
    } catch (error) {
      console.error('App initialization failed:', error);
      // Still set ready to prevent infinite waiting
      this.isInitialized = true;
      setAppReady(true);
    }
  }

  onInitialized(callback: () => void): void {
    if (this.isInitialized) {
      callback();
    } else {
      this.initCallbacks.push(callback);
    }
  }

  isAppInitialized(): boolean {
    return this.isInitialized;
  }
}

export const appInit = AppInitializationService.getInstance();
