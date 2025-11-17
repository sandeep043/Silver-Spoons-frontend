import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native'

function ProductDetailsScreen() {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Locations</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
                <View style={styles.locationCard}>
                    <Text style={styles.icon}>📍</Text>
                    <View style={styles.locationInfo}>
                        <Text style={styles.locationName}>Home</Text>
                        <Text style={styles.locationAddress}>123 Main Street, Calicut</Text>
                    </View>
                    <Pressable style={styles.selectButton}>
                        <Text style={styles.selectButtonText}>Select</Text>
                    </Pressable>
                </View>
                <View style={styles.locationCard}>
                    <Text style={styles.icon}>📍</Text>
                    <View style={styles.locationInfo}>
                        <Text style={styles.locationName}>Office</Text>
                        <Text style={styles.locationAddress}>456 Business Ave, Calicut</Text>
                    </View>
                    <Pressable style={styles.selectButton}>
                        <Text style={styles.selectButtonText}>Select</Text>
                    </Pressable>
                </View>
                <Pressable style={styles.addButton}>
                    <Text style={styles.addButtonText}>+ Add New Location</Text>
                </Pressable>
            </ScrollView>
        </View>
    )
}

export default ProductDetailsScreen;

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
    locationCard: {
        flexDirection: 'row',
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        alignItems: 'center',
    },
    icon: {
        fontSize: 28,
        marginRight: 12,
    },
    locationInfo: {
        flex: 1,
    },
    locationName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: 4,
    },
    locationAddress: {
        fontSize: 12,
        color: '#6b7280',
    },
    selectButton: {
        backgroundColor: '#26469d',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
    },
    selectButtonText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: '600',
    },
    addButton: {
        borderWidth: 1,
        borderColor: '#26469d',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 12,
    },
    addButtonText: {
        color: '#26469d',
        fontSize: 16,
        fontWeight: '600',
    },
});