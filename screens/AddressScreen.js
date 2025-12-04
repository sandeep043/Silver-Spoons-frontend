import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native'
import { useEffect, useState, useCallback } from 'react';
import { getAllAddresses } from '../utils/AddressFetch';
import { useSelector } from 'react-redux';
import { Trash, SquarePen } from 'lucide-react-native';

function AddressScreen() {
    const nav = useNavigation();
    const [addresses, setAddresses] = useState([]);
    const { token } = useSelector((state) => state.auth);

    const getAllAdresses = async () => {
        const response = await getAllAddresses(token);
        console.log('Fetched addresses:', response);
        setAddresses(response.data);
    }

    useFocusEffect(
        useCallback(() => {
            getAllAdresses();
        }, [token])
    );

    return (
        <View style={styles.container}>

            <View style={styles.header}>
                <Pressable onPress={() => nav.goBack()} style={styles.backButton}>
                    <Text style={styles.backIcon}>←</Text>
                </Pressable>
                <Text style={styles.title}>Locations</Text>
            </View>
            <FlatList
                data={addresses}
                keyExtractor={(item) => item._id}
                scrollEnabled={false}
                contentContainerStyle={styles.content}
                renderItem={({ item }) => (
                    <View style={[styles.locationCard, item.default && styles.defaultLocationCard]}>
                        {item.default && <Text style={styles.defaultBadge}>default</Text>}
                        <Text style={styles.icon}>📍</Text>
                        <View style={styles.locationInfo}>
                            <Text style={styles.locationName}>{item.street}</Text>
                            <Text style={styles.locationAddress}>
                                {item.addressLine1}{item.addressLine2 ? ', ' + item.addressLine2 : ''}, {item.city}, {item.state} {item.zipCode}
                            </Text>
                        </View>
                        <View style={styles.buttonContainer}>
                            <Pressable style={styles.editButton}>

                                <SquarePen color="#6b7280" style={styles.buttonIcon} />
                            </Pressable>
                            <Pressable style={styles.deleteButton}>
                                <Trash color='#f70808' style={styles.buttonIcon} />

                            </Pressable>
                        </View>
                    </View>
                )}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No addresses found</Text>
                }
            />
            <Pressable style={styles.addButton} onPress={() => nav.navigate('AddAddress')}>
                <Text style={styles.addButtonText}>Add New Location</Text>
            </Pressable>
        </View>
    )
}

export default AddressScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a0a',
        paddingBottom: 20,
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
    locationCard: {
        flexDirection: 'row',
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        alignItems: 'center',
        position: 'relative',
    },
    defaultLocationCard: {
        borderWidth: 2,
        borderColor: '#16a34a',
    },
    defaultBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        fontSize: 10,
        color: '#16a34a',
        fontWeight: '600',
        backgroundColor: 'rgba(22, 163, 74, 0.1)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    }, backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    backIcon: {
        fontSize: 24,
        color: '#ffffff',
    },
    icon: {
        fontSize: 28,
        marginRight: 12,
    },
    locationInfo: {
        flex: 1,
        width: '70%',
    },
    locationName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: 4,
    },
    locationAddress: {
        width: '95%',
        fontSize: 12,
        color: '#6b7280',
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
        marginTop: 4,
    },
    editButton: {

        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteButton: {



        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonIcon: {
        fontSize: 16,
    },
    emptyText: {
        color: '#9ca3af',
        textAlign: 'center',
        paddingVertical: 32,
        fontSize: 14,
    },
    addButton: {
        borderWidth: 1,
        borderColor: '#26469d',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 12,
        width: '90%',
        alignSelf: 'center',
    },
    addButtonText: {
        color: '#26469d',
        fontSize: 16,
        fontWeight: '600',
    },
});