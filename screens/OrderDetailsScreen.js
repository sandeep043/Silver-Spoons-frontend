import { StyleSheet, Text, View, Pressable, ScrollView, Image } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';

function OrderDetailsScreen() {
    const nav = useNavigation();
    const route = useRoute();
    const order = route.params?.order ?? {};

    const orderId = order.orderId ?? order._id ?? order.id ?? '—';
    const status = order.status ?? order.orderStatus ?? 'Pending';
    const date = order.date ?? (order.createdAt ? new Date(order.createdAt).toLocaleString() : '');
    const items = Array.isArray(order.items) ? order.items : [];
    const address = order.address ?? order.deliveryAddress ?? '';
    const paymentId = order.paymentId ? (order.paymentId._id ?? order.paymentId) : (order.paymentId ?? '—');
    const totalAmount = order.totalAmount ?? order.total ?? 0;

    const getStatusColor = (s) => {
        switch (s) {
            case 'Completed':
                return '#16a34a';
            case 'Processing':
            case 'Pending':
                return '#f59e0b';
            case 'Cancelled':
                return '#ef4444';
            default:
                return '#6b7280';
        }
    };

    const handleReorder = () => {
        // Implement reorder logic or navigation back to menu with items
        alert('Reorder feature is not implemented yet.');
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => nav.goBack()} style={styles.backButton}>
                    <Text style={styles.backIcon}>←</Text>
                </Pressable>
                <Text style={styles.title}>Order Details</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                <View style={styles.card}>
                    <View style={styles.rowBetween}>
                        <View>
                            <Text style={styles.orderId}>Order {orderId}</Text>
                            <Text style={styles.smallText}>{date}</Text>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(status) + '20' }]}>
                            <Text style={[styles.statusText, { color: getStatusColor(status) }]}>{status}</Text>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Items</Text>
                        {items.length === 0 ? (
                            <Text style={styles.emptyText}>No items available</Text>
                        ) : (
                            items.map((item, idx) => (
                                <View key={idx} style={styles.itemRow}>
                                    <Image source={{ uri: item.image }} style={styles.itemImage} />
                                    <View style={styles.itemInfo}>
                                        <Text style={styles.itemName}>{item.name}</Text>
                                        <Text style={styles.itemQty}>Qty: {item.quantity ?? item.qty ?? 1}</Text>
                                    </View>
                                    <Text style={styles.itemPrice}>₹{(item.price ?? item.unitPrice ?? 0) * (item.quantity ?? item.qty ?? 1)}</Text>
                                </View>
                            ))
                        )}
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Delivery Address</Text>
                        <Text style={styles.addressText}>{address || 'No address provided'}</Text>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.col}>
                            <Text style={styles.sectionTitle}>Payment ID</Text>
                            <Text style={styles.smallText}>{paymentId}</Text>
                        </View>
                        <View style={styles.col}>
                            <Text style={styles.sectionTitle}>Total</Text>
                            <Text style={styles.totalAmount}>₹{totalAmount}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ height: 120 }} />
            </ScrollView>

            <View style={styles.bottomBar}>
                <Text style={styles.bottomTotal}>Total: <Text style={styles.bottomTotalAmount}>₹{totalAmount}</Text></Text>
                <Pressable style={styles.reorderButton} onPress={handleReorder}>
                    <Text style={styles.reorderButtonText}>REORDER</Text>
                </Pressable>
            </View>
        </View>
    );
}

export default OrderDetailsScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a0a0a' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 50,
        paddingBottom: 16,
    },
    backButton: { width: 40, height: 40, justifyContent: 'center' },
    backIcon: { fontSize: 24, color: '#ffffff' },
    title: { fontSize: 20, fontWeight: '600', color: '#ffffff' },
    content: { padding: 16, paddingBottom: 0 },
    card: { backgroundColor: '#1a1a1a', borderRadius: 12, padding: 16 },
    rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    orderId: { fontSize: 16, fontWeight: '700', color: '#ffffff' },
    smallText: { fontSize: 12, color: '#6b7280', marginTop: 4 },
    statusBadge: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20 },
    statusText: { fontSize: 12, fontWeight: '600' },
    section: { marginTop: 16 },
    sectionTitle: { color: '#cbd5e1', fontSize: 14, fontWeight: '700', marginBottom: 8 },
    emptyText: { color: '#9ca3af' },
    itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    itemImage: { width: 60, height: 60, borderRadius: 8, marginRight: 12, backgroundColor: '#0b1220' },
    itemInfo: { flex: 1 },
    itemName: { color: '#ffffff', fontWeight: '600', marginBottom: 4 },
    itemQty: { color: '#6b7280' },
    itemPrice: { color: '#ffffff', fontWeight: '600' },
    addressText: { color: '#ffffff', lineHeight: 20 },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
    col: { flex: 1 },
    totalAmount: { color: '#16a34a', fontWeight: '700', fontSize: 18 },
    bottomBar: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#0a0a0a',
        borderTopWidth: 1,
        borderTopColor: '#1a1a1a',
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    bottomTotal: { color: '#cbd5e1', fontSize: 14 },
    bottomTotalAmount: { color: '#ffffff', fontWeight: '700' },
    reorderButton: { backgroundColor: '#16a34a', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 30 },
    reorderButtonText: { color: '#fff', fontWeight: '700' }
});
