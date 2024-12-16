import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Calendar} from 'react-native-calendars';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Shadow} from 'react-native-shadow-2';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import COLORS from '../../constraints/colors';
import Icons from '../../assets/icons';

type RootDrawerParamList = {
  Calendar: undefined;
  AddTime: undefined;
  AddAlignerSwitch: undefined;
  AddAppointment: undefined;
  AddNotes: {savedNote: string} | undefined;
};

type CalendarScreenNavigationProp = DrawerNavigationProp<
  RootDrawerParamList,
  'Calendar'
>;

const CalenderScreen = () => {
  const [selected, setSelected] = useState<string>('');
  const [isPlusOpen, setIsPlusOpen] = useState<boolean>(false);
  const [currentMonth, setCurrentMonth] = useState<string>('November 2024');
  const navigation = useNavigation<CalendarScreenNavigationProp>();
  const route = useRoute<RouteProp<RootDrawerParamList, 'AddNotes'>>();

  const note = route.params?.savedNote;

  const today = new Date();
  const todayDate = today.toISOString().split('T')[0];

  const handleDayPress = (day: {
    dateString: string;
    day: number;
    month: number;
    year: number;
  }) => {
    setSelected(day.dateString);
  };

  const handleMonthChange = (month: {year: number; month: number}) => {
    const formattedMonth = new Date(month.year, month.month - 1).toLocaleString(
      'default',
      {month: 'long', year: 'numeric'},
    );
    setCurrentMonth(formattedMonth);
  };

  const togglePlus = (): void => {
    setIsPlusOpen(!isPlusOpen);
  };

  return (
    <SafeAreaView style={styles.container}>
      {isPlusOpen ? (
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate('AddTime')}
            activeOpacity={0.8}
            style={styles.iconRow}>
            <Text style={styles.textLabel}>Time</Text>
            <Shadow>
              <View style={styles.iconButtonContainer}>
                <Icons.KNIFEANDFORK />
              </View>
            </Shadow>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('AddAlignerSwitch')}
            activeOpacity={0.8}
            style={styles.iconRow}>
            <Text style={styles.textLabel}>Aligner Switch</Text>
            <Shadow>
              <View style={styles.iconButtonContainer}>
                <Icons.SYNC />
              </View>
            </Shadow>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('AddAppointment')}
            activeOpacity={0.8}
            style={styles.iconRow}>
            <Text style={styles.textLabel}>Ortho Appoinment</Text>
            <Shadow>
              <View style={styles.iconButtonContainer}>
                <Icons.STAR />
              </View>
            </Shadow>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setIsPlusOpen(false);
              navigation.navigate('AddNotes', {savedNote: note || ''});
            }}
            activeOpacity={0.8}
            style={styles.iconRow}>
            <Text style={styles.textLabel}>Notes</Text>
            <Shadow>
              <View style={styles.iconButtonContainer}>
                <Icons.FOLDER />
              </View>
            </Shadow>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={togglePlus}
            activeOpacity={0.8}
            style={styles.downIconContainer}>
            <Icons.DOWNARROW />
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <Calendar
            onDayPress={handleDayPress}
            onMonthChange={handleMonthChange}
            hideArrows={true}
            minDate={todayDate}
            hideExtraDays={true}
            enableSwipeMonths={true}
            renderHeader={() => (
              <View style={styles.calendarHeader}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => navigation.openDrawer()}>
                  <Icons.MENU height={20} width={20} />
                </TouchableOpacity>
                <Text style={styles.currentMonth}>{currentMonth}</Text>
                <Icons.CALENDER height={25} />
              </View>
            )}
            theme={{
              textSectionTitleColor: '#000000',
              selectedDayBackgroundColor: '#42afd2',
              selectedDayTextColor: '#fff',
              todayTextColor: '#00adf5',
              dayTextColor: '#000',
              textDayHeaderFontSize: 16,
              textDisabledColor: '#c2c8c8',
            }}
            markedDates={{
              '2024-11-13': {selected: true, selectedColor: '#a56d6095'},
              '2024-11-14': {selected: true, selectedColor: '#a56d6095'},
              '2024-11-15': {selected: true, selectedColor: '#a56d60'},
              '2024-11-29': {selected: true, selectedColor: '#a56d60'},
              [selected]: {selected: true},
            }}
          />
          <View style={styles.infoBar}>
            <Text style={styles.totalText}>Total: {'<'} 1 min</Text>
            <Text style={styles.alignerText}>Aligner #1</Text>
          </View>
          {note && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 20,
                padding: 10,
                borderBottomWidth: 2,
                borderColor: COLORS.GRAY,
              }}>
              <Icons.FOLDER />
              <Text
                style={{
                  fontFamily: 'Roboto-Regular',
                  fontSize: 17,
                  color: COLORS.BLACK,
                }}>
                {note}
              </Text>
            </View>
          )}
          <View style={styles.detailsBar}>
            <Icons.LIKE />
            <Text style={styles.detailsText}>15 hr 50 min</Text>
          </View>
          <TouchableOpacity
            onPress={togglePlus}
            activeOpacity={0.8}
            style={styles.plusIconContainer}>
            <Icons.PLUS />
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
};

export default CalenderScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    width: '100%',
  },
  currentMonth: {
    fontFamily: 'Roboto-Regular',
    fontSize: 20,
    color: COLORS.BLACK,
  },
  infoBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 2,
    borderColor: COLORS.GRAY,
    paddingHorizontal: 20,
  },
  totalText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 17,
    color: COLORS.BLACK,
  },
  alignerText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 17,
    color: COLORS.BLACK,
  },
  detailsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 40,
    paddingTop: 15,
  },
  detailsText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 15,
    color: COLORS.GRAY_DARK,
  },
  plusIconContainer: {
    height: 60,
    width: 60,
    backgroundColor: COLORS.SKY_LIGHT,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: '8%',
    right: '5%',
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
  downIconContainer: {
    height: 60,
    width: 60,
    backgroundColor: COLORS.SKY_LIGHT,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
