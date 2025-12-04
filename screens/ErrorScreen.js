import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ErrorScreen({ navigation, route }) {
    const error = route?.params?.error || 'An unexpected error occurred.';

    const goHome = () => {
        try {
            navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
        } catch (e) {
            try {
                navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
            } catch (e2) {
                console.warn('Could not reset navigation from ErrorScreen', e2);
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Something went wrong</Text>
            <Text style={styles.message} numberOfLines={6}>{String(error)}</Text>
            <TouchableOpacity style={styles.button} onPress={goHome}>
                <Text style={styles.buttonText}>Go to Home</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    title: {
        color: '#fff',
        fontSize: 24,
        marginBottom: 12,
    },
    message: {
        color: '#ccc',
        textAlign: 'center',
        marginBottom: 28,
    },
    button: {
        backgroundColor: '#26469d',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 30,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '700',
    },
});
