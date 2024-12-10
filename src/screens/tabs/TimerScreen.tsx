import React, {useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Shadow} from 'react-native-shadow-2';
import COLORS from '../../constraints/colors';
import Icons from '../../assets/icons';

const {width} = Dimensions.get('window');
const circularProgressSize = width * 0.9;
const indicatorPosition = (20 / 24) * 360;

type TimerScreenNavigationProp = DrawerNavigationProp<any, any>;

const TimerScreen: React.FC = () => {
  const [startTime, setStartTime] = useState<string | null>(null);
  const [isWearing, setIsWearing] = useState<boolean>(true);
  const [timer, setTimer] = useState<number>(0);
  const [notificationTimer, setNotificationTimer] = useState<number>(0);
  const [outTime, setOutTime] = useState<string>('');
  const lastPausedAt = useRef<Date | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [remindModalVisible, setRemindModalVisible] = useState<boolean>(false);
  const [isSettingOpen, setIsSettingOpen] = useState<boolean>(false);
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

  const [remainingMinutes, setRemainingMinutes] =
    useState<number>(totalMinutes);

  const toggleModal = (): void => {
    setModalVisible(!modalVisible);
  };
  const toggleRemindModal = (): void => {
    setRemindModalVisible(!remindModalVisible);
  };
  const toggleSettingOpen = (): void => {
    setIsSettingOpen(!isSettingOpen);
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

  return (
    <SafeAreaView style={styles.container}>
      {isSettingOpen ? (
        <View style={styles.bottomContainer}>
          <TouchableOpacity activeOpacity={0.8} style={styles.iconRow}>
            <Text style={styles.textLabel}>Reminder</Text>
            <Shadow>
              <View style={styles.iconButtonContainer}>
                <Icons.ALARM />
              </View>
            </Shadow>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8} style={styles.iconRow}>
            <Text style={styles.textLabel}>Share</Text>
            <Shadow>
              <View style={styles.iconButtonContainer}>
                <Icons.SHARE />
              </View>
            </Shadow>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={toggleSettingOpen}
            activeOpacity={0.8}
            style={[styles.shadowButton, {marginRight: -12}]}>
            <Icons.DOWNARROW />
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <View style={{height: '100%'}}>
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
                width={25}
                fill={fillPercentage}
                tintColor={isWearing ? COLORS.SKY_LIGHT : COLORS.BLUE_DARK}
                backgroundColor={
                  isWearing ? COLORS.BLUE_DARK : COLORS.SKY_LIGHT
                }
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
                          color: isWearing
                            ? COLORS.BLUE_DARK
                            : COLORS.SKY_LIGHT,
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
                            color: isWearing
                              ? COLORS.SKY_LIGHT
                              : COLORS.BLUE_DARK,
                          },
                        ]}>
                        SPARKLE ALIGN
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.timerText,
                        {
                          color: isWearing
                            ? COLORS.BLUE_DARK
                            : COLORS.SKY_LIGHT,
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
                          :
                          {(notificationTimer % 60).toString().padStart(2, '0')}
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
                      translateX: circularProgressSize / 4.6,
                    },
                    {rotate: `${indicatorPosition}deg`},
                    {
                      translateX: -circularProgressSize / 2,
                    },
                  ],
                },
              ]}>
              <View
                style={[
                  styles.progressIndicatorLine,
                  {
                    backgroundColor: isWearing
                      ? COLORS.SKY_LIGHT
                      : COLORS.BLUE_DARK,
                  },
                ]}
              />
              <Text
                style={[
                  styles.progressIndicatorText,
                  {color: isWearing ? COLORS.SKY_LIGHT : COLORS.BLUE_DARK},
                ]}>
                20
              </Text>
            </View>
            <View style={styles.daysToSmileContainer}>
              <Icons.CALENDER />
              <Text style={styles.daysToSmileText}>
                {remainingMinutes} minutes to a perfect smile!
              </Text>
            </View>
          </View>
          <Shadow containerStyle={styles.shadowContainer}>
            <TouchableOpacity
              onPress={toggleSettingOpen}
              activeOpacity={0.8}
              style={styles.shadowButton}>
              <Icons.WRENCH />
            </TouchableOpacity>
          </Shadow>
          <Modal
            transparent={true}
            animationType="slide"
            visible={modalVisible}>
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
                          selectedAligner === index &&
                            styles.selectedAlignerText,
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
        </View>
      )}
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
    </SafeAreaView>
  );
};

export default TimerScreen;

const styles = StyleSheet.create({
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
  headerTitle: {
    fontFamily: 'Roboto-Regular',
    fontSize: 20,
    color: COLORS.BLACK,
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
    paddingTop: 25,
  },
  circularProgressInnerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    height: '100%',
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
    width: 2,
    height: 30,
    position: 'absolute',
    top: 0,
  },
  progressIndicatorText: {
    position: 'absolute',
    top: 30,
    fontSize: 14,
    fontWeight: 'bold',
  },
  daysToSmileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'center',
    paddingTop: 20,
  },
  daysToSmileText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 20,
    color: COLORS.BLACK,
  },
  shadowContainer: {
    position: 'absolute',
    bottom: 0,
    left: '83%',
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
  bottomContainer: {
    gap: 40,
    alignItems: 'flex-end',
    position: 'absolute',
    bottom: '10%',
    right: '7%',
  },
  iconRow: {
    gap: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textLabel: {
    fontFamily: 'Roboto-Bold',
    fontSize: 17,
    color: COLORS.BLACK,
  },
  iconButtonContainer: {
    height: 45,
    width: 45,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
