import { StyleSheet, Text, View, Pressable, ScrollView, Image, Dimensions } from "react-native"
import { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { addItemToCart } from "../utils/cartFetch";
import { useSelector } from "react-redux";

const { width } = Dimensions.get('window');

function ProductViewScreen() {
    const { token } = useSelector((state) => state.auth);
    const nav = useNavigation();
    const route = useRoute();

    // Get product data from route params or use sample data
    const product = route.params?.product || null;
    console.log(product)
    const [quantity, setQuantity] = useState(1);

    const addToCart = async (itemId) => {
        // Add to cart logic here
        const response = await addItemToCart(itemId, token);
        alert(`Added ${quantity} ${product.name} to cart!`);
    };

    //   const handleAddCart = async (itemId) => {

    //     const response = await addItemToCart(itemId, token);
    //     console.log('Add to cart response:', response);

    // }
    // const renderStars = (rating) => {
    //     if (!rating || typeof rating !== 'number') return [];
    //     const stars = [];
    //     const fullStars = Math.floor(rating);
    //     const hasHalfStar = rating % 1 !== 0;

    //     for (let i = 0; i < fullStars; i++) {
    //         stars.push(<Text key={i} style={styles.star}>⭐</Text>);
    //     }
    //     if (hasHalfStar) {
    //         stars.push(<Text key="half" style={styles.star}>⭐</Text>);
    //     }
    //     return stars;
    // };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => nav.goBack()} style={styles.headerButton}>
                    <Text style={styles.headerIcon}>←</Text>
                </Pressable>
                <View style={styles.headerRight}>
                    <Pressable style={styles.headerButton}>
                        <Text style={styles.headerIcon}>🔍</Text>
                    </Pressable>
                    <Pressable style={styles.headerButton} onPress={() => nav.navigate('Cart')}>
                        <Text style={styles.headerIcon}>🛒</Text>
                    </Pressable>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Product Image */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: product.ImageUrl }}
                        style={styles.productImage}
                        resizeMode="cover"
                    />
                    {/* <View style={styles.vegIndicator}>
                        <View style={styles.vegDot} />
                    </View> */}
                    {product.type === 'Vegetarian' && (<View style={styles.vegIndicator}>
                        <View style={styles.vegDot} />
                    </View>

                    )}
                    {
                        product.type === 'Non-Vegetarian' && (<View style={[styles.vegIndicator, { borderColor: '#dc2626' }]}>
                            <View style={[styles.vegDot, { backgroundColor: '#dc2626' }]} />
                        </View>)
                    }

                </View>

                {/* Product Info */}
                <View style={styles.contentContainer}>
                    {/* Product Name & Rating */}
                    <Text style={styles.productName}>{product.name}</Text>
                    {/* <View style={styles.ratingContainer}>
                        <View style={styles.stars}>
                            {renderStars(product.rating)}
                        </View>
                        <Text style={styles.ratingText}>{product.rating}</Text>
                    </View> */}

                    {/* Price */}
                    <View style={styles.priceContainer}>
                        <Text style={styles.price}>₹ {product.price}</Text>
                        {/* {product.originalPrice && (
                            <Text style={styles.originalPrice}>₹{product.originalPrice}</Text>
                        )} */}
                    </View>

                    {/* Description */}
                    <Text style={styles.description}>{product.description}</Text>

                    {/* Nutrition Info */}
                    {product && (
                        <View style={styles.nutritionContainer}>
                            <View style={styles.nutritionItem}>
                                <Text style={styles.nutritionValue}>{product.calories ?? '-kcl'}</Text>
                                <Text style={styles.nutritionLabel}>calories</Text>
                            </View>
                            <View style={styles.nutritionItem}>
                                <Text style={styles.nutritionValue}>{product.grams ?? '-'}</Text>
                                <Text style={styles.nutritionLabel}>grams</Text>
                            </View>
                            {/* <View style={styles.nutritionItem}>
                                <Text style={styles.nutritionValue}>{product.nutrition.fat ?? '-'}</Text>
                                <Text style={styles.nutritionLabel}>Fat</Text>
                            </View>
                            <View style={styles.nutritionItem}>
                                <Text style={styles.nutritionValue}>{product.nutrition.protein ?? '-'}</Text>
                                <Text style={styles.nutritionLabel}>Protein</Text>
                            </View> */}
                        </View>
                    )}

                    {/* Add to Cart Button */}
                    <Pressable style={styles.addToCartButton} onPress={addToCart(product._id)}>
                        <Text style={styles.addToCartText}>ADD TO CART</Text>
                    </Pressable>

                    {/* Ingredients */}
                    {product.ingredients && product.ingredients.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Ingredients</Text>
                            <View style={styles.ingredientsList}>
                                {product.ingredients.map((ingredient, index) => (
                                    <View key={index} style={styles.ingredientRow}>
                                        <Text style={styles.bullet}>•</Text>
                                        <Text style={styles.ingredientText}>{ingredient}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Storage Terms */}
                    {/* <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Terms & Conditions of storage</Text>
                        <Text style={styles.storageText}>{product.storage}</Text>
                    </View> */}

                    {/* Reviews */}
                    {product.reviews && product.reviews.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Reviews</Text>
                            {product.reviews.map((review) => (
                                <View key={review.id} style={styles.reviewCard}>
                                    <Image
                                        source={{ uri: review.avatar }}
                                        style={styles.reviewAvatar}
                                    />
                                    <View style={styles.reviewContent}>
                                        <Text style={styles.reviewName}>{review.name}</Text>
                                        <Text style={styles.reviewComment}>{review.comment}</Text>
                                        <View style={styles.reviewStars}>
                                            {renderStars(review.rating)}
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}

                    <View style={{ height: 100 }} />
                </View>
            </ScrollView>
        </View>
    );
}

export default ProductViewScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a0a',
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 50,
        paddingBottom: 16,
        zIndex: 10,
    },
    headerButton: {
        width: 40,
        height: 40,
        backgroundColor: 'rgba(26, 26, 26, 0.8)',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerIcon: {
        fontSize: 20,
        color: '#ffffff',
    },
    headerRight: {
        flexDirection: 'row',
        gap: 12,
    },
    imageContainer: {
        width: width,
        height: width * 1.2,
        position: 'relative',
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    vegIndicator: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        width: 24,
        height: 24,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#16a34a',
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    vegDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#16a34a',
    },
    contentContainer: {
        padding: 20,
    },
    productName: {
        fontSize: 28,
        fontWeight: '700',
        color: '#ffffff',
        marginBottom: 8,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    stars: {
        flexDirection: 'row',
        marginRight: 8,
    },
    star: {
        fontSize: 14,
    },
    ratingText: {
        fontSize: 14,
        color: '#9ca3af',
        fontWeight: '600',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    price: {
        fontSize: 32,
        fontWeight: '700',
        color: '#ffffff',
        marginRight: 12,
    },
    originalPrice: {
        fontSize: 18,
        color: '#6b7280',
        textDecorationLine: 'line-through',
    },
    description: {
        fontSize: 14,
        color: '#9ca3af',
        lineHeight: 22,
        marginBottom: 20,
    },
    nutritionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
    },
    nutritionItem: {
        alignItems: 'center',
    },
    nutritionValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#ffffff',
        marginBottom: 4,
    },
    nutritionLabel: {
        fontSize: 12,
        color: '#6b7280',
    },
    addToCartButton: {
        backgroundColor: '#16a34a',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 32,
    },
    addToCartText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 1,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#ffffff',
        marginBottom: 16,
    },
    ingredientsList: {
        gap: 8,
    },
    ingredientRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    bullet: {
        fontSize: 16,
        color: '#ffffff',
        marginRight: 8,
        marginTop: 2,
    },
    ingredientText: {
        fontSize: 14,
        color: '#9ca3af',
        flex: 1,
    },
    storageText: {
        fontSize: 14,
        color: '#9ca3af',
        lineHeight: 22,
    },
    reviewCard: {
        flexDirection: 'row',
        marginBottom: 20,
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        padding: 16,
    },
    reviewAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
    },
    reviewContent: {
        flex: 1,
    },
    reviewName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: 4,
    },
    reviewComment: {
        fontSize: 13,
        color: '#9ca3af',
        lineHeight: 20,
        marginBottom: 8,
    },
    reviewStars: {
        flexDirection: 'row',
    },
});