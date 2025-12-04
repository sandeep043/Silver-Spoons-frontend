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
import { createNavigationContainerRef } from '@react-navigation/native';
import VerifyOTPScreen from './screens/VerifyOTP';
import HomeScreen from './screens/HomeScreen';
import CartScreen from './screens/CartScreen';
import ErrorScreen from './screens/ErrorScreen';

import SettingScreen from './screens/SettingScreen';
import ProfileScreen from './screens/ProfileScreen';
import { useSelector } from 'react-redux';
import SearchScreen from './screens/SearchScreen';
import AddAdressScreen from './screens/AddAdressScreen';
import AddressScreen from './screens/AddressScreen';
import PaymentScreen from './screens/PaymentScreen';
import PaymentResult from './screens/PaymentResultScreen';
import ProductViewScreen from './screens/ProductViewScreen';
import { CartProvider } from './context/CartContext';
import OrderHistoryScreen from './screens/OrderHistoryScreen';

import { House, Settings, CircleUserRound, Search } from 'lucide-react-native';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const navigationRef = createNavigationContainerRef();

// Error boundary to catch render errors and navigate to the dedicated Error screen
class ErrorBoundary extends (require('react').Component) {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, navigated: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('Uncaught error:', error, info);
    // Try to navigate to the Error screen once
    try {
      if (navigationRef && navigationRef.current && !this.state.navigated) {
        navigationRef.current.navigate('Error', { error: String(error) });
        this.setState({ navigated: true });
      }
    } catch (e) {
      console.warn('Could not navigate to Error screen from ErrorBoundary', e);
    }
  }

  render() {
    // When an error happens, the app will navigate to the `Error` screen.
    // We render nothing here to avoid duplicate UI.
    if (this.state.hasError) {
      return null;
    }

    return this.props.children;
  }
}

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
        tabBarActiveTintColor: '#ac3636ff',
        tabBarInactiveTintColor: '#ffffff',
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <House color={color} />,
        }}
      />
      <Tab.Screen
        name="SearchTab"
        component={SearchScreen}
        options={{
          title: 'Search',
          tabBarLabel: 'Search',
          tabBarIcon: ({ color }) => <Search color={color} />,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <CircleUserRound color={color} />,
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingScreen}
        options={{
          title: 'Settings',
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color }) => <Settings color={color} />,
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

  // Handle navigation reset when user logs out
  useEffect(() => {
    if (!isAuthenticated && navigationRef.current && showOnboarding === false) {
      console.log('User logged out - resetting navigation to Login');
      navigationRef.current.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }
  }, [isAuthenticated, showOnboarding]);

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
      <NavigationContainer
        ref={navigationRef}
        onUnhandledAction={(action) => {
          console.warn('Unhandled navigation action:', action);
          try {
            if (navigationRef && navigationRef.current) {
              navigationRef.current.navigate('Error', { error: action.type || JSON.stringify(action) });
            }
          } catch (e) {
            console.warn('Failed to navigate to Error screen for unhandled action', e);
          }
        }}
      >
        <Stack.Navigator initialRouteName='Onboarding'>
          <Stack.Screen name="Onboarding" options={{ headerShown: false }} component={OnboardingScreen} />
          <Stack.Screen name="Login" options={{ headerShown: false }} component={LoginScreen} />
          <Stack.Screen name="SignUp" options={{ headerShown: false }} component={SignUpScreen} />
          <Stack.Screen name="VerifyOTP" options={{ headerShown: false }} component={VerifyOTPScreen} />
          {/* Home screens only accessible after login */}
          <Stack.Screen name="Home" options={{ headerShown: false }} component={HomeTabs} />
          <Stack.Screen name="Address" options={{ headerShown: false }} component={AddressScreen} />
          <Stack.Screen name="Cart" options={{ headerShown: false }} component={CartScreen} />
          <Stack.Screen name="Settings" options={{ headerShown: false }} component={SettingScreen} />
          <Stack.Screen name="Profile" options={{ headerShown: false }} component={ProfileScreen} />
          <Stack.Screen name="Error" options={{ headerShown: false }} component={ErrorScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  // After onboarding - check if user is authenticated
  else {
    return (
      <NavigationContainer
        ref={navigationRef}
        onUnhandledAction={(action) => {
          console.warn('Unhandled navigation action:', action);
          try {
            if (navigationRef && navigationRef.current) {
              navigationRef.current.navigate('Error', { error: action.type || JSON.stringify(action) });
            }
          } catch (e) {
            console.warn('Failed to navigate to Error screen for unhandled action', e);
          }
        }}
      >
        {isAuthenticated ? (
          // User is logged in - show Home with protected screens
          <Stack.Navigator initialRouteName='Home'>
            <Stack.Screen name="Home" options={{ headerShown: false }} component={HomeTabs} />
            <Stack.Screen name="Address" options={{ headerShown: false }} component={AddressScreen} />
            <Stack.Screen name="AddAddress" options={{ headerShown: false }} component={AddAdressScreen} />
            <Stack.Screen name="Cart" options={{ headerShown: false }} component={CartScreen} />
            <Stack.Screen name="Settings" options={{ headerShown: false }} component={SettingScreen} />
            <Stack.Screen name="Profile" options={{ headerShown: false }} component={ProfileScreen} />
            <Stack.Screen name="Payment" options={{ headerShown: false }} component={PaymentScreen} />
            <Stack.Screen name="PaymentResult" options={{ headerShown: false }} component={PaymentResult} />
            <Stack.Screen name="ProductView" options={{ headerShown: false }} component={ProductViewScreen} />
            <Stack.Screen name="Error" options={{ headerShown: false }} component={ErrorScreen} />
            <Stack.Screen name="OrderHistory" options={{ headerShown: false }} component={OrderHistoryScreen} />

          </Stack.Navigator>
        ) : (
          // User is not logged in - show Login/SignUp screens
          <Stack.Navigator initialRouteName='Login'>
            <Stack.Screen name="Login" options={{ headerShown: false }} component={LoginScreen} />
            <Stack.Screen name="SignUp" options={{ headerShown: false }} component={SignUpScreen} />
            <Stack.Screen name="VerifyOTP" options={{ headerShown: false }} component={VerifyOTPScreen} />
            <Stack.Screen name="Error" options={{ headerShown: false }} component={ErrorScreen} />
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
      <CartProvider>
        <ErrorBoundary>
          <RootNavigator />
        </ErrorBoundary>
      </CartProvider>
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

