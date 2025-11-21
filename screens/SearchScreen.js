import { StyleSheet, Text, View, TextInput, Pressable, FlatList, Image, ActivityIndicator } from "react-native"
import { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { searchProducts } from '../utils/productFetch';
import { getAllCategories } from "../utils/productFetch";

function SearchScreen() {
    const nav = useNavigation();
    const route = useRoute();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [allItems, setAllItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');


    //get query from navigation params
    useEffect(() => {
        const query = route.params?.query || '';
        if (query) {
            setSearchQuery(query);
        }
    }, [route.params?.query]);

    // Dropdown states
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedSort, setSelectedSort] = useState('None');
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [categories, setCategories] = useState(["All"]);

    // const categories = ['All', 'Breakfast', 'Meals', 'Snacks', 'Beverages'];
    const sortOptions = ['None', 'Price: Low to High', 'Price: High to Low', 'Rating: High to Low'];

    const getCategories = async () => {
        try {
            const response = await getAllCategories();
            const apiCats = Array.isArray(response) ? response : [];
            const merged = ['All', ...apiCats.filter(c => String(c).toLowerCase() !== 'all')];
            setCategories(merged);
        } catch (err) {
            console.error('Failed to load categories for search dropdown', err);

        }
    }

    useEffect(() => {
        getCategories();
    }, []);

    // Debounced backend search with filters
    useEffect(() => {
        const q = searchQuery.trim();
        if (q === '') {
            setSearchResults([]);
            setError('');
            setLoading(false);
            return;
        }

        setLoading(true);
        setError('');
        const t = setTimeout(async () => {
            try {
                // Build query params
                const params = { query: q, limit: 20 };

                // Add category filter if not "All"
                if (selectedCategory !== 'All') {
                    params.category = selectedCategory;
                }

                // Add sort parameter
                if (selectedSort !== 'None') {
                    if (selectedSort === 'Price: Low to High') {
                        params.sortBy = 'price';
                        params.order = 'asc';
                    } else if (selectedSort === 'Price: High to Low') {
                        params.sortBy = 'price';
                        params.order = 'desc';
                    } else if (selectedSort === 'Rating: High to Low') {
                        params.sortBy = 'rating';
                        params.order = 'desc';
                    }
                }

                const { products = [], meta } = await searchProducts(params);
                setAllItems(products);
                setSearchResults(products);
            } catch (err) {
                console.error('search error', err);
                setError('Failed to fetch results');
                setAllItems([]);
                setSearchResults([]);
            } finally {
                setLoading(false);
            }
        }, 350);

        return () => clearTimeout(t);
    }, [searchQuery, selectedCategory, selectedSort]);

    const handleSearch = (text) => {
        setSearchQuery(text);
    };

    const clearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
    };

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setShowCategoryDropdown(false);
        // The useEffect will automatically trigger the search with new category
    };

    const handleSortSelect = (sort) => {
        setSelectedSort(sort);
        setShowSortDropdown(false);
        // The useEffect will automatically trigger the search with new sort
    };

    return (
        <View style={styles.container}>
            {/* Header with Search Bar */}
            <View style={styles.header}>
                <Pressable onPress={() => nav.goBack()} style={styles.backButton}>
                    <Text style={styles.backIcon}>←</Text>
                </Pressable>
            </View>

            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search for dishes..."
                    placeholderTextColor="#6b7280"
                    value={searchQuery}
                    onChangeText={handleSearch}
                    autoFocus={true}
                />
                {searchQuery.length > 0 && (
                    <Pressable onPress={clearSearch}>
                        <Text style={styles.clearIcon}>✕</Text>
                    </Pressable>
                )}
                <Text style={styles.searchIcon}>🔍</Text>
            </View>

            {/* Filter Dropdowns */}
            <View style={styles.filterContainer}>
                {/* Category Dropdown */}
                <View style={styles.dropdownWrapper}>
                    <Pressable
                        style={styles.dropdownButton}
                        onPress={() => {
                            setShowCategoryDropdown(!showCategoryDropdown);
                            setShowSortDropdown(false);
                        }}
                    >
                        <Text style={styles.dropdownLabel}>Category</Text>
                        <Text style={styles.dropdownValue}>{selectedCategory}</Text>
                        <Text style={styles.dropdownArrow}>{showCategoryDropdown ? '▲' : '▼'}</Text>
                    </Pressable>
                    {showCategoryDropdown && (
                        <View style={styles.dropdownMenu}>
                            {categories.map((category, index) => (
                                <Pressable
                                    key={index}
                                    style={[
                                        styles.dropdownItem,
                                        selectedCategory === category && styles.dropdownItemActive,
                                        index === categories.length - 1 && { borderBottomWidth: 0 }
                                    ]}
                                    onPress={() => handleCategorySelect(category)}
                                >
                                    <Text style={[
                                        styles.dropdownItemText,
                                        selectedCategory === category && styles.dropdownItemTextActive
                                    ]}>
                                        {category}
                                    </Text>
                                    {selectedCategory === category && (
                                        <Text style={styles.checkMark}>✓</Text>
                                    )}
                                </Pressable>
                            ))}
                        </View>
                    )}
                </View>

                {/* Sort Dropdown */}
                <View style={styles.dropdownWrapper}>
                    <Pressable
                        style={styles.dropdownButton}
                        onPress={() => {
                            setShowSortDropdown(!showSortDropdown);
                            setShowCategoryDropdown(false);
                        }}
                    >
                        <Text style={styles.dropdownLabel}>Sort By</Text>
                        <Text style={styles.dropdownValue}>
                            {selectedSort === 'None' ? 'Default' : selectedSort.split(':')[0]}
                        </Text>
                        <Text style={styles.dropdownArrow}>{showSortDropdown ? '▲' : '▼'}</Text>
                    </Pressable>
                    {showSortDropdown && (
                        <View style={styles.dropdownMenu}>
                            {sortOptions.map((option, index) => (
                                <Pressable
                                    key={index}
                                    style={[
                                        styles.dropdownItem,
                                        selectedSort === option && styles.dropdownItemActive,
                                        index === sortOptions.length - 1 && { borderBottomWidth: 0 }
                                    ]}
                                    onPress={() => handleSortSelect(option)}
                                >
                                    <Text style={[
                                        styles.dropdownItemText,
                                        selectedSort === option && styles.dropdownItemTextActive
                                    ]}>
                                        {option === 'None' ? 'Default' : option}
                                    </Text>
                                    {selectedSort === option && (
                                        <Text style={styles.checkMark}>✓</Text>
                                    )}
                                </Pressable>
                            ))}
                        </View>
                    )}
                </View>
            </View>

            <View style={{ flex: 1 }}>
                {/* Search Results */}
                {searchQuery.length > 0 && (
                    <View style={styles.resultsContainer}>
                        {loading ? (
                            <ActivityIndicator size="small" color="#ffffff" style={{ marginVertical: 20 }} />
                        ) : error ? (
                            <View style={styles.noResultsContainer}>
                                <Text style={styles.noResultsText}>{error}</Text>
                            </View>
                        ) : searchResults.length > 0 ? (
                            <>
                                <Text style={styles.resultsCount}>
                                    {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} found
                                </Text>
                                <FlatList
                                    data={searchResults}
                                    keyExtractor={(item) => (item._id ?? item.id ?? String(item.name))}
                                    renderItem={({ item }) => (
                                        <Pressable key={item._id ?? item.id} style={styles.resultCard}>
                                            <Image source={{ uri: item.image ?? item.ImageUrl }} style={styles.resultImage} />
                                            <View style={styles.resultContent}>
                                                <Text style={styles.resultName}>{item.name}</Text>
                                                <Text style={styles.resultCategory}>{item.category}</Text>
                                                <View style={styles.resultInfo}>
                                                    <Text style={styles.resultRating}>⭐ {item.rating}</Text>
                                                    <Text style={styles.resultTime}>🕐 {item.time}</Text>
                                                </View>
                                            </View>
                                            <View style={styles.resultRight}>
                                                <Text style={styles.resultPrice}>{item.price}</Text>
                                                <Pressable style={styles.addButton}>
                                                    <Text style={styles.addButtonText}>+</Text>
                                                </Pressable>
                                            </View>
                                        </Pressable>
                                    )}
                                    ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                                />
                            </>
                        ) : (
                            <View style={styles.noResultsContainer}>
                                <Text style={styles.noResultsEmoji}>🔍</Text>
                                <Text style={styles.noResultsText}>No results found</Text>
                                <Text style={styles.noResultsSubtext}>
                                    Try searching for something else
                                </Text>
                            </View>
                        )}
                    </View>
                )}

                {/* Empty State */}
                {searchQuery.length === 0 && (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyEmoji}>🍽️</Text>
                        <Text style={styles.emptyText}>Search for your favorite dishes</Text>
                        <Text style={styles.emptySubtext}>
                            Try "Dosa", "Biryani", "Fish" or any dish name
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
}

export default SearchScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a0a',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 50,
        paddingBottom: 16,
        gap: 12,
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
    searchContainer: {
        marginHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 12,
    },
    searchIcon: {
        fontSize: 18,
    },
    searchInput: {
        flex: 1,
        color: '#ffffff',
        fontSize: 16,
    },
    clearIcon: {
        fontSize: 18,
        color: '#6b7280',
    },
    filterContainer: {
        marginHorizontal: 16,
        marginTop: 12,
        marginBottom: 4,
        flexDirection: 'row',
        gap: 12,
    },
    dropdownWrapper: {
        flex: 1,
        position: 'relative',
        zIndex: 1,
    },
    dropdownButton: {
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    dropdownLabel: {
        fontSize: 11,
        color: '#6b7280',
    },
    dropdownValue: {
        flex: 1,
        fontSize: 13,
        color: '#ffffff',
        fontWeight: '500',
    },
    dropdownArrow: {
        fontSize: 10,
        color: '#9ca3af',
    },
    dropdownMenu: {
        position: 'absolute',
        top: 45,
        left: 0,
        right: 0,
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        overflow: 'hidden',
        zIndex: 1000,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    dropdownItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#2a2a2a',
    },
    dropdownItemActive: {
        backgroundColor: '#2a2a2a',
    },
    dropdownItemText: {
        fontSize: 14,
        color: '#9ca3af',
    },
    dropdownItemTextActive: {
        color: '#ffffff',
        fontWeight: '600',
    },
    checkMark: {
        fontSize: 16,
        color: '#16a34a',
        fontWeight: 'bold',
    },
    resultsContainer: {
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    resultsCount: {
        fontSize: 14,
        color: '#9ca3af',
        marginBottom: 16,
    },
    resultCard: {
        flexDirection: 'row',
        backgroundColor: '#1a1a1a',
        borderRadius: 16,
        padding: 12,
        marginBottom: 12,
        alignItems: 'center',
    },
    resultImage: {
        width: 80,
        height: 80,
        borderRadius: 12,
        marginRight: 12,
    },
    resultContent: {
        flex: 1,
    },
    resultName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: 4,
    },
    resultCategory: {
        fontSize: 12,
        color: '#6b7280',
        marginBottom: 4,
    },
    resultInfo: {
        flexDirection: 'row',
        gap: 12,
    },
    resultRating: {
        fontSize: 12,
        color: '#9ca3af',
    },
    resultTime: {
        fontSize: 12,
        color: '#9ca3af',
    },
    resultRight: {
        alignItems: 'flex-end',
        gap: 8,
    },
    resultPrice: {
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
    noResultsContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
        paddingHorizontal: 40,
    },
    noResultsEmoji: {
        fontSize: 64,
        marginBottom: 16,
    },
    noResultsText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: 8,
    },
    noResultsSubtext: {
        fontSize: 14,
        color: '#6b7280',
        textAlign: 'center',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 120,
        paddingHorizontal: 40,
    },
    emptyEmoji: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptySubtext: {
        fontSize: 14,
        color: '#6b7280',
        textAlign: 'center',
    },
});