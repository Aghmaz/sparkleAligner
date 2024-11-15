import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import COLORS from '../../constraints/colors';
import Icons from '../../assets/icons';

interface Aligner {
  number: number;
  duration: string;
  startDate: string;
  endDate: string;
  startDateObj: Date;
  endDateObj: Date;
}

type NavigationProps = NavigationProp<any>;

const AdjustCurrentTreatment: React.FC = () => {
  const [daysEditModal, setDaysEditModal] = useState<boolean>(false);
  const [aligners, setAligners] = useState<Aligner[]>([]);
  const [selectedAligner, setSelectedAligner] = useState<number | 2>(2);

  const totalAligners: number = 30;

  const navigation = useNavigation<NavigationProps>();

  const toggleDaysEditModal = (): void => {
    setDaysEditModal(!daysEditModal);
  };

  useEffect(() => {
    const initialStartDate: Date = new Date('2024-11-11');
    const alignersData: Aligner[] = [];

    for (let i = 0; i < totalAligners; i++) {
      const previousEndDate =
        i === 0 ? initialStartDate : new Date(alignersData[i - 1].endDateObj);
      const duration: number = 14;
      const startDate: Date = new Date(previousEndDate);
      const endDate: Date = new Date(startDate);
      endDate.setDate(startDate.getDate() + duration);

      alignersData.push({
        number: i + 1,
        duration: `${duration} Days`,
        startDate: startDate.toLocaleDateString(),
        endDate: endDate.toLocaleDateString(),
        startDateObj: startDate,
        endDateObj: endDate,
      });
    }

    setAligners(alignersData);
  }, []);

  const handleBackNavigation = (): void => {
    navigation.goBack();
  };

  const days: number[] = Array.from({length: 180}, (_, index) => index + 1);

  const handleAlignerSelect = (alignerNumber: number): void => {
    toggleDaysEditModal();
    setSelectedAligner(prevSelected =>
      prevSelected === alignerNumber ? 2 : alignerNumber,
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackNavigation} activeOpacity={0.8}>
          <Icons.CROSS />
        </TouchableOpacity>
        <Text style={styles.headerText}>Adjust Treatment</Text>
        <TouchableOpacity onPress={handleBackNavigation} activeOpacity={0.8}>
          <Icons.TICK />
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{paddingBottom: 20}}>
          {aligners.map((aligner, index) => (
            <View key={aligner.number} style={styles.contentContainer}>
              <View style={styles.dateRow}>
                {!(index === aligners.length - 1) ? (
                  <Text style={styles.dateText}>{aligner.endDate}</Text>
                ) : null}
                <View style={styles.alignerContainer}>
                  {index === 0 ? (
                    <View style={styles.startDateRow}>
                      <Icons.EDIT style={styles.iconOffset} />
                      <Text style={styles.startDateText}>
                        Start: {aligner.startDate}
                      </Text>
                    </View>
                  ) : null}
                  <View>
                    <TouchableOpacity
                      onPress={() => handleAlignerSelect(aligner.number)}
                      activeOpacity={0.8}
                      style={[
                        styles.alignerInfo,
                        {
                          borderTopLeftRadius: index === 0 ? 25 : 0,
                          borderTopRightRadius: index === 0 ? 25 : 0,
                          borderBottomLeftRadius:
                            index === aligners.length - 1 ? 25 : 0,
                          borderBottomRightRadius:
                            index === aligners.length - 1 ? 25 : 0,
                          backgroundColor:
                            selectedAligner === aligner.number
                              ? COLORS.SKYBLUE
                              : COLORS.GRAY,
                        },
                      ]}>
                      <Text style={styles.alignerNumber}>
                        Aligner #{aligner.number}
                      </Text>
                      <Text style={styles.alignerDuration}>
                        {aligner.duration}
                      </Text>
                    </TouchableOpacity>
                    <View style={styles.editIconContainer}>
                      <Icons.EDIT />
                    </View>
                  </View>
                  {index === aligners.length - 1 ? (
                    <View style={styles.totalAlignerContainer}>
                      <Icons.EDIT style={{top: 2}} />
                      <Text style={styles.totalAlignerText}>
                        Total: {totalAligners} Aligners
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>
              {!(index === aligners.length - 1) ? (
                <View style={styles.progressBar} />
              ) : null}
            </View>
          ))}
        </View>
      </ScrollView>
      <Modal transparent={true} animationType="slide" visible={daysEditModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              Days for Aligner #{selectedAligner}
            </Text>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={styles.scrollView}>
              {days.map((day, index) => (
                <TouchableOpacity
                  activeOpacity={0.8}
                  key={index}
                  style={styles.alignTextContainer}>
                  <Text style={styles.alignText}>{day}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.btnsConatiner}>
              <Text onPress={toggleDaysEditModal} style={styles.btnText}>
                CANCEL
              </Text>
              <Text style={styles.btnText}>CONFIRM</Text>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default AdjustCurrentTreatment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  headerText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 20,
    color: COLORS.BLACK,
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    gap: 20,
  },
  dateText: {
    fontFamily: 'Roboto-Bold',
    fontSize: 13,
    color: COLORS.BLACK,
    bottom: '-6%',
  },
  alignerContainer: {
    width: '70%',
  },
  startDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 30,
    paddingBottom: 10,
    alignSelf: 'center',
    marginLeft: -5,
  },
  iconOffset: {
    top: 2,
  },
  startDateText: {
    fontFamily: 'Roboto-Bold',
    fontSize: 17,
    color: COLORS.BLACK,
  },
  alignerInfo: {
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  alignerNumber: {
    fontFamily: 'Roboto-Bold',
    fontSize: 17,
    color: COLORS.BLACK,
  },
  alignerDuration: {
    fontFamily: 'Roboto-Bold',
    fontSize: 17,
    color: COLORS.BLACK,
  },
  editIconContainer: {
    position: 'absolute',
    top: '10%',
    right: '6%',
  },
  progressBar: {
    width: '73%',
    height: 3,
    backgroundColor: COLORS.BLUE_DARK,
    alignSelf: 'flex-end',
  },
  totalAlignerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingTop: 10,
    alignSelf: 'center',
  },
  totalAlignerText: {
    fontFamily: 'Roboto-Bold',
    fontSize: 17,
    color: COLORS.BLACK,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: COLORS.WHITE,
    borderRadius: 25,
  },
  modalTitle: {
    fontFamily: 'Roboto-Medium',
    fontSize: 20,
    color: COLORS.BLACK,
    borderBottomWidth: 1,
    borderColor: COLORS.GRAY_LIGHT,
    paddingBottom: 15,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  scrollView: {
    height: 170,
    paddingTop: 70,
  },
  alignTextContainer: {
    alignItems: 'center',
  },
  alignText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 20,
    color: COLORS.GRAY_DARK,
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
    color: COLORS.BLUE_DARK,
  },
});
