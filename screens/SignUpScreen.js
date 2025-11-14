import { StyleSheet, Text, View, TextInput, Pressable } from "react-native"
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { setCredentials, setIsAuthenticated } from '../store/authSlice';

function SignUpScreen() {
    const nav = useNavigation();
    const dispatch = useDispatch();

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSignUp = async () => {
        try {
            if (!fullName || !email || !phoneNumber || !password) {
                setError('All fields are required');
                return;
            }
            setError('');

            // Add your signup API call here
            // const response = await SignUpUser(fullName, email, phoneNumber, password);
            // dispatch(setCredentials({ token: response.token }));
            // dispatch(setIsAuthenticated(true));

            alert('Sign up successful');
            nav.navigate('Home');
        } catch (err) {
            console.error('Sign up error:', err);
            setError('Sign up failed. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Create a new account</Text>
                <Text style={styles.subtitle}>Please fill in the form to continue</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    placeholderTextColor="#6b7280"
                    value={fullName}
                    autoCapitalize="words"
                    autoCorrect={false}
                    onChangeText={setFullName}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#6b7280"
                    value={email}
                    autoCapitalize="none"
                    autoCorrect={false}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Ph number"
                    placeholderTextColor="#6b7280"
                    value={phoneNumber}
                    autoCapitalize="none"
                    autoCorrect={false}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
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

                <Pressable style={styles.signInButton} onPress={handleSignUp}>
                    <Text style={styles.signInText}>SIGN IN</Text>
                </Pressable>

                <Pressable style={styles.googleButton}>
                    <Text style={styles.googleIcon}>G</Text>
                    <Text style={styles.googleText}>Sign in with google</Text>
                </Pressable>

                <Pressable onPress={() => nav.navigate('Login')}>
                    <Text style={styles.loginText}>
                        Have an account? <Text style={styles.loginLink}>Login</Text>
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}

export default SignUpScreen


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
        fontSize: 28,
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
    signInButton: {
        backgroundColor: '#1f2937',
        paddingVertical: 16,
        borderRadius: 30,
        marginTop: 40,
        marginBottom: 20,
        alignItems: 'center',
    },
    signInText: {
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
    loginText: {
        marginTop: 16,
        textAlign: 'center',
        fontSize: 14,
        color: '#9ca3af',
    },
    loginLink: {
        color: '#ef4444',
        fontWeight: '600',
    },
});