import React, { useState, useEffect } from 'react';
import { View, Text, Button, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { api } from '../utils/PaymentAPI';

const PaymentResult = ({ route, navigation }) => {
    const { txnid, paymentId, amount, fromWebView } = route.params;
    const token = useSelector(state => state.auth.token);
    const [loading, setLoading] = useState(fromWebView);
    const [paymentData, setPaymentData] = useState(null);
    const [error, setError] = useState(null);

    // If coming from WebView, verify payment status before showing result
    useEffect(() => {
        if (fromWebView && txnid && paymentId) {
            verifyPayment();
        }
    }, [fromWebView]);

    const verifyPayment = async () => {
        try {
            console.log('Calling verify API with txnid:', txnid, 'paymentId:', paymentId);

            const client = api(token);

            // Call backend verification endpoint - backend will verify with PayU and create order
            // No need to pass txnid/paymentId in body - just call the endpoint
            const res = await client.post(`/payment/verify/${txnid}?payment_id=${paymentId}`);

            console.log('Verify response:', res.data);

            if (res.data && res.data.success) {
                const verified = res.data;

                setPaymentData({
                    status: verified.status,
                    txnid: verified.txnid,
                    paymentId: verified.paymentId,
                    orderId: verified.orderId,
                    amount: verified.amount || amount,
                    message: verified.message,
                    mode: verified.mode
                });
            } else {
                setError(res.data?.message || 'Verification failed');
            }
        } catch (err) {
            console.error('Payment verification error:', err);
            setError(err?.response?.data?.message || err?.message || 'Unable to verify payment');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                <ActivityIndicator size="large" color="#FF6B6B" />
                <Text style={{ marginTop: 20, fontSize: 16, color: '#666' }}>Verifying payment...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 20 }}>
                <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>
                    ⚠️ Verification Error
                </Text>
                <Text style={{ fontSize: 16, textAlign: 'center', marginBottom: 20, color: '#333' }}>
                    {error}
                </Text>
                <Button
                    title="Check Orders"
                    onPress={() => navigation.navigate('Orders')}
                    color="#FF6B6B"
                />
                <Button
                    title="Back to Home"
                    onPress={() => navigation.navigate('Home')}
                    color="#999"
                />
            </View>
        );
    }

    if (!paymentData) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                <Text style={{ fontSize: 16, color: '#666' }}>No payment data available</Text>
                <Button
                    title="Back to Home"
                    onPress={() => navigation.navigate('Home')}
                    color="#FF6B6B"
                />
            </View>
        );
    }

    const isSuccess = paymentData.status === 'success';

    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={{ flex: 1, padding: 20, justifyContent: 'center', minHeight: '100%' }}>
                <Text style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>
                    {isSuccess ? '✅ Payment Successful' : '❌ Payment Failed'}
                </Text>

                <Text style={{ fontSize: 16, marginBottom: 20, textAlign: 'center', color: '#333' }}>
                    {paymentData.message}
                </Text>

                <View style={{ backgroundColor: '#f5f5f5', padding: 15, borderRadius: 10, marginBottom: 30 }}>
                    <Text style={{ fontSize: 14, color: '#666', marginBottom: 10 }}>
                        <Text style={{ fontWeight: '600' }}>Status: </Text>
                        <Text style={{ color: isSuccess ? '#28a745' : '#dc3545' }}>
                            {paymentData.status.toUpperCase()}
                        </Text>
                    </Text>
                    <Text style={{ fontSize: 14, color: '#666', marginBottom: 10 }}>
                        <Text style={{ fontWeight: '600' }}>Transaction ID: </Text>{paymentData.txnid}
                    </Text>
                    <Text style={{ fontSize: 14, color: '#666', marginBottom: 10 }}>
                        <Text style={{ fontWeight: '600' }}>Amount: </Text>₹{paymentData.amount}
                    </Text>
                    {paymentData.mode && (
                        <Text style={{ fontSize: 14, color: '#666', marginBottom: 10 }}>
                            <Text style={{ fontWeight: '600' }}>Payment Mode: </Text>{paymentData.mode}
                        </Text>
                    )}
                    {paymentData.orderId && (
                        <Text style={{ fontSize: 14, color: '#666' }}>
                            <Text style={{ fontWeight: '600' }}>Order ID: </Text>{paymentData.orderId}
                        </Text>
                    )}
                </View>

                <Button
                    title={isSuccess ? 'View Orders' : 'Retry Payment'}
                    onPress={() => {
                        if (isSuccess) {
                            navigation.navigate('Orders');
                        } else {
                            navigation.navigate('Cart');
                        }
                    }}
                    color="#FF6B6B"
                />
                <View style={{ marginTop: 10 }}>
                    <Button
                        title="Back to Home"
                        onPress={() => navigation.navigate('Home')}
                        color="#999"
                    />
                </View>
            </View>
        </ScrollView>
    );
};

export default PaymentResult;