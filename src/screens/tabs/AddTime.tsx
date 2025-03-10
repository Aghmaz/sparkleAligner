import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import DatePicker from 'react-native-date-picker';
import COLORS from '../../constraints/colors';
import Icons from '../../assets/icons';
import {useTheme} from '../../theme/themeManagement';
import LightTheme from '../../theme/LightTheme';
import DarkTheme from '../../theme/DarkTheme';

type NavigationProps = NavigationProp<any>;

const AddTime: React.FC = () => {
  const {theme} = useTheme();
  const currentTheme = theme === 'light' ? LightTheme : DarkTheme;
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
  const [currentDate, setCurrentDate] = useState<string>('');

  const formatDateWithoutTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    };
    return date.toLocaleString('en-US', options);
  };

  useEffect(() => {
    setCurrentDate(formatDateWithoutTime(new Date()));
  }, []);

  const [duration, setDuration] = useState<number>(1);

  const handleTimeOptionPress = (selectedDuration: number) => {
    setDuration(selectedDuration);
  };

  const timeOptions = [5, 15, 30, 45, 60];

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
          Add Time
        </Text>
        <TouchableOpacity onPress={handleBackNavigation} activeOpacity={0.8}>
          <Icons.TICK fill={currentTheme.colors.icon} />
        </TouchableOpacity>
      </View>
      <View style={styles.contentContainer}>
        <TouchableOpacity
          onPress={handleTookOffDatePress}
          activeOpacity={0.8}
          style={styles.row}>
          <View style={styles.rowLeft}>
            <Icons.KNIFEANDFORK fill={currentTheme.colors.icon} />
            <Text style={[styles.rowTitle, {color: currentTheme.colors.text}]}>
              Took Off
            </Text>
          </View>
          <Text style={[styles.rowTime, {color: currentTheme.colors.text}]}>
            {formatDate(tookOffDate)}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handlePutOnDatePress}
          activeOpacity={0.8}
          style={styles.row}>
          <View style={styles.rowLeft}>
            <Icons.LIKEBLACK fill={currentTheme.colors.icon} />
            <Text style={[styles.rowTitle, {color: currentTheme.colors.text}]}>
              Put On
            </Text>
          </View>
          <Text style={[styles.rowTime, {color: currentTheme.colors.text}]}>
            {formatDate(putOnDate)}
          </Text>
        </TouchableOpacity>
        <View style={styles.timeOptions}>
          {timeOptions.map(time => (
            <Text
              key={time}
              style={[styles.timeOption, {color: currentTheme.colors.text}]}
              onPress={() => handleTimeOptionPress(time)}>
              {time === 60 ? 1 : time} {time === 60 ? 'hr' : 'min'}
            </Text>
          ))}
        </View>
      </View>
      <View style={styles.footer}>
        <Text style={[styles.footerDate, {color: currentTheme.colors.text}]}>
          {currentDate}
        </Text>
        <Text
          style={[styles.footerDuration, {color: currentTheme.colors.text}]}>
          Out {duration === 60 ? 1 : duration} {duration === 60 ? 'hr' : 'min'}
        </Text>
      </View>
      {showTookOffDatePicker && (
        <DatePicker
          modal
          open={showTookOffDatePicker}
          date={tookOffDate}
          theme={currentTheme.isDark ? 'dark' : 'light'}
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
          theme={currentTheme.isDark ? 'dark' : 'light'}
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
