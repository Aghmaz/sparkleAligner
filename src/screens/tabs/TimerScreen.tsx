import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import COLORS from '../../constraints/colors';
import {Shadow} from 'react-native-shadow-2';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import Icons from '../../assets/icons';

const TimerScreen = () => {
  const fillPercentage = 40;
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <View style={styles.header}>
          <Icons.MENU />
          <Text style={styles.headerTitle}>Timer</Text>
          <Icons.FAQ />
        </View>
        <View style={styles.daysLeftContainer}>
          <Icons.SYNC />
          <Text style={styles.daysLeftText}>13 more days on Aligner #1</Text>
        </View>
        <View style={styles.circularProgressContainer}>
          <AnimatedCircularProgress
            size={340}
            width={25}
            fill={fillPercentage}
            tintColor={COLORS.GRAY_LIGHT}
            backgroundColor={COLORS.GRAY}
            childrenContainerStyle={styles.circularProgressChildrenContainer}
            children={() => (
              <View style={styles.circularProgressInnerContent}>
                <Text style={styles.notWearingText}>Not Wearing</Text>
                <View style={styles.alignInfoContainer}>
                  <Icons.ALIGN />
                  <Text style={styles.alignText}>SPARKLE ALIGN</Text>
                </View>
                <Text style={styles.timerText}>10:25</Text>
                <Text style={styles.outText}>Out 00 00</Text>
              </View>
            )}
          />
          <View style={styles.circleProgressIndicator}>
            <View style={styles.progressIndicatorLine} />
            <Text style={styles.progressIndicatorText}>20</Text>
          </View>
        </View>
        <View style={styles.daysToSmileContainer}>
          <Icons.CALENDER />
          <Text style={styles.daysToSmileText}>
            419 days to a perfect smile!
          </Text>
        </View>
      </View>
      <Shadow containerStyle={styles.shadowContainer}>
        <View style={styles.shadowButton}>
          <Icons.WRENCH />
        </View>
      </Shadow>
    </SafeAreaView>
  );
};

export default TimerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontFamily: 'Roboto-Regular',
    fontSize: 20,
    color: COLORS.BLACK,
  },
  daysLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'center',
    paddingTop: 50,
  },
  daysLeftText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 20,
    color: COLORS.BLACK,
  },
  circularProgressContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 25,
  },
  circularProgressChildrenContainer: {
    backgroundColor: COLORS.PINK,
  },
  circularProgressInnerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  notWearingText: {
    fontFamily: 'Roboto-Bold',
    fontSize: 17,
    color: COLORS.BROWN,
  },
  alignInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingTop: 40,
  },
  alignText: {
    fontFamily: 'Roboto-Bold',
    fontSize: 17,
    color: COLORS.BLUE_LIGHT,
  },
  timerText: {
    fontFamily: 'Roboto-Bold',
    fontSize: 70,
    color: COLORS.BLACK_LIGHT,
  },
  outText: {
    fontFamily: 'Roboto-Bold',
    fontSize: 27,
    color: COLORS.BROWN,
  },
  circleProgressIndicator: {
    gap: 6,
    alignItems: 'center',
    flexDirection: 'row',
    transform: [{rotate: '45deg'}],
    position: 'absolute',
    bottom: '90%',
    left: '-16%',
  },
  progressIndicatorLine: {
    height: 4,
    width: 35,
    backgroundColor: COLORS.BROWN,
    marginLeft: 125,
  },
  progressIndicatorText: {
    fontFamily: 'Roboto-Black',
    fontSize: 15,
    color: COLORS.BROWN,
    top: 3,
  },
  daysToSmileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'center',
    paddingTop: 25,
  },
  daysToSmileText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 20,
    color: COLORS.BLACK,
  },
  shadowContainer: {
    position: 'absolute',
    bottom: '9%',
    right: '5%',
  },
  shadowButton: {
    height: 50,
    width: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.SKY_LIGHT,
  },
});
