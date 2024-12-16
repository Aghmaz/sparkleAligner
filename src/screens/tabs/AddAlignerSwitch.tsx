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

type NavigationProps = NavigationProp<any>;

const AddAlignerSwitch: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedAligner, setSelectedAligner] = useState<number>(0);
  const [displayedAligner, setDisplayedAligner] =
    useState<string>('Aligner #1');

  const scrollViewRef = useRef<ScrollView>(null);

  const alignerTexts: string[] = Array.from(
    {length: 30},
    (_, index) => `Aligner #${index + 1}`,
  );

  const handleAlignerPress = (index: number): void => {
    setSelectedAligner(index);
  };

  const handleConfirm = (): void => {
    const alignerText = alignerTexts[selectedAligner];
    setDisplayedAligner(alignerText);
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

  const initialDate = new Date();
  initialDate.setHours(12, 0, 0);

  const [date, setDate] = useState(initialDate);
  const [showDatePicker, setShowDatePicker] = useState(false);

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

  const handleBackNavigation = (): void => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackNavigation} activeOpacity={0.8}>
          <Icons.CROSS />
        </TouchableOpacity>
        <Text style={styles.headerText}>Add Aligner Switch</Text>
        <TouchableOpacity onPress={handleBackNavigation} activeOpacity={0.8}>
          <Icons.TICK />
        </TouchableOpacity>
      </View>
      <View style={styles.contentContainer}>
        <TouchableOpacity
          onPress={handleDatePress}
          activeOpacity={0.8}
          style={styles.row}>
          <View style={styles.rowLeft}>
            <Icons.CALENDER />
            <Text style={styles.rowTitle}>When?</Text>
          </View>
          <Text style={styles.rowTime}>{formatDate(date)}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
          style={styles.row}>
          <View style={styles.rowLeft}>
            <Icons.SYNC />
            <Text style={styles.rowTitle}>Switched To</Text>
          </View>
          <Text style={styles.alignerNo}>{displayedAligner}</Text>
        </TouchableOpacity>
      </View>{' '}
      {showDatePicker && (
        <DatePicker
          modal
          open={showDatePicker}
          date={date}
          onConfirm={selectedDate => handleDateChange(selectedDate)}
          onCancel={() => setShowDatePicker(false)}
          mode="datetime"
          confirmText="OK"
          cancelText="CANCEL"
          title={'When?'}
          buttonColor={COLORS.BLUE_DARK}
        />
      )}
      <Modal transparent={true} animationType="slide" visible={modalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Which aligner did you switch to?</Text>
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
                    styles.selectedValueContainer,
                    selectedAligner === index && styles.selectedValue,
                    index === alignerTexts.length - 1 && {
                      marginBottom: 120,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.alignText,
                      selectedAligner === index && styles.selectedValueText,
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

export default AddAlignerSwitch;

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
