import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import { store } from './store/store';
import { Provider } from 'react-redux';
import OnboardingScreen from './screens/OnboardingScreen';
import { useEffect, useState } from 'react';
import VerifyOTPScreen from './screens/VerifyOTP';
import HomeScreen from './screens/HomeScreen';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


// function MyTabs() {
//   return (
//     <Tab.Navigator>
//       <Tab.Screen name="Exercises" component={Exercises} />
//       <Tab.Screen name="Final" component={Final} />
//       <Tab.Screen name="Screen2" component={Screen2} />
//     </Tab.Navigator>
//   );
// }r


export default function App() {

  const [showOnboarding, setShowOnboarding] = useState(null);

  useEffect(() => {
    checkIfAlreadyOnboarded();
  }, []);

  const checkIfAlreadyOnboarded = async () => {
    let onboarded = await AsyncStorage.getItem('onboarded');
    if (onboarded == 1) {
      // User has already onboarded, navigate to login
      setShowOnboarding(false);
      console.log('User has already onboarded');
    } else {
      // First time user, set onboarded flag
      setShowOnboarding(true);
    }
  };

  if (showOnboarding === null) {
    return (
      // Show a loading screen or nothing while checking AsyncStorage
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (showOnboarding) {
    return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName='onboarding'>
            <Stack.Screen name="onboarding" options={{ headerShown: false }} component={OnboardingScreen} />
            <Stack.Screen name="login" options={{ headerShown: false }} component={LoginScreen} />
            <Stack.Screen name="signUp" options={{ headerShown: false }} component={SignUpScreen} />
            <Stack.Screen name="verifyOTP" options={{ headerShown: false }} component={VerifyOTPScreen} />
            <Stack.Screen name="Home" options={{ headerShown: false }} component={HomeScreen} />
            {/* <Stack.Screen name="Home" component={MyTabs} /> */}
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }
  else {
    return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName='Home'>
            <Stack.Screen name="onboarding" options={{ headerShown: false }} component={OnboardingScreen} />
            <Stack.Screen name="login" options={{ headerShown: false }} component={LoginScreen} />
            <Stack.Screen name="signUp" options={{ headerShown: false }} component={SignUpScreen} />
            <Stack.Screen name="verifyOTP" options={{ headerShown: false }} component={VerifyOTPScreen} />
            <Stack.Screen name="Home" options={{ headerShown: false }} component={HomeScreen} />
            {/* <Stack.Screen name="Home" component={MyTabs} /> */}
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );

  }


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
