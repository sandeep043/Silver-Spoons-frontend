import React, { useState, useRef } from 'react';
import { View, Text, ActivityIndicator, Button, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { api } from '../utils/PaymentAPI';
import { useSelector } from 'react-redux';

const PaymentScreen = ({ route, navigation }) => {
    // route.params may include either `order` object or raw fields: amount, cartItems, orderItems
    const params = route?.params ?? {};
    const order = params.order ?? {
        amount: params.amount,
        cartItems: params.cartItems,
        orderItems: params.orderItems,
    };
    console.log('PaymentScreen order:', order, 'params:', params);
    const [loading, setLoading] = useState(false);
    const [paymentResponse, setPaymentResponse] = useState(null); // Store txnid and paymentId
    const [webviewHtml, setWebviewHtml] = useState(null);
    const [showWebview, setShowWebview] = useState(false);
    const webviewRef = useRef(null);

    // Replace with your auth token retrieval
    const { token } = useSelector((state) => state.auth);

    const Details = { firstname: "sandeep", email: "sandeep.talari8999@gmail.com", phone: "6006782936", address: "123 Main Street, Calicut" };

    const initiate = async () => {
        setLoading(true);
        try {
            const client = api(token);

            // Validate required data before sending
            if (!Details.firstname || !Details.email || !Details.phone || !Details.address) {
                Alert.alert('Validation Error', 'Please fill all required fields: name, email, phone, address');
                setLoading(false);
                return;
            }

            const payload = {
                amount: order.amount,
                product: order.cartItems || { name: 'Food Order' },
                firstname: Details.firstname,
                email: Details.email,
                mobile: Details.phone,
                address: Details.address,
                orderItems: order.orderItems || []
            };

            console.log('Sending payment payload:', payload);

            const res = await client.post('/payment/initiate', payload); // Note: no '/api' prefix if using baseURL


            if (!res.data || !res.data.success) {
                Alert.alert('Payment Error', res.data?.message || 'Invalid response from server');
                setLoading(false);
                return;
            }

            const data = res.data;
            console.log('Payment initiated:', data);

            // Store payment response for verification later
            setPaymentResponse({
                txnid: data.txnid,
                paymentId: data.paymentId,
                amount: data.amount || order.amount
            });

            // Case A: PayU SDK returns structured form with action and params
            if (data.paymentForm && data.paymentForm.action && data.paymentForm.params) {
                const { action, params } = data.paymentForm;
                console.log('Opening PayU form with action:', action);

                // Build HTML form that auto-submits to PayU
                const inputs = Object.keys(params)
                    .map(k => {
                        const value = params[k]
                            .toString()
                            .replace(/'/g, '&#39;')
                            .replace(/"/g, '&quot;');
                        return `<input type="hidden" name="${k}" value="${value}" />`;
                    })
                    .join('\n');

                const html = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body onload="document.getElementById('payForm').submit();">
                    <form id="payForm" action="${action}" method="post" style="display:none;">
                        ${inputs}
                    </form>
                    <p>Redirecting to payment gateway...</p>
                </body>
                </html>
            `;

                setWebviewHtml(html);
                setShowWebview(true);
                setLoading(false);
            }
            // Case B: server returned raw HTML (less common with PayU SDK)
            else if (data.paymentForm && typeof data.paymentForm === 'string') {
                console.log('Opening PayU HTML form');
                setWebviewHtml(data.paymentForm);
                setShowWebview(true);
                setLoading(false);
            }
            // Case C: Fallback - unexpected format
            else {
                console.warn('Unexpected paymentForm format:', data.paymentForm);
                Alert.alert(
                    'Payment Gateway',
                    'Unable to open payment form. Please try again.',
                    [
                        { text: 'Retry', onPress: initiate },
                        { text: 'Cancel', onPress: () => setLoading(false) }
                    ]
                );
            }
        } catch (err) {
            console.error('Payment initiate error:', err);
            const errorMsg = err?.response?.data?.message || err?.message || 'Network error occurred';
            Alert.alert('Payment Error', errorMsg);
            setLoading(false);
        }
    };

    const onNavigationStateChange = (navState) => {
        const url = navState.url;
        console.log('WebView URL changed to:', url);

        // Detect when PayU redirects to our verify endpoint (which means payment processing is done)
        if (url.includes('/api/payment/verify')) {
            console.log('Payment verification detected - closing WebView and navigating to result screen');

            // Close WebView
            setShowWebview(false);
            setLoading(true);

            // Give backend a moment to process, then navigate to result screen
            // The result screen will call the verify API to get final status
            setTimeout(() => {
                navigation.replace('PaymentResult', {
                    txnid: paymentResponse?.txnid,
                    paymentId: paymentResponse?.paymentId,
                    amount: paymentResponse?.amount,
                    fromWebView: true
                });
            }, 1000);
        }
    };
    // Only show one of: loading, WebView, or initial screen
    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                <ActivityIndicator size="large" color="#FF6B6B" />
                <Text style={{ marginTop: 10, color: '#666' }}>Processing payment...</Text>
            </View>
        );
    }
    if (showWebview && webviewHtml) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['top', 'bottom', 'left', 'right']}>
                <WebView
                    ref={webviewRef}
                    originWhitelist={['*']}
                    source={{ html: webviewHtml }}
                    onNavigationStateChange={onNavigationStateChange}
                    javaScriptEnabled
                    domStorageEnabled
                    style={{ flex: 1, backgroundColor: '#fff' }}
                />
            </SafeAreaView>
        );
    }
    // Initial screen
    return (
        <View style={{ flex: 1, padding: 16, justifyContent: 'center', backgroundColor: '#fff' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' }}>
                Payment
            </Text>
            <Text style={{ fontSize: 18, marginBottom: 20, textAlign: 'center' }}>
                Amount to Pay: <Text style={{ color: '#FF6B6B', fontWeight: 'bold' }}>₹{order?.amount ?? params.amount ?? 0}</Text>
            </Text>
            <Button
                title="Pay Now"
                onPress={initiate}
                color="#FF6B6B"
            />
        </View>
    );
};

export default PaymentScreen;