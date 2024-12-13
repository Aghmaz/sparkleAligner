import React, {useState, useRef, useEffect} from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ListRenderItem,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import COLORS from '../../constraints/colors';
import Icons from '../../assets/icons';

interface Message {
  id: string;
  type: 'sender' | 'receiver';
  text: string;
  time: string;
}

const ChatSupport: React.FC = () => {
  const navigation = useNavigation();
  const [messageText, setMessageText] = useState('');

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'sender',
      text: 'Draw a line in the sand -dead a date. Thanks Proceduralize weaponize the data.',
      time: '6:27 PM',
    },
    {
      id: '2',
      type: 'receiver',
      text: 'Draw a line in the sand drop-dead date. And to Proceduralije weaponize their data.',
      time: '10:27 PM',
    },
    {
      id: '3',
      type: 'sender',
      text: 'Great! Thanks.',
      time: '6:27 AM',
    },
    {
      id: '4',
      type: 'receiver',
      text: 'Its my pleasure!',
      time: '8:27 PM',
    },
    {
      id: '5',
      type: 'receiver',
      text: 'Draw a line in the sand drop-dead date. And to Proceduralije weaponize their data yet ping me.',
      time: '11:27 PM',
    },
    {
      id: '6',
      type: 'sender',
      text: 'Great! Thanks.',
      time: '12:27 AM',
    },
    {
      id: '7',
      type: 'receiver',
      text: 'Its my pleasure!',
      time: '9:27 PM',
    },
  ]);

  const flatListRef = useRef<FlatList>(null);

  const renderItem: ListRenderItem<Message> = ({item}) => (
    <View
      style={[
        styles.msgContainer,
        {
          flexDirection: item.type === 'sender' ? 'row-reverse' : 'row',
        },
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
        <Text style={styles.msgText}>{item.text}</Text>
        <Text
          style={{
            fontFamily: 'Roboto-Regular',
            fontSize: 12,
            color: COLORS.GRAY_DARK,
            textAlign: item.type === 'sender' ? 'left' : 'right',
          }}>
          {item.time}
        </Text>
      </View>
    </View>
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (messages.length > 0) {
        flatListRef.current?.scrollToIndex({
          index: messages.length - 1,
          animated: false,
        });
      }
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToIndex({
        index: messages.length - 1,
        animated: true,
      });
    }
  }, [messages]);

  const handleSend = () => {
    if (messageText.trim()) {
      const newMessage: Message = {
        id: String(messages.length + 1),
        type: 'sender',
        text: messageText.trim(),
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setMessages(prevMessages => [...prevMessages, newMessage]);
      setMessageText('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}>
          <Icons.BACKARROW />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chat Support</Text>
      </View>
      <FlatList
        ref={flatListRef}
        data={messages}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        getItemLayout={(data, index) => ({
          length: 100,
          offset: 100 * index,
          index,
        })}
      />
      <View style={styles.inputContainer}>
        <TextInput
          multiline
          numberOfLines={5}
          style={styles.textInput}
          placeholder="Type your message..."
          value={messageText}
          onChangeText={setMessageText}
          placeholderTextColor={COLORS.GRAY_DARK}
        />
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.sendButton}
          onPress={handleSend}>
          <Icons.SEND />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingVertical: 20,
    gap: 100,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
  },
  msgContainer: {
    padding: 10,
  },
  msgText: {
    fontSize: 14,
    color: COLORS.BLACK,
    fontFamily: 'Roboto-Regular',
  },
  timeText: {
    fontSize: 12,
    color: COLORS.GRAY_DARK,
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 15,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.GRAY_DARK,
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 14,
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
});

export default ChatSupport;
