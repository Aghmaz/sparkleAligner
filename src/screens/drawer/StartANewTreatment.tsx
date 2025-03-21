// src/screens/drawer/StartANewTreatment.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Modal,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Shadow } from 'react-native-shadow-2';
import { useNavigation } from '@react-navigation/native';
import CheckBox from 'react-native-check-box';
import { useTheme } from '../../theme/themeManagement';
import LightTheme from '../../theme/LightTheme';
import DarkTheme from '../../theme/DarkTheme';
import COLORS from '../../constraints/colors';
import Icons from '../../assets/icons';

const StartANewTreatment: React.FC = () => {
  const { theme } = useTheme();
  const currentTheme = theme === 'light' ? LightTheme : DarkTheme;

  const [activeStep, setActiveStep] = useState<number>(0);
  const [isDeleteDataChecked, setIsDeleteDataChecked] = useState<boolean>(false);
  const [isDeletePhotosChecked, setIsDeletePhotosChecked] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [totalAlignersCount, setTotalAlignersCount] = useState(30);
  const [prevTotalAlignersCount, setPrevTotalAlignersCount] = useState(totalAlignersCount);

  const scrollViewRef = useRef<ScrollView>(null);

  const navigation = useNavigation();

  const nextStep = (): void => {
    if (activeStep === 6) {
      navigation.goBack();
    } else if (activeStep >= 0) {
      setActiveStep(activeStep + 1);
    }
  };

  const alignersCount: number[] = Array.from({ length: 150 }, (_, index) => index + 1);

  const alignerDays: number[] = Array.from({ length: 180 }, (_, index) => index + 1);

  const treatmentValues: string[] = Array.from({ length: 3 }, (_, index) => {
    const themes = [
      '3D Predict',
      '3D Smile',
      '3M Clarity',
      'Active Aligners',
      'Angel Align',
      'Candid',
      'Clear Diamond',
      'ClearCorrect',
      'CristaLine Aligners',
      'Crystal Clear Aligners',
      'Custom "A"ligners',
      'Dentist Malaya Clear Aligner',
      'Digiortho',
      'Easy Smile',
      'eCligner',
      'Econ Aligner',
      'Fixalign',
      'I-Align',
      'Insignia Clearguide',
      'Invisalign',
      'jerushaligne',
      'LIne-M-Up',
      'LovmySmile',
      'Myaligner',
      'NU Smile Aligner',
      'Orthero',
      'Orthly',
      'OrthoAlign',
      'Orthoclear',
      'Others',
      'Othocaps',
      'Perfect Fit',
      'Precisalign',
      'SLX',
      'Smartee',
      'SmileCode',
      'SmileDirectClub',
      'Smilelove',
      'Spark',
      'StarSmiles',
      'SureSmile',
      'UGrin',
      'Uniform Teeth',
    ];
    return themes[index % themes.length];
  });

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleTotalAlignersCountConfirm = () => {
    setPrevTotalAlignersCount(totalAlignersCount);
    setTotalAlignersCount(totalAlignersCount);
    toggleModal();
  };

  const handleTotalAlignersCountCancel = () => {
    setTotalAlignersCount(prevTotalAlignersCount);
    toggleModal();
  };

  const setupText =
    activeStep === 0
      ? "Let's go through a few steps to set up your new treatment."
      : activeStep === 1
      ? 'Type of clear aligner for your treatment'
      : activeStep === 2
      ? 'Total number of aligners'
      : activeStep === 3
      ? 'Number of days to wear each aligner'
      : activeStep === 4
      ? 'Your current aligner number'
      : activeStep === 5
      ? 'Number of days you have been wearing your current aligner'
      : 'Remind me to switch aligners at';

  useEffect(() => {
    if (modalVisible && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        y: (totalAlignersCount - 1.5) * 37,
        animated: true,
      });
    }
  }, [modalVisible]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
      <Image
        resizeMode="cover"
        source={require('../../assets/images/onboard/BG.webp')}
        style={styles.backgroundImage}
      />
      <Text style={[styles.appText, { color: currentTheme.colors.text }]}>SPARKLE ALIGNER</Text>
      <Shadow distance={5} containerStyle={styles.shadowWrapper}>
        <View
          style={{
            backgroundColor: currentTheme.colors.background,
            borderRadius: 12,
            width: Dimensions.get('screen').width / 1.1,
            height: Dimensions.get('screen').width / 1.6,
          }}>
          <Text style={{ paddingVertical: 100 }} />
        </View>
      </Shadow>
      <View style={[styles.bottomContainer, { backgroundColor: currentTheme.colors.background }]}>
        {activeStep === 0 ? (
          <>
            <Text style={[styles.setupText, { color: currentTheme.colors.text }]}>
              Let's go through a few steps to set up your new treatment.
            </Text>
            <View style={styles.checkboxContainer}>
              <View style={styles.checkboxRow}>
                <CheckBox
                  onClick={() => setIsDeleteDataChecked(!isDeleteDataChecked)}
                  isChecked={isDeleteDataChecked}
                  checkBoxColor={currentTheme.colors.tabbarActiveColor}
                  style={styles.checkbox}
                />
                <Text style={[styles.checkboxLabel, { color: currentTheme.colors.text }]}>Delete all data</Text>
              </View>
              <View style={styles.checkboxRow}>
                <CheckBox
                  onClick={() => setIsDeletePhotosChecked(!isDeletePhotosChecked)}
                  isChecked={isDeletePhotosChecked}
                  checkBoxColor={currentTheme.colors.tabbarActiveColor}
                  style={styles.checkbox}
                />
                <Text style={[styles.checkboxLabel, { color: currentTheme.colors.text }]}>Delete all photos</Text>
              </View>
            </View>
          </>
        ) : (
          <>
            <Text style={[styles.setupText, { color: currentTheme.colors.text }]}>{setupText}</Text>
            <TouchableOpacity
              onPress={toggleModal}
              activeOpacity={0.8}
              style={styles.alignerInfoContainer}>
              {activeStep === 6 ? (
                <Icons.ALARM
                  height={20}
                  width={20}
                  style={styles.alignerIcon}
                />
              ) : (
                <Icons.EDIT height={20} width={20} style={styles.alignerIcon} />
              )}
              <Text style={[styles.alignerName, { color: currentTheme.colors.text }]}>
                {' '}
                {activeStep === 1
                  ? 'Invisalign'
                  : activeStep === 2
                  ? `${totalAlignersCount}`
                  : activeStep === 3
                  ? '14'
                  : activeStep === 4
                  ? '1'
                  : activeStep === 5
                  ? '0'
                  : '10:00 PM'}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
      <View style={styles.paginationContainer}>
        {[...Array(7)].map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              {
                backgroundColor:
                  index === activeStep ? currentTheme.colors.tabbarActiveColor : COLORS.GRAY,
              },
            ]}
          />
        ))}
      </View>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={nextStep}
        style={{
          paddingHorizontal: 20,
          borderRadius: 8,
          backgroundColor: currentTheme.colors.tabbarActiveColor,
          justifyContent: 'center',
          alignItems: 'center',
          marginHorizontal: 40,
          position: 'absolute',
          width: '80%',
          alignSelf: 'center',
          bottom: '8%',
          paddingVertical: 15,
        }}>
        <Text style={[styles.nextText, { color: currentTheme.colors.text }]}>
          {activeStep === 6 ? 'Done' : 'Next'}
        </Text>
      </TouchableOpacity>
      <Modal transparent={true} animationType="slide" visible={modalVisible}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: currentTheme.colors.background }]}>
            <Text style={[styles.modalTitle, { color: currentTheme.colors.text }]}>{setupText}</Text>
            <ScrollView
              ref={scrollViewRef}
              showsVerticalScrollIndicator={false}
              style={styles.scrollView}>
              {(activeStep === 2 ? alignersCount : alignerDays).map(
                (alignerCount, index) => (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setTotalAlignersCount(index + 1)}
                    key={index}
                    style={[
                      styles.alignTextContainer,
                      totalAlignersCount === index + 1 &&
                        styles.selectedAligner,
                      index ===
                        (activeStep === 2 ? alignersCount : alignerDays)
                          .length - 1 && {
                        marginBottom: 120,
                      },
                    ]}>
                    <Text
                      style={[
                        styles.alignText,
                        { color: currentTheme.colors.text },
                        totalAlignersCount === index + 1 &&
                          styles.selectedAlignerText,
                        {
                          opacity:
                            totalAlignersCount === index + 1 ||
                            totalAlignersCount === index + 1 + 1 ||
                            totalAlignersCount === index + 1 - 1
                              ? 1
                              : 0.5,
                        },
                      ]}>
                      {alignerCount}
                    </Text>
                  </TouchableOpacity>
                ),
              )}
            </ScrollView>
            <View style={styles.btnsConatiner}>
              <Text
                onPress={handleTotalAlignersCountCancel}
                style={[styles.btnText, { color: currentTheme.colors.text }]}>
                CANCEL
              </Text>
              <Text
                onPress={handleTotalAlignersCountConfirm}
                style={[styles.btnText, { color: currentTheme.colors.text }]}>
                CONFIRM
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default StartANewTreatment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    height: '70%',
    width: '100%',
    borderBottomLeftRadius: 80,
    borderBottomRightRadius: 80,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '85%',
    borderRadius: 25,
  },
  modalTitle: {
    fontFamily: 'Roboto-Medium',
    fontSize: 20,
    borderBottomWidth: 1,
    borderColor: COLORS.GRAY_LIGHT,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  scrollView: {
    height: 200,
    paddingTop: 70,
  },
  alignTextContainer: {
    alignItems: 'center',
  },
  alignText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 20,
    paddingBottom: 10,
  },
  selectedAligner: {
    backgroundColor: COLORS.GRAY,
    paddingTop: 7,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  selectedAlignerText: {
    color: COLORS.BLACK,
  },
  btnsConatiner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 30,
    padding: 30,
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderColor: COLORS.GRAY_LIGHT,
    marginTop: 15,
  },
  btnText: {
    fontFamily: 'Roboto-Bold',
    fontSize: 14,
  },
  appText: {
    fontSize: 25,
    position: 'absolute',
    top: '18%',
    width: '50%',
    textAlign: 'center',
    alignSelf: 'center',
    fontFamily: '20db',
  },
  shadowWrapper: {
    alignSelf: 'center',
    bottom: '25%',
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingVertical: 25,
    borderRadius: 12,
    position: 'absolute',
    bottom: '25%',
    width: '90%',
    alignSelf: 'center',
    height: '30%',
  },
  setupText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 20,
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
  },
  alignerInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  alignerIcon: {
    marginRight: 10,
  },
  alignerName: {
    fontFamily: 'Roboto-Medium',
    fontSize: 20,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  nextText: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
  },
});