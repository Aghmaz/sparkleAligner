import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Shadow} from 'react-native-shadow-2';
import COLORS from '../../constraints/colors';
import Icons from '../../assets/icons';

const CameraScreen = () => {
  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.bottomContainer}>
        <TouchableOpacity activeOpacity={0.8} style={styles.iconRow}>
          <Text style={styles.textLabel}>Take Photo</Text>
          <Shadow>
            <View style={styles.iconButtonContainer}>
              <Icons.CAMERASKYBLUE />
            </View>
          </Shadow>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.8} style={styles.iconRow}>
          <Text style={styles.textLabel}>Choose from Library</Text>
          <Shadow>
            <View style={styles.iconButtonContainer}>
              <Icons.LIBRARY />
            </View>
          </Shadow>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CameraScreen;

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    justifyContent: 'flex-end',
  },
  bottomContainer: {
    gap: 40,
    alignItems: 'flex-end',
    position: 'absolute',
    bottom: '10%',
    right: '7%',
  },
  iconRow: {
    gap: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textLabel: {
    fontFamily: 'Roboto-Bold',
    fontSize: 17,
    color: COLORS.BLACK,
  },
  iconButtonContainer: {
    height: 45,
    width: 45,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
