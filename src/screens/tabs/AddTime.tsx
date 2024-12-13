import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import COLORS from '../../constraints/colors';
import Icons from '../../assets/icons';

type NavigationProps = NavigationProp<any>;

const AddTime: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();

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
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Icons.KNIFEANDFORK />
            <Text style={styles.rowTitle}>Took Off</Text>
          </View>
          <Text style={styles.rowTime}>12/13/2024, 8:04 PM</Text>
        </View>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Icons.LIKEBLACK />
            <Text style={styles.rowTitle}>Put On</Text>
          </View>
          <Text style={styles.rowTime}>12/13/2024, 8:05 PM</Text>
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
