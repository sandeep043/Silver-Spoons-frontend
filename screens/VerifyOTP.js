import { StyleSheet, Text, View, TextInput, Pressable } from "react-native"
import { useState, useRef } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setToken, setIsAuthenticated } from '../store/authSlice';
import { VerifyOTPUser } from '../utils/auth';
import { ResendOTP } from '../utils/auth';

function VerifyOTPScreen() {
    const nav = useNavigation();
    const route = useRoute();
    const dispatch = useDispatch();

    const email = route.params?.email || 'your email';
    console.log('Verifying OTP for:', email);

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const inputRefs = useRef([]);

    const handleOtpChange = (value, index) => {
        // Only allow numbers
        if (value && !/^\d+$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (e, index) => {
        // Handle backspace
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerifyOTP = async () => {
        try {
            const otpCode = otp.join('');
            if (otpCode.length !== 6) {
                setError('Please enter complete OTP');
                return;
            }
            setError('');
            // Call backend to verify OTP and receive token
            const response = await VerifyOTPUser(email, otpCode);

            alert('OTP verified successfully. Please login to continue.');
            nav.navigate('Login', { verified: true });
        } catch (err) {
            console.error('OTP verification error:', err.response?.data || err.message || err);
            const serverMessage = err.response?.data?.message || err.response?.data || err.message;
            setError(serverMessage || 'Invalid OTP. Please try again.');
        }
    };

    const handleResendOTP = async () => {
        try {
            // Add your resend OTP API call here
            // await ResendOTP(phoneNumber);

            setOtp(['', '', '', '', '', '']);
            setError('');
            alert('OTP resent successfully');
            inputRefs.current[0]?.focus();
        } catch (err) {
            console.error('Resend OTP error:', err);
            setError('Failed to resend OTP. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Verify OTP!</Text>
                <View style={styles.subtitleContainer}>
                    <Text style={styles.subtitle}>
                        Enter the OTP sent to {email}
                    </Text>
                    <Pressable onPress={() => nav.goBack()}>
                        <Text style={styles.editIcon}>✏️</Text>
                    </Pressable>
                </View>

                <View style={styles.otpContainer}>
                    {otp.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={(ref) => (inputRefs.current[index] = ref)}
                            style={styles.otpInput}
                            value={digit}
                            onChangeText={(value) => handleOtpChange(value, index)}
                            onKeyPress={(e) => handleKeyPress(e, index)}
                            keyboardType="number-pad"
                            maxLength={1}
                            selectTextOnFocus
                        />
                    ))}
                </View>

                {error ? <Text style={styles.error}>{error}</Text> : null}

                <Pressable onPress={handleResendOTP}>
                    <Text style={styles.resendText}>Resend OTP</Text>
                </Pressable>

                <Pressable style={styles.verifyButton} onPress={handleVerifyOTP}>
                    <Text style={styles.verifyText}>VERIFY</Text>
                </Pressable>
            </View>
        </View>
    );
}

export default VerifyOTPScreen


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
        marginBottom: 12,
        letterSpacing: 0.5,
    },
    subtitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 60,
    },
    subtitle: {
        fontSize: 14,
        color: '#9ca3af',
        textAlign: 'center',
    },
    editIcon: {
        fontSize: 16,
        marginLeft: 8,
        color: '#9ca3af',
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 40,
        gap: 10,
    },
    otpInput: {
        flex: 1,
        height: 60,
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        textAlign: 'center',
        fontSize: 24,
        fontWeight: '600',
        color: '#ffffff',
        borderWidth: 1,
        borderColor: '#2a2a2a',
    },
    resendText: {
        fontSize: 14,
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: 120,
        textDecorationLine: 'underline',
    },
    verifyButton: {
        backgroundColor: '#1f2937',
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: 'center',
    },
    verifyText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '500',
        letterSpacing: 1,
    },
    error: {
        color: '#ef4444',
        marginBottom: 16,
        textAlign: 'center',
        fontSize: 14,
    },
});