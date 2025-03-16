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
import io from 'socket.io-client';

interface Message {
  _id: string;
  type: 'sender' | 'receiver';
  senderId: string;
  receiverId: string;
  text: string;
  time: string;
  status?: string;
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
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  sendButton: {
    backgroundColor: '#9ceff5',
    marginLeft: 10,
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
    paddingVertical: 5,
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
    marginLeft: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderColor: COLORS.GRAY_DARK,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
let USER_ID: string | null = null;
const userId = async () => {
  USER_ID = await AsyncStorage.getItem('userId');
  console.log('USER_ID=========', USER_ID);
};
userId();
// Hardcode support agent as the only chat partner
const agentId = '67ba1c0e0bab5a0c9f2bf65e';

const socket = io('http://192.168.1.101:8000', {
  query: {userId: USER_ID ? USER_ID : '67ba24eb1431a3c93ab1d9e7'},
});

const Chat: React.FC<ChatProps> = ({isChatModalOpen, setIsChatModalOpen}) => {
  const {theme} = useTheme();
  const currentTheme = theme === 'light' ? LightTheme : DarkTheme;

  // Use a single state variable for the message input
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedUser] = useState<any>({_id: agentId, name: 'Support Agent'});
  //   const [socket, setSocket] = useState<any>(null);

  const [typingUserId, setTypingUserId] = useState<string | null>(null);
  const flatListRef = useRef<FlatList<Message>>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load current patient info from AsyncStorage
  useEffect(() => {
    AsyncStorage.getItem('userId').then(userId => {
      setCurrentUser({
        _id: userId,
        name: 'PatientName',
        role: 'Patient',
      });
    });
  }, []);

  // Create and configure the socket connection
  useEffect(() => {
    // setSocket(newSocket);
    // Listen for new messages
    socket.on('newMessage', (message: any) => {
      // Ensure the message is between the patient and support agent
      if (
        [currentUser._id, agentId].includes(message.senderId) &&
        [currentUser._id, agentId].includes(message.receiverId)
      ) {
        setMessages(prev => [
          ...prev,
          {
            _id: message._id || String(prev.length + 1),
            type: message.senderId === currentUser._id ? 'sender' : 'receiver',
            senderId: message.senderId,
            receiverId: message.receiverId,
            text: message.message,
            time: new Date(message.createdAt).toLocaleTimeString(),
            status: message.status,
          },
        ]);
      }
    });

    // Listen for typing events
    socket.on('userTyping', ({userId}: any) => {
      if (userId === agentId) {
        setTyping(true);
        setTypingUserId(userId);
      }
    });
    socket.on('userStopTyping', ({userId}: any) => {
      if (userId === agentId) {
        setTyping(false);
        setTypingUserId(null);
      }
    });

    // Listen for message status updates
    socket.on('messageStatus', ({messageId, status}: any) => {
      setMessages(prev =>
        prev.map(msg => (msg._id === messageId ? {...msg, status} : msg)),
      );
    });

    // Load initial messages
    socket.emit('getMessages', {receiverId: agentId});
    socket.on('loadMessages', (msgs: any) => {
      console.log('Received messages:', msgs);
      setMessages(
        msgs.map((msg: any) => ({
          _id: msg._id || String(msgs.length + 1),
          type: msg.senderId === currentUser._id ? 'sender' : 'receiver',
          senderId: msg.senderId,
          receiverId: msg.receiverId,
          text: msg.message,
          time: new Date(msg.createdAt).toLocaleTimeString(),
          status: msg.status,
        })),
      );
    });

    return () => {
      socket.off('loadMessages');
      //   newSocket.disconnect();
      //   setSocket(null);
    };
  });

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    flatListRef.current?.scrollToEnd({animated: true});
  }, [messages]);

  // Send message via socket and update local state immediately
  const sendMessage = () => {
    if (!messageText.trim()) return;
    // Add the new message locally so it appears immediately.
    setMessages(prev => [
      ...prev,
      {
        _id: String(prev.length + 1),
        type: 'sender',
        senderId: currentUser._id || USER_ID,
        receiverId: agentId,
        text: messageText,
        time: new Date().toLocaleTimeString(),
      },
    ]);
    // Emit the message to the server.
    const messageData = {
      message: messageText,
      senderId: currentUser._id || USER_ID,
      receiverId: agentId,
      createdAt: new Date(),
    };
    socket.emit('sendMessage', messageData);
    setMessageText('');
  };

  //   Handle typing events: emit "typing" then "stopTyping" after delay
  const handleTyping = () => {
    if (socket) {
      socket.emit('typing', {receiverId: agentId});
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('stopTyping', {receiverId: agentId});
      }, 1000);
    }
  };

  return (
    <Modal transparent visible={isChatModalOpen} animationType="slide">
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
            {/* Chat Header */}
            <View style={styles.chatHeader}>
              <TouchableOpacity onPress={() => setIsChatModalOpen(false)}>
                <Icons.BACKARROW fill={currentTheme.colors.icon} />
              </TouchableOpacity>
              <Text
                style={[styles.headerTitle, {color: currentTheme.colors.text}]}>
                Chat Support
              </Text>
            </View>
            {/* Chat Body */}
            <View style={{flex: 1}}>
              <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={({item}) => (
                  <View
                    style={[
                      styles.msgContainer,
                      {
                        flexDirection:
                          item.type === 'sender' ? 'row-reverse' : 'row',
                      },
                    ]}>
                    <View
                      style={{
                        backgroundColor:
                          item.type === 'sender' ? '#3b82f6' : '#e5e7eb',
                        padding: 10,
                        borderRadius: 8,
                        maxWidth: '80%',
                      }}>
                      <Text
                        style={{
                          color: item.type === 'sender' ? '#fff' : '#000',
                        }}>
                        {item.text}
                      </Text>
                      <Text
                        style={{fontSize: 10, color: currentTheme.colors.text}}>
                        {item.time}
                      </Text>
                    </View>
                  </View>
                )}
                keyExtractor={item => item._id}
              />
              {typing && (
                <View style={{padding: 10}}>
                  <Text
                    style={{
                      fontStyle: 'italic',
                      color: currentTheme.colors.text,
                    }}>
                    Typing...
                  </Text>
                </View>
              )}
            </View>
            {/* Input Area */}
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.textInput,
                  {borderColor: currentTheme.colors.text},
                ]}
                placeholder="Type your message..."
                placeholderTextColor={currentTheme.colors.text}
                value={messageText}
                onChangeText={text => {
                  setMessageText(text);
                  handleTyping();
                }}
                onSubmitEditing={sendMessage}
              />
              <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
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
