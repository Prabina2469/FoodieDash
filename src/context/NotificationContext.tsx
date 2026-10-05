import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { notificationService } from '../services/notificationService';
import { useAuth } from './AuthContext';
import { NotificationItem } from '../types';

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  loading: boolean;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const FALLBACK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 101,
    userId: 'guest',
    title: 'Welcome to FoodieDash 🎉',
    message: 'Explore hand-picked restaurants, flash discounts, and ultra-fast 20-min delivery.',
    type: 'WELCOME',
    isRead: false,
    createdAt: 'Just now'
  },
  {
    id: 102,
    userId: 'guest',
    title: 'Weekend Treat — 20% OFF',
    message: 'Use code FOODIE20 at checkout for up to $12 off on your favorite Italian & Sushi feast.',
    type: 'PROMOTION',
    isRead: false,
    createdAt: '1 hour ago'
  }
];

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>(FALLBACK_NOTIFICATIONS);
  const [loading, setLoading] = useState(false);

  const refreshNotifications = async () => {
    if (isAuthenticated) {
      try {
        setLoading(true);
        const data = await notificationService.getMyNotifications();
        if (Array.isArray(data) && data.length > 0) {
          setNotifications(data);
        }
      } catch (err) {
        console.warn('Backend notifications fetch note:', err);
      } finally {
        setLoading(false);
      }
    } else {
      setNotifications(FALLBACK_NOTIFICATIONS);
    }
  };

  useEffect(() => {
    refreshNotifications();
    const interval = setInterval(() => {
      if (isAuthenticated) refreshNotifications();
    }, 15000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const markAsRead = async (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    if (isAuthenticated) {
      try {
        await notificationService.markAsRead(id);
      } catch (e) {
        console.warn('Mark as read note:', e);
      }
    }
  };

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    if (isAuthenticated) {
      for (const notif of notifications.filter((n) => !n.isRead)) {
        try {
          await notificationService.markAsRead(notif.id);
        } catch (e) {
          // ignore individual fails
        }
      }
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        refreshNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
