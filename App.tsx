import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import notifee from '@notifee/react-native';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  Theme as NavigationTheme,
} from '@react-navigation/native';
import BootSplash from 'react-native-bootsplash';
import AppNavigator from './src/navigation';
import Toast from 'react-native-toast-message';
import { ThemeProvider, useTheme } from './src/theme/themeManagement';
import { PermissionsAndroid, Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
// Define the notification display function as a declaration so it’s hoisted.



async function onDisplayNotification(remoteMessage) {
  try {
    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    // Display a notification using a valid smallIcon (ensure this icon exists in your project)
    await notifee.displayNotification({
      title: remoteMessage?.notification?.title || 'Notification',
      body: remoteMessage?.notification?.body || 'You have a new message',
      android: {
        channelId,
        smallIcon: 'ic_launcher', // Replace with your actual icon name if different.
        pressAction: {
          id: 'default',
        },
      },
    });
  } catch (error) {
    console.error('Error displaying notification:', error);
  }
}

// MainApp component consumes the theme from our context
function MainApp() {
  const { theme } = useTheme();

  // Choose navigation theme based on our custom theme.
  const navigationTheme: NavigationTheme =
    theme === 'dark' ? DarkTheme : DefaultTheme;

  return (


    <GestureHandlerRootView style={{ flex: 1 }}>
    <NavigationContainer theme={navigationTheme}>
      <AppNavigator />
      <Toast />
    </NavigationContainer>
    </GestureHandlerRootView>
   

  );
}

function App() {
  useEffect(() => {
    // Request the POST_NOTIFICATIONS permission (Android)
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

    const init = async () => {
      // Perform any additional async initialization tasks if needed
      await BootSplash.hide({ fade: true });
      const token = await messaging().getToken();
      await AsyncStorage.setItem('firebaseToken', token);
      console.log('BootSplash has been hidden successfully');
    };

    // Call initialization logic
    init();

    // Subscribe to foreground messages
    const unsubscribe = messaging().onMessage(async remoteMessage => {
    //  Alert.alert('A new FCM message arrived!');
      onDisplayNotification(remoteMessage);
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  // Wrap your application with the ThemeProvider
  return (

 
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  
  );
}

export default App;
