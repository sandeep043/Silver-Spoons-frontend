import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, FlatList, Pressable, Modal, TextInput, Alert, Switch, ScrollView } from 'react-native'
import { useEffect, useState, useCallback } from 'react';
import { getAllAddresses, updateAddress, deleteAddress } from '../utils/AddressFetch';
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

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [street, setStreet] = useState('');
    const [addressLine1, setAddressLine1] = useState('');
    const [addressLine2, setAddressLine2] = useState('');
    const [city, setCity] = useState('');
    const [stateField, setStateField] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [isDefault, setIsDefault] = useState(false);

    const openEditModal = (address) => {
        setEditingAddress(address);
        setStreet(address.street || '');
        setAddressLine1(address.addressLine1 || '');
        setAddressLine2(address.addressLine2 || '');
        setCity(address.city || '');
        setStateField(address.state || '');
        setZipCode(address.zipCode || '');
        setIsDefault(!!address.default);
        setIsModalVisible(true);
    }

    const handleSaveChanges = async () => {
        if (!editingAddress) return;

        const payload = {
            street,
            addressLine1,
            addressLine2,
            city,
            state: stateField,
            zipCode,
            default: isDefault,
        };

        try {
            await updateAddress(editingAddress._id, payload, token);
            setIsModalVisible(false);
            setEditingAddress(null);
            getAllAdresses();
        }
        catch (err) {
            console.error('Save changes error:', err);
        }
    }

    const confirmDelete = (address) => {
        Alert.alert(
            'Delete Address',
            'Are you sure you want to delete this address?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete', style: 'destructive', onPress: async () => {
                        try {
                            await deleteAddress(address._id, token);
                            getAllAdresses();
                        }
                        catch (err) {
                            console.error('Delete address error:', err);
                        }
                    }
                }
            ]
        );
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
                            <Pressable style={styles.editButton} onPress={() => openEditModal(item)}>
                                <SquarePen color="#6b7280" style={styles.buttonIcon} />
                            </Pressable>
                            <Pressable style={styles.deleteButton} onPress={() => confirmDelete(item)}>
                                <Trash color='#f70808' style={styles.buttonIcon} />

                            </Pressable>
                        </View>
                    </View>
                )}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No addresses found</Text>
                }
            />

            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Edit Address</Text>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Address Line 1 <Text style={styles.required}>*</Text></Text>
                                <TextInput
                                    style={[styles.input]}
                                    placeholder="House/Flat/Building No."
                                    placeholderTextColor="#6b7280"
                                    value={addressLine1}
                                    onChangeText={setAddressLine1}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Address Line 2</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Apartment/Floor (Optional)"
                                    placeholderTextColor="#6b7280"
                                    value={addressLine2}
                                    onChangeText={setAddressLine2}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Street <Text style={styles.required}>*</Text></Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Street Name"
                                    placeholderTextColor="#6b7280"
                                    value={street}
                                    onChangeText={setStreet}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>City <Text style={styles.required}>*</Text></Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="City"
                                    placeholderTextColor="#6b7280"
                                    value={city}
                                    onChangeText={setCity}
                                />
                            </View>

                            <View style={styles.rowInputs}>
                                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                                    <Text style={styles.label}>State <Text style={styles.required}>*</Text></Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="State"
                                        placeholderTextColor="#6b7280"
                                        value={stateField}
                                        onChangeText={setStateField}
                                    />
                                </View>
                                <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                                    <Text style={styles.label}>Zip Code <Text style={styles.required}>*</Text></Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Zip Code"
                                        placeholderTextColor="#6b7280"
                                        value={zipCode}
                                        onChangeText={setZipCode}
                                        keyboardType="number-pad"
                                        maxLength={6}
                                    />
                                </View>
                            </View>

                            <View style={styles.defaultRow}>
                                <Text style={styles.defaultLabel}>Set as default</Text>
                                <Switch value={isDefault} onValueChange={setIsDefault} trackColor={{ false: '#2a2a2a', true: '#16a34a' }} thumbColor={isDefault ? '#ffffff' : '#9ca3af'} />
                            </View>

                            <View style={{ height: 20 }} />
                        </ScrollView>

                        <View style={styles.modalBottom}>
                            <Pressable style={[styles.saveButtonModal]} onPress={handleSaveChanges}>
                                <Text style={styles.saveButtonText}>{'SAVE CHANGES'}</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    modalContainer: {
        width: '100%',
        maxWidth: 520,
        backgroundColor: '#0f1724',
        borderRadius: 12,
        padding: 16,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 12,
    },
    input: {
        backgroundColor: '#0b1220',
        borderColor: '#243341',
        borderWidth: 1,
        color: '#ffffff',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 8,
        marginBottom: 10,
    },
    defaultRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 8,
    },
    defaultLabel: {
        color: '#cbd5e1',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 8,
        marginTop: 8,
    },
    saveButton: {
        backgroundColor: '#2563eb',
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 8,
    },
    saveText: {
        color: '#fff',
        fontWeight: '600',
    },
    cancelButton: {
        backgroundColor: 'transparent',
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 8,
        marginRight: 8,
    },
    cancelText: {
        color: '#cbd5e1',
        fontWeight: '600',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: 8,
    },
    required: {
        color: '#ef4444',
    },
    inputError: {
        borderColor: '#ef4444',
    },
    errorText: {
        color: '#ef4444',
        fontSize: 12,
        marginTop: 4,
    },
    modalBottom: {
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#0b1220',
        marginTop: 8,
    },
    saveButtonModal: {
        backgroundColor: '#16a34a',
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 1,
    },
});