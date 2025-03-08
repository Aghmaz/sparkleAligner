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

// MainApp component consumes the theme from our context
function MainApp() {
  const {theme} = useTheme();

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

    init().finally(async () => {
      await BootSplash.hide({fade: true});
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
