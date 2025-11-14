import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from "react-native"
import Onboarding from 'react-native-onboarding-swiper';
import LottieView from 'lottie-react-native';
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get('window');




function OnboardingScreen() {
    const navigation = useNavigation();

    const handleDone = () => {
        navigation.navigate('login');
    }
    const handleSkip = () => {
        navigation.replace('login');
    }
    const doneButton = () => {
        return (
            <TouchableOpacity style={{ marginRight: 20 }} onPress={handleDone} >
                <Text style={{ fontSize: 16, color: '#26469d', fontWeight: 'bold' }}>Done</Text>
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.container}>

            <Onboarding
                onDone={handleDone}
                onSkip={handleSkip}
                DoneButtonComponent={doneButton}
                containerStyles={{ paddingHorizontal: 15 }}
                pages={[
                    {
                        backgroundColor: '#ffffffff',
                        image: (
                            <View style={{ width: width * 0.9, height: width }}>
                                <LottieView
                                    source={require('../assets/animations/onboardingAnimation/Cooking.json')}
                                    autoPlay
                                    loop={true}
                                    style={{ width: 400, height: 500 }}
                                />
                            </View>),

                        title: (<Text style={styles.title} >Welcome to FoodBuddy!</Text>),
                        subtitle: (<Text style={styles.subtitle} >Delicious meals from your favorite restaurant.</Text>),
                    },
                    {
                        backgroundColor: '#ffffffff',
                        image: (
                            <View style={{ width: width * 0.9, height: width }}>
                                <LottieView
                                    source={require('../assets/animations/onboardingAnimation/Shopping Green.json')}
                                    autoPlay
                                    loop={true}
                                    style={{ width: 400, height: 500 }}
                                />
                            </View>),

                        title: (<Text style={styles.title} >Explore Menu</Text>),
                        subtitle: (<Text style={styles.subtitle} >Search cuisines, find top-rated dishes.</Text>),
                    },
                    {
                        backgroundColor: '#ffffffff',
                        image: (
                            <View style={{ width: width * 0.9, height: width }}>
                                <LottieView
                                    source={require('../assets/animations/onboardingAnimation/Food Delivery.json')}
                                    autoPlay
                                    loop={true}
                                    style={{ width: 400, height: 600 }}
                                />
                            </View>),
                        title: (<Text style={styles.title} >Super Fast Delivery</Text>),
                        subtitle: (<Text style={styles.subtitle} >Hot, fresh, and on time — delivered to your door.</Text>),
                    }
                    , {
                        backgroundColor: '#ffffff',
                        image: (
                            <View style={{ width: width * 0.9, height: width }}>
                                <LottieView
                                    source={require('../assets/animations/onboardingAnimation/success confetti.json')}
                                    autoPlay
                                    loop={true}
                                    style={{ width: 400, height: 500 }}
                                />
                            </View>),
                        title: (<Text style={styles.title} >Easy Payments</Text>),
                        subtitle: (<Text style={styles.subtitle} >Pay securely using UPI, cards, wallets, or cash on delivery.</Text>),
                    }
                    ,

                ]}
            />
        </View>
    )
}

export default OnboardingScreen


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: "#26469d"
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
}); 