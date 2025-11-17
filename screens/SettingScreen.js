import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';





function SettingScreen() {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
    };
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Settings</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account</Text>
                    <Pressable style={styles.settingItem}>
                        <Text style={styles.settingLabel}>📧 Email</Text>
                        <Text style={styles.settingValue}>user@example.com</Text>
                    </Pressable>
                    <Pressable style={styles.settingItem}>
                        <Text style={styles.settingLabel}>📞 Phone</Text>
                        <Text style={styles.settingValue}>+91 98765 43210</Text>
                    </Pressable>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Preferences</Text>
                    <Pressable style={styles.settingItem}>
                        <Text style={styles.settingLabel}>🔔 Notifications</Text>
                        <Text style={styles.settingValue}>Enabled</Text>
                    </Pressable>
                    <Pressable style={styles.settingItem}>
                        <Text style={styles.settingLabel}>🌙 Dark Mode</Text>
                        <Text style={styles.settingValue}>On</Text>
                    </Pressable>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Support</Text>
                    <Pressable style={styles.settingItem}>
                        <Text style={styles.settingLabel}>❓ Help & Support</Text>
                    </Pressable>
                    <Pressable style={styles.settingItem}>
                        <Text style={styles.settingLabel}>📋 Terms & Conditions</Text>
                    </Pressable>
                    <Pressable style={styles.settingItem}>
                        <Text style={styles.settingLabel}>🔒 Privacy Policy</Text>
                    </Pressable>
                </View>

                <Pressable style={styles.logoutButton} onPress={handleLogout} >
                    <Text style={styles.logoutButtonText}>🚪 Logout</Text>
                </Pressable>
            </ScrollView>
        </View>
    )
}

export default SettingScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a0a',
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: 50,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#2a2a2a',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    content: {
        padding: 16,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#26469d',
        marginBottom: 12,
        textTransform: 'uppercase',
    },
    settingItem: {
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        padding: 16,
        marginBottom: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    settingLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#ffffff',
    },
    settingValue: {
        fontSize: 12,
        color: '#6b7280',
    },
    logoutButton: {
        backgroundColor: '#dc2626',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 24,
    },
    logoutButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
});