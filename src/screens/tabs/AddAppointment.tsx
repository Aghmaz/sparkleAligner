import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import DatePicker from 'react-native-date-picker';
import COLORS from '../../constraints/colors';
import Icons from '../../assets/icons';
import {useTheme} from '../../theme/themeManagement';
import LightTheme from '../../theme/LightTheme';
import DarkTheme from '../../theme/DarkTheme';

type NavigationProps = NavigationProp<any>;

const AddAppointment: React.FC = () => {
  const {theme} = useTheme();
  const currentTheme = theme === 'light' ? LightTheme : DarkTheme;
  const navigation = useNavigation<NavigationProps>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedMins, setSelectedMins] = useState<number>(2);
  const [displayedMins, setDisplayedMins] =
    useState<string>('30 Minutes Before');

  const ScrollViewRef = useRef<ScrollView>(null);

  const minutesValues: string[] = Array.from({length: 6}, (_, index) => {
    const minutes = [
      '5 Minutes Before',
      '15 Minutes Before',
      '30 Minutes Before',
      '1 Hour Before',
      '2 Hours Before',
      '1 Day Before',
    ];
    return minutes[index % minutes.length];
  });

  const handleMinsPress = (index: number): void => {
    setSelectedMins(index);
  };

  const handleMinutesConfirm = (): void => {
    const minutesValue = minutesValues[selectedMins];
    setDisplayedMins(minutesValue);
    setModalVisible(false);
  };

  useEffect(() => {
    if (modalVisible && ScrollViewRef.current) {
      ScrollViewRef.current.scrollTo({
        y: selectedMins * 37,
        animated: true,
      });
    }
  }, [modalVisible]);

  const initialDate = new Date();
  initialDate.setHours(12, 0, 0);

  const [date, setDate] = useState(initialDate);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleBackNavigation = (): void => {
    navigation.goBack();
  };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
    return date.toLocaleString('en-US', options);
  };

  const handleDateChange = (selectedDate: Date) => {
    setDate(selectedDate);
    setShowDatePicker(false);
  };

  const handleDatePress = () => {
    setShowDatePicker(true);
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: currentTheme.colors.background},
      ]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackNavigation} activeOpacity={0.8}>
          <Icons.CROSS fill={currentTheme.colors.icon} />
        </TouchableOpacity>
        <Text style={[styles.headerText, {color: currentTheme.colors.text}]}>
          Add Appointment
        </Text>
        <TouchableOpacity onPress={handleBackNavigation} activeOpacity={0.8}>
          <Icons.TICK fill={currentTheme.colors.icon} />
        </TouchableOpacity>
      </View>
      <View style={styles.contentContainer}>
        <TouchableOpacity
          onPress={handleDatePress}
          activeOpacity={0.8}
          style={styles.row}>
          <View style={styles.rowLeft}>
            <Icons.CALENDER fill={currentTheme.colors.icon} />
            <Text style={[styles.rowTitle, {color: currentTheme.colors.text}]}>
              When?
            </Text>
          </View>
          <Text style={[styles.rowTime, {color: currentTheme.colors.text}]}>
            {formatDate(date)}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
          style={styles.row}>
          <View style={styles.rowLeft}>
            <Icons.ALARM fill={currentTheme.colors.icon} />
            <Text style={[styles.rowTitle, {color: currentTheme.colors.text}]}>
              Remind Me
            </Text>
          </View>
          <Text style={[styles.rowTime, {color: currentTheme.colors.text}]}>
            {displayedMins}
          </Text>
        </TouchableOpacity>
      </View>
      {showDatePicker && (
        <DatePicker
          modal
          open={showDatePicker}
          theme={currentTheme.isDark ? 'dark' : 'light'}
          date={date}
          onConfirm={selectedDate => handleDateChange(selectedDate)}
          onCancel={() => setShowDatePicker(false)}
          mode="datetime"
          confirmText="OK"
          cancelText="CANCEL"
          title={'Appointment starts at'}
          buttonColor={COLORS.BLUE_DARK}
        />
      )}
      <Modal transparent={true} animationType="slide" visible={modalVisible}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, {backgroundColor: currentTheme.colors.background}]}>
            <Text
              style={[styles.modalTitle, {color: currentTheme.colors.text}]}>
              Remind me of my appointment
            </Text>
            <ScrollView
              ref={ScrollViewRef}
              showsVerticalScrollIndicator={false}
              style={[styles.scrollView]}>
              {minutesValues.map((minutesValue, index) => (
                <TouchableOpacity
                  activeOpacity={0.8}
                  key={index}
                  onPress={() => handleMinsPress(index)}
                  style={[
                    styles.selectedValueContainer,
                    selectedMins === index && styles.selectedValue,
                    index === minutesValues.length - 1 && {
                      marginBottom: 120,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.alignText,
                      selectedMins === index && styles.selectedValueText,
                      {
                        opacity:
                          selectedMins === index ||
                          selectedMins === index + 1 ||
                          selectedMins === index - 1
                            ? 1
                            : 0.5,
                        color: currentTheme.colors.text,
                      },
                    ]}>
                    {minutesValue}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.btnsConatiner}>
              <Text
                onPress={() => setModalVisible(false)}
                style={[styles.btnText, {color: currentTheme.colors.text}]}>
                CANCEL
              </Text>
              <Text
                onPress={handleMinutesConfirm}
                style={[styles.btnText, {color: currentTheme.colors.text}]}>
                CONFIRM
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default AddAppointment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  headerText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 20,
    color: COLORS.BLACK,
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
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 40,
    gap: 50,
    borderBottomWidth: 1,
    paddingBottom: 30,
    borderColor: COLORS.GRAY_LIGHT,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 10,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  rowTitle: {
    fontFamily: 'Roboto-Regular',
    fontSize: 17,
    color: COLORS.BLACK,
  },
  rowTime: {
    fontFamily: 'Roboto-Regular',
    fontSize: 15,
    color: COLORS.BLACK,
  },
  alignerNo: {
    fontFamily: 'Roboto-Regular',
    fontSize: 15,
    color: COLORS.BLACK,
  },
});
