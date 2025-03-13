import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  Theme as NavigationTheme,
} from '@react-navigation/native';
import BootSplash from 'react-native-bootsplash';
import AppNavigator from './src/navigation';
import Toast from 'react-native-toast-message';
import {ThemeProvider, useTheme} from './src/theme/themeManagement'; // Import your theme manager
import AsyncStorage from '@react-native-async-storage/async-storage';
import WebSocketService from './src/services/websocketService';
// MainApp component consumes the theme from our context
function MainApp() {
  const {theme} = useTheme();

  const initSocket = async () => {
    console.log("timer Screen on");
    const userId = await AsyncStorage.getItem('userId');
    console.log("userId============",userId);
    if (userId) {
      WebSocketService.connect('67ba24eb1431a3c93ab1d9e7');
    } else {
      console.error("User ID not found");
    }
  };
  // Choose navigation theme based on our custom theme.
  // Here we use react-navigation's default themes for simplicity.
  const navigationTheme: NavigationTheme =
    theme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <NavigationContainer theme={navigationTheme}>
      <AppNavigator />
      <Toast />
    </NavigationContainer>
  );
}

function App() {



  useEffect(() => {
    const init = async () => {
      // …perform multiple sync or async tasks if needed
    };

  const initSocket = async () => {
    console.log("timer Screen on");
    const userId = await AsyncStorage.getItem('userId');
    console.log("userId============",userId);
    if (userId) {
      WebSocketService.connect('67ba24eb1431a3c93ab1d9e7');
    } else {
      console.error("User ID not found");
    }
  };
    init().finally(async () => {
      await BootSplash.hide({fade: true});
      initSocket();
    console.log('BootSplash has been hidden successfully');
    });
  }, []);

  // Wrap your application with the ThemeProvider to enable theme management.
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}

export default App;
