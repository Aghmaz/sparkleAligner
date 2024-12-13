import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import COLORS from '../../constraints/colors';
import Icons from '../../assets/icons';

type NavigationProps = NavigationProp<any>;

const AddNotes: React.FC = () => {
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
        <Text style={styles.headerText}>Add Notes</Text>
        <Text />
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Icons.CALENDER />
            <Text style={styles.rowTitle}>Date</Text>
          </View>
          <Text style={styles.rowDate}>12/13/2024</Text>
        </View>
        <View style={styles.rowLeft}>
          <Icons.MENU height={20} width={20} />
          <Text
            style={{
              color: COLORS.GRAY_DARK,
              fontSize: 15,
              width: '70%',
              fontFamily: 'Roboto-Regular',
            }}>
            e.g. tightness, discomfort, special circumstances etc.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AddNotes;

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
  rowDate: {
    fontFamily: 'Roboto-Regular',
    fontSize: 15,
    color: COLORS.BLACK,
  },
});
