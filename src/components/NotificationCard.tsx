import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  Animated, 
  Easing,
  TouchableOpacity,
  Modal,
  ScrollView
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { 
  Bell, 
  CheckCircle, 
  Lightbulb, 
  Clock, 
  Award, 
  Sparkles 
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export interface NotificationCardProps {
  
  // Callback when a new aligner is confirmed; returns the selected aligner index, new aligner text, and calculated minutes left.
  onAlignerConfirm: (selectedAligner: number, newAlignerText: string, newMinutes: number) => void;
  // Optional initial aligner values
  initialAligner?: number;
  initialMinutesLeft?: number;
  initialDisplayedAligner?: string;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  
  onAlignerConfirm,
  initialAligner = 0,
  initialMinutesLeft = 60,
  initialDisplayedAligner = 'Aligner #1',
}) => {
  // Cycle through icons
  const [icon, setIcon] = useState<JSX.Element>(<Bell size={20} color="white" />);
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

  // Entrance animations for the card
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

  // Text slide-in animation
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

  // Sparkle background animations
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

  // --- Modal & aligner selection state ---
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedAligner, setSelectedAligner] = useState<number>(initialAligner);
  const [newMinutes, setNewMinutes] = useState<number>(initialMinutesLeft);

  // Dummy list of aligners (30 aligners)
  const alignerTexts: string[] = Array.from({ length: 30 }, (_, index) => `Aligner #${index + 1}`);

  const toggleModal = (): void => {
    setModalVisible(!modalVisible);
  };

  const handleAlignerPress = (index: number): void => {
    setSelectedAligner(index);
  };

  // When user confirms a new aligner selection, call the provided callback
  const handleConfirm = (): void => {
    const newAlignerText = alignerTexts[selectedAligner];
    // Example calculation: minutes left is (index + 1) * 2
    const newMinutes = (selectedAligner + 1) * 2;
    onAlignerConfirm(selectedAligner, newAlignerText, newMinutes);
    setNewMinutes(newMinutes);
    setModalVisible(false);
  };

  return (
    <>
      <Animated.View
        style={[
          styles.cardContainer,
          { transform: [{ translateY: cardTranslateY }], opacity: cardOpacity },
        ]}
      >
        {/* Background Glow */}
        <LinearGradient
          colors={['#eff7fa', '#e0f2fe']}
          style={StyleSheet.absoluteFill}
        />
        {/* Sparkle Background */}
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
        {/* Main Content */}
        <TouchableOpacity style={styles.content} onPress={toggleModal}>
          <View style={styles.iconContainer}>
            {icon}
          </View>
          <Animated.View
            style={[
              styles.textContainer,
              { transform: [{ translateX: textTranslateX }], opacity: textOpacity },
            ]}
          >
            <Animated.Text style={styles.messageText}>
            {`${newMinutes} minutes left on ${selectedAligner+1}`}
            </Animated.Text>
            <Text style={styles.subText}>Tap to change aligner</Text>
          </Animated.View>
          <Animated.View style={styles.progressIndicator} />
        </TouchableOpacity>
        {/* Tapping the card opens the aligner selection modal */}
       
      </Animated.View>

      {/* Modal for aligner selection */}
      <Modal transparent={true} animationType="slide" visible={modalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>I'm currently wearing...</Text>
            <ScrollView style={styles.scrollView}>
              {alignerTexts.map((alignerText, index) => (
                <TouchableOpacity
                  activeOpacity={0.8}
                  key={index}
                  onPress={() => handleAlignerPress(index)}
                  style={[
                    styles.alignTextContainer,
                    selectedAligner === index && styles.selectedAligner,
                    index === alignerTexts.length - 1 && { marginBottom: 120 },
                  ]}
                >
                  <Text
                    style={[
                      styles.alignText,
                      selectedAligner === index && styles.selectedAlignerText,
                      { opacity: selectedAligner === index || selectedAligner === index + 1 || selectedAligner === index - 1 ? 1 : 0.5 },
                    ]}
                  >
                    {alignerText}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.btnsContainer}>
              <Text onPress={toggleModal} style={styles.btnText}>
                CANCEL
              </Text>
              <Text onPress={handleConfirm} style={styles.btnText}>
                CONFIRM
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </>
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
    width: '100%',
    backgroundColor: '#2A93D5',
  },
  sparkle: {
    position: 'absolute',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    width: width * 0.8,
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    color: '#1f2937',
  },
  scrollView: {
    maxHeight: 300,
    width: '100%',
  },
  alignTextContainer: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  alignText: {
    fontSize: 18,
    color: '#374151',
  },
  selectedAligner: {
    backgroundColor: '#e0f2fe',
    borderRadius: 10,
  },
  selectedAlignerText: {
    fontWeight: '700',
  },
  btnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  btnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2A93D5',
  },
});

export default NotificationCard;
