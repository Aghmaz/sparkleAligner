import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import COLORS from '../../constraints/colors';
import Icons from '../../assets/icons';

type NavigationProps = NavigationProp<any>;

const FAQ = () => {
  const navigation = useNavigation<NavigationProps>();
  const handleBackNavigation = (): void => {
    navigation.goBack();
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text></Text>
        <Text style={styles.headerText}>Frequently Asked Questions</Text>
        <TouchableOpacity onPress={handleBackNavigation} activeOpacity={0.8}>
          <Icons.TICK />
        </TouchableOpacity>
      </View>
      <View style={styles.faqContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{paddingVertical: 30}}>
            <Text style={styles.sectionTitle}>Reminders & Notifications</Text>
            <Text style={styles.questionText}>
              Will Sparkle Align remind me to switch to a new aligner?
            </Text>
            <Text style={styles.answerText}>
              Yes, you will get a notification with sound to switch to your new
              aligner. You can also choose the time of the day to be reminded.
              Go to Settings and turn on the "Remind Me to Switch Aligners."
            </Text>
            <Text style={styles.questionText}>
              Can I add a doctor's appointment and set a reminder for it?
            </Text>
            <Text style={styles.answerText}>
              Yes, on the Calendar tab, select the day and tap the "+" on the
              lower right hand corner and select "Ortho Appointment."
            </Text>
            <Text style={styles.questionText}>
              Can I add a note to a day (e.g. to document any special
              circumstances)?
            </Text>
            <Text style={styles.answerText}>
              Yes, on the Calendar tab, select the day and tap the "+" on the
              lower right hand corner and select "Notes."
            </Text>
            <Text style={styles.questionText}>
              Why am I not getting any sounds with the notification?
            </Text>
            <Text style={styles.answerText}>
              Please make sure the phone is not on mute or in Do Not Disturb
              mode.
            </Text>
            <Text style={styles.questionText}>
              What if I miss the notification to put my aligners back in?
            </Text>
            <Text style={styles.answerText}>
              Sparkle Align will send you four notifications to replace your
              aligners: once when it's time, and then 5, 15, and 30 minutes
              later.
            </Text>
            <Text style={[styles.sectionTitle, styles.lastSection]}>
              Timer & Stats
            </Text>
            <Text style={styles.questionText}>
              I forgot to "start" or "pause" the timer. Can I edit it?
            </Text>
            <Text style={styles.answerText}>
              Yes, on the Calendar tab, tap on the day you want to adjust,
              select the "+" on the upper right hand corner and select "Wear
              Time." From there, you can manually enter the time you put on and
              took off your aligners.
            </Text>
            <Text style={styles.questionText}>
              Does the timer drain my battery when running in the background?
            </Text>
            <Text style={styles.answerText}>
              Sparkle Align only uses the "on" and "off" time to compute the
              total wear time. It's not a constantly running timer and doesn't
              use any power when running in the background.
            </Text>
            <Text style={styles.questionText}>
              Will Sparkle Align remind me to put my aligner back in after meals
              and snacks?
            </Text>
            <Text style={styles.answerText}>
              Yes, press the pause button on the timer every time you remove
              your aligners and select the number of minutes you want Sparkle
              Align to notify you to put your aligners back on.
            </Text>
            <Text style={styles.questionText}>
              Is there a way to see how much time, e.g. for eating, I have left
              in each day?
            </Text>
            <Text style={styles.answerText}>
              Yes, under the timer, you'll see "Out 00:00" which will tell you
              how long your aligners have been out for the day. Can I view my
              average daily wear stats?
            </Text>
            <Text style={styles.questionText}>
              Can i view my average daily wear stats?
            </Text>
            <Text style={styles.answerText}>
              Yes, go to the My Stats tab. From there, you can share your stats
              via text, email, or other apps. You can also see the total number
              of hours you have worn each aligner.
            </Text>
            <Text style={styles.questionText}>
              Why is it not showing the per aligner wear time for some aligners?
            </Text>
            <Text style={styles.answerText}>
              Please make sure that you've specified which day you started each
              aligner. On the Calendar tab, click on the day you switched
              aligners, select the "+" on the lower right hand corner and select
              "Aligner Switch." Please note that any data entered prior to the
              current treatment will not be taken into consideration when
              computing the per aligner wear time.
            </Text>
            <Text style={styles.questionText}>
              What do the colors mean on the calendar? How many hours do I have
              to wear my aligners to get a green?
            </Text>
            <Text style={styles.answerText}>
              By default, Green = 20 hours/day or more of wear time, Yellow = 18
              hours/day or more of wear time, Red = fewer than 18 hrs/day of
              wear time. You can also adjust these by choosing "Set Daily Goal"
              in the Settings menu.
            </Text>
            <Text style={styles.questionText}>
              What happens when there is a time change due to daylight saving?
            </Text>
            <Text style={styles.answerText}>
              Sparkle Align works with daylight saving time changes. Your daily
              goal will also be adjusted automatically on the day when daylight
              saving time starts/ends to accommodate the longer/shorter day.
            </Text>
            <Text style={styles.questionText}>
              Does Sparkle Align work if I travel to a different time zone?
            </Text>
            <Text style={styles.answerText}>
              Yes, Sparkle Align will automatically adjust the time based on the
              time zone you're currently in.
            </Text>
            <Text style={styles.questionText}>
              How do I change the start of the week to Sunday/Monday?
            </Text>
            <Text style={styles.answerText}>
              Sparkle Align will automatically use the locale setting of your
              phone to determine the first day the week. You can also manually
              change it by selecting "Start Week On' in the Settings menu.
            </Text>
            <Text style={[styles.sectionTitle, styles.lastSection]}>
              Treatment Changes
            </Text>
            <Text style={styles.questionText}>
              I need a refinement/extra aligners. How can I reset the
              parameters?
            </Text>
            <Text style={styles.answerText}>
              Go to the side menu and select "Start a New Treatment" to enter
              the new parameters.
            </Text>
            <Text style={styles.questionText}>
              Will I lose my records & pictures if I start a new treatment?
            </Text>
            <Text style={styles.answerText}>
              No, all your records and pictures will remain after starting a new
              treatment. The Calendar tab will fade out days outside of the
              current treatment.
            </Text>
            <Text style={styles.questionText}>
              Can I adjust the number of days to wear each aligner
              mid-treatment? What if I skipped an aligner or had to wear an
              aligner longer than expected?
            </Text>
            <Text style={styles.answerText}>
              Go to the side menu and select "Adjust Current Treatment." Tap on
              the specific aligner to adjust the number of days to wear. You can
              even skip the aligner if needed.
            </Text>
            <Text style={[styles.sectionTitle, styles.lastSection]}>
              Teeth Selfies
            </Text>
            <Text style={styles.questionText}>
              Is there a limit to the number of pictures I can take?
            </Text>
            <Text style={styles.answerText}>
              There is no limit to the number of pictures you can take. You are
              only limited by the storage capacity of your phone.
            </Text>
            <Text style={styles.questionText}>
              Can I import existing teeth selfies into Sparkle Align?
            </Text>
            <Text style={styles.answerText}>
              In the Teeth Selfie tab, tap the "+" icon on the lower right hand
              corner and select "Choose from Library." You can label the teeth
              selfie with the aligner number by selecting the pencil and tapping
              on the aligner number.
            </Text>
            <Text style={styles.questionText}>
              Can I horizontally flip my teeth selfie?
            </Text>
            <Text style={styles.answerText}>
              Yes, tap the pencil icon at the bottom of the picture and select
              the mirror image icon on the upper left hand corner.
            </Text>
            <Text style={styles.questionText}>
              I didn't align my teeth perfectly when taking a selfie? Can I edit
              it?
            </Text>
            <Text style={styles.answerText}>
              Yes, you can edit the picture after you take it. Tap the pencil
              icon at the bottom of the picture to edit or the trash icon to
              delete. You can also adjust the brightness, contrast and color
              saturation.
            </Text>
            <Text style={styles.questionText}>
              Can I share my teeth selfies?
            </Text>
            <Text style={styles.answerText}>
              Yes, you can share your selfie via email or text by tapping the
              share icon at the bottom of the picture.
            </Text>
            <Text style={styles.questionText}>
              Can I compare two different teeth selfies?
            </Text>
            <Text style={styles.answerText}>
              Yes, select the comparison icon at the bottom of the picture.
            </Text>
            <Text style={[styles.sectionTitle, styles.lastSection]}>
              Others
            </Text>
            <Text style={styles.questionText}>
              Does Sparkle Align support Apple Watch?
            </Text>
            <Text style={styles.answerText}>
              Yes, the Apple Watch app is available for purchase for a one time
              fee of $1.99. Tap "Apple Watch Sync" from the side menu.
            </Text>
            <Text style={styles.questionText}>
              Why is the data not synced between my iPhone & Apple Watch?
            </Text>
            <Text style={styles.answerText}>
              Sparkle Align uses iCloud to sync data between iPhone and Apple
              Watch. Please make sure that you're logged into iCloud and that
              "iCloud Drive" and "Sparkle Align" are enabled in your iCloud
              settings. You'll also need a small amount of iCloud space (less
              than 1 MB) for the synchronization to work.
            </Text>
            <Text style={styles.questionText}>
              How do I keep all my records and photos if I'm switching to a new
              phone?
            </Text>
            <Text style={styles.answerText}>
              Use the "Backup to Cloud" function to automatically or manually
              backup your data, then restore the data to your new phone using
              the same account.
            </Text>
            <Text style={styles.questionText}>Can I remove the ads?</Text>
            <Text style={styles.answerText}>
              Yes, go to side menu and tap on "Remove Ads."
            </Text>
            <Text style={styles.questionText}>
              Does Sparkle Align support Android Wear?
            </Text>
            <Text style={styles.answerText}>
              Not yet, but we're working on adding Android Wear in the near
              future, so stay tuned!
            </Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default FAQ;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingTop: 30,
    paddingBottom: 20,
  },
  headerText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 20,
    color: COLORS.BLACK,
  },
  faqContainer: {
    flex: 1,
    backgroundColor: COLORS.BLACK,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontFamily: 'Roboto-Bold',
    color: COLORS.WHITE,
    fontSize: 20,
  },
  lastSection: {
    paddingTop: 40,
  },
  questionText: {
    fontFamily: 'Roboto-Medium',
    color: COLORS.WHITE,
    fontSize: 15,
    paddingTop: 30,
    paddingBottom: 15,
  },
  answerText: {
    fontFamily: 'Roboto-Regular',
    color: COLORS.WHITE,
    fontSize: 13,
  },
});
