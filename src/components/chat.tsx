import React, {useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTheme} from '../theme/themeManagement';
import LightTheme from '../theme/LightTheme';
import DarkTheme from '../theme/DarkTheme';
import COLORS from '../constraints/colors';
import Icons from '../assets/icons';
import WebSocketService from '../services/websocketService';

interface Message {
  id: string;
  type: 'sender' | 'receiver';
  text: string;
  time: string;
}

interface ChatProps {
  isChatModalOpen: boolean;
  setIsChatModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    width: width,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.1,
    paddingVertical: 15,
  },
  sendButton: {
    backgroundColor: '#9ceff5',
    marginLeft: 15,
    borderRadius: 50,
    height: 45,
    width: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.GRAY_DARK,
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 14,
  },
  msgContainer: {
    padding: 10,
  },
  msgText: {
    fontSize: 14,
    color: COLORS.BLACK,
    fontFamily: 'Roboto-Regular',
  },
  headerTitle: {
    fontFamily: 'Roboto-Regular',
    fontSize: 20,
    color: COLORS.BLACK,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingVertical: 15,
    paddingHorizontal: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
});

const Chat: React.FC<ChatProps> = ({isChatModalOpen, setIsChatModalOpen}) => {
  const {theme} = useTheme();
  const currentTheme = theme === 'light' ? LightTheme : DarkTheme;
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentConversation, setCurrentConversation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList<Message>>(null);

  // Dummy currentUser for mobile patients.
  let currentUser: any = {
    _id: AsyncStorage.getItem('userId'),
    name: 'PatientName',
    role: 'Patient',
  };

  // Function to scroll the FlatList to the bottom
  const scrollToBottom = () => {
    flatListRef.current?.scrollToEnd({animated: true});
  };

  // Render each message item
  const renderItem = ({item}: {item: Message}) => (
    
    <View
      style={[
        styles.msgContainer,
        {flexDirection: item.type === 'sender' ? 'row-reverse' : 'row'},
      ]}>
      <View
        style={{
          backgroundColor: '#9ceff545',
          padding: 20,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          maxWidth: '89%',
          borderBottomLeftRadius: item.type === 'sender' ? 0 : 8,
          borderBottomRightRadius: item.type === 'sender' ? 8 : 0,
          gap: 5,
        }}>
        <Text style={[styles.msgText, {color: currentTheme.colors.text}]}>
          {item.text}
        </Text>
        <Text
          style={{
            fontFamily: 'Roboto-Regular',
            fontSize: 12,
            color: currentTheme.colors.text,
            textAlign: item.type === 'sender' ? 'left' : 'right',
          }}>
          {item.time}
        </Text>
      </View>
    </View>
  );

  // When the modal opens, create a conversation (if not already created) and fetch previous messages.
  useEffect(() => {
    const initiateConversation = async () => {
      if (isChatModalOpen && currentConversation === null && currentUser) {
        setIsLoading(true);
        try {
          const userId = await AsyncStorage.getItem('userId');
          currentUser._id = userId;
          const supportAgentId = '67ba1c0e0bab5a0c9f2bf65e';
          // console.log('userId=============', userId);
          // Create conversation between the patient (currentUser) and support agent.
          console.log('currentUser._id=============', currentUser._id);
          const members = [currentUser._id, supportAgentId];
          console.log('Creating conversation with members:', members);
          const conversation = await WebSocketService.createConversation(
            members,
          );
          console.log('Conversation created/retrieved:', conversation);
          setCurrentConversation(conversation);

          // Fetch previous messages for this conversation.
          if (conversation._id) {
            const fetchedMessages = await WebSocketService.getMessages(
              conversation._id,
              currentUser._id,
            );
            if (fetchedMessages && fetchedMessages.length > 0) {
              const formattedMessages = fetchedMessages.map((msg: any) => ({
                id: msg._id || String(Math.random()),
                type: msg.senderId === currentUser._id ? 'sender' : 'receiver',
                text: msg.text,
                time: new Date(msg.createdAt).toLocaleTimeString(),
              }));
              setMessages(formattedMessages);
            }
          }
        } catch (error) {
          console.error('Error initiating conversation:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    const fetchMessages = async () => {
        if (currentConversation) {
            console.log("currentConversation",currentConversation._id)
            const fetchedMessages = await WebSocketService.getMessages(
             currentConversation._id,
              currentUser._id,
            );
            if (fetchedMessages && fetchedMessages.length > 0) {
              const formattedMessages = fetchedMessages.map((msg: any) => ({
                id: msg._id || String(Math.random()),
                type: msg.senderId === currentUser._id ? 'sender' : 'receiver',
                text: msg.text,
                time: new Date(msg.createdAt).toLocaleTimeString(),
              }));
              setMessages(formattedMessages);
            }
          }}
        


    if (isChatModalOpen && currentUser) {
        initiateConversation();
        
        }


   
  }, [isChatModalOpen, currentConversation, currentUser]);

  // Handle sending a message
  const handleSend = async () => {
    if (messageText.trim() && currentConversation) {
      const newMessage: Message = {
        id: String(messages.length + 1),
        type: 'sender',
        text: messageText.trim(),
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      // Update local state
      setMessages(prev => [...prev, newMessage]);

      // Send message via API endpoint
      try {
        console.log('currentConversation._id', currentConversation._id);
        console.log('currentUser._id', currentUser._id_j);
        console.log('messageText.trim()', messageText.trim());
        await WebSocketService.sendMessage(
          currentConversation._id,
          currentUser._id._j,
          messageText.trim(),
        );
        console.log('Message sent successfully via API');
      } catch (error) {
        console.error('Error sending message:', error);
      }

      setMessageText('');
      scrollToBottom();
    }
  };

  // Set up socket connection and listen for new messages
  useEffect(() => {
    if (isChatModalOpen && currentUser) {
      WebSocketService.connect(currentUser._id);

      // Listen for incoming messages
      WebSocketService.onNewMessage((newMsg: any) => {
        if (
          currentConversation &&
          newMsg.conversationId === currentConversation._id
        ) {
          setMessages(prev => [
            ...prev,
            {
              id: String(prev.length + 1),
              type: newMsg.senderId === currentUser._id ? 'sender' : 'receiver',
              text: newMsg.text,
              time: new Date(newMsg.createdAt).toLocaleTimeString(),
            },
          ]);
        }
      });
    } else {
      WebSocketService.disconnect();
    }

    return () => {
      WebSocketService.disconnect();
    };
  }, [isChatModalOpen, currentUser, currentConversation]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Modal transparent={true} visible={isChatModalOpen} animationType="slide">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalOverlay}>
          <View
            style={{
              backgroundColor: currentTheme.colors.background,
              borderRadius: 12,
              width: width * 0.9,
              height: height * 0.8,
              paddingHorizontal: 10,
            }}>
            <View style={styles.chatHeader}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setIsChatModalOpen(false)}>
                <Icons.BACKARROW fill={currentTheme.colors.icon} />
              </TouchableOpacity>
              <Text
                style={[styles.headerTitle, {color: currentTheme.colors.text}]}>
                Chat Support
              </Text>
            </View>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator
                  size="large"
                  color={currentTheme.colors.text}
                />
              </View>
            ) : (
              <FlatList
                ref={flatListRef}
                data={messages}
                showsVerticalScrollIndicator={false}
                renderItem={renderItem}
                keyExtractor={item => item.id}
              />
            )}
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.textInput,
                  {borderColor: currentTheme.colors.text},
                ]}
                placeholder="Type your message..."
                value={messageText}
                onChangeText={setMessageText}
                placeholderTextColor={currentTheme.colors.text}
              />
              <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                <Icons.SEND fill={currentTheme.colors.icon} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default Chat;
