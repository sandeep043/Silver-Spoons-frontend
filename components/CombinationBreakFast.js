import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, Pressable, StyleSheet } from 'react-native';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import { getAllComboCategories } from '../utils/productFetch';
import { productFetchOnCategory } from '../utils/productFetch';
import { addItemToCart } from '../utils/cartFetch';
import { useSelector } from 'react-redux';

export default function CombinationBreakFast({ selectedCategory: selectedCategoryProp }) {
    const [comboItems, setComboItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(selectedCategoryProp || null);
    const [categories, setCategories] = useState([]);

    const { token } = useSelector((state) => state.auth || {});

    const handleAddCart = async (item) => {
        try {
            const id = item?._id || item?.id;
            if (!id) return;
            const response = await addItemToCart(id, token);
            console.log('Add to cart response:', response);
        } catch (err) {
            console.error('Add to cart failed', err);
        }
    };

    // Fetch categories and/or items on mount
    const initFetch = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await getAllComboCategories();
            const data = res?.data ?? [];

            // If API returned category names (array of strings)
            if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'string') {
                setCategories(data);
                const cat = selectedCategoryProp || selectedCategory || data[0];
                setSelectedCategory(cat);
                const productsRes = await productFetchOnCategory(cat);
                const products = productsRes?.data ?? productsRes ?? [];
                setComboItems(Array.isArray(products) ? products : []);
                return;
            }

            // Otherwise assume data is already items
            setComboItems(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error fetching combo items:', err);
            setError('Failed to load combo breakfast items');
            setComboItems([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        initFetch();
    }, []);

    // when selectedCategory is changed by the user, fetch products for that category
    useEffect(() => {
        if (!selectedCategory) return;
        const fetchForCategory = async () => {
            setLoading(true);
            try {
                const productsRes = await productFetchOnCategory(selectedCategory);
                const products = productsRes?.data ?? productsRes ?? [];
                setComboItems(Array.isArray(products) ? products : []);
            } catch (err) {
                console.error('Failed to fetch products for category', selectedCategory, err);
                setError('Failed to load products for category');
                setComboItems([]);
            } finally {
                setLoading(false);
            }
        };
        fetchForCategory();
    }, [selectedCategory]);

    const renderItem = ({ item }) => (
        <View style={styles.listCard}>
            <Image source={{ uri: item.image || item.ImageUrl }} style={styles.listImage} />
            <View style={styles.listContent}>
                <Text style={styles.listName}>{item.name}</Text>
                <View style={styles.listInfo}>
                    <Text style={styles.listRating}>⭐ {item.rating ?? '-'}</Text>
                    <Text style={styles.listTime}>🕐 {item.time ?? '-'}</Text>
                </View>
                <Text style={styles.listPrice}>{item.price}</Text>
            </View>
            <Pressable style={styles.listAddButton} onPress={() => handleAddCart(item)}>
                <Text style={styles.listAddButtonText}>+</Text>
            </Pressable>
        </View>
    );

    const renderShimmer = () => (
        <View style={styles.listCard}>
            <ShimmerPlaceHolder style={styles.listImage} shimmerColors={["#565d4d", "#8e8e8e", "#564d4d"]} />
            <View style={styles.listContent}>
                <ShimmerPlaceHolder style={{ height: 18, width: '60%', borderRadius: 4, marginBottom: 6 }} shimmerColors={["#565d4d", "#8e8e8e", "#564d4d"]} />
                <View style={styles.listInfo}>
                    <ShimmerPlaceHolder style={{ height: 12, width: 40, borderRadius: 4 }} shimmerColors={["#565d4d", "#8e8e8e", "#564d4d"]} />
                    <ShimmerPlaceHolder style={{ height: 12, width: 40, borderRadius: 4 }} shimmerColors={["#565d4d", "#8e8e8e", "#564d4d"]} />
                </View>
                <ShimmerPlaceHolder style={{ height: 16, width: 50, borderRadius: 4, marginTop: 8 }} shimmerColors={["#565d4d", "#8e8e8e", "#564d4d"]} />
            </View>
            <ShimmerPlaceHolder style={{ height: 36, width: 36, borderRadius: 6, marginRight: 12 }} shimmerColors={["#565d4d", "#8e8e8e", "#564d4d"]} />
        </View>
    );

    return (
        <View>
            {/* Category picker (horizontal) */}
            <Text style={styles.sectionTitle}>Combination Breakfast</Text>
            {categories && categories.length > 0 && (
                <FlatList
                    data={categories}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.categoriesContainer}
                    contentContainerStyle={{ paddingHorizontal: 12 }}
                    keyExtractor={(cat) => String(cat)}
                    renderItem={({ item: cat }) => (
                        <Pressable
                            onPress={() => setSelectedCategory(cat)}
                            style={styles.categoryTab}
                        >
                            <Text style={[
                                styles.categoryText,
                                selectedCategory === cat && styles.categoryTextActive
                            ]}>
                                {cat}
                            </Text>
                            {selectedCategory === cat && (
                                <View style={styles.categoryUnderline} />
                            )}
                        </Pressable>
                    )}
                />
            )}

            {loading ? (
                <FlatList
                    data={[1, 2, 3]}
                    keyExtractor={(v, i) => `shimmer-${i}`}
                    renderItem={() => renderShimmer()}
                />
            ) : error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : comboItems.length === 0 ? (
                <Text style={styles.emptyText}>No combo breakfast items found.</Text>
            ) : (
                <FlatList
                    data={comboItems}
                    keyExtractor={(item) => (item.id || item._id || String(item.name))}
                    renderItem={renderItem}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    listCard: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#131010ff', marginBottom: 10, borderRadius: 12, marginHorizontal: 12 },
    listImage: { width: 80, height: 80, borderRadius: 8, marginRight: 12, backgroundColor: '#222' },
    listContent: { flex: 1 },
    listName: { color: '#ffffff', fontWeight: '600', marginBottom: 6 },
    listInfo: { flexDirection: 'row', justifyContent: 'flex-start', gap: 12, marginBottom: 6 },
    listRating: { color: '#9ca3af', fontSize: 12, marginRight: 12 },
    listTime: { color: '#9ca3af', fontSize: 12 },
    listPrice: { color: '#ffffff', fontWeight: '600' },
    listAddButton: { width: 36, height: 36, backgroundColor: '#16a34a', borderRadius: 6, justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
    listAddButtonText: { color: '#ffffff', fontWeight: '600' },
    emptyText: { color: '#9ca3af', textAlign: 'center', paddingVertical: 12 },
    errorText: { color: '#ef4444', textAlign: 'center', paddingVertical: 12 },
    categoriesContainer: {
        marginBottom: 20,
        paddingHorizontal: 16,
    },
    categoryTab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 12,
        borderRadius: 20,
        backgroundColor: 'transparent',
    },
    categoryTabActive: {},
    categoryUnderline: {
        height: 3,
        width: 38,
        backgroundColor: '#f70808',
        borderRadius: 2,
        marginTop: 6,
        alignSelf: 'center'
    },
    categoryText: {
        fontSize: 14,
        color: '#6b7280',
    },
    categoryTextActive: {
        color: '#ffffff',
        fontWeight: '600',
    }, sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#ffffff',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
});