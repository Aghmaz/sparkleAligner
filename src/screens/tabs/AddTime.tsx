import React, {useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import DatePicker from 'react-native-date-picker';
import COLORS from '../../constraints/colors';
import Icons from '../../assets/icons';

type NavigationProps = NavigationProp<any>;

const AddTime: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();

  const initialTookOffDate = new Date();
  initialTookOffDate.setMinutes(initialTookOffDate.getMinutes() - 1);

  const [tookOffDate, setTookOffDate] = useState(initialTookOffDate);
  const [showTookOffDatePicker, setShowTookOffDatePicker] = useState(false);

  const initialPutOnDate = new Date();

  const [putOnDate, setPutOnDate] = useState(initialPutOnDate);
  const [showPutOnDatePicker, setShowPutOnDatePicker] = useState(false);

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

  const handleTookOffDateChange = (selectedDate: Date) => {
    setTookOffDate(selectedDate);
    setShowTookOffDatePicker(false);
  };

  const handleTookOffDatePress = () => {
    setShowTookOffDatePicker(true);
  };
  const handlePutOnDateChange = (selectedDate: Date) => {
    setPutOnDate(selectedDate);
    setShowPutOnDatePicker(false);
  };

  const handlePutOnDatePress = () => {
    setShowPutOnDatePicker(true);
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
        <Text style={styles.headerText}>Add Time</Text>
        <TouchableOpacity onPress={handleBackNavigation} activeOpacity={0.8}>
          <Icons.TICK />
        </TouchableOpacity>
      </View>
      <View style={styles.contentContainer}>
        <TouchableOpacity
          onPress={handleTookOffDatePress}
          activeOpacity={0.8}
          style={styles.row}>
          <View style={styles.rowLeft}>
            <Icons.KNIFEANDFORK />
            <Text style={styles.rowTitle}>Took Off</Text>
          </View>
          <Text style={styles.rowTime}>{formatDate(tookOffDate)}</Text>
        </TouchableOpacity>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Icons.LIKEBLACK />
            <Text style={styles.rowTitle}>Put On</Text>
          </View>
          <Text style={styles.rowTime}>{formatDate(putOnDate)}</Text>
        </View>
        <View style={styles.timeOptions}>
          <Text style={styles.timeOption}>5 min</Text>
          <Text style={styles.timeOption}>15 min</Text>
          <Text style={styles.timeOption}>30 min</Text>
          <Text style={styles.timeOption}>45 min</Text>
          <Text style={styles.timeOption}>1 hr</Text>
        </View>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerDate}>12/13/2024</Text>
        <Text style={styles.footerDuration}>Out 1 min</Text>
      </View>
      {showTookOffDatePicker && (
        <DatePicker
          modal
          open={showTookOffDatePicker}
          date={tookOffDate}
          theme="light"
          onConfirm={selectedDate => handleTookOffDateChange(selectedDate)}
          onCancel={() => setShowTookOffDatePicker(false)}
          mode="datetime"
          confirmText="OK"
          cancelText="CANCEL"
          title={'Took my aligners off at'}
          buttonColor={COLORS.BLUE_DARK}
        />
      )}
      {showPutOnDatePicker && (
        <DatePicker
          modal
          open={showPutOnDatePicker}
          date={putOnDate}
          theme="light"
          onConfirm={selectedDate => handlePutOnDateChange(selectedDate)}
          onCancel={() => setShowPutOnDatePicker(false)}
          mode="datetime"
          confirmText="OK"
          cancelText="CANCEL"
          title={'Put my aligners on at'}
          buttonColor={COLORS.BLUE_DARK}
        />
      )}
    </SafeAreaView>
  );
};

export default AddTime;

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
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    gap: 50,
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
  timeOptions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 7,
  },
  timeOption: {
    fontFamily: 'Roboto-Regular',
    fontSize: 15,
    color: COLORS.BLACK,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 40,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderColor: COLORS.GRAY_LIGHT,
  },
  footerDate: {
    fontFamily: 'Roboto-Regular',
    fontSize: 17,
    color: COLORS.BLACK,
  },
  footerDuration: {
    fontFamily: 'Roboto-Regular',
    fontSize: 15,
    color: COLORS.BLACK,
  },
});
