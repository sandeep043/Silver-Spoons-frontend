import { StyleSheet, Text, View, Pressable, ScrollView, Image, RefreshControl, Modal, FlatList } from "react-native"
import { useState, useCallback, useRef } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getCartItems } from '../utils/cartFetch';
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { removeItemFromCart, decreaseQuantity, addItemToCart } from "../utils/cartFetch";
import { getAllAddresses, getDefaultAddress } from '../utils/AddressFetch';


function CartScreen() {
    const nav = useNavigation();

    const { token } = useSelector((state) => state.auth);



    const [cartItems, setCartItems] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [deliveryAddress, setDeliveryAddress] = useState('Fetching default address...');
    const [deliveryTime, setDeliveryTime] = useState('Breakfast - 7:30AM');
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [addresses, setAddresses] = useState([]);

    // Track if we've loaded the initial default address
    const isInitialLoadDone = useRef(false);

    const getCartData = async () => {
        try {
            const data = await getCartItems(token);
            console.log('Fetched cart items:', data);
            setCartItems(data.data);
        } catch (error) {
            setRefreshing(false);
            console.error('Failed to fetch cart items:', error);
        }
    };

    const loadDefaultAddress = async () => {
        try {
            const response = await getDefaultAddress(token);
            console.log('Default address:', response);
            if (response.data) {
                const addr = response.data;
                const fullAddress = `${addr.street}, ${addr.addressLine1}${addr.addressLine2 ? ', ' + addr.addressLine2 : ''}, ${addr.city}, ${addr.state} ${addr.zipCode}`;
                setDeliveryAddress(fullAddress);
            }
        } catch (error) {
            console.error('Failed to fetch default address:', error);
        }
    };

    const fetchAllAddresses = async () => {
        try {
            const response = await getAllAddresses(token);
            console.log('All addresses:', response);
            setAddresses(response.data);
        } catch (error) {
            console.error('Failed to fetch addresses:', error);
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getCartData().then(() => {
            setRefreshing(false);
        }).catch(() => {
            setRefreshing(false);
        });
    }, [token]);

    // Load default address only on initial mount
    useEffect(() => {
        if (!isInitialLoadDone.current && token) {
            loadDefaultAddress();
            isInitialLoadDone.current = true;
        }
    }, [token]);

    // Refresh cart items when screen is focused (but NOT the address)
    useFocusEffect(
        useCallback(() => {
            getCartData();
        }, [token])
    );

    const handleSelectAddress = (address) => {
        const fullAddress = `${address.street}, ${address.addressLine1}${address.addressLine2 ? ', ' + address.addressLine2 : ''}, ${address.city}, ${address.state} ${address.zipCode}`;
        setDeliveryAddress(fullAddress);
        setShowAddressModal(false);
    };

    const handleOpenAddressModal = () => {
        fetchAllAddresses();
        setShowAddressModal(true);
    };

    // const updateQuantity = (id, change) => {
    //     setCartItems(prevItems =>
    //         prevItems.map(item => {
    //             if (item._id === id) {
    //                 const newQuantity = Math.max(0, item.quantity + change);
    //                 return { ...item, quantity: newQuantity };
    //             }
    //             return item;
    //         }).filter(item => item.quantity > 0)
    //     );
    // };

    const handelIncreaseQuantity = async (itemId) => {
        try {

            const response = await addItemToCart(itemId, token);
            getCartData();
        } catch (error) {
            console.error('Failed to increase quantity:', error);
        }

    };

    const handelDecreaseQuantity = async (itemId) => {
        try {
            console.log('Decreasing quantity for item:', itemId);
            await decreaseQuantity(itemId, token);
            getCartData();
        } catch (error) {
            console.error('Failed to decrease quantity:', error);
        }
    };





    const handleItemDelete = async (item) => {
        console.log('Deleting item from cart:', token);
        await removeItemFromCart(item._id, token);
        // Re-fetch cart data after deletion
        getCartData();
    }

    const calculateSubtotal = () => {
        return cartItems.reduce((sum, item) => sum + (item.productId.price * item.quantity), 0);
    };

    const subtotal = calculateSubtotal();
    const gst = Math.round(subtotal * 0.05); // 5% GST
    const deliveryFee = 30;
    const grandTotal = subtotal + gst + deliveryFee;

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => nav.goBack()} style={styles.backButton}>
                    <Text style={styles.backIcon}>←</Text>
                </Pressable>
                <Text style={styles.headerTitle}>Cart</Text>
                <View style={{ width: 40 }} />
            </View>

            {cartItems.length === 0 ? (
                <View style={styles.emptyCartContainer}>
                    <Text style={styles.emptyCartText}>Your cart is empty</Text>
                    <Pressable style={styles.addItemsButton} onPress={() => {
                        console.log('Navigating to Home screen to add items');
                        nav.navigate('Home')
                    }}>
                        <Text style={styles.addItemsButtonText}>Add Items</Text>
                    </Pressable>
                </View>
            ) : (
                <>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    >
                        {/* Order Summary Card */}
                        <View style={styles.summaryCard}>
                            <View style={styles.summaryHeader}>
                                <Text style={styles.summaryTitle}>Order summary</Text>
                            </View>

                            {/* Cart Items */}
                            {cartItems.map((item) => (
                                <View key={item._id} style={styles.cartItem}>
                                    <Image
                                        source={{
                                            uri: item.productId.ImageUrl
                                        }}
                                        style={styles.itemImage}
                                    />
                                    <View style={styles.itemDetails}>
                                        <Text style={styles.itemName}>{item.productId.name}</Text>
                                        <View style={styles.quantityContainer}>
                                            <Pressable
                                                style={styles.quantityButton}
                                                onPress={() => handelDecreaseQuantity(item.productId._id)}
                                            >
                                                <Text style={styles.quantityButtonText}>-</Text>
                                            </Pressable>
                                            <Text style={styles.quantityText}>{item.quantity}</Text>
                                            <Pressable
                                                style={styles.quantityButton}
                                                onPress={() => handelIncreaseQuantity(item.productId._id)}
                                            >
                                                <Text style={styles.quantityButtonText}>+</Text>
                                            </Pressable>
                                        </View>
                                    </View>
                                    <Pressable onPress={() => handleItemDelete(item)} style={styles.cartDeleteButton}>
                                        <Text style={styles.cartDeleteButtonText}>Delete</Text>
                                    </Pressable>
                                    <Text style={styles.itemPrice}>₹ {item.productId.price * item.quantity}</Text>
                                </View>
                            ))}

                            {/* Delivery Address */}
                            <View style={styles.infoRow}>
                                <Text style={styles.infoIcon}>📍</Text>
                                <Text style={styles.infoText}>{deliveryAddress}</Text>
                                <Pressable onPress={handleOpenAddressModal}>
                                    <Text style={styles.changeButton}>Change</Text>
                                </Pressable>
                            </View>



                            {/* Rate */}
                            <View style={styles.rateRow}>
                                <Text style={styles.rateLabel}>Rate</Text>
                                <Text style={styles.rateValue}>₹ {subtotal}</Text>
                            </View>
                        </View>

                        {/* Coupons */}
                        <Pressable style={styles.couponsCard}>
                            <Text style={styles.giftIcon}>🎁</Text>
                            <Text style={styles.couponsText}>Coupons</Text>
                            <Text style={styles.arrowIcon}>›</Text>
                        </Pressable>

                        {/* Bill Details */}
                        <View style={styles.billCard}>
                            <View style={styles.billRow}>
                                <Text style={styles.billLabel}>Subtotal</Text>
                                <Text style={styles.billValue}>₹ {subtotal}</Text>
                            </View>
                            <View style={styles.billRow}>
                                <Text style={styles.billLabel}>GST</Text>
                                <Text style={styles.billValue}>₹ {gst}</Text>
                            </View>
                            <View style={styles.billRow}>
                                <Text style={styles.billLabel}>Delivery partner fee for 8km</Text>
                                <Text style={styles.billValue}>₹ {deliveryFee}</Text>
                            </View>
                        </View>

                        {/* Grand Total */}
                        <View style={styles.totalCard}>
                            <Text style={styles.totalLabel}>Grand Total</Text>
                            <Text style={styles.totalValue}>₹ {grandTotal}</Text>
                        </View>

                        <View style={{ height: 120 }} />
                    </ScrollView>

                    {/* Proceed to Pay Button */}
                    <View style={styles.bottomContainer}>
                        <Pressable style={styles.proceedButton} onPress={() => nav.navigate('Payment', { amount: grandTotal, cartItems: cartItems })}>
                            <Text style={styles.proceedButtonText}>PROCEED TO PAY</Text>
                        </Pressable>
                    </View>
                </>
            )}

            {/* Address Modal */}
            <Modal
                visible={showAddressModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowAddressModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Address</Text>
                            <Pressable onPress={() => setShowAddressModal(false)}>
                                <Text style={styles.closeButton}>✕</Text>
                            </Pressable>
                        </View>
                        <FlatList
                            data={addresses}
                            keyExtractor={(item) => item._id}
                            renderItem={({ item }) => (
                                <Pressable
                                    style={styles.addressOption}
                                    onPress={() => handleSelectAddress(item)}
                                >
                                    <View style={styles.addressOptionContent}>
                                        <Text style={styles.addressOptionTitle}>{item.street}</Text>
                                        <Text style={styles.addressOptionSubtitle}>
                                            {item.addressLine1}{item.addressLine2 ? ', ' + item.addressLine2 : ''}, {item.city}, {item.state} {item.zipCode}
                                        </Text>
                                    </View>
                                    {item.default && <Text style={styles.defaultBadgeModal}>default</Text>}
                                </Pressable>
                            )}
                        />
                        <View>
                            <Pressable style={styles.addButtonModal} onPress={() => {
                                setShowAddressModal(false);
                                nav.navigate('AddAddress');
                            }}>
                                <Text style={styles.addButtonTextModal}>Add New Address</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

export default CartScreen;

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
    summaryCard: {
        marginHorizontal: 16,
        marginTop: 8,
        backgroundColor: '#1a1a1a',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    summaryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    summaryTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
    },
    cartItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#2a2a2a',
    },
    itemImage: {
        width: 80,
        height: 60,
        borderRadius: 8,
        marginRight: 12,
    },
    itemDetails: {
        flex: 1,
    },
    itemName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#ffffff',
        marginBottom: 8,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    quantityButton: {
        width: 24,
        height: 24,
        backgroundColor: '#2a2a2a',
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantityButtonText: {
        fontSize: 16,
        color: '#ffffff',
        fontWeight: '600',
    },
    quantityText: {
        fontSize: 14,
        color: '#ffffff',
        fontWeight: '500',
        minWidth: 20,
        textAlign: 'center',
    },
    itemPrice: {
        fontSize: 14,
        fontWeight: '600',
        color: '#ffffff',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 8,
    },
    infoIcon: {
        fontSize: 18,
    },
    infoText: {
        flex: 1,
        fontSize: 13,
        color: '#9ca3af',
    },
    editIcon: {
        fontSize: 14,
    },
    rateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#2a2a2a',
    },
    rateLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
    },
    rateValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
    },
    couponsCard: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        backgroundColor: '#1a1a1a',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        gap: 12,
    },
    giftIcon: {
        fontSize: 24,
    },
    couponsText: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
        color: '#ffffff',
    },
    arrowIcon: {
        fontSize: 24,
        color: '#ffffff',
    },
    billCard: {
        marginHorizontal: 16,
        marginBottom: 16,
    },
    billRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    billLabel: {
        fontSize: 14,
        color: '#9ca3af',
    },
    billValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#ffffff',
    },
    totalCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#2a2a2a',
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: '700',
        color: '#ffffff',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#ffffff',
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
    },
    proceedButton: {
        backgroundColor: '#1f2937',
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: 'center',
    },
    proceedButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 1,
    },
    cartDeleteButton: {
        justifyContent: 'center',
        marginRight: 15,
        backgroundColor: "#a72323ff",
        borderRadius: 4,
    },
    cartDeleteButtonText: {
        color: "#ffff",
        padding: 2,
        paddingLeft: 6,
        paddingRight: 6,
    },
    emptyCartContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyCartText: {
        fontSize: 18,
        color: '#9ca3af',
        marginBottom: 20,
    },
    addItemsButton: {
        backgroundColor: '#FF6B6B',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
    },
    addItemsButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    changeButton: {
        color: '#26469d',
        fontSize: 13,
        fontWeight: '600',
    },
    editIcon: {
        fontSize: 14,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#1a1a1a',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '80%',
        paddingBottom: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#2a2a2a',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#ffffff',
    },
    closeButton: {
        fontSize: 24,
        color: '#ffffff',
    },
    addressOption: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#2a2a2a',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    addressOptionContent: {
        flex: 1,
    },
    addressOptionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: 4,
    },
    addressOptionSubtitle: {
        fontSize: 12,
        color: '#6b7280',
    },
    defaultBadgeModal: {
        fontSize: 10,
        color: '#16a34a',
        fontWeight: '600',
        backgroundColor: 'rgba(22, 163, 74, 0.1)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    addButtonModal: {
        backgroundColor: '#26469d',
        marginHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    addButtonTextModal: {
        fontSize: 16,
        color: '#ffffff',
        fontWeight: '500',
    },

});