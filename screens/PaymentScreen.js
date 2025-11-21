import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ActivityIndicator, Button, Alert } from 'react-native';
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
    const [paymentId, setPaymentId] = useState(null);
    const [txnid, setTxnid] = useState(null);
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
            setPaymentId(data.paymentId);
            setTxnid(data.txnid);

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
            }
            // Case B: server returned raw HTML (less common with PayU SDK)
            else if (data.paymentForm && typeof data.paymentForm === 'string') {
                console.log('Opening PayU HTML form');
                setWebviewHtml(data.paymentForm);
                setShowWebview(true);
            }
            // Case C: Backend returned payment record but no paymentForm
            // This means payment was initiated on backend, proceed with polling
            else if (data.paymentId && !data.paymentForm) {
                console.log('Payment initiated on backend without form. Starting polling...');
                // Payment is already initiated, just wait for status updates
                // Close loading and start polling
                setShowWebview(false);
            }
            // Case D: Fallback - unexpected format
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
        } finally {
            setLoading(false);
        }
    };
    // Poll payment status for final result
    const pollStatus = async (interval = 3000, maxAttempts = 30) => {
        if (!paymentId) {
            console.warn('No paymentId available for polling');
            return;
        }

        console.log('Starting payment status polling...');
        const client = api(token);
        let attempts = 0;
        let isPolling = true;

        const timer = setInterval(async () => {
            if (!isPolling) {
                clearInterval(timer);
                return;
            }

            attempts += 1;
            console.log(`Poll attempt ${attempts}/${maxAttempts}`);

            try {
                const res = await client.get(`/payment/status/${paymentId}`);
                console.log('Payment status response:', res.data);

                if (res.data && res.data.success && res.data.data) {
                    const payment = res.data.data;
                    console.log('Payment status:', payment.status);

                    // If payment status changed from 'initiated', we have a result
                    if (payment.status && payment.status !== 'initiated') {
                        clearInterval(timer);
                        isPolling = false;

                        console.log('Payment completed with status:', payment.status);

                        // Navigate to result screen with full details
                        navigation.replace('PaymentResult', {
                            status: payment.status,
                            txnid: payment.txnid,
                            paymentId: payment._id,
                            orderId: payment.orderId || null,
                            amount: payment.amount,
                            message: payment.status === 'success'
                                ? 'Payment successful! Your order has been placed.'
                                : 'Payment failed. Please try again.'
                        });
                    }
                }
            } catch (err) {
                console.warn(`Poll error (attempt ${attempts}):`, err.message || err);
            }

            if (attempts >= maxAttempts) {
                clearInterval(timer);
                isPolling = false;
                console.error('Payment polling timeout');
                Alert.alert(
                    'Payment Timeout',
                    'Unable to confirm payment. Please check your order history or contact support.',
                    [
                        {
                            text: 'Check Orders',
                            onPress: () => navigation.navigate('Orders')
                        },
                        {
                            text: 'Retry',
                            onPress: () => {
                                setPaymentId(null);
                                setShowWebview(false);
                            }
                        }
                    ]
                );
            }
        }, interval);

        // Cleanup function - stop polling if component unmounts
        return () => {
            isPolling = false;
            clearInterval(timer);
        };
    };

    // When paymentId set and WebView closed, start polling
    useEffect(() => {
        let cleanup;
        if (paymentId && !showWebview) {
            cleanup = pollStatus();
        }
        return cleanup;
    }, [paymentId, showWebview]);

    const onNavigationStateChange = (navState) => {
        const url = navState.url;
        console.log('WebView navigated to:', url);

        // Detect PayU redirect completion - look for your app's deep link
        const deepLinkPattern = /silverrest:\/\/payment/i;

        // Also detect server verify endpoint being called (if PayU redirects there)
        const verifyPattern = /\/api\/payment\/verify/i;

        if (deepLinkPattern.test(url) || verifyPattern.test(url)) {
            console.log('Payment flow completed, closing WebView');
            // Close webview - polling will detect status change
            setShowWebview(false);
        } else if (url.includes('error') || url.includes('failed')) {
            console.log('Payment error detected in URL');
            setShowWebview(false);
            Alert.alert('Payment Error', 'Payment was not completed. Please try again.');
        }
    };
    return (
        <View style={{ flex: 1 }}>
            {loading && <ActivityIndicator size="large" />}
            {!showWebview && (
                <View style={{ padding: 16 }}>
                    <Text>Pay: ₹{order?.amount ?? params.amount ?? 0}</Text>
                    <Button title="Pay Now" onPress={initiate} />

                    {paymentId && (
                        <View style={{ marginTop: 20 }}>
                            <Text style={{ marginBottom: 10 }}>Payment ID: {paymentId}</Text>
                            <Text style={{ marginBottom: 10, color: '#666' }}>
                                Polling for payment status... (Attempt tracking in logs)
                            </Text>
                            <Button
                                title="Force Complete Payment (TEST)"
                                onPress={() => {
                                    // Manual test: simulate successful payment after user clicks
                                    navigation.replace('PaymentResult', {
                                        status: 'success',
                                        txnid: txnid,
                                        paymentId: paymentId,
                                        orderId: null,
                                        amount: order?.amount ?? params.amount ?? 0,
                                        message: 'Payment successful! Your order has been placed.'
                                    });
                                }}
                            />
                        </View>
                    )}
                </View>
            )}

            {showWebview && webviewHtml && (
                <WebView
                    ref={webviewRef}
                    originWhitelist={['*']}
                    source={{ html: webviewHtml }}
                    onNavigationStateChange={onNavigationStateChange}
                    javaScriptEnabled
                    domStorageEnabled
                />
            )}
        </View>
    );
};

export default PaymentScreen;