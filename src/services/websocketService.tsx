import AsyncStorage from '@react-native-async-storage/async-storage';
import io, {connect, Socket} from 'socket.io-client';

const API_URL = 'http://192.168.43.112:8000';
const socketUrl = 'http://192.168.43.112:8000';

class WebSocketService {
  socket: Socket | null = null;

  async createConversation(members: string[]): Promise<any> {
    try {
      if (!members || members.length !== 2 || !members[0] || !members[1]) {
        throw new Error(
          'Invalid members array. Need exactly 2 valid member IDs',
        );
      }

      console.log('Creating conversation with members:', members);
      const token = await AsyncStorage.getItem('Token');

      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Making request to:', `${API_URL}/conversation`);
      console.log('Request payload:', {members});
      console.log('Request headers:', {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      });
      console.log('response is starting');
      const response = await fetch(`${API_URL}/conversation`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({members}),
      });
      console.log('response is ending');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Conversation API response:', data);
      return data;
    } catch (error: any) {
      console.error('Full error object:', error);
      if (error.response) {
        console.error('Error response:', error.response);
      }
      throw error;
    }
  }

  async sendMessage(
    conversationId: string,
    sender: string,
    text: string,
  ): Promise<any> {
    try {
      if (!conversationId) {
        throw new Error('No conversation ID provided');
      }

      console.log('Sending message:', {conversationId, sender, text});
      const token = await AsyncStorage.getItem('Token');

      if (!token) {
        throw new Error('No authentication token found');
      }
      console.log('=====================??????=======================');

      console.log(
        sender,
        'sender',
        conversationId,
        'conversationId',
        text,
        'text',
      );
      console.log('=====================??????=======================');
      const response = await fetch(`${API_URL}/message/send`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId,
          sender,
          text,
        }),
      });
      console.log('============================================');
      console.log(response, '---------------------');
      console.log('============================================');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Message sent successfully:', data);
      return data;
    } catch (error: any) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async getMessages(conversationId: string, userId: string): Promise<any> {
    try {
      const token = await AsyncStorage.getItem('Token');

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(
        `${API_URL}/message/${conversationId}/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }
  // Socket methods
  connect(userId: string): void {
    this.socket = connect(socketUrl, {
      query: {userId},
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
    });
  }

  onNewMessage(callback: (message: any) => void): void {
    if (this.socket) {
      this.socket.on('newMessage', callback);
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

export default new WebSocketService();
