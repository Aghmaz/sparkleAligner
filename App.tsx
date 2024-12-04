import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import BootSplash from 'react-native-bootsplash';
import AppNavigator from './src/navigation';
import Toast from 'react-native-toast-message';

function App() {
  useEffect(() => {
    const init = async () => {
      // …do multiple sync or async tasks
    };

    init().finally(async () => {
      await BootSplash.hide({fade: true});
      console.log('BootSplash has been hidden successfully');
    });
  }, []);

  return (
    <NavigationContainer>
     <AppNavigator/>
     <Toast/>
    </NavigationContainer>
  );
}

export default App;
