import { StyleSheet, Text, View, Pressable, ScrollView, Image, ActivityIndicator } from "react-native"
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

function OrderHistoryScreen() {
    const nav = useNavigation();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState('All');

    const tabs = ['All', 'Completed', 'Processing', 'Cancelled'];

    // Sample order data - replace with API call
    const sampleOrders = [
        {
            id: 'ORD001',
            orderId: '#ORD001234',
            date: '15 Nov 2024',
            time: '10:30 AM',
            status: 'Completed',
            items: [
                {
                    name: 'Plain Dosa',
                    quantity: 2,
                    price: 80,
                    image: 'https://images.unsplash.com/photo-1694809434016-0c2e94b1d0c7?w=400'
                },
                {
                    name: 'Idli Sambar',
                    quantity: 1,
                    price: 60,
                    image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400'
                }
            ],
            totalAmount: 220,
            deliveryAddress: 'Flat no 9B, Landmark World, Palazhi, Calicut',
        },
        {
            id: 'ORD002',
            orderId: '#ORD001235',
            date: '14 Nov 2024',
            time: '08:15 PM',
            status: 'Processing',
            items: [
                {
                    name: 'Chicken Biryani',
                    quantity: 1,
                    price: 180,
                    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400'
                }
            ],
            totalAmount: 210,
            deliveryAddress: 'Flat no 9B, Landmark World, Palazhi, Calicut',
        },
        {
            id: 'ORD003',
            orderId: '#ORD001236',
            date: '12 Nov 2024',
            time: '07:00 AM',
            status: 'Completed',
            items: [
                {
                    name: 'Masala Dosa',
                    quantity: 3,
                    price: 100,
                    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400'
                },
                {
                    name: 'Filter Coffee',
                    quantity: 2,
                    price: 40,
                    image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400'
                }
            ],
            totalAmount: 380,
            deliveryAddress: 'Flat no 9B, Landmark World, Palazhi, Calicut',
        },
        {
            id: 'ORD004',
            orderId: '#ORD001237',
            date: '10 Nov 2024',
            time: '12:45 PM',
            status: 'Cancelled',
            items: [
                {
                    name: 'Fish Curry',
                    quantity: 1,
                    price: 150,
                    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400'
                }
            ],
            totalAmount: 180,
            deliveryAddress: 'Flat no 9B, Landmark World, Palazhi, Calicut',
        },
    ];

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setOrders(sampleOrders);
            setLoading(false);
        }, 1000);
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed':
                return '#16a34a';
            case 'Processing':
                return '#f59e0b';
            case 'Cancelled':
                return '#ef4444';
            default:
                return '#6b7280';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Completed':
                return '✓';
            case 'Processing':
                return '⏳';
            case 'Cancelled':
                return '✕';
            default:
                return '•';
        }
    };

    const filteredOrders = selectedTab === 'All'
        ? orders
        : orders.filter(order => order.status === selectedTab);

    const handleReorder = (order) => {
        alert(`Reordering: ${order.orderId}`);
        // Add reorder logic here
    };

    const handleViewDetails = (order) => {
        nav.navigate('OrderDetails', { order });
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => nav.goBack()} style={styles.backButton}>
                    <Text style={styles.backIcon}>←</Text>
                </Pressable>
                <Text style={styles.headerTitle}>Order History</Text>
                <View style={{ width: 40 }} />
            </View>

            {/* Tabs */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.tabsContainer}
            >
                {tabs.map((tab) => (
                    <Pressable
                        key={tab}
                        style={[
                            styles.tab,
                            selectedTab === tab && styles.tabActive
                        ]}
                        onPress={() => setSelectedTab(tab)}
                    >
                        <Text style={[
                            styles.tabText,
                            selectedTab === tab && styles.tabTextActive
                        ]}>
                            {tab}
                        </Text>
                    </Pressable>
                ))}
            </ScrollView>

            {/* Orders List */}
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#16a34a" />
                    <Text style={styles.loadingText}>Loading orders...</Text>
                </View>
            ) : filteredOrders.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyEmoji}>📦</Text>
                    <Text style={styles.emptyText}>No orders found</Text>
                    <Text style={styles.emptySubtext}>
                        {selectedTab === 'All'
                            ? "You haven't placed any orders yet"
                            : `No ${selectedTab.toLowerCase()} orders`}
                    </Text>
                    <Pressable style={styles.exploreButton} onPress={() => nav.navigate('Home')}>
                        <Text style={styles.exploreButtonText}>Explore Menu</Text>
                    </Pressable>
                </View>
            ) : (
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.ordersContainer}>
                        {filteredOrders.map((order) => (
                            <View key={order.id} style={styles.orderCard}>
                                {/* Order Header */}
                                <View style={styles.orderHeader}>
                                    <View style={styles.orderHeaderLeft}>
                                        <Text style={styles.orderId}>{order.orderId}</Text>
                                        <Text style={styles.orderDateTime}>
                                            {order.date} • {order.time}
                                        </Text>
                                    </View>
                                    <View style={[
                                        styles.statusBadge,
                                        { backgroundColor: getStatusColor(order.status) + '20' }
                                    ]}>
                                        <Text style={[
                                            styles.statusText,
                                            { color: getStatusColor(order.status) }
                                        ]}>
                                            {getStatusIcon(order.status)} {order.status}
                                        </Text>
                                    </View>
                                </View>

                                {/* Order Items */}
                                <View style={styles.orderItems}>
                                    {order.items.map((item, index) => (
                                        <View key={index} style={styles.orderItem}>
                                            <Image
                                                source={{ uri: item.image }}
                                                style={styles.itemImage}
                                            />
                                            <View style={styles.itemDetails}>
                                                <Text style={styles.itemName}>{item.name}</Text>
                                                <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
                                            </View>
                                            <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
                                        </View>
                                    ))}
                                </View>

                                {/* Order Footer */}
                                <View style={styles.orderFooter}>
                                    <View style={styles.totalContainer}>
                                        <Text style={styles.totalLabel}>Total Amount</Text>
                                        <Text style={styles.totalAmount}>₹{order.totalAmount}</Text>
                                    </View>
                                    <View style={styles.orderActions}>
                                        <Pressable
                                            style={styles.actionButton}
                                            onPress={() => handleViewDetails(order)}
                                        >
                                            <Text style={styles.actionButtonText}>View Details</Text>
                                        </Pressable>
                                        {order.status === 'Completed' && (
                                            <Pressable
                                                style={[styles.actionButton, styles.reorderButton]}
                                                onPress={() => handleReorder(order)}
                                            >
                                                <Text style={styles.reorderButtonText}>Reorder</Text>
                                            </Pressable>
                                        )}
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                    <View style={{ height: 100 }} />
                </ScrollView>
            )}
        </View>
    );
}

export default OrderHistoryScreen;

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
        paddingBottom: 16,
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
    tabsContainer: {
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    tab: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        marginRight: 12,
        borderRadius: 20,
        backgroundColor: '#1a1a1a',
    },
    tabActive: {
        backgroundColor: '#16a34a',
    },
    tabText: {
        fontSize: 14,
        color: '#9ca3af',
        fontWeight: '500',
    },
    tabTextActive: {
        color: '#ffffff',
        fontWeight: '600',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#9ca3af',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyEmoji: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#6b7280',
        textAlign: 'center',
        marginBottom: 24,
    },
    exploreButton: {
        backgroundColor: '#16a34a',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 24,
    },
    exploreButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    ordersContainer: {
        paddingHorizontal: 16,
        paddingTop: 8,
    },
    orderCard: {
        backgroundColor: '#1a1a1a',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#2a2a2a',
    },
    orderHeaderLeft: {
        flex: 1,
    },
    orderId: {
        fontSize: 18,
        fontWeight: '700',
        color: '#ffffff',
        marginBottom: 4,
    },
    orderDateTime: {
        fontSize: 12,
        color: '#6b7280',
    },
    statusBadge: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    orderItems: {
        marginBottom: 16,
    },
    orderItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    itemImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 12,
    },
    itemDetails: {
        flex: 1,
    },
    itemName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: 4,
    },
    itemQuantity: {
        fontSize: 13,
        color: '#6b7280',
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
    },
    orderFooter: {
        borderTopWidth: 1,
        borderTopColor: '#2a2a2a',
        paddingTop: 16,
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#9ca3af',
    },
    totalAmount: {
        fontSize: 20,
        fontWeight: '700',
        color: '#16a34a',
    },
    orderActions: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        flex: 1,
        backgroundColor: '#2a2a2a',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    actionButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
    },
    reorderButton: {
        backgroundColor: '#16a34a',
    },
    reorderButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
    },
});