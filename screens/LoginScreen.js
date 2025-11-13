import { StyleSheet, Text, View, TextInput, Pressable } from "react-native"
import { useState } from 'react';
import { LoginUser } from '../utils/auth';
import { useSelector, useDispatch } from 'react-redux';
import {
    selectIsAuthenticated,
    selectCurrentToken,
    setCredentials,
    setIsAuthenticated,
} from '../store/authSlice';
import { useNavigation } from '@react-navigation/native';


function LoginScreen() {
    const nav = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const isAuthenticated = useSelector(selectIsAuthenticated);
    const token = useSelector(selectCurrentToken);
    const dispatch = useDispatch();

    const handleLogin = async () => {
        try {
            if (!email || !password) {
                setError('Email and password are required');
                return;
            }
            setError('');
            const response = await LoginUser(email, password);
            dispatch(setCredentials({ token: response.token }));
            dispatch(setIsAuthenticated(true));

            alert('Login successful');
            nav.navigate('Home');
            console.log('Logged in with token:', token);
            console.log('Is Authenticated:', isAuthenticated);
        } catch (err) {
            console.error('Login error:', err);
            setError('Login failed. Please check your credentials and try again.');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Please log in to continue</Text>

                <Text style={styles.label}>Email Address</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    value={email}
                    autoCapitalize="none"
                    autoCorrect={false}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />

                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    value={password}
                    autoCapitalize="none"
                    autoCorrect={false}
                    onChangeText={setPassword}
                    secureTextEntry={true}
                />

                {error ? <Text style={styles.error}>{error}</Text> : null}

                <Pressable style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.loginText}>Login</Text>
                </Pressable>

                <Pressable onPress={() => nav.navigate('SignUp')}>
                    <Text style={styles.signupText}>
                        Don’t have an account? <Text style={styles.signupLink}>Sign Up</Text>
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
        backgroundColor: '#f3f4f6',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    card: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },
    title: {
        fontSize: 26,
        fontWeight: '700',
        color: '#111827',
        textAlign: 'center',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#6b7280',
        textAlign: 'center',
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginTop: 12,
        marginBottom: 4,
    },
    input: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 14,
        fontSize: 16,
        backgroundColor: '#f9fafb',
    },
    loginButton: {
        backgroundColor: '#2563eb',
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 24,
        alignItems: 'center',
    },
    loginText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
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
        color: '#4b5563',
    },
    signupLink: {
        color: '#2563eb',
        fontWeight: '600',
    },
});
