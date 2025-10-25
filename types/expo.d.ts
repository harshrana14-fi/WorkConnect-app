declare module 'expo-linear-gradient' {
  import { Component } from 'react';
  import { ViewStyle } from 'react-native';

  interface LinearGradientProps {
    colors: readonly [string, string, ...string[]];
    style?: ViewStyle;
    start?: [number, number];
    end?: [number, number];
    locations?: number[];
    children?: React.ReactNode;
  }

  export class LinearGradient extends Component<LinearGradientProps> {}
}

declare module 'expo-router' {
  export type Href = string;
  
  export const router: {
    push: (path: string | { pathname: string; params?: any }) => void;
    replace: (path: string) => void;
    back: () => void;
  };
  
  export const useRouter: () => typeof router;
  export const usePathname: () => string;
  export const useLocalSearchParams: <T = any>() => T;
  
  export const Link: React.ComponentType<any>;
  
  export const Stack: React.ComponentType<{
    children: React.ReactNode;
    screenOptions?: any;
  }> & {
    Screen: React.ComponentType<{
      name: string;
      options?: any;
    }>;
  };
}
