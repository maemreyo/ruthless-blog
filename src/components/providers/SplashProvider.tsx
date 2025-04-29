'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import SplashScreen from '@/components/splash/SplashScreen';

interface SplashContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const SplashContext = createContext<SplashContextType | undefined>(undefined);

export function useSplash() {
  const context = useContext(SplashContext);
  if (context === undefined) {
    throw new Error('useSplash must be used within a SplashProvider');
  }
  return context;
}

interface SplashProviderProps {
  children: ReactNode;
}

export function SplashProvider({ children }: SplashProviderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const handleSplashComplete = () => {
    setIsLoading(false);
  };
  
  if (!isMounted) {
    return null;
  }
  
  return (
    <SplashContext.Provider value={{ isLoading, setIsLoading }}>
      <SplashScreen onComplete={handleSplashComplete} />
      <div style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.5s ease-in-out' }}>
        {children}
      </div>
    </SplashContext.Provider>
  );
}