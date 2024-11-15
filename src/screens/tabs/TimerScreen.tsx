import React, {useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Shadow} from 'react-native-shadow-2';
import COLORS from '../../constraints/colors';
import Icons from '../../assets/icons';

type TimerScreenNavigationProp = DrawerNavigationProp<any, any>;

const TimerScreen: React.FC = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [isSettingOpen, setIsSettingOpen] = useState<boolean>(false);
  const [selectedAligner, setSelectedAligner] = useState<number>(0);
  const [minutesLeft, setMinutesLeft] = useState<number>(2);
  const navigation = useNavigation<TimerScreenNavigationProp>();
  const [displayedAligner, setDisplayedAligner] =
    useState<string>('Aligner #1');
  const [currentTime, setCurrentTime] = useState<string>(
    new Date().toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    }),
  );
  const scrollViewRef = useRef<ScrollView>(null);

  const fillPercentage: number = 40;
  const totalMinutes: number = 60;
  const alignerTimeIncrement: number = 2;

  const [remainingMinutes, setRemainingMinutes] =
    useState<number>(totalMinutes);

  const toggleModal = (): void => {
    setModalVisible(!modalVisible);
  };
  const toggleSettingOpen = (): void => {
    setIsSettingOpen(!isSettingOpen);
  };

  const alignerTexts: string[] = Array.from(
    {length: 30},
    (_, index) => `Aligner #${index + 1}`,
  );

  const handleAlignerPress = (index: number): void => {
    setSelectedAligner(index);
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
    const timer = setInterval(() => {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
      });
      setCurrentTime(formattedTime);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
          <View>
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
            <View style={styles.circularProgressContainer}>
              <AnimatedCircularProgress
                size={340}
                width={25}
                fill={fillPercentage}
                tintColor={COLORS.GRAY_LIGHT}
                backgroundColor={COLORS.GRAY}
                childrenContainerStyle={
                  styles.circularProgressChildrenContainer
                }
                children={() => (
                  <View style={styles.circularProgressInnerContent}>
                    <Text style={styles.notWearingText}>Not Wearing</Text>
                    <View style={styles.alignInfoContainer}>
                      <Icons.ALIGN />
                      <Text style={styles.appName}>SPARKLE ALIGN</Text>
                    </View>
                    <Text style={styles.timerText}>00:00</Text>
                    <Text style={styles.outText}>Out {currentTime}</Text>
                  </View>
                )}
              />
              <View style={styles.circleProgressIndicator}>
                <View style={styles.progressIndicatorLine} />
                <Text style={styles.progressIndicatorText}>20</Text>
              </View>
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
    paddingTop: 25,
  },
  circularProgressChildrenContainer: {
    backgroundColor: COLORS.PINK,
  },
  circularProgressInnerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  notWearingText: {
    fontFamily: 'Roboto-Bold',
    fontSize: 17,
    color: COLORS.BROWN,
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
    color: COLORS.BLUE_LIGHT,
  },
  timerText: {
    fontFamily: 'Roboto-Bold',
    fontSize: 45,
    color: COLORS.BLACK_LIGHT,
  },
  outText: {
    fontFamily: 'Roboto-Bold',
    fontSize: 27,
    color: COLORS.BROWN,
  },
  circleProgressIndicator: {
    gap: 6,
    alignItems: 'center',
    flexDirection: 'row',
    transform: [{rotate: '45deg'}],
    position: 'absolute',
    bottom: '90%',
    left: '-16%',
  },
  progressIndicatorLine: {
    height: 4,
    width: 35,
    backgroundColor: COLORS.BROWN,
    marginLeft: 125,
  },
  progressIndicatorText: {
    fontFamily: 'Roboto-Black',
    fontSize: 15,
    color: COLORS.BROWN,
    top: 3,
  },
  daysToSmileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'center',
    paddingTop: 25,
  },
  daysToSmileText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 20,
    color: COLORS.BLACK,
  },
  shadowContainer: {
    position: 'absolute',
    top: '105%',
    left: '83%',
  },
  shadowButton: {
    height: 60,
    width: 60,
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
  },
  modalTitle: {
    fontFamily: 'Roboto-Medium',
    fontSize: 20,
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
