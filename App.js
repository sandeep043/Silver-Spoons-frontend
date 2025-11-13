import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import { store } from './store/store';
import { Provider } from 'react-redux';


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
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>

          <Stack.Screen name="login" component={LoginScreen} />
          <Stack.Screen name="signUp" component={SignUpScreen} />
          {/* <Stack.Screen name="Home" component={MyTabs} /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
