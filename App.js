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
import CartScreen from './screens/CartScreen';
import ProductDetailsScreen from './screens/ProductDetails';
import SettingScreen from './screens/SettingScreen';
import ProfileScreen from './screens/ProfileScreen';
import { useSelector } from 'react-redux';
import SearchScreen from './screens/SearchScreen';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Navigator for Home screens
function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1a1a1a',
          borderTopWidth: 1,
          borderTopColor: '#2a2a2a',
          paddingVertical: 12,
          paddingBottom: 24,
          height: 80,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 4,
          marginBottom: 8,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
        tabBarActiveTintColor: '#26469d',
        tabBarInactiveTintColor: '#ffffff',
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🏠</Text>,
        }}
      />
      <Tab.Screen
        name="LocationTab"
        component={ProductDetailsScreen}
        options={{
          title: 'Location',
          tabBarLabel: 'Location',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>📍</Text>,
        }}
      />
      <Tab.Screen
        name="SearchTab"
        component={SearchScreen}
        options={{
          title: 'Search',
          tabBarLabel: 'Search',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>S</Text>,
        }}
      />
      <Tab.Screen
        name="CartTab"
        component={CartScreen}
        options={{
          title: 'Cart',
          tabBarLabel: 'Cart',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🛒</Text>,
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingScreen}
        options={{
          title: 'Settings',
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>⚙️</Text>,
        }}
      />
    </Tab.Navigator>
  );
}


// Inner component that uses Redux (inside Provider)
function RootNavigator() {
  const [showOnboarding, setShowOnboarding] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    checkIfAlreadyOnboarded();
  }, []);

  const checkIfAlreadyOnboarded = async () => {
    try {
      let onboarded = await AsyncStorage.getItem('onboarded');
      if (onboarded == 1) {
        // User has already onboarded
        setShowOnboarding(false);
        console.log('User has already onboarded');
      } else {
        // First time user, set onboarded flag
        setShowOnboarding(true);
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setShowOnboarding(true); // Default to onboarding on error
    } finally {
      setIsCheckingAuth(false);
    }
  };

  // Loading screen while checking auth status
  if (isCheckingAuth) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Onboarding flow (user hasn't onboarded yet)
  if (showOnboarding) {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Onboarding'>
          <Stack.Screen name="Onboarding" options={{ headerShown: false }} component={OnboardingScreen} />
          <Stack.Screen name="Login" options={{ headerShown: false }} component={LoginScreen} />
          <Stack.Screen name="SignUp" options={{ headerShown: false }} component={SignUpScreen} />
          <Stack.Screen name="VerifyOTP" options={{ headerShown: false }} component={VerifyOTPScreen} />
          {/* Home screens only accessible after login */}
          <Stack.Screen name="Home" options={{ headerShown: false }} component={HomeTabs} />
          <Stack.Screen name="ProductDetails" options={{ headerShown: false }} component={ProductDetailsScreen} />
          <Stack.Screen name="Cart" options={{ headerShown: false }} component={CartScreen} />
          <Stack.Screen name="Settings" options={{ headerShown: false }} component={SettingScreen} />
          <Stack.Screen name="Profile" options={{ headerShown: false }} component={ProfileScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  // After onboarding - check if user is authenticated
  else {
    return (
      <NavigationContainer>
        {isAuthenticated ? (
          // User is logged in - show Home with protected screens
          <Stack.Navigator initialRouteName='Home'>
            <Stack.Screen name="Home" options={{ headerShown: false }} component={HomeTabs} />
            <Stack.Screen name="ProductDetails" options={{ headerShown: false }} component={ProductDetailsScreen} />
            <Stack.Screen name="Cart" options={{ headerShown: false }} component={CartScreen} />
            <Stack.Screen name="Settings" options={{ headerShown: false }} component={SettingScreen} />
            <Stack.Screen name="Profile" options={{ headerShown: false }} component={ProfileScreen} />
          </Stack.Navigator>
        ) : (
          // User is not logged in - show Login/SignUp screens
          <Stack.Navigator initialRouteName='Login'>
            <Stack.Screen name="Home" options={{ headerShown: false }} component={HomeTabs} />
            <Stack.Screen name="Login" options={{ headerShown: false }} component={LoginScreen} />
            <Stack.Screen name="SignUp" options={{ headerShown: false }} component={SignUpScreen} />
            <Stack.Screen name="VerifyOTP" options={{ headerShown: false }} component={VerifyOTPScreen} />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    );
  }
}

// Main App component with Provider wrapper
export default function App() {
  return (
    <Provider store={store}>
      <RootNavigator />
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

