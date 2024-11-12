import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  DrawerContentScrollView,
  DrawerItem,
  createDrawerNavigator,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/tabs/homeScreen';
import TimerScreen from '../screens/tabs/TimerScreen';
import CalenderScreen from '../screens/tabs/CalenderScreen';
import CameraScreen from '../screens/tabs/CameraScreen';
import DashboardScreen from '../screens/tabs/DashboardScreen';
import Icons from '../assets/icons';
import NotificationsScreen from '../screens/tabs/NotificationsScreen';
import AboutScreen from '../screens/tabs/Aboutscreen';
import {Text, View} from 'react-native';
import {useTheme, NavigationContainer} from '@react-navigation/native';

const COLORS = {
  ORANGE: '#FFA500',
  GRAY_DARK: '#D3D3D3',
  BLACK: '#000000',
  WHITE: '#FFFFFF',
};

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Profile: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const StackNavigation: React.FC = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Home"
        component={TabNavigator}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

const ProfileScreenWithDrawer: React.FC = () => (
  <Drawer.Navigator
    initialRouteName="Home"
    drawerContent={(props: DrawerContentComponentProps) => {
      const {routeNames, index} = props.state;
      const focused = routeNames[index];

      return (
        <DrawerContentScrollView {...props}>
          <View style={{alignItems: 'center', marginBottom: 20}}>
            <Text
              style={{textAlign: 'center', fontSize: 18, fontWeight: 'bold'}}>
              Code With sahil
            </Text>
          </View>
          <DrawerItem
            label="Home"
            onPress={() => props.navigation.navigate('Home')}
            focused={focused === 'Home'}
            activeBackgroundColor={COLORS.ORANGE}
            inactiveBackgroundColor={COLORS.GRAY_DARK}
            inactiveTintColor={COLORS.BLACK}
            activeTintColor={COLORS.WHITE}
          />
          <DrawerItem
            label="About"
            onPress={() => props.navigation.navigate('About')}
            focused={focused === 'About'}
            activeBackgroundColor={COLORS.ORANGE}
            inactiveBackgroundColor={COLORS.GRAY_DARK}
            inactiveTintColor={COLORS.BLACK}
            activeTintColor={COLORS.WHITE}
          />
        </DrawerContentScrollView>
      );
    }}>
    <Drawer.Screen name="Home" component={HomeScreen} />
    <Drawer.Screen name="About" component={AboutScreen} />
  </Drawer.Navigator>
);

export const TabNavigator: React.FC = () => {
  const {colors} = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="Timer"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: COLORS.WHITE,
          height: 80,
          borderTopWidth: 0.2,
          borderColor: COLORS.GRAY_DARK,
        },
      }}>
      <Tab.Screen
        name="Timer"
        component={TimerScreen}
        options={{
          tabBarIcon: ({focused}) =>
            focused ? (
              <View
                style={{
                  paddingVertical: 4,
                  backgroundColor: '#42afd275',
                  borderRadius: 25,
                  paddingHorizontal: 15,
                }}>
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
              <View
                style={{
                  paddingVertical: 4,
                  backgroundColor: '#42afd275',
                  borderRadius: 25,
                  paddingHorizontal: 15,
                }}>
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
              <View
                style={{
                  paddingVertical: 4,
                  backgroundColor: '#42afd275',
                  borderRadius: 25,
                  paddingHorizontal: 15,
                }}>
                <Icons.CAMERAA />
              </View>
            ) : (
              <Icons.CAMERA />
            ),
        }}
      />
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({focused}) =>
            focused ? (
              <View
                style={{
                  paddingVertical: 4,
                  backgroundColor: '#42afd275',
                  borderRadius: 25,
                  paddingHorizontal: 15,
                }}>
                <Icons.DASHBOARDA />
              </View>
            ) : (
              <Icons.DASHBOARD />
            ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          tabBarIcon: ({focused}) =>
            focused ? (
              <View
                style={{
                  paddingVertical: 4,
                  backgroundColor: '#42afd275',
                  borderRadius: 25,
                  paddingHorizontal: 15,
                }}>
                <Icons.NOTIFICATIONA />
              </View>
            ) : (
              <Icons.NOTIFICATION />
            ),
        }}
      />
    </Tab.Navigator>
  );
};

export default StackNavigation;
