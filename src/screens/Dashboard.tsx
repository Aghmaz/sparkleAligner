// import React from 'react';
// import { View, Text, Button, StyleSheet } from 'react-native';
// import { NativeStackScreenProps } from '@react-navigation/native-stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import HomeScreen from '../screens/tabs/homeScreen';  // Import your screens
// import AboutScreen from './tabs/Aboutscreen';

// const Tab = createBottomTabNavigator();
// // Define types for the RootStackParamList
// type RootStackParamList = {
//   Login: undefined;
//   Dashboard: undefined;
// };

// // Define props type
// type DashboardProps = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

// const Dashboard: React.FC<DashboardProps> = ({ navigation }) => {
//   return (

//     <Tab.Navigator>
//      <View style={styles.container}>
//       <Text>dashboard</Text></View>
//       <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
//       <Tab.Screen name="Settings" component={AboutScreen} options={{ title: 'Settings' }} />
//     </Tab.Navigator>
//     // <View style={styles.container}>
//     //   <Text style={styles.title}>Welcome to Dashboard</Text>
//     //   <Button title="Logout" onPress={() => navigation.replace('Login')} />
//     // </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//   },
// });

// export default Dashboard;
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Dashboard = () => {
  return (
    <View>
      <Text>Dashboard</Text>
    </View>
  )
}

export default Dashboard

const styles = StyleSheet.create({})
