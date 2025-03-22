import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import Svg, {
  Circle,
  Defs,
  Filter,
  FeGaussianBlur,
  FeColorMatrix,
} from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import {
  Sparkles,
  CloudSun,
  Timer,
  RocketIcon,
  Zap,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export interface TimerState {
  wearing: boolean;
  minutes: number;
  seconds: number;
  outSeconds: number;
  progress: number;
}

interface TimerCircleProps {
  timerState: TimerState;
  toggleWearing: () => void;
}

const TimerCircle: React.FC<TimerCircleProps> = ({ timerState, toggleWearing }) => {
  const { wearing, minutes, seconds, outSeconds, progress } = timerState;
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  // Circle properties
  const circleRadius = 135;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circleCircumference * (1 - progress);

  // Format time
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');
  const formattedOutMinutes = String(Math.floor(outSeconds / 60)).padStart(2, '0');
  const formattedOutSeconds = String(outSeconds % 60).padStart(2, '0');

  // Create 30 Animated.Values for confetti pieces
  const confettiAnimations: Animated.Value[] = Array.from({ length: 30 }, () => new Animated.Value(0));

  useEffect(() => {
    if (wearing) {
      setShowConfetti(true);
      // Start confetti animations
      confettiAnimations.forEach(anim => {
        anim.setValue(0);
        Animated.timing(anim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }).start();
      });
      const timer = setTimeout(() => setShowConfetti(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [wearing]);

  // Calculate marker position around the circle (centered at 150,150 per SVG viewBox)
  const markerAngle = (progress * 360) - 90;
  const markerX = 150 + circleRadius * Math.cos(markerAngle * (Math.PI / 180));
  const markerY = 150 + circleRadius * Math.sin(markerAngle * (Math.PI / 180));

  // Inner circle pulse animation using Animated API
  const pulseAnim = new Animated.Value(1);
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.03,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Floating background particles */}
      <View style={StyleSheet.absoluteFill}>
        {Array.from({ length: 10 }).map((_, index) => {
          const randomX = Math.random() * 300;
          const randomY = Math.random() * 300;
          return (
            <Animated.View
              key={index}
              style={[
                styles.particle,
                { left: randomX, top: randomY, transform: [{ scale: Math.random() * 0.4 + 0.8 }] },
              ]}
            >
              {index % 3 === 0 ? (
                <CloudSun color="#70B7FF" width={32} height={32} />
              ) : index % 3 === 1 ? (
                <Sparkles color="#FFC107" width={32} height={32} />
              ) : (
                <RocketIcon color="#D291FF" width={32} height={32} />
              )}
            </Animated.View>
          );
        })}
      </View>

      {/* Confetti effect */}
      {showConfetti && (
        <View style={StyleSheet.absoluteFill}>
          {confettiAnimations.map((anim, i) => {
            const finalX = Math.random() * 300;
            const finalY = Math.random() * 300;
            const rotation = Math.random() * 360;
            return (
              <Animated.View
                key={i}
                style={[
                  styles.confetti,
                  {
                    opacity: anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 0],
                    }),
                    transform: [
                      {
                        translateX: anim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [150, finalX],
                        }),
                      },
                      {
                        translateY: anim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [150, finalY],
                        }),
                      },
                      {
                        scale: anim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, Math.random() * 0.5 + 0.5],
                        }),
                      },
                      {
                        rotate: anim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0deg', `${rotation}deg`],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <View
                  style={[
                    styles.confettiPiece,
                    {
                      backgroundColor: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#6772E5', '#2A93D5'][
                        Math.floor(Math.random() * 5)
                      ],
                    },
                  ]}
                />
              </Animated.View>
            );
          })}
        </View>
      )}

      {/* SVG Progress Circle */}
      <View style={styles.svgContainer}>
        <Svg width={330} height={330} viewBox="0 0 300 300">
          <Defs>
            <Filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <FeGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
              <FeColorMatrix {...{ in: 'blur' }} type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -7" />
            </Filter>
          </Defs>
          {/* Dashed Background Circle */}
          <Circle
            cx="150"
            cy="150"
            r={circleRadius}
            stroke="#E0F7FA"
            strokeWidth="8"
            strokeDasharray="4,8"
            fill="none"
          />
          {/* Progress Circle */}
          <Circle
            cx="150"
            cy="150"
            r={circleRadius}
            stroke={wearing ? "#2A93D5" : "#FF6B6B"}
            strokeWidth="12"
            fill="none"
            strokeDasharray={circleCircumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 150 150)"
            filter="url(#glow)"
          />
          {/* Progress Marker */}
          <Circle
            cx={markerX}
            cy={markerY}
            r="8"
            fill={wearing ? "#2A93D5" : "#FF6B6B"}
            filter="url(#glow)"
          />
          {/* Progress Indicator Lines */}
          {[0, 25, 50, 75].map((percent) => {
            const angle = (percent / 100) * 360 - 90;
            const x = 150 + (circleRadius + 15) * Math.cos(angle * (Math.PI / 180));
            const y = 150 + (circleRadius + 15) * Math.sin(angle * (Math.PI / 180));
            return (
              <Circle
                key={percent}
                cx={x}
                cy={y}
                r="3"
                fill={progress * 100 >= percent ? "#2A93D5" : "#E0F7FA"}
              />
            );
          })}
        </Svg>
      </View>

      {/* Timer Inner Circle with pulse */}
      <Animated.View style={[styles.innerCircle, { transform: [{ scale: pulseAnim }] }]}>
        <LinearGradient
          colors={
            wearing
              ? ['rgba(78,205,196,0.8)', 'rgba(42,147,213,0.8)']
              : ['rgba(255,154,139,0.8)', 'rgba(255,107,107,0.8)']
          }
          style={styles.gradientBackground}
        >
          <View style={styles.innerContent}>
            {/* Status Icon */}
            <View style={styles.statusIcon}>
              {wearing ? (
                <Timer color="#2A93D5" width={24} height={24} />
              ) : (
                <Zap color="#FF6B6B" width={24} height={24} />
              )}
            </View>
            {/* Wearing Status */}
            <Text style={[styles.statusText, { color: wearing ? "#2A93D5" : "#FF6B6B" }]}>
              {wearing ? 'Aligner Active' : 'Aligner Off'}
            </Text>
            {/* Timer Display */}
            <View style={styles.timerDisplay}>
              <Text style={[styles.timerText, { color: wearing ? "#2A93D5" : "#FF6B6B" }]}>
                {formattedMinutes}
                <Text style={styles.colon}>:</Text>
                {formattedSeconds}
              </Text>
            </View>
            {/* Out Time */}
            <Text style={styles.outTime}>
              {wearing ? 'Time wearing' : 'Time out'}:{' '}
              <Text style={styles.outTimeValue}>
                {formattedOutMinutes}:{formattedOutSeconds}
              </Text>
            </Text>
            {/* Toggle Button */}
            <TouchableOpacity
              style={[
                styles.toggleButton,
                { backgroundColor: wearing ? '#2A93D5' : '#FF6B6B' },
              ]}
              onPress={toggleWearing}
            >
              <Text style={styles.toggleButtonText}>
                {wearing ? 'Take Off' : 'Put On'}
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Animated.View>

      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 330,
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  particle: {
    position: 'absolute',
    opacity: 0.2,
  },
  confetti: {
    position: 'absolute',
  },
  confettiPiece: {
    width: 12,
    height: 12,
    transform: [{ rotate: '45deg' }],
  },
  svgContainer: {
    position: 'absolute',
  },
  innerCircle: {
    width: 270,
    height: 270,
    borderRadius: 135,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
    overflow: 'hidden',
  },
  gradientBackground: {
    flex: 1,
    borderRadius: 135,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContent: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 230,
    height: 230,
    borderRadius: 115,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  statusIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E0F7FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8,
  },
  timerDisplay: {
    marginVertical: 8,
  },
  timerText: {
    fontSize: 48,
    fontWeight: '700',
    letterSpacing: 2,
  },
  colon: {
    opacity: 0.7,
  },
  outTime: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginVertical: 4,
  },
  outTimeValue: {
    color: '#333',
  },
  toggleButton: {
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  toggleButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default TimerCircle;
