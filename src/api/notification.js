import axiosInstance from './axios.config';

const notification = {
  /**
   * Get all notifications for a user
   * @param {string} userId - The ID of the user
   * @returns {Promise} - The response from the API
   */
  getNotifications: (userId) => {
    return axiosInstance.get(`/notifications/${userId}`);
  },

  /**
   * Mark a notification as read
   * @param {string} notificationId - The ID of the notification
   * @returns {Promise} - The response from the API
   */
  markAsRead: (notificationId) => {
    return axiosInstance.put(`/notifications/${notificationId}/read`);
  }
};

export default notification;