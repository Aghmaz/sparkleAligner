import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageSourcePropType,
  Dimensions,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import Carousel, {ICarouselInstance} from 'react-native-reanimated-carousel';
import {Shadow} from 'react-native-shadow-2';
import COLORS from '../constraints/colors';

interface OnboardingItem {
  image: ImageSourcePropType;
  title: string;
  description: string;
}
type RootStackParamList = {
  Login: undefined;
};
const OnBoardScreen: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const carouselRef = React.useRef<ICarouselInstance | null>(null);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const onboardingData: OnboardingItem[] = [
    {
      image: require('../assets/images/onboard/Profile.jpeg'),
      title: 'Get Your Treatment Plan',
      description:
        'Access and retrieve your treatment plan with ease, directly within the app, providing personalised guidance for your orthodontic journey.',
    },
    {
      image: require('../assets/images/onboard/MouthGuard.jpeg'),
      title: 'TRACK YOUR PROGRESS',
      description:
        'Use the Aligner Tracker App to log your daily wear time and track your progress throughout your treatment.',
    },
    {
      image: require('../assets/images/onboard/Calender.jpg'),
      title: 'See Your Future Smile',
      description:
        'Submit a pre-treatment photo to preview your anticipated results and see how your smile could transform after the treatment.',
    },
  ];

  const screenWidth = Dimensions.get('window').width;

  const handleNextScreen = (): void => {
    // if (currentIndex < onboardingData.length - 1) {
    //   setCurrentIndex(currentIndex + 1);
    // } else {
    // }
    navigation.navigate('Login');
  };
  const handleSnapToItem = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../assets/images/BG.jpg')}
        resizeMode="cover"
        style={styles.backgroundImage}
      />
      <Text style={styles.titleText}>SPARKLE ALIGN</Text>
      <Carousel
        style={{bottom: '136%'}}
        ref={carouselRef}
        loop={true}
        autoPlay={true}
        autoPlayInterval={5000}
        width={screenWidth}
        height={screenWidth}
        data={onboardingData}
        renderItem={({item}) => (
          <View style={{paddingTop: 170}}>
            <Shadow distance={5} containerStyle={styles.shadowContainer}>
              <View style={styles.cardContainer}>
                <Image
                  source={item.image}
                  resizeMode="cover"
                  style={styles.profileImage}
                />
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardDescription}>{item.description}</Text>
                </View>
              </View>
            </Shadow>
          </View>
        )}
        onSnapToItem={handleSnapToItem}
      />
      <View style={styles.paginationContainer}>
        {onboardingData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              {
                backgroundColor:
                  currentIndex === index ? COLORS.BLUE_LIGHT : COLORS.SKYBLUE,
              },
            ]}
          />
        ))}
      </View>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.getStartedButton}
        onPress={handleNextScreen}>
        <Text style={styles.getStartedText}>
          {' '}
          {currentIndex === onboardingData.length - 1
            ? 'Get Started'
            : 'Get Started'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  backgroundImage: {
    height: '70%',
    width: '100%',
    borderBottomLeftRadius: 80,
    borderBottomRightRadius: 80,
  },
  titleText: {
    fontSize: 25,
    color: COLORS.WHITE,
    position: 'absolute',
    top: '18%',
    width: '50%',
    textAlign: 'center',
    alignSelf: 'center',
    fontFamily: '20db',
  },
  shadowContainer: {
    alignSelf: 'center',
  },
  cardContainer: {
    paddingHorizontal: 20,
    paddingVertical: 25,
    borderRadius: 12,
    backgroundColor: COLORS.WHITE,
    alignItems: 'center',
  },
  profileImage: {
    height: 190,
    width: 190,
    borderRadius: 100,
    marginHorizontal: 40,
    bottom: 140,
  },
  cardContent: {
    position: 'absolute',
    top: '60%',
    gap: 10,
  },
  cardTitle: {
    fontSize: 20,
    color: COLORS.BLUE_LIGHT,
    textAlign: 'center',
    fontFamily: 'Roboto-Medium',
  },
  cardDescription: {
    fontSize: 14,
    color: COLORS.BLACK_LIGHT,
    lineHeight: 20,
    textAlign: 'center',
    fontFamily: 'Roboto-Regular',
  },
  paginationContainer: {
    alignItems: 'center',
    gap: 10,
    position: 'absolute',
    bottom: '19%',
    alignSelf: 'center',
    flexDirection: 'row',
  },
  paginationDot: {
    height: 10,
    width: 10,
    borderRadius: 50,
    backgroundColor: COLORS.BLUE_LIGHT,
  },
  getStartedButton: {
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: COLORS.BLUE_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 40,
    position: 'absolute',
    width: '80%',
    alignSelf: 'center',
    bottom: '8.5%',
    paddingVertical: 15,
  },
  getStartedText: {
    fontSize: 15,
    color: COLORS.WHITE,
    fontFamily: 'Roboto-Regular',
  },
});
export default OnBoardScreen;
