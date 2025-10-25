// Safe Navigation Utility
import { router } from 'expo-router';

// Flag to track if the app is ready
let isAppReady = false;
let isLayoutMounted = false;
let navigationQueue: Array<{ path: string; delay: number; timestamp: number }> = [];

// Set app ready state
export const setAppReady = (ready: boolean) => {
  isAppReady = ready;
  if (ready) {
    console.log('App is ready, processing navigation queue...');
    processNavigationQueue();
  }
};

// Set layout mounted state
export const setLayoutMounted = (mounted: boolean) => {
  isLayoutMounted = mounted;
  if (mounted && isAppReady) {
    console.log('Layout mounted and app ready, processing navigation queue...');
    processNavigationQueue();
  }
};

// Process queued navigation calls
const processNavigationQueue = () => {
  if (navigationQueue.length > 0 && isLayoutMounted && isAppReady) {
    console.log(`Processing ${navigationQueue.length} queued navigation calls`);
    navigationQueue.forEach(({ path, delay }) => {
      setTimeout(() => safeNavigateInternal(path), delay);
    });
    navigationQueue = [];
  }
};

// Internal navigation function that actually performs the navigation
const safeNavigateInternal = (path: string) => {
  try {
    // Check if path is valid
    if (!path || typeof path !== 'string') {
      console.error('Invalid path provided for navigation:', path);
      return;
    }
    
    // Ensure path starts with '/' for proper routing
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    
    console.log('Executing navigation to:', normalizedPath);
    router.replace(normalizedPath);
  } catch (error) {
    console.error('Navigation execution error:', error);
    // Final fallback - try push instead of replace
    try {
      if (path && typeof path === 'string') {
        const normalizedPath = path.startsWith('/') ? path : `/${path}`;
        router.push(normalizedPath);
      }
    } catch (fallbackError) {
      console.error('Final fallback navigation error:', fallbackError);
    }
  }
};

export const safeNavigate = (path: string, delay: number = 100) => {
  try {
    // Check if path is valid
    if (!path || typeof path !== 'string') {
      console.error('Invalid path provided for navigation:', path);
      return;
    }
    
    console.log('Navigation requested to:', path, 'App ready:', isAppReady, 'Layout mounted:', isLayoutMounted);
    
    // If app isn't ready or layout isn't mounted, queue the navigation
    if (!isAppReady || !isLayoutMounted) {
      console.log('App not ready or layout not mounted, queuing navigation to:', path);
      navigationQueue.push({ path, delay, timestamp: Date.now() });
      return;
    }

    // Use setTimeout to prevent navigation during render
    setTimeout(() => {
      safeNavigateInternal(path);
    }, delay);
  } catch (error) {
    console.error('Safe navigation error:', error);
  }
};

export const safePush = (path: string, delay: number = 100) => {
  try {
    // Check if path is valid
    if (!path || typeof path !== 'string') {
      console.error('Invalid path provided for push navigation:', path);
      return;
    }
    
    console.log('Push requested to:', path, 'App ready:', isAppReady, 'Layout mounted:', isLayoutMounted);
    
    // If app isn't ready or layout isn't mounted, queue the navigation
    if (!isAppReady || !isLayoutMounted) {
      console.log('App not ready or layout not mounted, queuing push to:', path);
      navigationQueue.push({ path, delay, timestamp: Date.now() });
      return;
    }

    // Ensure path starts with '/' for proper routing
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    
    setTimeout(() => {
      try {
        console.log('Executing push to:', normalizedPath);
        router.push(normalizedPath);
      } catch (error) {
        console.error('Push navigation error:', error);
      }
    }, delay);
  } catch (error) {
    console.error('Safe push error:', error);
  }
};
