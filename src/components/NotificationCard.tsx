import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  Animated, 
  Easing 
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { 
  Bell, 
  Clock, 
  CheckCircle, 
  Lightbulb, 
  Award, 
  Sparkles 
} from 'lucide-react-native';

interface NotificationCardProps {
  message: string;
}

const { width } = Dimensions.get('window');

const NotificationCard: React.FC<NotificationCardProps> = ({ message }) => {
  // Initial icon is Bell
  const [icon, setIcon] = useState<JSX.Element>(<Bell size={20} color="white" />);

  // Cycle through icons every 3 seconds
  useEffect(() => {
    const icons = [
      <Bell key="bell" size={20} color="white" />,
      <CheckCircle key="check" size={20} color="white" />,
      <Lightbulb key="bulb" size={20} color="white" />,
      <Clock key="clock" size={20} color="white" />,
      <Award key="award" size={20} color="white" />,
    ];

    let index = 0;
    const intervalId = setInterval(() => {
      index = (index + 1) % icons.length;
      setIcon(icons[index]);
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  // Card container entrance animation
  const cardTranslateY = useRef(new Animated.Value(-50)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(cardTranslateY, {
        toValue: 0,
        stiffness: 300,
        damping: 20,
        useNativeDriver: true,
      }),
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [cardTranslateY, cardOpacity]);

  // Text content animation (slide-in)
  const textTranslateX = useRef(new Animated.Value(20)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(textTranslateX, {
        toValue: 0,
        duration: 300,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 300,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [textTranslateX, textOpacity]);

  // Sparkle animations: create an array of sparkles with random positions, duration, and delays
  const numSparkles = 5;
  const sparkles = Array.from({ length: numSparkles }).map(() => ({
    left: Math.random() * 100 + 50,
    top: Math.random() * 30 + 10,
    opacity: new Animated.Value(0),
    scale: new Animated.Value(0),
    duration: 2000 + Math.random() * 3000,
    delay: Math.random() * 5000,
  }));

  useEffect(() => {
    sparkles.forEach((sparkle) => {
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(sparkle.opacity, {
              toValue: 0.5,
              duration: sparkle.duration / 2,
              useNativeDriver: true,
            }),
            Animated.timing(sparkle.opacity, {
              toValue: 0,
              duration: sparkle.duration / 2,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(sparkle.scale, {
              toValue: 1,
              duration: sparkle.duration / 2,
              useNativeDriver: true,
            }),
            Animated.timing(sparkle.scale, {
              toValue: 0,
              duration: sparkle.duration / 2,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    });
  }, [sparkles]);

  return (
    <Animated.View
      style={[
        styles.cardContainer,
        { transform: [{ translateY: cardTranslateY }], opacity: cardOpacity },
      ]}
    >
      {/* Background glow effect */}
      <LinearGradient
        colors={['#eff7fa', '#e0f2fe']}
        style={StyleSheet.absoluteFill}
      />

      {/* Sparkle animations in background */}
      <View style={StyleSheet.absoluteFill}>
        {sparkles.map((sparkle, index) => (
          <Animated.View
            key={index}
            style={[
              styles.sparkle,
              {
                left: sparkle.left,
                top: sparkle.top,
                opacity: sparkle.opacity,
                transform: [{ scale: sparkle.scale }],
              },
            ]}
          >
            <Sparkles size={12} color="#93c5fd" />
          </Animated.View>
        ))}
      </View>

      {/* Main content */}
      <View style={styles.content}>
        {/* Icon container */}
        <View style={styles.iconContainer}>
          {icon}
        </View>

        {/* Text content */}
        <Animated.View
          style={[
            styles.textContainer,
            { transform: [{ translateX: textTranslateX }], opacity: textOpacity },
          ]}
        >
          <Animated.Text style={styles.messageText}>
            {message}
          </Animated.Text>
          <Text style={styles.subText}>Tap to dismiss</Text>
        </Animated.View>

        {/* Progress indicator at the bottom */}
        <Animated.View style={styles.progressIndicator} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    position: 'relative',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  content: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    zIndex: 10,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2A93D5',
  },
  textContainer: {
    flex: 1,
  },
  messageText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  subText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  progressIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 3,
    width: '100%', // set to 100% as a placeholder; you could animate this if needed
    backgroundColor: '#2A93D5',
  },
  sparkle: {
    position: 'absolute',
  },
});

export default NotificationCard;
