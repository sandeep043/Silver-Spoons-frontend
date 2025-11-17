import { StyleSheet, Text, View, Pressable, ScrollView, Image } from "react-native"
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logout } from '../store/authSlice';

function ProfileScreen() {
    const nav = useNavigation();
    const dispatch = useDispatch();

    // Get user data from Redux or use default
    const user = {
        name: 'Arti Abraham',
        phone: '+91 9874563210',
        email: 'artiabraham123@gmail.com',
        avatar: 'https://i.pravatar.cc/150?img=47'
    };

    const menuItems = [
        {
            id: 1,
            icon: '🏠',
            title: 'Address',
            onPress: () => nav.navigate('Address')
        },
        {
            id: 2,
            icon: '🎂',
            title: 'Order history',
            onPress: () => nav.navigate('OrderHistory')
        },
        {
            id: 3,
            icon: '💳',
            title: 'Payments',
            onPress: () => nav.navigate('Payments')
        },
        {
            id: 4,
            icon: '💎',
            title: 'Table Reservation',
            onPress: () => nav.navigate('TableReservation')
        },
        {
            id: 5,
            icon: '🍴',
            title: 'Food Planner',
            onPress: () => nav.navigate('FoodPlanner')
        },
        {
            id: 6,
            icon: '📞',
            title: 'Contact Us',
            onPress: () => nav.navigate('ContactUs')
        },
    ];

    const handleLogout = () => {
        // Clear persisted token and update Redux. RootNavigator will react
        // to `isAuthenticated` change and show the Login flow.
        AsyncStorage.removeItem('authToken')
            .catch((e) => console.warn('Error clearing authToken', e))
            .finally(() => dispatch(logout()));
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => nav.goBack()} style={styles.backButton}>
                    <Text style={styles.backIcon}>←</Text>
                </Pressable>
                <Pressable style={styles.orderFoodButton}>
                    <View style={styles.orderFoodIcon}>
                        <Text style={styles.orderFoodEmoji}>🍔</Text>
                    </View>
                    <Text style={styles.orderFoodText}>Order Food</Text>
                </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Profile Section */}
                <View style={styles.profileSection}>
                    <Image
                        source={{ uri: user.avatar }}
                        style={styles.avatar}
                    />
                    <Text style={styles.name}>{user.name}</Text>
                    <View style={styles.contactInfo}>
                        <Text style={styles.phone}>{user.phone}</Text>
                        <Pressable>
                            <Text style={styles.editIcon}>✏️</Text>
                        </Pressable>
                    </View>
                    <View style={styles.contactInfo}>
                        <Text style={styles.email}>{user.email}</Text>
                        <Pressable>
                            <Text style={styles.editIcon}>✏️</Text>
                        </Pressable>
                    </View>
                </View>

                {/* Menu Items */}
                <View style={styles.menuContainer}>
                    {menuItems.map((item) => (
                        <Pressable
                            key={item.id}
                            style={styles.menuItem}
                            onPress={item.onPress}
                        >
                            <View style={styles.menuItemLeft}>
                                <Text style={styles.menuIcon}>{item.icon}</Text>
                                <Text style={styles.menuTitle}>{item.title}</Text>
                            </View>
                        </Pressable>
                    ))}
                </View>

                {/* Logout */}
                <Pressable style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Logout</Text>
                    <Text style={styles.logoutArrow}>→</Text>
                </Pressable>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Bottom Navigation */}
            {/* <View style={styles.bottomNav}>
                <Pressable style={styles.navItem} onPress={() => nav.navigate('Home')}>
                    <Text style={styles.navIcon}>🏠</Text>
                </Pressable>
                <Pressable style={styles.navItem}>
                    <Text style={styles.navIcon}>📍</Text>
                </Pressable>
                <Pressable style={styles.navItem}>
                    <Text style={styles.navIcon}>🛒</Text>
                </Pressable>
                <Pressable style={[styles.navItem, styles.navItemActive]}>
                    <Text style={styles.navText}>Account</Text>
                </Pressable>
                <Pressable style={styles.navItem}>
                    <Text style={styles.navIcon}>⚙️</Text>
                </Pressable>
            </View> */}
        </View>
    );
}

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a0a',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 50,
        paddingBottom: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    backIcon: {
        fontSize: 24,
        color: '#ffffff',
    },
    orderFoodButton: {
        alignItems: 'center',
    },
    orderFoodIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#ff6b6b',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    orderFoodEmoji: {
        fontSize: 24,
    },
    orderFoodText: {
        fontSize: 11,
        color: '#ffffff',
    },
    profileSection: {
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 40,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 16,
    },
    name: {
        fontSize: 24,
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: 12,
    },
    contactInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    phone: {
        fontSize: 14,
        color: '#9ca3af',
    },
    email: {
        fontSize: 14,
        color: '#9ca3af',
    },
    editIcon: {
        fontSize: 14,
    },
    menuContainer: {
        paddingHorizontal: 20,
        gap: 16,
        marginBottom: 20,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#1a1a1a',
        paddingVertical: 18,
        paddingHorizontal: 20,
        borderRadius: 16,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    menuIcon: {
        fontSize: 22,
    },
    menuTitle: {
        fontSize: 16,
        color: '#ffffff',
        fontWeight: '500',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 20,
        paddingVertical: 16,
    },
    logoutText: {
        fontSize: 16,
        color: '#ffffff',
        fontWeight: '500',
    },
    logoutArrow: {
        fontSize: 20,
        color: '#ffffff',
    },
    bottomNav: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
        paddingVertical: 12,
        paddingBottom: 24,
        borderTopWidth: 1,
        borderTopColor: '#2a2a2a',
    },
    navItem: {
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    navItemActive: {
        backgroundColor: '#2a2a2a',
        borderRadius: 20,
    },
    navIcon: {
        fontSize: 24,
    },
    navText: {
        fontSize: 12,
        color: '#ffffff',
    },
});