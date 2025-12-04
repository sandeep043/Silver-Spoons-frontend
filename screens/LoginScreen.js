import { StyleSheet, Text, View, TextInput, Pressable } from "react-native"
import { useState, useEffect } from 'react';
import { LoginUser } from '../utils/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from 'react-redux';
import {
    selectIsAuthenticated,
    selectCurrentToken,
    setCredentials,
    setIsAuthenticated, setToken, setUserId
} from '../store/authSlice';

import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';


function LoginScreen() {
    const nav = useNavigation();
    const route = useRoute();
    const [verifiedBanner, setVerifiedBanner] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { isAuthenticated, token, userId } = useSelector((state) => state.auth)
    const dispatch = useDispatch();

    // Navigate when authentication state changes
    useEffect(() => {
        if (isAuthenticated && token) {
            console.log('Logged in with token:', token);
            console.log('Is Authenticated:', isAuthenticated);
            console.log('User ID:', userId);
            nav.navigate('Home');
        }
    }, [isAuthenticated, token]);

    // Show a one-time success banner if navigated here after OTP verification
    useEffect(() => {
        const verified = route.params?.verified;
        if (verified) {
            setVerifiedBanner(true);
            // clear the param so banner doesn't reappear on re-render
            try {
                nav.setParams({ verified: false });
            } catch (e) {
                // ignore if setParams not available
            }
            const t = setTimeout(() => setVerifiedBanner(false), 3000);
            return () => clearTimeout(t);
        }
    }, [route.params?.verified]);

    const handleLogin = async () => {
        try {
            if (!email || !password) {
                setError('Email and password are required');
                return;
            }
            setError('');
            const response = await LoginUser(email, password);
            console.log('Login response:', response);

            // Store token in AsyncStorage for persistence
            await AsyncStorage.setItem('authToken', response.token);

            // Dispatch to Redux store

            dispatch(setToken(response.token));
            dispatch(setIsAuthenticated(true));
            dispatch(setUserId(response.user._id));
        } catch (err) {
            console.error('Login error:', err);
            setError('Login failed. Please check your credentials and try again.');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                {verifiedBanner ? (
                    <View style={styles.banner}>
                        <Text style={styles.bannerText}>OTP verified — please login</Text>
                    </View>
                ) : null}
                <Text style={styles.title}>Welcome Back!</Text>
                <Text style={styles.subtitle}>Please login to your account</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Email/Ph number"
                    placeholderTextColor="#6b7280"
                    value={email}
                    autoCapitalize="none"
                    autoCorrect={false}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />

                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.passwordInput}
                        placeholder="Password"
                        placeholderTextColor="#6b7280"
                        value={password}
                        autoCapitalize="none"
                        autoCorrect={false}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                    />
                    <Pressable
                        style={styles.eyeIcon}
                        onPress={() => setShowPassword(!showPassword)}
                    >
                        <Text style={styles.eyeIconText}>👁</Text>
                    </Pressable>
                </View>

                {error ? <Text style={styles.error}>{error}</Text> : null}

                <Pressable style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.loginText}>LOGIN</Text>
                </Pressable>

                <Pressable style={styles.googleButton}>
                    <Text style={styles.googleIcon}>G</Text>
                    <Text style={styles.googleText}>Login with google</Text>
                </Pressable>

                <Pressable onPress={() => nav.navigate('SignUp')}>
                    <Text style={styles.signupText}>
                        Don't have an account? <Text style={styles.signupLink}>Sign Up</Text>
                    </Text>
                </Pressable>


            </View>
        </View>
    );
}

export default LoginScreen


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    card: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: '#000000',
        borderRadius: 12,
        padding: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: '400',
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: 14,
        color: '#9ca3af',
        textAlign: 'center',
        marginBottom: 60,
    },
    input: {
        borderWidth: 0,
        borderBottomWidth: 1,
        borderBottomColor: '#374151',
        paddingVertical: 12,
        paddingHorizontal: 0,
        fontSize: 14,
        backgroundColor: 'transparent',
        color: '#ffffff',
        marginBottom: 30,
    },
    passwordContainer: {
        position: 'relative',
        borderBottomWidth: 1,
        borderBottomColor: '#374151',
        marginBottom: 30,
        flexDirection: 'row',
        alignItems: 'center',
    },
    passwordInput: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 0,
        fontSize: 14,
        backgroundColor: 'transparent',
        color: '#ffffff',
        borderWidth: 0,
    },
    eyeIcon: {
        padding: 8,
    },
    eyeIconText: {
        fontSize: 18,
        color: '#6b7280',
    },
    loginButton: {
        backgroundColor: '#1f2937',
        paddingVertical: 16,
        borderRadius: 30,
        marginTop: 80,
        marginBottom: 20,
        alignItems: 'center',
    },
    loginText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '500',
        letterSpacing: 1,
    },
    googleButton: {
        backgroundColor: 'transparent',
        paddingVertical: 14,
        borderRadius: 30,
        marginBottom: 20,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#1f2937',
    },
    googleIcon: {
        fontSize: 18,
        marginRight: 10,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    googleText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '400',
    },
    error: {
        color: '#ef4444',
        marginTop: 8,
        textAlign: 'center',
        fontSize: 14,
    },
    signupText: {
        marginTop: 16,
        textAlign: 'center',
        fontSize: 14,
        color: '#9ca3af',
    },
    signupLink: {
        color: '#ef4444',
        fontWeight: '600',
    },
    banner: {
        backgroundColor: '#064e3b',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginBottom: 12,
        alignSelf: 'center',
    },
    bannerText: {
        color: '#bbf7d0',
        fontSize: 13,
    },
});