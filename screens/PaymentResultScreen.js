import React from 'react';
import { View, Text, Button } from 'react-native';

const PaymentResult = ({ route, navigation }) => {
    const { status, txnid, paymentId, orderId, amount, message } = route.params;

    const isSuccess = status === 'success';

    return (
        <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
                {isSuccess ? '✅ Payment Successful' : '❌ Payment Failed'}
            </Text>
            <Text style={{ fontSize: 16, marginBottom: 10 }}>{message}</Text>
            <Text style={{ fontSize: 14, color: '#666', marginBottom: 5 }}>Transaction ID: {txnid}</Text>
            {amount && <Text style={{ fontSize: 14, color: '#666', marginBottom: 5 }}>Amount: ₹{amount}</Text>}
            {orderId && <Text style={{ fontSize: 14, color: '#666', marginBottom: 20 }}>Order ID: {orderId}</Text>}

            <Button
                title={isSuccess ? 'View Order' : 'Retry Payment'}
                onPress={() => navigation.navigate(isSuccess ? 'OrderDetails' : 'Cart')}
            />
            <Button
                title="Home"
                onPress={() => navigation.navigate('Home')}
                color="#ccc"
            />
        </View>
    );
};
export default PaymentResult;