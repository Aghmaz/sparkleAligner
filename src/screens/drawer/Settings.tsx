import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
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
  const navigation = useNavigation<SettingsScreenNavigationProp>();
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
            <View>
              <Text style={styles.reminderTitle}>Theme</Text>
              <Text style={styles.reminderSubtitle}>Automatic</Text>
            </View>
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
});
