import React, {useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
  FlatList,
  ListRenderItem,
  TextInput,
  TouchableWithoutFeedback
} from 'react-native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Shadow} from 'react-native-shadow-2';
import COLORS from '../../constraints/colors';
import Icons from '../../assets/icons';

const {width} = Dimensions.get('window');
const circularProgressSize = width * 0.812;
const indicatorPosition = (20 / 24) * 360;

type TimerScreenNavigationProp = DrawerNavigationProp<any, any>;

interface Message {
  id: string;
  type: 'sender' | 'receiver';
  text: string;
  time: string;
}

const TimerScreen: React.FC = () => {
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

  const [startTime, setStartTime] = useState<string | null>(null);
  const [isWearing, setIsWearing] = useState<boolean>(true);
  const [isChatModalOpen, setIsChatModalOpen] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const [notificationTimer, setNotificationTimer] = useState<number>(0);
  const [outTime, setOutTime] = useState<string>('');
  const lastPausedAt = useRef<Date | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [messageText, setMessageText] = useState('');
  const [remindModalVisible, setRemindModalVisible] = useState<boolean>(false);
  const [fillPercentage, setFillPercentage] = useState<number>(0);
  const [selectedAligner, setSelectedAligner] = useState<number>(0);
  const [selectedRemindMin, setSelectedRemindMin] = useState<number>(1);
  const [selectedRemindHour, setSelectedRemindHOur] = useState<number>(0);
  const [minutesLeft, setMinutesLeft] = useState<number>(2);
  const navigation = useNavigation<TimerScreenNavigationProp>();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const notificationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const remindMinsscrollViewRef = useRef<ScrollView>(null);
  const remindHourscrollViewRef = useRef<ScrollView>(null);
  const [displayedAligner, setDisplayedAligner] =
    useState<string>('Aligner #1');
  const [currentTime, setCurrentTime] = useState<string>(
    new Date().toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    }),
  );

  const totalMinutes: number = 60;
  const alignerTimeIncrement: number = 2;

  const flatListRef = useRef<FlatList>(null);

  const [remainingMinutes, setRemainingMinutes] =
    useState<number>(totalMinutes);

  const toggleModal = (): void => {
    setModalVisible(!modalVisible);
  };
  const toggleRemindModal = (): void => {
    setRemindModalVisible(!remindModalVisible);
  };

  const alignerTexts: string[] = Array.from(
    {length: 30},
    (_, index) => `Aligner #${index + 1}`,
  );
  const remindHours: string[] = Array.from(
    {length: 4},
    (_, index) => `${index} hr`,
  );
  const remindMins: string[] = Array.from(
    {length: 60},
    (_, index) => `${index.toString().padStart(2, '0')} min`,
  );

  const handleAlignerPress = (index: number): void => {
    setSelectedAligner(index);
  };
  const handleRemindMinsPress = (index: number): void => {
    setSelectedRemindMin(index);
  };
  const handleRemindHourPress = (index: number): void => {
    setSelectedRemindHOur(index);
  };

  const handleConfirm = (): void => {
    const alignerText = alignerTexts[selectedAligner];
    const minutes = calculateMinutes(selectedAligner);
    setDisplayedAligner(alignerText);
    setMinutesLeft(minutes);
    setModalVisible(false);
  };

  const calculateMinutes = (alignerIndex: number): number => {
    return (alignerIndex + 1) * alignerTimeIncrement;
  };

  useEffect(() => {
    if (modalVisible && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        y: selectedAligner * 37,
        animated: true,
      });
    }
  }, [modalVisible]);

  useEffect(() => {
    if (remindModalVisible && remindHourscrollViewRef.current) {
      remindHourscrollViewRef.current.scrollTo({
        y: selectedRemindHour * 37,
        animated: true,
      });
    }
  }, [remindModalVisible]);

  useEffect(() => {
    if (remindModalVisible && remindMinsscrollViewRef.current) {
      remindMinsscrollViewRef.current.scrollTo({
        y: selectedRemindMin * 37,
        animated: true,
      });
    }
  }, [remindModalVisible, selectedRemindMin]);

  useEffect(() => {
    const timer = setInterval(() => {
      const timeToUse = outTime === '' ? currentTime : outTime;
      const [hours, minutes] = timeToUse.split(':').map(Number);
      const minutesPassed = hours * 60 + minutes;
      const percentage = (minutesPassed / 1440) * 100;
      setFillPercentage(percentage);
      if (outTime === '') {
        const now = new Date();
        const formattedTime = now.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
        });
        setCurrentTime(formattedTime);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [outTime, currentTime]);

  useEffect(() => {
    const timeDecrement = setInterval(() => {
      if (minutesLeft > 1) {
        setMinutesLeft(prev => prev - 1);
      } else {
        if (selectedAligner < 29) {
          const nextAligner = selectedAligner + 1;
          const nextAlignerText = alignerTexts[nextAligner];
          const nextMinutes = calculateMinutes(nextAligner);
          setSelectedAligner(nextAligner);
          setDisplayedAligner(nextAlignerText);
          setMinutesLeft(nextMinutes);
          setRemainingMinutes(totalMinutes - nextAligner * 2);
        }
      }
    }, 60000);
    return () => clearInterval(timeDecrement);
  }, [minutesLeft, selectedAligner]);

  const handlePress = () => {
    const now = new Date();
    if (!isWearing) {
      lastPausedAt.current = now;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = setInterval(() => {
        setOutTime(prev => {
          const [hours, minutes] = prev.split(':').map(Number);
          const newMinutes = minutes + 1;
          const adjustedHours = hours + Math.floor(newMinutes / 60);
          const adjustedMinutes = newMinutes % 60;
          return `${adjustedHours.toString().padStart(2, '0')}:${adjustedMinutes
            .toString()
            .padStart(2, '0')}`;
        });
      }, 60000);
    } else {
      toggleRemindModal();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (!startTime) {
        const formattedTime = now.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
        });
        setStartTime(formattedTime);
        setOutTime(formattedTime);
      }
      intervalRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 60000);
    }
    setIsWearing(!isWearing);
  };
  const notificationAlertMinutes = selectedRemindHour * 60 + selectedRemindMin;

  const startTimer = () => {
    if (!isWearing && notificationAlertMinutes > 0) {
      setNotificationTimer(notificationAlertMinutes);

      if (notificationIntervalRef.current) {
        clearInterval(notificationIntervalRef.current);
      }

      notificationIntervalRef.current = setInterval(() => {
        setNotificationTimer(prev => {
          if (prev > 1) {
            return prev - 1;
          } else if (prev === 1) {
            console.log('Notification Alert');
            setTimeout(() => {
              if (!isWearing) {
                setNotificationTimer(notificationAlertMinutes);
              } else {
                clearInterval(notificationIntervalRef.current!);
              }
            }, 30000);
            return 0;
          }
          return prev;
        });
      }, 60000);
    }
  };

  const stopTimer = () => {
    if (notificationIntervalRef.current) {
      clearInterval(notificationIntervalRef.current);
    }
    setNotificationTimer(0);
  };

  const handleNoReminder = () => {
    setRemindModalVisible(false);
    stopTimer();
  };

  const handleRemindConfirm = () => {
    setRemindModalVisible(false);
    startTimer();
  };

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

  const scrollToBottom = () => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToIndex({
        index: messages.length - 1,
        animated: true,
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [isChatModalOpen, messages]);

  const handleInputFocus = () => {
    scrollToBottom();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{height:'100%'}}>
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          activeOpacity={0.8}
          style={styles.header}>
          <Icons.MENU />
          <Text style={styles.headerTitle}>Timer</Text>
          <Icons.FAQ />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={toggleModal}
          activeOpacity={0.8}
          style={styles.daysLeftContainer}>
          <Icons.SYNC />
          <Text style={styles.daysLeftText}>
            {minutesLeft} more {minutesLeft === 1 ? 'minute' : 'minutes'} on{' '}
            {displayedAligner}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handlePress}
          activeOpacity={0.8}
          style={styles.circularProgressContainer}>
          <AnimatedCircularProgress
            size={circularProgressSize}
            width={20}
            fill={fillPercentage}
            tintColor={isWearing ? COLORS.SKY_LIGHT : COLORS.BLUE_DARK}
            backgroundColor={isWearing ? COLORS.BLUE_DARK : COLORS.SKY_LIGHT}
            rotation={360}
            childrenContainerStyle={{
              backgroundColor: COLORS.WHITE,
            }}
            children={() => (
              <View style={styles.circularProgressInnerContent}>
                <Text
                  style={[
                    styles.notWearingText,
                    {
                      color: isWearing ? COLORS.BLUE_DARK : COLORS.SKY_LIGHT,
                    },
                  ]}>
                  {' '}
                  {isWearing ? 'Wearing' : 'Not Wearing'}
                </Text>
                <View style={styles.alignInfoContainer}>
                  {isWearing ? <Icons.ALIGN /> : <Icons.AlignBLUE />}
                  <Text
                    style={[
                      styles.appName,
                      {
                        color: isWearing ? COLORS.SKY_LIGHT : COLORS.BLUE_DARK,
                      },
                    ]}>
                    SPARKLE ALIGN
                  </Text>
                </View>
                <Text
                  style={[
                    styles.timerText,
                    {
                      color: isWearing ? COLORS.BLUE_DARK : COLORS.SKY_LIGHT,
                    },
                  ]}>
                  {outTime === '' ? currentTime : outTime}
                </Text>
                <Text style={[styles.outText, {color: COLORS.GRAY_DARK}]}>
                  Out{' '}
                  {`${Math.floor(timer / 60)
                    .toString()
                    .padStart(2, '0')}:${(timer % 60)
                    .toString()
                    .padStart(2, '0')}`}
                </Text>
                {!isWearing && notificationTimer > 0 && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 6,
                    }}>
                    <Icons.ALARM height={15} width={15} style={{top: 5}} />
                    <Text
                      style={{
                        fontFamily: 'Roboto-Regular',
                        fontSize: 13,
                        color: COLORS.BLACK,
                        paddingTop: 10,
                      }}>
                      {Math.floor(notificationTimer / 60)
                        .toString()
                        .padStart(2, '0')}
                      :{(notificationTimer % 60).toString().padStart(2, '0')}
                    </Text>
                  </View>
                )}
              </View>
            )}
          />
        </TouchableOpacity>
        <View
          style={[
            styles.circleProgressIndicator,
            {
              transform: [
                {
                  translateX: circularProgressSize / 3.1,
                },
                {rotate: `${indicatorPosition}deg`},
                {
                  translateX: -circularProgressSize / 2,
                },
              ],
            },
          ]}>
          <View style={styles.progressIndicatorLine} />
          <Text style={styles.progressIndicatorText}>20</Text>
        </View>
        <View style={styles.daysToSmileContainer}>
          <Icons.CALENDER />
          <Text style={styles.daysToSmileText}>
            {remainingMinutes} minutes to a perfect smile!
          </Text>
        </View>
        <View
          style={{
            position: 'absolute',
            bottom: -10,
            right: 0,
            paddingRight: 1.5,
          }}>
          <Shadow>
            <TouchableOpacity
              onPress={() => setIsChatModalOpen(true)}
              activeOpacity={0.8}
              style={styles.shadowButton}>
              <Icons.CHAT />
            </TouchableOpacity>
          </Shadow>
        </View>
      </View>
      <Modal transparent={true} animationType="slide" visible={modalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>I'm currently wearing...</Text>
            <ScrollView
              ref={scrollViewRef}
              showsVerticalScrollIndicator={false}
              style={styles.scrollView}>
              {alignerTexts.map((alignerText, index) => (
                <TouchableOpacity
                  activeOpacity={0.8}
                  key={index}
                  onPress={() => handleAlignerPress(index)}
                  style={[
                    styles.alignTextContainer,
                    selectedAligner === index && styles.selectedAligner,
                    index === alignerTexts.length - 1 && {
                      marginBottom: 120,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.alignText,
                      selectedAligner === index && styles.selectedAlignerText,
                      {
                        opacity:
                          selectedAligner === index ||
                          selectedAligner === index + 1 ||
                          selectedAligner === index - 1
                            ? 1
                            : 0.5,
                      },
                    ]}>
                    {alignerText}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.btnsConatiner}>
              <Text
                onPress={() => setModalVisible(!modalVisible)}
                style={styles.btnText}>
                CANCEL
              </Text>
              <Text onPress={handleConfirm} style={styles.btnText}>
                CONFIRM
              </Text>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        transparent={true}
        visible={remindModalVisible}
        animationType="slide">
        <View style={styles.modalOverlay}>
          <View
            style={{
              backgroundColor: COLORS.WHITE,
              borderRadius: 25,
              marginHorizontal: 8,
            }}>
            <Text style={styles.modalTitle}>Remind me to wear again in</Text>
            <View style={{flexDirection: 'row'}}>
              <ScrollView
                ref={remindHourscrollViewRef}
                showsVerticalScrollIndicator={false}
                style={{height: 200, paddingTop: 70}}>
                {remindHours.map((remindHour, index) => (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    key={index}
                    onPress={() => handleRemindHourPress(index)}
                    style={[
                      styles.alignTextContainer,
                      selectedRemindHour === index && styles.selectedAligner,
                      index === remindHours.length - 1 && {
                        marginBottom: 120,
                      },
                    ]}>
                    <Text
                      style={[
                        styles.alignText,
                        selectedRemindHour === index &&
                          styles.selectedAlignerText,
                        {
                          opacity:
                            selectedRemindHour === index ||
                            selectedRemindHour === index + 1 ||
                            selectedRemindHour === index - 1
                              ? 1
                              : 0.5,
                        },
                      ]}>
                      {remindHour}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <ScrollView
                ref={remindMinsscrollViewRef}
                showsVerticalScrollIndicator={false}
                style={{height: 200, paddingTop: 70}}>
                {remindMins.map((remindMin, index) => (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    key={index}
                    onPress={() => handleRemindMinsPress(index)}
                    style={[
                      styles.alignTextContainer,
                      selectedRemindMin === index && styles.selectedAligner,
                      index === remindMins.length - 1 && {
                        marginBottom: 120,
                      },
                    ]}>
                    <Text
                      style={[
                        styles.alignText,
                        selectedRemindMin === index &&
                          styles.selectedAlignerText,
                        {
                          opacity:
                            selectedRemindMin === index ||
                            selectedRemindMin === index + 1 ||
                            selectedRemindMin === index - 1
                              ? 1
                              : 0.5,
                        },
                      ]}>
                      {remindMin}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <View
              style={{
                paddingHorizontal: 20,
                paddingTop: 15,
                paddingBottom: 3,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                onPress={() => setSelectedRemindMin(5)}
                style={{
                  fontFamily: 'Roboto-Medium',
                  fontSize: 17,
                  color: COLORS.BLACK,
                }}>
                5 min
              </Text>
              <Text
                onPress={() => setSelectedRemindMin(15)}
                style={{
                  fontFamily: 'Roboto-Medium',
                  fontSize: 17,
                  color: COLORS.BLACK,
                }}>
                15 min
              </Text>
              <Text
                onPress={() => setSelectedRemindMin(30)}
                style={{
                  fontFamily: 'Roboto-Medium',
                  fontSize: 17,
                  color: COLORS.BLACK,
                }}>
                30 min
              </Text>
              <Text
                onPress={() => setSelectedRemindMin(45)}
                style={{
                  fontFamily: 'Roboto-Medium',
                  fontSize: 17,
                  color: COLORS.BLACK,
                }}>
                45 min
              </Text>
              <Text
                onPress={() => setSelectedRemindHOur(1)}
                style={{
                  fontFamily: 'Roboto-Medium',
                  fontSize: 17,
                  color: COLORS.BLACK,
                }}>
                1 hr
              </Text>
            </View>
            <View style={styles.btnsConatiner}>
              <Text onPress={handleNoReminder} style={styles.btnText}>
                NO REMINDER
              </Text>
              <Text onPress={handleRemindConfirm} style={styles.btnText}>
                CONFIRM
              </Text>
            </View>
          </View>
        </View>
      </Modal>
      <Modal transparent={true} visible={isChatModalOpen} animationType="slide">
       <TouchableWithoutFeedback onPress={()=>setIsChatModalOpen(false)}>
       <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
          <View
            style={{
              backgroundColor: COLORS.WHITE,
              borderRadius: 12,
              height: '80%',
              paddingHorizontal: 10,
            }}>
            <View style={styles.chatHeader}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setIsChatModalOpen(false)}>
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
                onFocus={handleInputFocus}
              />
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.sendButton}
                onPress={handleSend}>
                <Icons.SEND />
              </TouchableOpacity>
            </View>
          </View>
          </TouchableWithoutFeedback>
        </View>
       </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

export default TimerScreen;

const styles = StyleSheet.create({
  msgContainer: {
    padding: 10,
  },
  msgText: {
    fontSize: 14,
    color: COLORS.BLACK,
    fontFamily: 'Roboto-Regular',
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 100,
    paddingVertical: 15,
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
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.GRAY_DARK,
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 14,
  },
  daysLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'center',
    paddingTop: 50,
  },
  daysLeftText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 20,
    color: COLORS.BLACK,
  },
  circularProgressContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    paddingTop: 35,
  },
  circularProgressInnerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    height: '100%',
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
  notWearingText: {
    fontFamily: 'Roboto-Bold',
    fontSize: 17,
  },
  alignInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingTop: 40,
  },
  appName: {
    fontFamily: 'Roboto-Bold',
    fontSize: 17,
    color: COLORS.SKY_LIGHT,
  },
  timerText: {
    fontFamily: 'Roboto-Bold',
    fontSize: 45,
  },
  outText: {
    fontFamily: 'Roboto-Bold',
    fontSize: 27,
  },
  circleProgressIndicator: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    height: circularProgressSize,
    width: circularProgressSize,
  },
  progressIndicatorLine: {
    width: 3,
    height: 25,
    position: 'absolute',
    top: -1,
    backgroundColor: COLORS.GRAY_DARK,
  },
  progressIndicatorText: {
    position: 'absolute',
    top: 27,
    fontSize: 12,
    color: COLORS.GRAY_DARK,
    fontFamily: 'Roboto-Bold',
  },
  daysToSmileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'center',
    paddingTop: 30,
  },
  daysToSmileText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 20,
    color: COLORS.BLACK,
  },
  shadowButton: {
    height: 50,
    width: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.SKY_LIGHT,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: COLORS.WHITE,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  modalTitle: {
    fontFamily: 'Roboto-Medium',
    fontSize: 27,
    color: COLORS.BLACK,
    borderBottomWidth: 1,
    borderColor: COLORS.GRAY_LIGHT,
    paddingBottom: 15,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  scrollView: {
    height: 170,
    paddingTop: 70,
  },
  alignTextContainer: {
    alignItems: 'center',
  },
  alignText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 20,
    color: COLORS.GRAY_DARK,
    paddingBottom: 10,
  },
  selectedAligner: {
    backgroundColor: COLORS.GRAY,
    paddingTop: 7,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  selectedAlignerText: {
    color: COLORS.BLACK,
  },
  btnsConatiner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 30,
    padding: 30,
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderColor: COLORS.GRAY_LIGHT,
    marginTop: 15,
  },
  btnText: {
    fontFamily: 'Roboto-Bold',
    fontSize: 14,
    color: COLORS.BLUE_DARK,
  },
});
