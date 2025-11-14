import React from 'react'
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native'
import { setItem } from '../utils/asyncStorage'

function HomeScreen() {
    const rest = () => {
        setItem('onboarded', '0');
    }

    return (
        <View style={styles.container} ><Text>hello from HOME Screen</Text>
            <TouchableOpacity onPress={rest} ><Text>rest</Text></TouchableOpacity></View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffffff',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
});