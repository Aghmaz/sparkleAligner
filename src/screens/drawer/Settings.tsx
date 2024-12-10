import React, {useState, useRef,useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Switch} from 'react-native-switch';
import COLORS from '../../constraints/colors';
import Icons from '../../assets/icons';

type SettingsScreenNavigationProp = StackNavigationProp<any, 'Settings'>;

const Settings = () => {
  const [wearAligner, setWearAligner] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const [selectedAligner, setSelectedAligner] = useState<number>(0);
  const [displayedAligner, setDisplayedAligner] =
    useState<string>('Automatic');

  const scrollViewRef = useRef<ScrollView>(null);

  const themeValues: string[] = Array.from({length: 3}, (_, index) => {
    const themes = ['Automatic', 'Light', 'Dark'];
    return themes[index % themes.length];
  });

  
  const handleAlignerPress = (index: number): void => {
    setSelectedAligner(index);
  };

  const handleConfirm = (): void => {
    const themeValue = themeValues[selectedAligner];
    setDisplayedAligner(themeValue);
    setModalVisible(false);
  };

  useEffect(() => {
    if (modalVisible && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        y: selectedAligner * 37,
        animated: true,
      });
    }
  }, [modalVisible]);

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
          <View style={styles.switchContainer}>
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
          </View>
          <View style={styles.reminderItemContainer}>
            <Icons.SYNC />
            <View>
              <Text style={styles.reminderTitle}>Switch Aligners</Text>
              <Text style={styles.reminderSubtitle}>No Reminder</Text>
            </View>
          </View>
          <View style={styles.reminderItemContainer}>
            <Icons.TEETH />
            <View>
              <Text style={styles.reminderTitle}>Take Teethies</Text>
              <Text style={styles.reminderSubtitle}>No Reminder</Text>
            </View>
          </View>
          <View style={styles.reminderItemContainer}>
            <Icons.WRENCH height={18} width={40} />
            <Text style={styles.reminderTitle}>Fix Notification Problems</Text>
          </View>
        </View>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Calender</Text>
          <View style={styles.reminderItemContainer}>
            <Icons.CALENDER width={40} />
            <View>
              <Text style={styles.reminderTitle}>Start Week On</Text>
              <Text style={styles.reminderSubtitle}>Sunday</Text>
            </View>
          </View>
        </View>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Transfer Data</Text>
          <View style={styles.reminderItemContainer}>
            <Icons.CLOUD width={40} />
            <View>
              <Text style={styles.reminderTitle}>Backup to Cloud</Text>
              <Text style={styles.reminderSubtitle}>Off</Text>
            </View>
          </View>
          <View style={styles.reminderItemContainer}>
            <Icons.CLOUD width={40} />
            <Text style={styles.reminderTitle}>Restore from Cloud</Text>
          </View>
        </View>
        <View style={styles.sectionContainer}>
          <View style={styles.reminderItemContainer}>
            <Icons.THEME width={40} />
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              activeOpacity={0.8}>
              <Text style={styles.reminderTitle}>Theme</Text>
              <Text style={styles.reminderSubtitle}>{displayedAligner}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.reminderItemContainer}>
            <Icons.SOUND width={40} />
            <View>
              <Text style={styles.reminderTitle}>Notification Sound</Text>
              <Text style={styles.reminderSubtitle}>Long</Text>
            </View>
          </View>
          <View style={styles.reminderItemContainer}>
            <Icons.PRIVACY_POLICY width={40} />
            <Text style={styles.reminderTitle}>Privacy Policy</Text>
          </View>
          <View style={styles.reminderItemContainer}>
            <Icons.MENU width={40} height={20} />
            <Text style={styles.reminderTitle}>Software Licenses</Text>
          </View>
          <View style={styles.reminderItemContainer}>
            <Icons.INFO width={40} />
            <View>
              <Text style={styles.reminderTitle}>Version</Text>
              <Text style={styles.reminderSubtitle}>12.3.0</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <Modal transparent={true} animationType="slide" visible={modalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Theme</Text>
            <ScrollView
              ref={scrollViewRef}
              showsVerticalScrollIndicator={false}
              style={styles.scrollView}>
              {themeValues.map((themeValue, index) => (
                <TouchableOpacity
                  activeOpacity={0.8}
                  key={index}
                  onPress={() => handleAlignerPress(index)}
                  style={[
                    styles.alignTextContainer,
                    selectedAligner === index && styles.selectedAligner,
                    index === themeValues.length - 1 && {
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
                    {themeValue}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.btnsConatiner}>
              <Text
                onPress={() => setModalVisible(false)}
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
