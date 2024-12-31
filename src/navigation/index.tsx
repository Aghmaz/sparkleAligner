import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import LoginScreen from '../screens/LoginScreen';
import OnBoardScreen from '../screens/OnBoardScreen';
import TimerScreen from '../screens/tabs/TimerScreen';
import CalenderScreen from '../screens/tabs/CalenderScreen';
import FAQ from '../screens/drawer/FAQ';
import {useNavigation} from '@react-navigation/native';
import AdjustCurrentTreatment from '../screens/drawer/AdjustCurrentTreatment';
import StartANewTreatment from '../screens/drawer/StartANewTreatment';
import AddAlignerSwitch from '../screens/tabs/AddAlignerSwitch';
import Settings from '../screens/drawer/Settings';
import CameraScreen from '../screens/tabs/CameraScreen';
import AddAppointment from '../screens/tabs/AddAppointment';
import TreatmentPreviews from '../screens/drawer/TreatmentPreviews';
import AddTime from '../screens/tabs/AddTime';
import AddNotes from '../screens/tabs/AddNotes';
import Icons from '../assets/icons';
import COLORS from '../constraints/colors';

type RootStackParamList = {
  OnBoard: undefined;
  Login: undefined;
  Drawer: {screen: string};
  AdjustCurrentTreatment: undefined;
  AddTime: undefined;
  AddAlignerSwitch:undefined;
  AddAppointment:undefined;
  AddNotes:undefined
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      initialRouteName="Timer"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBarStyle,
      }}>
      <Tab.Screen
        name="Timer"
        component={TimerScreen}
        options={{
          tabBarIcon: ({focused}) =>
            focused ? (
              <View style={styles.tabIconContainerFocused}>
                <Icons.TIMERA />
              </View>
            ) : (
              <Icons.TIMER />
            ),
        }}
      />
      <Tab.Screen
        name="Calender"
        component={CalenderScreen}
        options={{
          tabBarIcon: ({focused}) =>
            focused ? (
              <View style={styles.tabIconContainerFocused}>
                <Icons.CALENDERA />
              </View>
            ) : (
              <Icons.CALENDER />
            ),
        }}
      />
      <Tab.Screen
        name="Camera"
        component={CameraScreen}
        options={{
          tabBarIcon: ({focused}) =>
            focused ? (
              <View style={styles.tabIconContainerFocused}>
                <Icons.CAMERAA />
              </View>
            ) : (
              <Icons.CAMERA />
            ),
        }}
      />
    </Tab.Navigator>
  );
};

const DrawerContent = () => {
  const navigation = useNavigation<DrawerNavigationProp<RootStackParamList>>();
  return (
    <View style={styles.drawerContentContainer}>
      <View style={styles.drawerHeader}>
        <Icons.AlignBLUELIGHT height={40} width={40} />
        <Text style={styles.drawerHeaderText}>SPARKLE ALIGN</Text>
      </View>
      <View style={styles.drawerSection}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Drawer', {screen: 'AdjustCurrentTreatment'})
          }
          activeOpacity={0.8}>
          <DrawerItem icon={Icons.ADJUST} text="Adjust Current Treatment" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Drawer', {screen: 'StartANewTreatment'})
          }
          activeOpacity={0.8}>
          <DrawerItem icon={Icons.FOLDER} text="Start a New Treatment" />
        </TouchableOpacity>
        <TouchableOpacity
        style={{marginLeft:-7}}
          onPress={() =>
            navigation.navigate('Drawer', {screen: 'TreatmentPreviews'})
          }
          activeOpacity={0.8}>
          <DrawerItem icon={Icons.TEETH} text="Treatment Previews" />
        </TouchableOpacity>
      </View>
      <View style={styles.drawerSection}>
        <DrawerItem icon={Icons.STAR} text="Review App" />
      </View>
      <View style={styles.drawerSection}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Drawer', {screen: 'FAQ'})}
          activeOpacity={0.8}>
          <DrawerItem icon={Icons.QNA} text="Frequently Asked Questions" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Drawer', {screen: 'Settings'})}
          activeOpacity={0.8}>
          <DrawerItem icon={Icons.SETTINGS} text="Settings" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const DrawerItem: React.FC<{icon: React.ComponentType; text: string}> = ({
  icon: Icon,
  text,
}) => {
  return (
    <View style={styles.drawerItemContainer}>
      <Icon />
      <Text style={styles.drawerItemText}>{text}</Text>
    </View>
  );
};

const DrawerNavigation = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        drawerPosition: 'left',
      }}
      drawerContent={() => <DrawerContent />}>
      <Drawer.Screen
        name="TabNavigator"
        component={TabNavigator}
        options={{
          drawerItemStyle: {height: 0},
        }}
      />
      <Drawer.Screen
        name="AdjustCurrentTreatment"
        component={AdjustCurrentTreatment}
        options={{
          drawerItemStyle: {height: 0},
        }}
      />
      <Drawer.Screen
        name="TreatmentPreviews"
        component={TreatmentPreviews}
        options={{
          drawerItemStyle: {height: 0},
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={Settings}
        options={{
          drawerItemStyle: {height: 0},
        }}
      />
      <Drawer.Screen
        name="StartANewTreatment"
        component={StartANewTreatment}
        options={{
          drawerItemStyle: {height: 0},
        }}
      />
      <Drawer.Screen
        name="FAQ"
        component={FAQ}
        options={{
          drawerItemStyle: {height: 0},
        }}
      />
    </Drawer.Navigator>
  );
};

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="OnBoard">
      <Stack.Screen
        name="OnBoard"
        component={OnBoardScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AddNotes"
        component={AddNotes}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AddAppointment"
        component={AddAppointment}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AddTime"
        component={AddTime}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AddAlignerSwitch"
        component={AddAlignerSwitch}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Drawer"
        component={DrawerNavigation}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: COLORS.WHITE,
    height: 80,
    borderTopWidth: 0.2,
    borderColor: COLORS.GRAY_DARK,
  },
  tabIconContainerFocused: {
    paddingVertical: 4,
    backgroundColor: '#9ceff5',
    borderRadius: 25,
    paddingHorizontal: 15,
  },
  drawerContentContainer: {
    paddingTop: 60,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: COLORS.GRAY,
    paddingHorizontal: 5,
  },
  drawerHeaderText: {
    fontFamily: 'Roboto-Black',
    fontSize: 22,
    color: COLORS.BLUE_LIGHT,
  },
  drawerSection: {
    paddingHorizontal: 20,
    gap: 35,
    borderBottomWidth: 1,
    borderColor: COLORS.GRAY_DARK,
    marginHorizontal: 13,
    paddingVertical: 25,
  },
  drawerItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  drawerItemText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    color: COLORS.BLACK,
  },
});
