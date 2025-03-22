import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
  StatusBar,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  Menu,
  HelpCircle,
  Clock,
  Calendar,
  Camera,
  User,
  MessageCircle,
  Bell,
  SparkleIcon,
  ZapIcon,
  Crown,
  Star,
  Diamond,
  GemIcon,
} from 'lucide-react-native';
import TimerCircle from '../screens/tabs/TimerTesting';
import { TimerState } from '../screens/tabs/TimerTesting';
import NotificationCard from '../components/NotificationCard';


const { width } = Dimensions.get('window');

const AlignerTimer: React.FC = () => {
 


    const [timerState, setTimerState] = useState<TimerState>({
        wearing: true,
        minutes: 1,
        seconds: 46,
        outSeconds: 6,
        progress: 0.75,
      });
    
      const toggleWearing = () => {
        setTimerState((prev: TimerState) => ({ ...prev, wearing: !prev.wearing }));
      };
    
      const TimerScreen1: React.FC = (props) => (
        <TimerCircle
          {...props}
          timerState={timerState}
          toggleWearing={toggleWearing}
        />
      );
      
    




  const [activeTab, setActiveTab] = useState<'timer' | 'calendar' | 'camera' | 'profile'>('timer');
  const [showReminder, setShowReminder] = useState(false);

  // Toggle wearing status
 

  // Set a reminder
  const setReminder = () => {
    setShowReminder(true);
    setTimeout(() => setShowReminder(false), 3000);
  };

  // Open chat support
  const openChatSupport = () => {
    console.log('Opening chat support');
  };

  // Create background animated shapes (6 items)
  const animatedBackground = Array.from({ length: 6 }).map((_, i) => {
    const x = new Animated.Value(Math.random() * 100);
    const y = new Animated.Value(Math.random() * 100);
    const scale = new Animated.Value(Math.random() * 0.6 + 0.4);
    const rotate = new Animated.Value(Math.random() * 360);
    // Animate horizontal movement
    Animated.loop(
      Animated.timing(x, {
        toValue: Math.random() * width,
        duration: 20000 + Math.random() * 30000,
        useNativeDriver: true,
      })
    ).start();
    // Animate vertical movement
    Animated.loop(
      Animated.timing(y, {
        toValue: Math.random() * 600,
        duration: 20000 + Math.random() * 30000,
        useNativeDriver: true,
      })
    ).start();
    // Animate rotation
    Animated.loop(
      Animated.timing(rotate, {
        toValue: 360 + Math.random() * 360,
        duration: 20000 + Math.random() * 30000,
        useNativeDriver: true,
      })
    ).start();

    return { x, y, scale, rotate };
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView>
      <LinearGradient colors={['#ffffff', '#eff6ff']} style={styles.container}>
        {/* Background Animated Elements */}
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

          {/* Notification Card */}
          <NotificationCard message="1 more minute on Aligner #2" />

          {/* Timer Circle */}
          <View style={styles.timerContainer}>
            <TimerCircle timerState={timerState} toggleWearing={toggleWearing} />
          </View>

          {/* Reminder Button and Toast */}
          <View style={styles.reminderContainer}>
            <TouchableOpacity style={styles.reminderButton} onPress={setReminder}>
              <Bell color="#2A93D5" width={18} height={18} style={styles.reminderIcon} />
              <Text style={styles.reminderText}>Remind me</Text>
            </TouchableOpacity>
            {showReminder && (
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


        {/* Chat Button */}
        <TouchableOpacity style={styles.chatButton} onPress={openChatSupport}>
          <LinearGradient colors={['#4ECDC4', '#2A93D5']} style={styles.chatGradient}>
            <MessageCircle color="#fff" width={24} height={24} />
          </LinearGradient>
        </TouchableOpacity>
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
