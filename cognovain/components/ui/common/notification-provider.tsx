'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import Notification from './notification';

interface NotificationContextType {
  showNotification: (message: string, type?: 'success' | 'error' | 'info', duration?: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    duration: number;
    show: boolean;
  }>({
    message: '',
    type: 'success',
    duration: 5000,
    show: false,
  });

  const showNotification = (
    message: string,
    type: 'success' | 'error' | 'info' = 'success',
    duration: number = 5000
  ) => {
    setNotification({ message, type, duration, show: true });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, show: false }));
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <Notification
        message={notification.message}
        type={notification.type}
        duration={notification.duration}
        show={notification.show}
        onClose={hideNotification}
      />
    </NotificationContext.Provider>
  );
} 