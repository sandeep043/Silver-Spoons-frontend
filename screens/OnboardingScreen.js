import { View, Text, StyleSheet, Image } from "react-native"
import Onboarding from 'react-native-onboarding-swiper';
import LottieView from 'lottie-react-native';



function OnboardingScreen() {
    return (
        <View style={styles.container}>

            <Onboarding
                pages={[
                    {
                        backgroundColor: '#rgba(236, 233, 252)',
                        image: (
                            <View style={{ width: 350, height: 400 }}>
                                <Image source={require('../assets/friendly cheif.jpeg')} style={{ width: '100%', height: '100%' }} />
                            </View>),

                        title: (<Text style={styles.title} >Welcome to FoodBuddy!</Text>),
                        subtitle: (<Text style={styles.subtitle} >Delicious meals from your favorite restaurants.</Text>),
                    },
                    {
                        backgroundColor: '#e4e7f6',
                        image: (
                            <View style={{ width: 350, height: 400 }}>
                                <Image source={require('../assets/menu.jpeg')} style={{ width: '100%', height: '100%' }} />
                            </View>),
                        title: (<Text style={styles.title} >Explore Restaurant Menu</Text>),
                        subtitle: (<Text style={styles.subtitle} >Search cuisines, find top-rated dishes and explore nearby Reviews</Text>),
                    }
                    , {
                        backgroundColor: '#ffffff',
                        image: (
                            <View style={{ width: 350, height: 400 }}>
                                <Image source={require('../assets/securePayment.jpg')} style={{ width: '100%', height: '100%' }} />
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