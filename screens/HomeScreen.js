import { StyleSheet, Text, View, TextInput, Pressable, ScrollView, Image, TouchableOpacity, FlatList } from "react-native"
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, selectCategories } from '../store/categoriesSlice';
import { useNavigation } from '@react-navigation/native';
import { setItem } from "../utils/asyncStorage";
import Carousel from "../components/Carousel";
import ProductMenu from "../components/ProductMenu";
import { useEffect } from "react";

import biryaniImage from '../assets/offere banners/biryani combo.png';
import welcomeBackImage from '../assets/offere banners/welcomeBack.png';

import { getAllCategories } from "../utils/productFetch";
import { getDefaultAddress } from "../utils/AddressFetch";
import CombinationBreakFast from "../components/CombinationBreakFast";

function HomeScreen() {
    const nav = useNavigation();
    const [selectedCategory, setSelectedCategory] = useState('Beverages');
    const [searchText, setSearchText] = useState('');
    const dispatch = useDispatch();
    const categories = useSelector(selectCategories) ?? [];
    const [deliveryAddress, setDeliveryAddress] = useState('Fetching default address...');

    const { token } = useSelector((state) => state.auth);

    const rest = () => {
        setItem('onboarded', '0');
    }


    const loadDefaultAddress = async () => {
        try {
            const response = await getDefaultAddress(token);
            console.log('Default address:', response);
            if (response.data) {
                const addr = response.data;
                const fullAddress = `${addr.street}, ${addr.addressLine1}`;
                setDeliveryAddress(fullAddress);
            }
        } catch (error) {
            console.error('Failed to fetch default address:', error);
        }
    };

    useEffect(() => {

        dispatch(fetchCategories());
        loadDefaultAddress();

    }, [dispatch])


    const handleSearch = () => {
        nav.navigate('SearchTab', { query: searchText });

        setSearchText('');
    }




    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable style={styles.headerLeft} onPress={() => nav.navigate('Profile')}>
                    <Image
                        source={{ uri: 'https://i.pravatar.cc/100' }}
                        style={styles.avatar}
                    />
                    <View>
                        <Text style={styles.deliverTo}>Deliver To</Text>
                        <Text style={styles.location}>{deliveryAddress}</Text>
                    </View>
                </Pressable>
                <Pressable style={styles.notificationIcon}>
                    <Text style={styles.bellIcon}>🔔</Text>
                </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search"
                        placeholderTextColor="#6b7280"
                        value={searchText}
                        onChangeText={(text) => setSearchText(text)}
                        onSubmitEditing={handleSearch}
                    />
                    <Pressable style={styles.searchIcon} onPress={handleSearch}>
                        <Text>🔍</Text>
                    </Pressable>
                </View>

                {/* Banner Carousel */}
                <View style={styles.bannerWrapper}>
                    <Carousel dotCount={2}>
                        <View style={[styles.banner, styles.banner2]}>
                            <Image
                                source={welcomeBackImage}
                                style={styles.bannerImageFull}
                            />
                        </View>

                        <View style={[styles.banner, styles.banner2]}>
                            <Image
                                source={biryaniImage}
                                style={styles.bannerImageFull}
                            />
                        </View>
                    </Carousel>
                </View>


                {/* Categories Tabs */}
                {categories && categories.length > 0 && (
                    <FlatList
                        data={categories}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.categoriesContainer}
                        contentContainerStyle={{ paddingHorizontal: 16 }}
                        keyExtractor={(item, index) => String(item) + index}
                        renderItem={({ item: category }) => (
                            <Pressable
                                style={styles.categoryTab}
                                onPress={() => setSelectedCategory(category)}
                            >
                                <Text style={[
                                    styles.categoryText,
                                    selectedCategory === category && styles.categoryTextActive
                                ]}>
                                    {category}
                                </Text>
                                {selectedCategory === category && (
                                    <View style={styles.categoryUnderline} />
                                )}
                            </Pressable>
                        )}
                    />
                )}

                {/* Product menu (Frequent Orders + Menu Grid) */}
                <ProductMenu selectedCategory={selectedCategory} />

                <CombinationBreakFast />






            </ScrollView>

            <TouchableOpacity onPress={rest} ><Text style={{ color: 'white' }} >rest</Text></TouchableOpacity>
        </View>
    );
}

export default HomeScreen;

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
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    deliverTo: {
        fontSize: 12,
        color: '#6b7280',
    },
    location: {
        fontSize: 14,
        color: '#ffffff',
        fontWeight: '600',
        width: 200,
    },
    notificationIcon: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bellIcon: {
        fontSize: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginVertical: 16,
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        paddingHorizontal: 16,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 12,
        color: '#ffffff',
        fontSize: 14,
    },
    searchIcon: {
        padding: 8,
    },
    bannerContainer: {
        marginBottom: 12,
    },
    bannerWrapper: {
        height: 200,
        marginBottom: 8,
    },
    banner: {
        marginHorizontal: 16,
        borderRadius: 16,
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: 320,
        height: 200,
    },
    banner2: {
        backgroundColor: '#1e3a8a',
    },
    bannerContent: {
        flex: 1,
    },
    bannerDiscount: {
        fontSize: 24,
        fontWeight: '700',
        color: '#ffffff',
        marginBottom: 8,
    },
    bannerWelcome: {
        fontSize: 12,
        color: '#ffffff',
        marginBottom: 12,
    },
    orderButton: {
        backgroundColor: '#000000',
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 20,
        alignSelf: 'flex-start',
    },
    orderButtonText: {
        color: '#ffffff',
        fontSize: 10,
        fontWeight: '600',
    },
    bannerImage: {
        width: 100,
        height: 100,
        borderRadius: 12,
    },
    bannerImageFull: {
        width: 320,
        height: 200,
        borderRadius: 16,
        position: 'absolute',
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 6,
        marginBottom: 20,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#374151',
    },
    dotActive: {
        backgroundColor: '#ffffff',
    },
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
    },
    frequentOrdersContainer: {
        marginBottom: 24,
        paddingHorizontal: 16,
    },
    foodCard: {
        width: 160,
        marginRight: 16,
        backgroundColor: '#1a1a1a',
        borderRadius: 16,
        padding: 12,
    },
    foodImage: {
        width: '100%',
        height: 120,
        borderRadius: 12,
        marginBottom: 8,
    },
    foodName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: 4,
    },
    foodInfo: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 8,
    },
    rating: {
        fontSize: 12,
        color: '#9ca3af',
    },
    time: {
        fontSize: 12,
        color: '#9ca3af',
    },
    foodFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
    },
    addButton: {
        width: 28,
        height: 28,
        backgroundColor: '#16a34a',
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonText: {
        fontSize: 18,
        color: '#ffffff',
        fontWeight: '600',
    },
    menuGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 16,
        marginBottom: 24,
        gap: 16,
    },
    menuItem: {
        width: '22%',
        alignItems: 'center',
    },
    menuIconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#1a1a1a',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    menuIcon: {
        fontSize: 28,
    },
    menuText: {
        fontSize: 12,
        color: '#ffffff',
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#ffffff',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    listCard: {
        flexDirection: 'row',
        marginHorizontal: 16,
        marginBottom: 16,
        backgroundColor: '#1a1a1a',
        borderRadius: 16,
        padding: 12,
        alignItems: 'center',
    },
    listImage: {
        width: 80,
        height: 80,
        borderRadius: 12,
        marginRight: 12,
    },
    listContent: {
        flex: 1,
    },
    listName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: 4,
    },
    listInfo: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 4,
    },
    listRating: {
        fontSize: 11,
        color: '#9ca3af',
    },
    listTime: {
        fontSize: 11,
        color: '#9ca3af',
    },
    listPrice: {
        fontSize: 14,
        fontWeight: '600',
        color: '#ffffff',
    },
    listAddButton: {
        width: 28,
        height: 28,
        backgroundColor: '#16a34a',
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listAddButtonText: {
        fontSize: 18,
        color: '#ffffff',
        fontWeight: '600',
    },
    recommendedContainer: {
        marginBottom: 24,
        paddingHorizontal: 16,
    },
    recommendedCard: {
        width: 140,
        marginRight: 16,
        backgroundColor: '#1a1a1a',
        borderRadius: 16,
        padding: 12,
    },
    recommendedImage: {
        width: '100%',
        height: 100,
        borderRadius: 12,
        marginBottom: 8,
    },
    recommendedName: {
        fontSize: 13,
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: 4,
    },
    recommendedInfo: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 8,
    },
    recommendedRating: {
        fontSize: 11,
        color: '#9ca3af',
    },
    recommendedTime: {
        fontSize: 11,
        color: '#9ca3af',
    },
    recommendedFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    recommendedPrice: {
        fontSize: 14,
        fontWeight: '600',
        color: '#ffffff',
    },
    recommendedAddButton: {
        width: 24,
        height: 24,
        backgroundColor: '#16a34a',
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    recommendedAddButtonText: {
        fontSize: 16,
        color: '#ffffff',
        fontWeight: '600',
    },
});