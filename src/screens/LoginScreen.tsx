import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {Formik} from 'formik';
import * as Yup from 'yup';
//formik validation schema

const LoginSchema = Yup.object().shape({
  email:Yup.string().email('Invalid email').required('Email is required'),
  password:Yup.string().min(6,"Password must be at least 6 character").required("Password is required")
})

// Define types for the RootStackParamList
type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
};

// Define props type
type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const handleLogin = (value :{email: string, password:string}) => {
    // if (email && password) {
      // Navigate to Dashboard on successful login
      navigation.replace('Dashboard');
    // } 
  };

  return (
        <View style={styles.container}>
          <Text style={styles.title}> logo</Text>
          <Text style={styles.title}>SparkAligner</Text>
          <Text style={styles.title}>Login</Text>
      <Formik initialValues={{email:"",password:""}} onSubmit={handleLogin} validationSchema={LoginSchema}>


        {({handleBlur,handleChange,handleSubmit,values,errors,touched})=>(
          <>
              <TextInput
              style={styles.input}
              placeholder="Email"
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              keyboardType="email-address"
            />
            {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={values.password}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              secureTextEntry
            />
            {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}
     <Button title="Login" onPress={handleSubmit as any} />
        </>
      )}
      </Formik>
     </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});

export default LoginScreen;
