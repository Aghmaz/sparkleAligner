import React, {useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  Linking,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Switch} from 'react-native-switch';
import COLORS from '../../constraints/colors';
import Icons from '../../assets/icons';

type SettingsScreenNavigationProp = StackNavigationProp<any, 'Settings'>;

const Settings = () => {
  const [wearAligner, setWearAligner] = useState<boolean>(true);
  const [timePickerVisible, setTimePickerVisible] = useState<boolean>(false);
  const [selectedTime, setSelectedTime] = useState<string>('No Reminder');
  const [themeModalVisible, setThemeModalVisible] = useState<boolean>(false);
  const [soundModalVisible, setSoundModalVisible] = useState<boolean>(false);
  const [weeksModalVisible, setWeeksModalVisible] = useState<boolean>(false);
  const [startWeekModalVisible, setStartWeekModalVisible] =
    useState<boolean>(false);
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const [selectedTheme, setSelectedTheme] = useState<number>(0);
  const [displayedTheme, setDisplayedTheme] = useState<string>('Automatic');
  const [selectedSound, setSelectedSound] = useState<number>(0);
  const [displayedSound, setDisplayedSound] = useState<string>('System');
  const [selectedWeeks, setSelectedWeeks] = useState<number>(0);
  const [displayedWeeks, setDisplayedWeeks] = useState<string>('No Reminder');
  const [selectedStartDay, setSelectedStartDay] = useState<number>(0);
  const [displayedStartDay, setDisplayedDay] = useState<string>('Sunday');

  const themeScrollViewRef = useRef<ScrollView>(null);
  const soundScrollViewRef = useRef<ScrollView>(null);
  const weeksScrollViewRef = useRef<ScrollView>(null);
  const startWeekScrollViewRef = useRef<ScrollView>(null);

  const themeValues: string[] = Array.from({length: 3}, (_, index) => {
    const themes = ['Automatic', 'Light', 'Dark'];
    return themes[index % themes.length];
  });
  const notificationSounds: string[] = Array.from({length: 3}, (_, index) => {
    const sounds = ['System', 'Long', 'Short'];
    return sounds[index % sounds.length];
  });
  const takeTeethiesWeeks: string[] = Array.from({length: 5}, (_, index) => {
    const weeks = ['1 week', '2 weeks', '3 weeks', '4 weeks', '5 weeks'];
    return weeks[index % weeks.length];
  });
  const startWeekDays: string[] = Array.from({length: 3}, (_, index) => {
    const days = ['Saturday', 'Sunday', 'Monday'];
    return days[index % days.length];
  });

  const handleThemePress = (index: number): void => {
    setSelectedTheme(index);
  };
  const handleSoundPress = (index: number): void => {
    setSelectedSound(index);
  };
  const handleWeeksPress = (index: number): void => {
    setSelectedWeeks(index);
  };
  const handleStartWeekDayPress = (index: number): void => {
    setSelectedStartDay(index);
  };

  const handleThemeConfirm = (): void => {
    const themeValue = themeValues[selectedTheme];
    setDisplayedTheme(themeValue);
    setThemeModalVisible(false);
  };
  const handleSoundConfirm = (): void => {
    const notificationSound = notificationSounds[selectedSound];
    setDisplayedSound(notificationSound);
    setSoundModalVisible(false);
  };
  const handleWeeksConfirm = (): void => {
    const weeks = takeTeethiesWeeks[selectedWeeks];
    setDisplayedWeeks(weeks);
    setWeeksModalVisible(false);
  };
  const handleStartDayConfirm = (): void => {
    const Day = startWeekDays[selectedStartDay];
    setDisplayedDay(Day);
    setStartWeekModalVisible(false);
  };

  useEffect(() => {
    if (themeModalVisible && themeScrollViewRef.current) {
      themeScrollViewRef.current.scrollTo({
        y: selectedTheme * 37,
        animated: true,
      });
    }
  }, [themeModalVisible]);

  useEffect(() => {
    if (soundModalVisible && soundScrollViewRef.current) {
      soundScrollViewRef.current.scrollTo({
        y: selectedSound * 37,
        animated: true,
      });
    }
  }, [soundModalVisible]);

  useEffect(() => {
    if (weeksModalVisible && weeksScrollViewRef.current) {
      weeksScrollViewRef.current.scrollTo({
        y: selectedWeeks * 37,
        animated: true,
      });
    }
  }, [weeksModalVisible]);

  useEffect(() => {
    if (startWeekModalVisible && startWeekScrollViewRef.current) {
      startWeekScrollViewRef.current.scrollTo({
        y: selectedStartDay * 37,
        animated: true,
      });
    }
  }, [startWeekModalVisible]);

  const handleTimeChange = (event: any, time: Date | undefined): void => {
    if (event.type === 'set' && time) {
      const formattedTime = time.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      setSelectedTime(formattedTime);
    } else if (event.type === 'dismissed') {
      setSelectedTime('No Reminder');
    }
    setTimePickerVisible(false);
  };

  const openLink = (url: string) => {
    Linking.openURL(url).catch(err =>
      console.error('Failed to open link: ', err),
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text></Text>
        <Text style={styles.headerText}>Settings</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}>
          <Icons.TICK />
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Remind Me To...</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setWearAligner(!wearAligner)}
            style={styles.switchContainer}>
            <View style={styles.iconTextContainer}>
              <Icons.NOTIFICATION />
              <Text style={styles.switchLabel}>Wear Aligners</Text>
            </View>
            <Switch
              value={wearAligner}
              onValueChange={setWearAligner}
              circleSize={22}
              barHeight={15}
              circleBorderWidth={0}
              backgroundActive={'#a4bfd675'}
              backgroundInactive={'#9b9b9b95'}
              circleActiveColor={COLORS.SKYBLUE}
              circleInActiveColor={COLORS.GRAY}
              renderActiveText={false}
              renderInActiveText={false}
              switchWidthMultiplier={1.3}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setTimePickerVisible(true)}
            style={styles.reminderItemContainer}>
            <Icons.SYNC />
            <View>
              <Text style={styles.reminderTitle}>Switch Aligners</Text>
              <Text style={styles.reminderSubtitle}>{selectedTime}</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.reminderItemContainer}>
            <Icons.TEETH />
            <TouchableOpacity
              onPress={() => setWeeksModalVisible(true)}
              activeOpacity={0.8}>
              <Text style={styles.reminderTitle}>Take Teethies</Text>
              <Text style={styles.reminderSubtitle}>{displayedWeeks}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Calender</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setStartWeekModalVisible(true)}
            style={styles.reminderItemContainer}>
            <Icons.CALENDER width={40} />
            <View>
              <Text style={styles.reminderTitle}>Start Week On</Text>
              <Text style={styles.reminderSubtitle}>{displayedStartDay}</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.sectionContainer}>
          <View style={styles.reminderItemContainer}>
            <Icons.THEME width={40} />
            <TouchableOpacity
              onPress={() => setThemeModalVisible(true)}
              activeOpacity={0.8}>
              <Text style={styles.reminderTitle}>Theme</Text>
              <Text style={styles.reminderSubtitle}>{displayedTheme}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => setSoundModalVisible(true)}
            activeOpacity={0.8}
            style={styles.reminderItemContainer}>
            <Icons.SOUND width={40} />
            <View>
              <Text style={styles.reminderTitle}>Notification Sound</Text>
              <Text style={styles.reminderSubtitle}>{displayedSound}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => openLink('http://www.crypthonlab.com')}
            activeOpacity={0.8}
            style={styles.reminderItemContainer}>
            <Icons.PRIVACY_POLICY width={40} />
            <Text style={styles.reminderTitle}>Privacy Policy</Text>
          </TouchableOpacity>
          {/* <View style={styles.reminderItemContainer}>
            <Icons.MENU width={40} height={20} />
            <Text style={styles.reminderTitle}>Software Licenses</Text>
          </View> */}
          <View style={styles.reminderItemContainer}>
            <Icons.INFO width={40} />
            <View>
              <Text style={styles.reminderTitle}>Version</Text>
              <Text style={styles.reminderSubtitle}>12.3.0</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <Modal
        transparent={true}
        animationType="slide"
        visible={themeModalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Theme</Text>
            <ScrollView
              ref={themeScrollViewRef}
              showsVerticalScrollIndicator={false}
              style={styles.scrollView}>
              {themeValues.map((themeValue, index) => (
                <TouchableOpacity
                  activeOpacity={0.8}
                  key={index}
                  onPress={() => handleThemePress(index)}
                  style={[
                    styles.selectedValueContainer,
                    selectedTheme === index && styles.selectedValue,
                    index === themeValues.length - 1 && {
                      marginBottom: 120,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.alignText,
                      selectedTheme === index && styles.selectedValueText,
                      {
                        opacity:
                          selectedTheme === index ||
                          selectedTheme === index + 1 ||
                          selectedTheme === index - 1
                            ? 1
                            : 0.5,
                      },
                    ]}>
                    {themeValue}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.btnsConatiner}>
              <Text
                onPress={() => setThemeModalVisible(false)}
                style={styles.btnText}>
                CANCEL
              </Text>
              <Text onPress={handleThemeConfirm} style={styles.btnText}>
                CONFIRM
              </Text>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        transparent={true}
        animationType="slide"
        visible={soundModalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Notification Sound</Text>
            <ScrollView
              ref={soundScrollViewRef}
              showsVerticalScrollIndicator={false}
              style={styles.scrollView}>
              {notificationSounds.map((notificationSound, index) => (
                <TouchableOpacity
                  activeOpacity={0.8}
                  key={index}
                  onPress={() => handleSoundPress(index)}
                  style={[
                    styles.selectedValueContainer,
                    selectedSound === index && styles.selectedValue,
                    index === notificationSounds.length - 1 && {
                      marginBottom: 120,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.alignText,
                      selectedSound === index && styles.selectedValueText,
                      {
                        opacity:
                          selectedSound === index ||
                          selectedSound === index + 1 ||
                          selectedSound === index - 1
                            ? 1
                            : 0.5,
                      },
                    ]}>
                    {notificationSound}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.btnsConatiner}>
              <Text
                onPress={() => setSoundModalVisible(false)}
                style={styles.btnText}>
                CANCEL
              </Text>
              <Text onPress={handleSoundConfirm} style={styles.btnText}>
                CONFIRM
              </Text>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        transparent={true}
        animationType="slide"
        visible={weeksModalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              Remind me to take my next Teethie in
            </Text>
            <ScrollView
              ref={weeksScrollViewRef}
              showsVerticalScrollIndicator={false}
              style={styles.scrollView}>
              {takeTeethiesWeeks.map((weeks, index) => (
                <TouchableOpacity
                  activeOpacity={0.8}
                  key={index}
                  onPress={() => handleWeeksPress(index)}
                  style={[
                    styles.selectedValueContainer,
                    selectedWeeks === index && styles.selectedValue,
                    index === takeTeethiesWeeks.length - 1 && {
                      marginBottom: 120,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.alignText,
                      selectedWeeks === index && styles.selectedValueText,
                      {
                        opacity:
                          selectedWeeks === index ||
                          selectedWeeks === index + 1 ||
                          selectedWeeks === index - 1
                            ? 1
                            : 0.5,
                      },
                    ]}>
                    {weeks}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.btnsConatiner}>
              <Text
                onPress={() => {
                  setWeeksModalVisible(false);
                  setDisplayedWeeks('No Reminder');
                }}
                style={styles.btnText}>
                NO REMINDER
              </Text>
              <Text onPress={handleWeeksConfirm} style={styles.btnText}>
                CONFIRM
              </Text>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        transparent={true}
        animationType="slide"
        visible={startWeekModalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Start the week on</Text>
            <ScrollView
              ref={startWeekScrollViewRef}
              showsVerticalScrollIndicator={false}
              style={styles.scrollView}>
              {startWeekDays.map((day, index) => (
                <TouchableOpacity
                  activeOpacity={0.8}
                  key={index}
                  onPress={() => handleStartWeekDayPress(index)}
                  style={[
                    styles.selectedValueContainer,
                    selectedStartDay === index && styles.selectedValue,
                    index === startWeekDays.length - 1 && {
                      marginBottom: 120,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.alignText,
                      selectedStartDay === index && styles.selectedValueText,
                      {
                        opacity:
                          selectedStartDay === index ||
                          selectedStartDay === index + 1 ||
                          selectedStartDay === index - 1
                            ? 1
                            : 0.5,
                      },
                    ]}>
                    {day}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.btnsConatiner}>
              <Text
                onPress={() => setStartWeekModalVisible(false)}
                style={styles.btnText}>
                CANCEL
              </Text>
              <Text onPress={handleStartDayConfirm} style={styles.btnText}>
                CONFIRM
              </Text>
            </View>
          </View>
        </View>
      </Modal>
      {timePickerVisible && (
        <DateTimePicker
          mode="time"
          value={new Date()}
          is24Hour={false}
          display="spinner"
          onChange={handleTimeChange}
        />
      )}
    </SafeAreaView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    paddingBottom: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  headerText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 22,
    color: COLORS.BLACK,
  },
  sectionContainer: {
    paddingHorizontal: 10,
    paddingBottom: 30,
    borderBottomWidth: 0.6,
    borderColor: COLORS.GRAY_DARK,
  },
  sectionTitle: {
    fontFamily: 'Robot-Regular',
    fontSize: 15,
    color: COLORS.BLACK,
    paddingTop: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 40,
    paddingRight: 20,
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  switchLabel: {
    fontFamily: 'Robot-Regular',
    fontSize: 17,
    color: COLORS.BLACK,
  },
  reminderItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 40,
    marginBottom: 5,
  },
  reminderTitle: {
    fontFamily: 'Robot-Regular',
    fontSize: 17,
    color: COLORS.BLACK,
  },
  reminderSubtitle: {
    fontFamily: 'Robot-Regular',
    fontSize: 14,
    color: COLORS.BLACK,
    top: -2,
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
    fontFamily: 'Roboto-Regular',
    fontSize: 25,
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
  selectedValueContainer: {
    alignItems: 'center',
  },
  alignText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 20,
    color: COLORS.GRAY_DARK,
    paddingBottom: 10,
  },
  selectedValue: {
    backgroundColor: COLORS.GRAY,
    paddingTop: 7,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  selectedValueText: {
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
