import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  Button,
} from 'react-native';
import websocketService from '../../services/websocketService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const agentId = '675433a1f20c61fed60f6e3b';

interface Message {
  sender: string;
  content: string;
  time: string;
}

const ChatSupport = () => {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>('');
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUserId = async () => {
      const ID = await AsyncStorage.getItem('userId');
      if (!ID) {
        console.log('No User ID found. Please login.');
        return;
      }
      setUserId(ID);
    };

    getUserId();
  }, []);

  useEffect(() => {

    if (!userId) return;

    websocketService.connect(userId);

    const createOrGetConversation = async () => {
      try {
        const conversation = await websocketService.createConversation([
          userId,
          agentId,
        ]);
        setConversationId(conversation._id);
        const fetchedMessages = await websocketService.getMessages(
          conversation._id,
          userId,
        );
        const formattedMessages = fetchedMessages.map((msg: any) => ({
          sender: msg.senderId === userId ? 'You' : 'Agent',
          content: msg.text,
          time: new Date(msg.createdAt).toLocaleTimeString(),
        }));
        setMessages(formattedMessages);
      } catch (error) {
        console.error('Error initializing conversation:', error);
      }
    };

    createOrGetConversation();

    websocketService.onNewMessage((newMessage: any) => {
      if (newMessage.conversationId === conversationId) {
        const formattedMessage = {
          sender: newMessage.senderId === userId ? 'You' : 'Agent',
          content: newMessage.text,
          time: new Date(newMessage.createdAt).toLocaleTimeString(),
        };
        setMessages(prevMessages => [...prevMessages, formattedMessage]);
      }
    });

    return () => websocketService.disconnect();
  }, [userId, conversationId,messages]);

  const handleSendMessage = async () => {
    if (!message.trim() || !conversationId || !userId) return;

    try {
      const sentMessage = await websocketService.sendMessage(
        conversationId,
        userId,
        message,
      );

      console.log('Message sent successfully:', sentMessage);

      const newMessage = {
        sender: 'You',
        content: message,
        time: new Date().toLocaleTimeString(),
      };
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Chat with Agent</Text>
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <View
            style={[
              styles.messageContainer,
              item.sender === 'You' ? styles.yourMessage : styles.agentMessage,
            ]}>
            <Text style={styles.messageText}>{item.content}</Text>
            <Text style={styles.messageTime}>{item.time}</Text>
          </View>
        )}
        style={styles.messageList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
        />
        <Button title="Send" onPress={handleSendMessage} />
      </View>
    </View>
  );
};

export default ChatSupport;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  messageList: {
    flex: 1,
    marginBottom: 10,
  },
  messageContainer: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    maxWidth: '70%',
  },
  yourMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007bff',
  },
  agentMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#e0e0e0',
  },
  messageText: {
    color: '#fff',
  },
  messageTime: {
    fontSize: 10,
    color: '#ddd',
    marginTop: 5,
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
});
