import React, {useState} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import CheckBox from 'react-native-check-box';
import COLORS from '../../constraints/colors';
import Icons from '../../assets/icons';

const StartANewTreatment: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isDeleteDataChecked, setIsDeleteDataChecked] =
    useState<boolean>(false);
  const [isDeletePhotosChecked, setIsDeletePhotosChecked] =
    useState<boolean>(false);

  const navigation = useNavigation();

  const nextStep = (): void => {
    if (activeStep === 6) {
      navigation.goBack();
    } else if (activeStep >= 0) {
      setActiveStep(activeStep + 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Image
          resizeMode="cover"
          source={require('../../assets/images/onboard/BG.jpg')}
          style={styles.backgroundImage}
        />
        {activeStep === 0 && (
          <View style={styles.overlay}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}>
              <Icons.CROSSWHITE style={styles.closeIcon} />
            </TouchableOpacity>
            <Text style={styles.welcomeText}>Welcome</Text>
          </View>
        )}
      </View>
      <View
        style={[
          styles.bottomContainer,
          {height: activeStep === 0 ? '60%' : '75%'},
        ]}>
        {activeStep === 0 ? (
          <>
            <Text style={styles.setupText}>
              Let's go through a few steps to set up your new treatment.
            </Text>
            <View style={styles.checkboxContainer}>
              <View style={styles.checkboxRow}>
                <CheckBox
                  onClick={() => setIsDeleteDataChecked(!isDeleteDataChecked)}
                  isChecked={isDeleteDataChecked}
                  checkBoxColor={COLORS.SKYBLUE}
                  style={styles.checkbox}
                />
                <Text style={styles.checkboxLabel}>Delete all data</Text>
              </View>
              <View style={styles.checkboxRow}>
                <CheckBox
                  onClick={() =>
                    setIsDeletePhotosChecked(!isDeletePhotosChecked)
                  }
                  isChecked={isDeletePhotosChecked}
                  checkBoxColor={COLORS.SKYBLUE}
                  style={styles.checkbox}
                />
                <Text style={styles.checkboxLabel}>Delete all photos</Text>
              </View>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.alignerTypeText}>
              {activeStep === 1
                ? 'Type of clear aligner for your treatment'
                : activeStep === 2
                ? 'Total number of aligners'
                : activeStep === 3
                ? 'Number of days to wear each aligner'
                : activeStep === 4
                ? 'Your current aligner number'
                : activeStep === 5
                ? 'Number of days you have been wearing your current aligner'
                : 'Remind me to switch aligners at'}
            </Text>
            <View style={styles.alignerInfoContainer}>
              {activeStep === 6 ? (
                <Icons.ALARM
                  height={25}
                  width={25}
                  style={styles.alignerIcon}
                />
              ) : (
                <Icons.EDIT height={25} width={25} style={styles.alignerIcon} />
              )}
              <Text style={styles.alignerName}>
                {' '}
                {activeStep === 1
                  ? 'Invisalign'
                  : activeStep === 2
                  ? '30'
                  : activeStep === 3
                  ? '14'
                  : activeStep === 4
                  ? '1'
                  : activeStep === 5
                  ? '0'
                  : '10:00 PM'}
              </Text>
            </View>
          </>
        )}
        <View style={styles.actionButtonsContainer}>
          <Text style={styles.cancelText}>Cancel</Text>
          <View style={styles.paginationContainer}>
            {[...Array(7)].map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  {
                    backgroundColor:
                      index === activeStep ? COLORS.SKYBLUE : COLORS.GRAY,
                  },
                ]}
              />
            ))}
          </View>
          <Text onPress={nextStep} style={styles.nextText}>
            {activeStep === 6 ? 'Done' : 'Next'}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default StartANewTreatment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  backgroundImage: {
    height: '85%',
    width: '100%',
  },
  overlay: {
    position: 'absolute',
    paddingHorizontal: 20,
    gap: 40,
    width: '100%',
    paddingTop: 40,
  },
  closeIcon: {
    alignSelf: 'flex-end',
  },
  welcomeText: {
    fontFamily: '20db',
    fontSize: 25,
    color: COLORS.WHITE,
    textAlign: 'center',
  },
  bottomContainer: {
    backgroundColor: COLORS.WHITE,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  setupText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 35,
    color: COLORS.BLACK,
    width: '90%',
    alignSelf: 'center',
    textAlign: 'center',
  },
  checkboxContainer: {
    paddingTop: 50,
    gap: 30,
    paddingHorizontal: 50,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  checkbox: {
    top: 2,
  },
  checkboxLabel: {
    fontFamily: 'Roboto-Medium',
    fontSize: 20,
    color: COLORS.BLACK,
  },
  alignerTypeText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 35,
    color: COLORS.BLACK,
    alignSelf: 'center',
    textAlign: 'center',
  },
  alignerInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    alignSelf: 'center',
    paddingTop: 150,
  },
  alignerIcon: {
    top: 2,
  },
  alignerName: {
    fontFamily: 'Roboto-Medium',
    fontSize: 30,
    color: COLORS.BLACK,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 110,
    paddingHorizontal: 30,
    position: 'absolute',
    width: '100%',
    alignSelf: 'center',
    bottom: '5%',
  },
  cancelText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 17,
    color: COLORS.BLACK,
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  paginationDot: {
    height: 8,
    width: 8,
    borderRadius: 5,
  },
  nextText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 17,
    color: COLORS.BLACK,
  },
});
