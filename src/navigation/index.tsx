import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DrawerContentScrollView, DrawerItem, createDrawerNavigator, DrawerContentComponentProps } from '@react-navigation/drawer';
import Dashboard from '../screens/Dashboard';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/tabs/homeScreen';
import AboutScreen from '../screens/tabs/Aboutscreen';
import { Text, View } from 'react-native';
import { useTheme, NavigationContainer } from '@react-navigation/native';

const COLORS = {
  ORANGE: '#FFA500',
  GRAY_LIGHT: '#D3D3D3',
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
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Home"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

const ProfileScreenWithDrawer: React.FC = () => (
  <Drawer.Navigator
    initialRouteName="Home"
    drawerContent={(props: DrawerContentComponentProps) => {
      const { routeNames, index } = props.state;
      const focused = routeNames[index];

      return (
        <DrawerContentScrollView {...props}>
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>
              Code With sahil
            </Text>
          </View>
          <DrawerItem
            label="Home"
            onPress={() => props.navigation.navigate('Home')}
            focused={focused === 'Home'}
            activeBackgroundColor={COLORS.ORANGE}
            inactiveBackgroundColor={COLORS.GRAY_LIGHT}
            inactiveTintColor={COLORS.BLACK}
            activeTintColor={COLORS.WHITE}
          />
          <DrawerItem
            label="About"
            onPress={() => props.navigation.navigate('About')}
            focused={focused === 'About'}
            activeBackgroundColor={COLORS.ORANGE}
            inactiveBackgroundColor={COLORS.GRAY_LIGHT}
            inactiveTintColor={COLORS.BLACK}
            activeTintColor={COLORS.WHITE}
          />
        </DrawerContentScrollView>
      );
    }}
  >
    <Drawer.Screen name="Home" component={HomeScreen} />
    <Drawer.Screen name="About" component={AboutScreen} />
  </Drawer.Navigator>
);

const TabNavigator: React.FC = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarStyle: { backgroundColor: colors.background },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.text,
        }}
      />
    </Tab.Navigator>
  );
};

export default StackNavigation;
