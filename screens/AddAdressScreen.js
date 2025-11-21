import { StyleSheet, Text, View, TextInput, Pressable, ScrollView, Switch } from "react-native"
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { createAddress } from "../utils/AddressFetch";

function AddAddressScreen() {
    const nav = useNavigation();
    const { token } = useSelector((state) => state.auth);



    const [formData, setFormData] = useState({
        addressLine1: '',
        addressLine2: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        isDefault: false,
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.addressLine1.trim()) {
            newErrors.addressLine1 = 'Address Line 1 is required';
        }

        if (!formData.street.trim()) {
            newErrors.street = 'Street is required';
        }

        if (!formData.city.trim()) {
            newErrors.city = 'City is required';
        }

        if (!formData.state.trim()) {
            newErrors.state = 'State is required';
        }

        if (!formData.zipCode.trim()) {
            newErrors.zipCode = 'Zip Code is required';
        } else if (!/^\d{6}$/.test(formData.zipCode.trim())) {
            newErrors.zipCode = 'Zip Code must be 6 digits';
        }

        if (!formData.country.trim()) {
            newErrors.country = 'Country is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const createAddressAPI = async (formData) => {
        // API call to create address

        const response = await createAddress(formData, token);
        console.log('Create address response:', response); // Debugging

        return response;
    }

    const handleSaveAddress = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            // Replace with your actual API endpoint
            const response = createAddressAPI(formData, token);
            alert('Address saved successfully!');
            nav.goBack();
        } catch (error) {
            console.error('Error saving address:', error);
            alert('Failed to save address. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => nav.goBack()} style={styles.backButton}>
                    <Text style={styles.backIcon}>←</Text>
                </Pressable>
                <Text style={styles.headerTitle}>Add New Address</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.formContainer}>
                    {/* Address Line 1 */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>
                            Address Line 1 <Text style={styles.required}>*</Text>
                        </Text>
                        <TextInput
                            style={[styles.input, errors.addressLine1 && styles.inputError]}
                            placeholder="House/Flat/Building No."
                            placeholderTextColor="#6b7280"
                            value={formData.addressLine1}
                            onChangeText={(value) => handleInputChange('addressLine1', value)}
                        />
                        {errors.addressLine1 && (
                            <Text style={styles.errorText}>{errors.addressLine1}</Text>
                        )}
                    </View>

                    {/* Address Line 2 */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Address Line 2</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Apartment/Floor (Optional)"
                            placeholderTextColor="#6b7280"
                            value={formData.addressLine2}
                            onChangeText={(value) => handleInputChange('addressLine2', value)}
                        />
                    </View>

                    {/* Street */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>
                            Street <Text style={styles.required}>*</Text>
                        </Text>
                        <TextInput
                            style={[styles.input, errors.street && styles.inputError]}
                            placeholder="Street Name"
                            placeholderTextColor="#6b7280"
                            value={formData.street}
                            onChangeText={(value) => handleInputChange('street', value)}
                        />
                        {errors.street && (
                            <Text style={styles.errorText}>{errors.street}</Text>
                        )}
                    </View>

                    {/* City */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>
                            City <Text style={styles.required}>*</Text>
                        </Text>
                        <TextInput
                            style={[styles.input, errors.city && styles.inputError]}
                            placeholder="City"
                            placeholderTextColor="#6b7280"
                            value={formData.city}
                            onChangeText={(value) => handleInputChange('city', value)}
                        />
                        {errors.city && (
                            <Text style={styles.errorText}>{errors.city}</Text>
                        )}
                    </View>

                    {/* State and Zip Code Row */}
                    <View style={styles.rowInputs}>
                        <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                            <Text style={styles.label}>
                                State <Text style={styles.required}>*</Text>
                            </Text>
                            <TextInput
                                style={[styles.input, errors.state && styles.inputError]}
                                placeholder="State"
                                placeholderTextColor="#6b7280"
                                value={formData.state}
                                onChangeText={(value) => handleInputChange('state', value)}
                            />
                            {errors.state && (
                                <Text style={styles.errorText}>{errors.state}</Text>
                            )}
                        </View>

                        <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                            <Text style={styles.label}>
                                Zip Code <Text style={styles.required}>*</Text>
                            </Text>
                            <TextInput
                                style={[styles.input, errors.zipCode && styles.inputError]}
                                placeholder="Zip Code"
                                placeholderTextColor="#6b7280"
                                value={formData.zipCode}
                                onChangeText={(value) => handleInputChange('zipCode', value)}
                                keyboardType="number-pad"
                                maxLength={6}
                            />
                            {errors.zipCode && (
                                <Text style={styles.errorText}>{errors.zipCode}</Text>
                            )}
                        </View>
                    </View>

                    {/* Country */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>
                            Country <Text style={styles.required}>*</Text>
                        </Text>
                        <TextInput
                            style={[styles.input, errors.country && styles.inputError]}
                            placeholder="Country"
                            placeholderTextColor="#6b7280"
                            value={formData.country}
                            onChangeText={(value) => handleInputChange('country', value)}
                        />
                        {errors.country && (
                            <Text style={styles.errorText}>{errors.country}</Text>
                        )}
                    </View>

                    {/* Set as Default */}
                    <View style={styles.switchContainer}>
                        <View style={styles.switchLeft}>
                            <Text style={styles.switchLabel}>Set as default address</Text>
                            <Text style={styles.switchSubtext}>
                                This will be used for all future orders
                            </Text>
                        </View>
                        <Switch
                            value={formData.isDefault}
                            onValueChange={(value) => handleInputChange('isDefault', value)}
                            trackColor={{ false: '#2a2a2a', true: '#16a34a' }}
                            thumbColor={formData.isDefault ? '#ffffff' : '#9ca3af'}
                        />
                    </View>
                </View>

                <View style={{ height: 120 }} />
            </ScrollView>

            {/* Save Button */}
            <View style={styles.bottomContainer}>
                <Pressable
                    style={[styles.saveButton, loading && styles.saveButtonDisabled]}
                    onPress={handleSaveAddress}
                    disabled={loading}
                >
                    <Text style={styles.saveButtonText}>
                        {loading ? 'SAVING...' : 'SAVE ADDRESS'}
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}

export default AddAddressScreen;

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
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#ffffff',
    },
    formContainer: {
        paddingHorizontal: 16,
        paddingTop: 8,
    },
    inputGroup: {
        marginBottom: 20,
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
    input: {
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#ffffff',
        borderWidth: 1,
        borderColor: '#2a2a2a',
    },
    inputError: {
        borderColor: '#ef4444',
    },
    errorText: {
        color: '#ef4444',
        fontSize: 12,
        marginTop: 4,
    },
    rowInputs: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
    },
    switchLeft: {
        flex: 1,
        marginRight: 16,
    },
    switchLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: 4,
    },
    switchSubtext: {
        fontSize: 12,
        color: '#6b7280',
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#0a0a0a',
        paddingHorizontal: 16,
        paddingVertical: 16,
        paddingBottom: 32,
        borderTopWidth: 1,
        borderTopColor: '#1a1a1a',
    },
    saveButton: {
        backgroundColor: '#16a34a',
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: 'center',
    },
    saveButtonDisabled: {
        backgroundColor: '#2a2a2a',
    },
    saveButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 1,
    },
});