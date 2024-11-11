import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import COLORS from '../constraints/colors';

const FirstScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../assets/images/BG.jpg')}
        resizeMode="cover"
        style={styles.BG}
      />
      <View
        style={{
          backgroundColor: 'red',
          padding: 20,
          position: 'absolute',
          top: '75%',
          alignSelf: 'center',
        }}>
        <Image
          source={require('../assets/images/onboard/Profile.jpeg')}
          resizeMode="cover"
          style={styles.onboardImage}
        />
      </View>
    </SafeAreaView>
  );
};
// kia me apny laptop pr krlu phr bd m ios pr check krlengy?
// sure go ahead Thanks give me a repo link
// i didn't push that code on repo can u push it?let me 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  onboardImage: {
    height: 150,
    width: 150,
    borderRadius: 100,
  },
  title: {},
  BG: {
    height: '70%',
    width: '100%',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
});
export default FirstScreen;
