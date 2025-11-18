import { StyleSheet, View, ScrollView, useWindowDimensions } from "react-native"
import { useState, useRef } from 'react';

function Carousel({ children, onIndexChange, dotCount }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollRef = useRef(null);
    const { width } = useWindowDimensions();

    const handleScroll = (event) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffsetX / width);
        setCurrentIndex(index);
        if (onIndexChange) {
            onIndexChange(index);
        }
    };

    return (
        <View style={styles.carouselContainer}>
            <ScrollView
                ref={scrollRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                scrollEventThrottle={16}
                onScroll={handleScroll}
                style={styles.scrollView}
            >
                {children}
            </ScrollView>

            {/* Dots Indicator */}
            {dotCount && dotCount > 0 && (
                <View style={styles.dotsContainer}>
                    {Array.from({ length: dotCount }).map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                currentIndex === index && styles.dotActive
                            ]}
                        />
                    ))}
                </View>
            )}
        </View>
    );
}

export default Carousel;

const styles = StyleSheet.create({
    carouselContainer: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 12,
        backgroundColor: 'transparent',
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
});
