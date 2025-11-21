import { StyleSheet, Text, View, Pressable, ScrollView, Image, RefreshControl, } from "react-native"
import { useState, useCallback } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { getCartItems } from '../utils/cartFetch';
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { removeItemFromCart } from "../utils/cartFetch";


function CartScreen() {
    const nav = useNavigation();

    const { token } = useSelector((state) => state.auth);



    const [cartItems, setCartItems] = useState([]);

    const [refreshing, setRefreshing] = useState(false);

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

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getCartData().then(() => {
            setRefreshing(false);
        }).catch(() => {
            setRefreshing(false);
        });
    }, []);

    useFocusEffect(
        useCallback(() => {
            // Fetch cart data every time screen is focused
            getCartData();
        }, [])
    );

    const [deliveryAddress, setDeliveryAddress] = useState('Flat no 9B, Landmark World, Palazhi, Calicut');
    const [deliveryTime, setDeliveryTime] = useState('Breakfast - 7:30AM');

    const updateQuantity = (id, change) => {
        setCartItems(prevItems =>
            prevItems.map(item => {
                if (item.id === id) {
                    const newQuantity = Math.max(0, item.quantity + change);
                    return { ...item, quantity: newQuantity };
                }
                return item;
            }).filter(item => item.quantity > 0)
        );
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
                                        onPress={() => updateQuantity(item.id, -1)}
                                    >
                                        <Text style={styles.quantityButtonText}>-</Text>
                                    </Pressable>
                                    <Text style={styles.quantityText}>{item.quantity}</Text>
                                    <Pressable
                                        style={styles.quantityButton}
                                        onPress={() => updateQuantity(item.id, 1)}
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
                        <Pressable>
                            <Text style={styles.editIcon}>✏️</Text>
                        </Pressable>
                    </View>

                    {/* Delivery Time */}
                    <View style={styles.infoRow}>
                        <Text style={styles.infoIcon}>🕐</Text>
                        <Text style={styles.infoText}>{deliveryTime}</Text>
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
});