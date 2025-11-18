import React, { useEffect, useState } from "react";
import { View, ScrollView, Text, Pressable, Image, StyleSheet } from "react-native";
import ShimmerPlaceHolder from "react-native-shimmer-placeholder";
import { productFetchOnCategory } from "../utils/productFetch";

function ProductMenu({ selectedCategory: selectedCategoryProp }) {
    const [selectedCategory, setSelectedCategory] = useState('Veg');
    useEffect(() => {
        if (selectedCategoryProp && selectedCategoryProp !== selectedCategory) {
            setSelectedCategory(selectedCategoryProp);
        }
    }, [selectedCategoryProp]);
    const [frequentOrders, setFrequentOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');


    const menuCategories = [
        { id: 1, name: 'Meals', icon: '🍱' },
        { id: 2, name: 'Chicken', icon: '🍗' },
        { id: 3, name: 'Biryani', icon: '🍛' },
        { id: 4, name: 'Breakfast', icon: '🥞' },
        { id: 5, name: 'Fish', icon: '🐟' },
        { id: 6, name: 'Biryani', icon: '🍚' },
        { id: 7, name: 'Veg Rice', icon: '🍚' },
        { id: 8, name: 'Meals', icon: '🍱' },
    ];

    const orderData = async (category) => {
        setLoading(true);
        setError('');
        try {
            const res = await productFetchOnCategory(category);
            const products = res?.data ?? res?.products ?? res ?? [];
            setFrequentOrders(Array.isArray(products) ? products : []);
            console.log('Fetched products for category', category, products);
        } catch (err) {
            console.error('product fetch error', err);
            setError('Failed to load products');
            setFrequentOrders([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        orderData(selectedCategory);
    }, [selectedCategory]);

    return (
        <View style={localStyles.container}>

            {loading ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={localStyles.frequentOrdersContainer}>
                    {[...Array(3)].map((_, idx) => (
                        <View key={idx} style={localStyles.foodCard}>
                            <ShimmerPlaceHolder style={localStyles.foodImage} shimmerColors={['#565d4d', '#8e8e8e', "#564d4d"]} />
                            <ShimmerPlaceHolder style={{ height: 18, width: '80%', borderRadius: 4, marginBottom: 6 }} shimmerColors={['#565d4d', '#8e8e8e', "#564d4d"]} />
                            <View style={localStyles.foodInfo}>
                                <ShimmerPlaceHolder style={{ height: 12, width: 40, borderRadius: 4 }} shimmerColors={['#565d4d', '#8e8e8e', "#564d4d"]} />
                                <ShimmerPlaceHolder style={{ height: 12, width: 40, borderRadius: 4 }} shimmerColors={['#565d4d', '#8e8e8e', "#564d4d"]} />
                            </View>
                            <View style={localStyles.foodFooter}>
                                <ShimmerPlaceHolder style={{ height: 16, width: 50, borderRadius: 4 }} shimmerColors={['#565d4d', '#8e8e8e', "#564d4d"]} />
                                <ShimmerPlaceHolder style={{ height: 28, width: 28, borderRadius: 6 }} shimmerColors={['#565d4d', '#8e8e8e', "#564d4d"]} />
                            </View>
                        </View>
                    ))}
                </ScrollView>
            ) : error ? (
                <Text style={localStyles.errorText}>{error}</Text>
            ) : frequentOrders.length === 0 ? (
                <Text style={localStyles.emptyText}>No products in this category.</Text>
            ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={localStyles.frequentOrdersContainer}>
                    {frequentOrders.map((item) => (
                        <View key={item.id} style={localStyles.foodCard}>
                            <Image source={{ uri: item.ImageUrl }} style={localStyles.foodImage} />
                            <Text style={localStyles.foodName}>{item.name}</Text>
                            <View style={localStyles.foodInfo}>
                                <Text style={localStyles.rating}>⭐ {item.rating}</Text>
                                <Text style={localStyles.time}>🕐 {item.time}</Text>
                            </View>
                            <View style={localStyles.foodFooter}>
                                <Text style={localStyles.price}>{item.price}</Text>
                                <Pressable style={localStyles.addButton}>
                                    <Text style={localStyles.addButtonText}>+</Text>
                                </Pressable>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            )}

            <View style={localStyles.menuGrid}>
                {menuCategories.map((item) => (
                    <Pressable key={item.id} style={localStyles.menuItem}>
                        <View style={localStyles.menuIconContainer}>
                            <Text style={localStyles.menuIcon}>{item.icon}</Text>
                        </View>
                        <Text style={localStyles.menuText}>{item.name}</Text>
                    </Pressable>
                ))}
            </View>
        </View>
    );
}

export default ProductMenu;

const localStyles = StyleSheet.create({
    container: { paddingVertical: 8 },
    categoriesRow: { paddingHorizontal: 12, marginBottom: 12 },
    categoryPill: { paddingHorizontal: 12, paddingVertical: 8, marginRight: 8, borderRadius: 20, backgroundColor: 'transparent' },
    categoryActive: { backgroundColor: '#1a1a1a' },
    categoryText: { color: '#9ca3af' },
    categoryTextActive: { color: '#ffffff', fontWeight: '600' },
    frequentOrdersContainer: { paddingHorizontal: 12 },
    foodCard: { width: 160, marginRight: 12, backgroundColor: '#1a1a1a', borderRadius: 12, padding: 8 },
    foodImage: { width: '100%', height: 100, borderRadius: 8, marginBottom: 8 },
    foodName: { color: '#ffffff', fontWeight: '600', marginBottom: 6 },
    foodInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    rating: { color: '#9ca3af', fontSize: 12 },
    time: { color: '#9ca3af', fontSize: 12 },
    foodFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    price: { color: '#ffffff', fontWeight: '600' },
    addButton: { width: 28, height: 28, backgroundColor: '#16a34a', borderRadius: 6, justifyContent: 'center', alignItems: 'center' },
    addButtonText: { color: '#ffffff', fontWeight: '600' },
    menuGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, marginTop: 16, gap: 12 },
    menuItem: { width: '22%', alignItems: 'center', marginBottom: 12 },
    menuIconContainer: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#1a1a1a', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
    menuIcon: { fontSize: 24 },
    menuText: { color: '#ffffff', fontSize: 12, textAlign: 'center' },
    emptyText: { color: '#9ca3af', textAlign: 'center', paddingVertical: 12 },
    errorText: { color: '#ef4444', textAlign: 'center', paddingVertical: 12 },
});