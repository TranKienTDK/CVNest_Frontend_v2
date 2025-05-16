import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { getUserData, getAccessToken } from '../helper/storage';

class WebSocketService {
  constructor() {
    this.client = null;
    this.connected = false;
    this.subscriptions = new Map();
    this.messageCallbacks = new Map();
    this.reconnectDelay = 5000;
    this.connectCallbacks = [];
  }

  connect() {
    if (this.client) {
      return;
    }

    const userData = getUserData();
    if (!userData || !userData.id) {
      console.warn('User data not available, WebSocket connection not established');
      return;
    }

    const accessToken = getAccessToken();
    if (!accessToken) {
      console.warn('Access token not available, WebSocket connection not established');
      return;
    }

    this.client = new Client({
      webSocketFactory: () => new SockJS(`${import.meta.env.VITE_API_URL}/ws`),
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`
      },
      debug: function(str) {
        console.log('STOMP: ' + str);
      },
      reconnectDelay: this.reconnectDelay,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log('WebSocket connected');
        this.connected = true;

        // Handle any subscriptions that were requested before connection was established
        this.subscriptions.forEach((topic, callback) => {
          this.subscribeToTopic(topic, callback);
        });

        // Execute any callbacks waiting for connection
        this.connectCallbacks.forEach(callback => callback());
        this.connectCallbacks = [];
      },
      onDisconnect: () => {
        console.log('WebSocket disconnected');
        this.connected = false;
      },
      onStompError: (frame) => {
        console.error('WebSocket error:', frame);
      }
    });

    this.client.activate();
  }

  subscribeToTopic(topic, callback) {
    if (!this.client) {
      console.warn(`Not connected to WebSocket. Will subscribe to ${topic} when connected.`);
      this.subscriptions.set(topic, callback);
      this.connect();
      return;
    }

    if (!this.connected) {
      console.warn(`Waiting for connection to subscribe to ${topic}`);
      this.subscriptions.set(topic, callback);
      return;
    }

    console.log(`Subscribing to topic: ${topic}`);
    const subscription = this.client.subscribe(topic, (message) => {
      try {
        const parsedMessage = JSON.parse(message.body);
        callback(parsedMessage);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
        callback(message.body);
      }
    });

    this.messageCallbacks.set(topic, subscription);
    return subscription;
  }

  unsubscribeFromTopic(topic) {
    const subscription = this.messageCallbacks.get(topic);
    if (subscription) {
      subscription.unsubscribe();
      this.messageCallbacks.delete(topic);
      console.log(`Unsubscribed from topic: ${topic}`);
    }
  }

  disconnect() {
    if (this.client && this.connected) {
      // Unsubscribe from all topics
      this.messageCallbacks.forEach((subscription) => {
        subscription.unsubscribe();
      });
      
      this.client.deactivate();
      this.client = null;
      this.connected = false;
      this.subscriptions.clear();
      this.messageCallbacks.clear();
      console.log('WebSocket disconnected');
    }
  }

  // Subscribe to user specific notifications
  subscribeToUserNotifications(userId, callback) {
    const userTopic = `/user/${userId}/topic/notifications`;
    return this.subscribeToTopic(userTopic, callback);
  }

  // Helper to execute callback once connection is established
  onConnect(callback) {
    if (this.connected) {
      callback();
    } else {
      this.connectCallbacks.push(callback);
    }
  }
}

// Create a singleton instance
const websocketService = new WebSocketService();

export default websocketService;