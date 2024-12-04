import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  Linking,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import {Shadow} from 'react-native-shadow-2';
import COLORS from '../constraints/colors';
import {Formik} from 'formik';
import axios, {AxiosError} from 'axios';
import * as Yup from 'yup';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 character')
    .required('Password is required'),
});

type RootStackParamList = {
  Login: undefined;
  Drawer: {screen: string};
  TabNavigator: undefined;
};

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<LoginScreenProps> = ({navigation}) => {
  const handleLogin = async (values: {email: string; password: string}) => {
    const payload = {
      email: values.email,
      password: values.password,
    };
    try {
      const response = await axios.post(
        'http://192.168.8.100:5000/api/auth/login',
        payload,
      );
      if (response.status === 200) {
        const {token, role} = response.data;
        console.log('Login Successfully');
        console.log('Token', token);
        if (role === 'Patient') {
          setTimeout(() => {
            Toast.show({
              type: 'error',
              position: 'top',
              text1: 'Login Successfull',
              text2: response?.data?.message,
            });
          }, 1000);
          navigation.navigate('Drawer', {screen: 'TabNavigator'});
        } else {
          Toast.show({
            type: 'error',
            position: 'top',
            text1: 'Invalid Role',
            text2: `patients only, ${role} can't login`,
          });
        }
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Login Failed',
          text2:
            error.response?.data.error ||
            'An error occurred. Please try again.',
        });
      } else {
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Login Failed',
          text2: 'An unexpected error occurred. Please try again.',
        });
      }
    }
  };

  const openLink = (url: string) => {
    Linking.openURL(url).catch(err =>
      console.error('Failed to open link: ', err),
    );
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.safeAreaContainer}>
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          <Image
            source={require('../assets/images/BG.jpg')}
            resizeMode="cover"
            style={styles.backgroundImage}
          />
          <View style={styles.overlayTextContainer}>
            <Text style={styles.headerTitle}>SPARKLE ALIGN</Text>
            <Text style={styles.subHeaderText}>
              Fill The Below information to Login
            </Text>
          </View>
          <Shadow distance={5} containerStyle={styles.shadowWrapper}>
            <View style={styles.formCardContainer}>
              <Formik
                initialValues={{email: '', password: ''}}
                onSubmit={handleLogin}
                validationSchema={LoginSchema}>
                {({
                  handleBlur,
                  handleChange,
                  handleSubmit,
                  values,
                  errors,
                  touched,
                }) => (
                  <>
                    <TextInput
                      style={styles.inputField}
                      placeholderTextColor={COLORS.GRAY_DARK}
                      placeholder="E-mail"
                      value={values.email}
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      keyboardType="email-address"
                    />
                    <View style={styles.separatorLine} />
                    {touched.email && errors.email && (
                      <Text style={styles.errorMessage}>{errors.email}</Text>
                    )}
                    <TextInput
                      style={styles.inputField}
                      placeholder="Password"
                      placeholderTextColor={COLORS.GRAY_DARK}
                      value={values.password}
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      secureTextEntry
                    />
                    <View style={styles.separatorLine} />
                    {touched.password && errors.password && (
                      <Text style={styles.errorMessage}>{errors.password}</Text>
                    )}
                    <Text style={styles.forgotPasswordText}>
                      Forgot password?
                    </Text>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={styles.loginButton}
                      onPress={handleSubmit as any}>
                      <Text style={styles.loginButtonText}>Log In</Text>
                    </TouchableOpacity>
                    <Text style={styles.footerText}>
                      By proceeding, you agree to our
                    </Text>
                    <View style={styles.termsLinkContainer}>
                      <Text
                        onPress={() => openLink('http://www.crypthonlab.com')}
                        style={styles.termsLinkText}>
                        Terms & Conditions
                      </Text>
                      <Text style={styles.termsDividerText}>and</Text>
                      <Text
                        onPress={() => openLink('http://www.crypthonlab.com')}
                        style={styles.termsLinkText}>
                        Privacy Policy
                      </Text>
                    </View>
                  </>
                )}
              </Formik>
            </View>
          </Shadow>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  backgroundImage: {
    height: Dimensions.get('window').height * 0.71,
    width: '100%',
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
  },
  overlayTextContainer: {
    position: 'absolute',
    top: '28%',
    alignSelf: 'center',
    gap: 5,
  },
  headerTitle: {
    fontSize: 25,
    color: COLORS.WHITE,
    width: '60%',
    textAlign: 'center',
    alignSelf: 'center',
    fontFamily: '20db',
  },
  subHeaderText: {
    fontSize: 15,
    color: COLORS.WHITE,
    textAlign: 'center',
    fontFamily: 'Roboto-Regular',
  },
  shadowWrapper: {
    alignSelf: 'center',
    bottom: '23%',
  },
  formCardContainer: {
    paddingHorizontal: 20,
    paddingVertical: 25,
    paddingTop: 30,
    borderRadius: 12,
    backgroundColor: COLORS.WHITE,
  },
  inputField: {
    paddingHorizontal: 10,
    fontSize: 14,
    color: COLORS.BLACK,
    fontFamily: 'Roboto-Medium',
  },
  separatorLine: {
    width: 270,
    height: 0.5,
    backgroundColor: COLORS.BLACK,
    alignSelf: 'center',
    marginBottom: 25,
    marginTop: -3,
  },
  errorMessage: {
    color: 'red',
    marginBottom: 10,
  },
  forgotPasswordText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    color: COLORS.BLUE_LIGHT,
    marginBottom: 15,
    paddingHorizontal: 8,
  },
  loginButton: {
    borderRadius: 8,
    backgroundColor: COLORS.BLUE_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    marginHorizontal: 10,
  },
  loginButtonText: {
    fontSize: 15,
    color: COLORS.WHITE,
    fontFamily: 'Roboto-Regular',
  },
  footerText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    color: COLORS.GRAY_DARK,
    textAlign: 'center',
    paddingTop: 5,
  },
  termsLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    justifyContent: 'center',
  },
  termsLinkText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    color: COLORS.BLUE_LIGHT,
  },
  termsDividerText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    color: COLORS.GRAY_DARK,
  },
});

export default LoginScreen;
