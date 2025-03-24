import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notifee, { AndroidImportance, TriggerType } from '@notifee/react-native';
import {
  Menu,
  HelpCircle,
  Clock,
  Calendar,
  Bell,
  MessageCircle,
  Diamond,
  Star,
  Crown,
  GemIcon,
} from 'lucide-react-native';
import TimerCircle, { TimerState } from '../screens/tabs/TimerTesting';
import NotificationCard from '../components/NotificationCard';
import COLORS from '../constraints/colors';
import LightTheme from '../theme/LightTheme';
import { useTheme } from '../theme/themeManagement';
import DarkTheme from '../theme/DarkTheme';
import Chat from './chat';


const { width } = Dimensions.get('window');

// API function to update aligner reminders on your backend
const updateAlignerData = async (payload: {
  alignerReminders: {
    selectedAligner: number;
    minutesLeft: number;
    outTime: string;
    notificationTimer: number;
    displayedAligner: string;
    isWearing: boolean;
  }[];
}) => {
  try {
    const response = await fetch('http://192.168.1.102:8000/api/auth/user/67ba24eb1431a3c93ab1d9e7', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    console.log('API update success:', data);
  } catch (error) {
    console.error('API update error:', error);
  }
};

const AlignerTimer: React.FC = () => {
  // Timer dynamic state (mirrors TimerScreen’s logic)
  const [timerState, setTimerState] = useState<TimerState>({
    wearing: true,
    minutes: 0,
    seconds: 0,
    outSeconds: 0,
    progress: 0, // progress value between 0 and 1
  });

  // Additional states for aligner data
  const [selectedAligner, setSelectedAligner] = useState<number>(0);
  const [minutesLeft, setMinutesLeft] = useState<number>(60); // e.g., time left for current aligner
  const [outTime, setOutTime] = useState<string>('');
  const [remindModalVisible, setRemindModalVisible] = useState<boolean>(false);
  const [displayedAligner, setDisplayedAligner] = useState<string>('Aligner #1');
  const [selectedRemindMin, setSelectedRemindMin] = useState<number>(1);
  const [selectedRemindHour, setSelectedRemindHOur] = useState<number>(0);
  const [notificationTimer, setNotificationTimer] = useState<number>(0);
  const [isChatModalOpen, setIsChatModalOpen] = useState<boolean>(false);
  // Reminder and tab state
  const [activeTab, setActiveTab] = useState<'timer' | 'calendar' | 'camera' | 'profile'>('timer');
  const [showReminder, setShowReminder] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const remindMinsscrollViewRef = useRef<ScrollView>(null);
  const remindHourscrollViewRef = useRef<ScrollView>(null);
  // displayedAligner holds the previously shown aligner.
  const remindHours: string[] = Array.from({length: 4}, (_, index) => `${index} hr`);
  const remindMins: string[] = Array.from({length: 60}, (_, index) => `${index.toString().padStart(2, '0')} min`);

  const handleRemindMinsPress = (index: number): void => {
    setSelectedRemindMin(index);
  };
  const handleRemindHourPress = (index: number): void => {
    setSelectedRemindHOur(index);
  };

  // Load saved timer data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('timerData');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setSelectedAligner(parsedData.selectedAligner);
          setMinutesLeft(parsedData.minutesLeft);
          setOutTime(parsedData.outTime);
          setDisplayedAligner(parsedData.displayedAligner);
          setTimerState(prev => ({ ...prev, wearing: parsedData.isWearing }));
        }
      } catch (error) {
        console.error('Failed to load timer data:', error);
      }
    };
    loadData();
  }, []);


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


  // Save timer data on state changes
  useEffect(() => {
    const saveData = async () => {
      try {
        const dataToStore = {
          selectedAligner,
          minutesLeft,
          outTime,
          displayedAligner,
          isWearing: timerState.wearing,
        };
        await AsyncStorage.setItem('timerData', JSON.stringify(dataToStore));
      } catch (error) {
        console.error('Failed to save timer data:', error);
      }
    };
    saveData();
  }, [selectedAligner, minutesLeft, outTime, displayedAligner, timerState.wearing]);

  // Timer update interval – when wearing, increment timer; when not, update outSeconds.
  useEffect(() => {
    const interval = setInterval(() => {
      setTimerState(prev => {
        if (prev.wearing) {
          let newSeconds = prev.seconds + 1;
          let newMinutes = prev.minutes;
          if (newSeconds >= 60) {
            newSeconds = 0;
            newMinutes++;
          }
          // For demo purposes we simulate progress over a 60‑minute period.
          const progress = (newMinutes % 60) / 60;
          return { ...prev, seconds: newSeconds, minutes: newMinutes, progress };
        } else {
          return { ...prev, outSeconds: prev.outSeconds + 1 };
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerState.wearing]);

  // Toggle the wearing state and update notifications accordingly.
  const toggleWearing = async () => {
    const newWearing = !timerState.wearing;
    setTimerState(prev => ({ ...prev, wearing: newWearing }));

    // Build API payload – update your aligner reminder data.
    const payload = {
      alignerReminders: [
        {
          selectedAligner,
          displayedAligner,
          minutesLeft,
          outTime: outTime || new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
          notificationTimer: 0,
          isWearing: newWearing,
        },
      ],
    };
    updateAlignerData(payload);

    // If turning off (not wearing), schedule a notification; otherwise cancel.
    if (!newWearing) {
      const delay = 2 * 60 * 60 * 1000; // example: 2 hours delay
      const triggerTimestamp = Date.now() + delay;
      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
      });
      await notifee.createTriggerNotification(
        {
          title: 'Timer Alert',
          body: 'Your timer has finished! Please check your aligner.',
          android: { channelId, smallIcon: 'ic_launcher' },
        },
        {
          type: TriggerType.TIMESTAMP,
          timestamp: triggerTimestamp,
        }
      );
    } else {
      await notifee.cancelAllNotifications();
    }
  };


  // Instead of relying solely on in-app intervals for notifications, schedule one.
  const scheduleTimerNotification = async () => {
    // Calculate the trigger time (in ms)
    const delay = (selectedRemindHour * 60 + selectedRemindMin) * 60000;
    const triggerTimestamp = Date.now() + delay;
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
    });
    await notifee.createTriggerNotification(
      {
        title: 'Timer Alert',
        body: 'Your timer has finished! Please check your aligner.',
        android: { channelId, smallIcon: 'ic_launcher' },
      },
      {
        type: TriggerType.TIMESTAMP,
        timestamp: triggerTimestamp,
      }
    );
  };

    // Cancel scheduled notifications (if any).
    const cancelScheduledNotifications = async () => {
        await notifee.cancelAllNotifications();
        setNotificationTimer(0);
      };
    


  // Reminder functionality (for example, scheduling a notification manually)
  const setReminder = () => {
    setShowReminder(true);
    setTimeout(() => setShowReminder(false), 3000);
    // Optionally schedule a reminder notification here.
  };

  const openChatSupport = () => {
    console.log('Opening chat support');
    // Implement chat support navigation or modal.
  };


  const handleRemindConfirm = () => {
    console.log('Reminder confirmed');
    setRemindModalVisible(false);
    scheduleTimerNotification();
  };

  const handleNoReminder = () => {
    setRemindModalVisible(false);
    cancelScheduledNotifications();
  };


  const {theme} = useTheme();
  const currentTheme = theme === 'light' ? LightTheme : DarkTheme;



  // Animated background shapes
  const animatedBackground = Array.from({ length: 6 }).map((_, i) => {
    const x = new Animated.Value(Math.random() * 100);
    const y = new Animated.Value(Math.random() * 100);
    const scale = new Animated.Value(Math.random() * 0.6 + 0.4);
    const rotate = new Animated.Value(Math.random() * 360);
    Animated.loop(
      Animated.timing(x, {
        toValue: Math.random() * width,
        duration: 20000 + Math.random() * 30000,
        useNativeDriver: true,
      })
    ).start();
    Animated.loop(
      Animated.timing(y, {
        toValue: Math.random() * 600,
        duration: 20000 + Math.random() * 30000,
        useNativeDriver: true,
      })
    ).start();
    Animated.loop(
      Animated.timing(rotate, {
        toValue: 360 + Math.random() * 360,
        duration: 20000 + Math.random() * 30000,
        useNativeDriver: true,
      })
    ).start();
    return { x, y, scale, rotate };
  });

  // Callback for NotificationCard's aligner selection.
  // This callback is invoked when the user confirms a new aligner selection.
  const handleAlignerConfirm = (selectedIndex: number, newAlignerText: string, newMinutes: number) => {
    setSelectedAligner(selectedIndex);
    setDisplayedAligner(newAlignerText);
    setMinutesLeft(newMinutes);

    // Call API here – update aligner data with the new values.
    updateAlignerData({
      alignerReminders: [
        {
          selectedAligner: selectedIndex,
          displayedAligner: newAlignerText,
          minutesLeft: newMinutes,
          outTime: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
          notificationTimer: 0,
          isWearing: timerState.wearing,
        },
      ],
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView>
        <LinearGradient colors={['#ffffff', '#eff6ff']} style={styles.container}>
          {/* Animated Background */}
          <View style={styles.backgroundContainer}>
            {animatedBackground.map((anim, i) => {
              const rotation = anim.rotate.interpolate({
                inputRange: [0, 360],
                outputRange: ['0deg', '360deg'],
              });
              return (
                <Animated.View
                  key={i}
                  style={[
                    styles.bgShape,
                    {
                      transform: [
                        { translateX: anim.x },
                        { translateY: anim.y },
                        { scale: anim.scale },
                        { rotate: rotation },
                      ],
                    },
                  ]}
                >
                  {i % 3 === 0 ? (
                    <Crown color="#3B82F6" width={80} height={80} />
                  ) : i % 3 === 1 ? (
                    <GemIcon color="#8B5CF6" width={80} height={80} />
                  ) : (
                    <Star color="#F59E0B" width={80} height={80} />
                  )}
                </Animated.View>
              );
            })}
          </View>

          {/* Main Content */}
          <View style={styles.content}>
            {/* App Header */}
            <View style={styles.header}>
              <TouchableOpacity style={styles.iconButton}>
                <Menu color="#2A93D5" width={28} height={28} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>SmileAlign Pro</Text>
              <TouchableOpacity style={styles.iconButton}>
                <HelpCircle color="#2A93D5" width={28} height={28} />
              </TouchableOpacity>
            </View>

            {/* User Stats Bar */}
            <View style={styles.statsBar}>
              <View style={styles.statItem}>
                <LinearGradient colors={['#4ECDC4', '#2A93D5']} style={styles.statIcon}>
                  <Diamond color="#fff" width={16} height={16} />
                </LinearGradient>
                <View style={styles.statTextContainer}>
                  <Text style={styles.statLabel}>Current Aligner</Text>
                  <Text style={styles.statValue}>2 of 20</Text>
                </View>
              </View>
              <View style={styles.statItem}>
                <LinearGradient colors={['#A78BFA', '#8B5CF6']} style={styles.statIcon}>
                  <Clock color="#fff" width={16} height={16} />
                </LinearGradient>
                <View style={styles.statTextContainer}>
                  <Text style={styles.statLabel}>Daily Goal</Text>
                  <Text style={styles.statValue}>22h / day</Text>
                </View>
              </View>
              <View style={styles.statItem}>
                <LinearGradient colors={['#FBBF24', '#F59E0B']} style={styles.statIcon}>
                  <Star color="#fff" width={16} height={16} />
                </LinearGradient>
                <View style={styles.statTextContainer}>
                  <Text style={styles.statLabel}>Streak</Text>
                  <Text style={styles.statValue}>7 days</Text>
                </View>
              </View>
            </View>

            {/* Notification Card with aligner selection */}
            <NotificationCard
             
              onAlignerConfirm={handleAlignerConfirm}
            />

            {/* Timer Circle */}
            <View style={styles.timerContainer}>
              <TimerCircle timerState={timerState} toggleWearing={toggleWearing} />
            </View>

            {/* Reminder Button and Toast */}
            <View style={styles.reminderContainer}>
              <TouchableOpacity style={styles.reminderButton} onPress={() => setRemindModalVisible(true)}>
                <Bell color="#2A93D5" width={18} height={18} style={styles.reminderIcon} />
                <Text style={styles.reminderText}>Remind me</Text>
              </TouchableOpacity>
              {remindModalVisible && (
                <View style={styles.reminderToast}>
                  <View style={styles.toastIcon}>
                    <Bell color="#10B981" width={16} height={16} />
                  </View>
                  <View>
                    <Text style={styles.toastTitle}>Reminder set!</Text>
                    <Text style={styles.toastSubtitle}>We'll notify you in 2 hours</Text>
                  </View>
                </View>
              )}
            </View>

            {/* Progress Info */}
            <View style={styles.progressInfo}>
              <Calendar color="#555" width={22} height={22} />
              <Text style={styles.progressText}>58 minutes to a perfect smile</Text>
            </View>
          </View>

          {/* Chat Support Button */}
          <TouchableOpacity style={styles.chatButton} onPress={() => setIsChatModalOpen(true)}>
            <LinearGradient colors={['#4ECDC4', '#2A93D5']} style={styles.chatGradient}>
              <MessageCircle color="#fff" width={24} height={24} />
            </LinearGradient>
          </TouchableOpacity>
       
<Modal transparent={true} visible={remindModalVisible} animationType="slide">
<View style={styles.modalOverlay}>
  <View style={{backgroundColor: currentTheme.colors.background, borderRadius: 25, marginHorizontal: 8}}>
    <Text style={[styles.modalTitle, {color: currentTheme.colors.text}]}>
      Remind me to wear again in
    </Text>
    <View style={{flexDirection: 'row'}}>
      <ScrollView ref={remindHourscrollViewRef} showsVerticalScrollIndicator={false} style={{height: 200, paddingTop: 70}}>
        {remindHours.map((remindHour, index) => (
          <TouchableOpacity
            activeOpacity={0.8}
            key={index}
            onPress={() => handleRemindHourPress(index)}
            style={[
              styles.alignTextContainer,
              selectedRemindHour === index && styles.selectedAligner,
              index === remindHours.length - 1 && {marginBottom: 120},
            ]}>
            <Text
              style={[
                styles.alignText,
                selectedRemindHour === index && styles.selectedAlignerText,
                {opacity: selectedRemindHour === index || selectedRemindHour === index + 1 || selectedRemindHour === index - 1 ? 1 : 0.5},
              ]}>
              {remindHour}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <ScrollView ref={remindMinsscrollViewRef} showsVerticalScrollIndicator={false} style={{height: 200, paddingTop: 70}}>
        {remindMins.map((remindMin, index) => (
          <TouchableOpacity
            activeOpacity={0.8}
            key={index}
            onPress={() => handleRemindMinsPress(index)}
            style={[
              styles.alignTextContainer,
              selectedRemindMin === index && styles.selectedAligner,
              index === remindMins.length - 1 && {marginBottom: 120},
            ]}>
            <Text
              style={[
                styles.alignText,
                selectedRemindMin === index && styles.selectedAlignerText,
                {opacity: selectedRemindMin === index || selectedRemindMin === index + 1 || selectedRemindMin === index - 1 ? 1 : 0.5},
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
        style={{fontFamily: 'Roboto-Medium', fontSize: 17, color: currentTheme.colors.text}}>
        5 min
      </Text>
      <Text
        onPress={() => setSelectedRemindMin(15)}
        style={{fontFamily: 'Roboto-Medium', fontSize: 17, color: currentTheme.colors.text}}>
        15 min
      </Text>
      <Text
        onPress={() => setSelectedRemindMin(30)}
        style={{fontFamily: 'Roboto-Medium', fontSize: 17, color: currentTheme.colors.text}}>
        30 min
      </Text>
      <Text
        onPress={() => setSelectedRemindMin(45)}
        style={{fontFamily: 'Roboto-Medium', fontSize: 17, color: currentTheme.colors.text}}>
        45 min
      </Text>
      <Text
        onPress={() => setSelectedRemindHOur(1)}
        style={{fontFamily: 'Roboto-Medium', fontSize: 17, color: currentTheme.colors.text}}>
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
<Chat isChatModalOpen={isChatModalOpen} setIsChatModalOpen={setIsChatModalOpen} />
</LinearGradient>
      </ScrollView>
    </SafeAreaView>




  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  bgShape: {
    position: 'absolute',
    opacity: 0.1,
  },
  content: {
    flex: 1,
    zIndex: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconButton: {
    padding: 5,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  statTextContainer: {},
  statLabel: {
    fontSize: 10,
    color: '#6b7280',
  },
  statValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  reminderContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  reminderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F7FA',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
  },
  reminderIcon: {
    marginRight: 8,
  },
  reminderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2A93D5',
  },
  reminderToast: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#d1fae5',
    marginTop: 10,
  },
  toastIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#d1fae5',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  toastTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  toastSubtitle: {
    fontSize: 10,
    color: '#6b7280',
  },
  progressInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    alignSelf: 'center',
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginLeft: 10,
  },  modalOverlay: {
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
  chatButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    zIndex: 20,
  },
  chatGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AlignerTimer;
