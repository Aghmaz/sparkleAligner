import React, {useEffect, useState, useRef} from 'react';
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
import DatePicker from 'react-native-date-picker';
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
  const [alignersCountChangeModal, setAlignersCountChangeModal] =
    useState<boolean>(false);
  const [aligners, setAligners] = useState<Aligner[]>([]);
  const [selectedAligner, setSelectedAligner] = useState<number | 1>(1);
  const [selectedAlignerDays, setSelectedAlignerDays] = useState<number>(14);
  const [dateEditModal, setDateEditModal] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date('2024-11-25'),
  );
  const [totalAligners, setTotalAligners] = useState(30);
  const [selectedAlignersCount, setSelectedAlignersCount] = useState(29);
  const [prevSelectedDays, setPrevSelectedDays] = useState(selectedAlignerDays);
  const [prevTotalAligners, setPrevTotalAligners] = useState(
    selectedAlignersCount,
  );

  const navigation = useNavigation<NavigationProps>();

  const scrollViewRef = useRef<ScrollView>(null);
  const daysscrollViewRef = useRef<ScrollView>(null);

  const toggleModal = (modalName: string): void => {
    if (modalName === 'daysEditModal') {
      setDaysEditModal(!daysEditModal);
    } else if (modalName === 'alignersCountChangeModal') {
      setAlignersCountChangeModal(!alignersCountChangeModal);
    }
  };

  const toggleDateModal = (): void => {
    setDateEditModal(!dateEditModal);
  };

  const handleAlignersCountConfirm = () => {
    setPrevTotalAligners(selectedAlignersCount);
    setTotalAligners(selectedAlignersCount + 1);
    toggleModal('alignersCountChangeModal');
  };

  const handleAlignersCountCancel = () => {
    setSelectedAlignersCount(prevTotalAligners);
    toggleModal('alignersCountChangeModal');
  };

  const handleDateChange = (_event: any, date: Date | undefined): void => {
    const currentDate = date || new Date('2024-11-25');
    setSelectedDate(currentDate);
    toggleDateModal();
  };

  const handleDaysPress = (day: number): void => {
    setSelectedAlignerDays(day);
  };

  const handleConfirmDaysPress = (): void => {
    const updatedAligners = [...aligners];
    const selectedAlignerIndex = updatedAligners.findIndex(
      aligner => aligner.number === selectedAligner,
    );

    if (selectedAlignerIndex !== -1) {
      const durationSuffix = selectedAlignerDays === 1 ? 'Day' : 'Days';
      updatedAligners[
        selectedAlignerIndex
      ].duration = `${selectedAlignerDays} ${durationSuffix}`;

      const initialDate = selectedDate ?? new Date('2024-11-25');

      for (let i = selectedAlignerIndex; i < totalAligners; i++) {
        const previousEndDate =
          i === 0
            ? initialDate
            : new Date(updatedAligners[i - 1]?.endDateObj || initialDate);

        const duration =
          i === selectedAlignerIndex
            ? selectedAlignerDays
            : parseInt(updatedAligners[i].duration.split(' ')[0]);

        const startDate = new Date(previousEndDate);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + duration);

        updatedAligners[i] = {
          ...updatedAligners[i],
          startDate: startDate.toLocaleDateString(),
          endDate: endDate.toLocaleDateString(),
          startDateObj: startDate,
          endDateObj: endDate,
        };
      }
      setAligners(updatedAligners);
      toggleModal('daysEditModal');
      setPrevSelectedDays(selectedAlignerDays);
    }
  };

  useEffect(() => {
    const initialDate = selectedDate ?? new Date('2024-11-25');
    const alignersData: Aligner[] = [];

    for (let i = 0; i < totalAligners; i++) {
      const previousEndDate =
        i === 0
          ? initialDate
          : new Date(alignersData[i - 1]?.endDateObj || initialDate);
      const duration: number = parseInt(
        aligners[i]?.duration?.split(' ')[0] || '14',
        10,
      );
      const durationSuffix = duration === 1 ? 'Day' : 'Days';
      const startDate: Date = new Date(previousEndDate);
      const endDate: Date = new Date(startDate);
      endDate.setDate(startDate.getDate() + duration);

      alignersData.push({
        number: i + 1,
        duration: `${duration} ${durationSuffix}`,
        startDate: startDate.toLocaleDateString(),
        endDate: endDate.toLocaleDateString(),
        startDateObj: startDate,
        endDateObj: endDate,
      });
    }

    setAligners(alignersData);
  }, [selectedDate, totalAligners]);

  const handleBackNavigation = (): void => {
    navigation.goBack();
  };

  const days: number[] = Array.from({length: 180}, (_, index) => index + 1);

  const alignersCount: number[] = Array.from(
    {length: 150},
    (_, index) => index + 1,
  );

  const handleAlignerSelect = (alignerNumber: number): void => {
    toggleModal('daysEditModal');
    setSelectedAligner(alignerNumber);

    const aligner = aligners.find(aligner => aligner.number === alignerNumber);
    if (aligner) {
      setSelectedAlignerDays(parseInt(aligner.duration.split(' ')[0], 10));
    }
    if (daysscrollViewRef.current) {
      const dayPosition = (selectedAlignerDays - 1) * 37;
      daysscrollViewRef.current.scrollTo({y: dayPosition, animated: true});
    }
  };

  useEffect(() => {
    if (alignersCountChangeModal && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        y: selectedAlignersCount * 37,
        animated: true,
      });
    }
  }, [alignersCountChangeModal]);

  useEffect(() => {
    if (daysEditModal && daysscrollViewRef.current) {
      const dayPosition = (selectedAlignerDays - 1) * 37;
      daysscrollViewRef.current.scrollTo({y: dayPosition, animated: true});
    }
  }, [daysEditModal, selectedAlignerDays]);

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
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={toggleDateModal}
                      style={styles.startDateRow}>
                      <Icons.EDIT style={styles.iconOffset} />
                      <Text style={styles.startDateText}>
                        Start: {aligner.startDate}
                      </Text>
                    </TouchableOpacity>
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
                      <Text
                        onPress={() => toggleModal('alignersCountChangeModal')}
                        style={styles.totalAlignerText}>
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
      {dateEditModal && (
        <DatePicker
          modal
          open={dateEditModal}
          date={selectedDate || new Date('2024-11-25')}
          theme="light"
          onConfirm={date => handleDateChange(null, date)}
          onCancel={toggleDateModal}
          mode="date"
          confirmText="OK"
          cancelText="CANCEL"
          title={'My treatment started on'}
          buttonColor={COLORS.BLUE_DARK}
        />
      )}
      <Modal transparent={true} animationType="slide" visible={daysEditModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              Days for Aligner #{selectedAligner}
            </Text>
            <ScrollView
              showsVerticalScrollIndicator={false}
              ref={daysscrollViewRef}
              style={styles.scrollView}>
              {days.map((day, index) => (
                <TouchableOpacity
                  activeOpacity={0.8}
                  key={index}
                  onPress={() => handleDaysPress(day)}
                  style={[
                    styles.alignTextContainer,
                    selectedAlignerDays === index + 1 && styles.selectedAligner,
                    index === days.length - 1 && {
                      marginBottom: 120,
                    },
                  ]}>
                  <Text style={styles.alignText}>{day}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.btnsConatiner}>
              <Text
                onPress={() => {
                  setSelectedAlignerDays(prevSelectedDays);
                  toggleModal('daysEditModal');
                }}
                style={styles.btnText}>
                CANCEL
              </Text>
              <Text onPress={handleConfirmDaysPress} style={styles.btnText}>
                CONFIRM
              </Text>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        transparent={true}
        animationType="slide"
        visible={alignersCountChangeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              How many aligners in your treatment?
            </Text>
            <ScrollView
              ref={scrollViewRef}
              showsVerticalScrollIndicator={false}
              style={styles.scrollView}>
              {alignersCount.map((alignerCount, index) => (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setSelectedAlignersCount(index)}
                  key={index}
                  style={[
                    styles.alignTextContainer,
                    selectedAlignersCount === index && styles.selectedAligner,
                    index === alignersCount.length - 1 && {
                      marginBottom: 120,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.alignText,
                      selectedAlignersCount === index &&
                        styles.selectedAlignerText,
                      {
                        opacity:
                          selectedAlignersCount === index ||
                          selectedAlignersCount === index + 1 ||
                          selectedAlignersCount === index - 1
                            ? 1
                            : 0.5,
                      },
                    ]}>
                    {alignerCount}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.btnsConatiner}>
              <Text onPress={handleAlignersCountCancel} style={styles.btnText}>
                CANCEL
              </Text>
              <Text onPress={handleAlignersCountConfirm} style={styles.btnText}>
                CONFIRM
              </Text>
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
    paddingBottom: 40,
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
