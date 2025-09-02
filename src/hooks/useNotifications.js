import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import notification from '@/api/notification';
import websocketService from '@/api/websocket';

export const useNotifications = (userData) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const handleNewNotification = useCallback((newNotification) => {
    setNotifications(prev => {
      // Check if notification already exists to prevent duplicates
      const exists = prev.some(n => n.id === newNotification.id);
      if (exists) {
        return prev;
      }
      
      const updated = [newNotification, ...prev];
      return updated;
    });
    
    setUnreadCount(prev => prev + 1);
    
    toast.info(newNotification.content, {
      position: "top-right",
      autoClose: 5000,
    });
  }, []);
  const fetchNotifications = useCallback(async () => {
    if (!userData?.id) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await notification.getNotifications(userData.id);
      
      if (response.data?.data) {
        const notificationData = response.data.data;
        setNotifications(notificationData);
        
        const unreadNotifications = notificationData.filter(
          notif => notif.status === "UNREAD"
        );
        setUnreadCount(unreadNotifications.length);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userData?.id]);

  const markAsRead = useCallback(async (notificationId) => {
    try {
      await notification.markAsRead(notificationId);
      
      setNotifications(prevNotifications => 
        prevNotifications.map(notif => 
          notif.id === notificationId 
            ? { ...notif, status: "READ" } 
            : notif
        )
      );
        setUnreadCount(prev => Math.max(0, prev - 1));
      
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  }, []);  // WebSocket subscription effect
  useEffect(() => {
    if (!userData?.id) {
      return;
    }

    // Connect to WebSocket
    websocketService.connect();
    
    // Set up subscription
    const subscription = websocketService.subscribeToUserNotifications(
      userData.id,
      handleNewNotification
    );
    
    // Fetch initial notifications
    fetchNotifications();
    
    // Add periodic check for missed notifications (fallback)
    const notificationCheckInterval = setInterval(() => {
      fetchNotifications();
    }, 30000); // Check every 30 seconds
    
    // Cleanup function
    return () => {
      const topic = `/user/${userData.id}/topic/notifications`;
      websocketService.unsubscribeFromTopic(topic);
      clearInterval(notificationCheckInterval);
    };
  }, [userData?.id, handleNewNotification, fetchNotifications]);return {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markAsRead,
    refreshNotifications: fetchNotifications, // Alias for manual refresh
  };
};
