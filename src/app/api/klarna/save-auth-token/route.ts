import { NextRequest, NextResponse } from 'next/server';

const KLARNA_API_BASE = 'https://api.playground.klarna.com';
const KLARNA_USERNAME = 'b873d66c-c5b5-49c8-b70d-483f6ab791b6';
const KLARNA_PASSWORD = 'klarna_test_api_SjJXbEc1YmhEMCQ2cXZHQ0gjJHckWm1hdS9VTmFpSzIsYjg3M2Q2NmMtYzViNS00OWM4LWI3MGQtNDgzZjZhYjc5MWI2LDEsS3VZcDlaYlpZVEJKL2t2NUFieE16c3RCbVpzWUg0TytCSXpHUitIODJFTT0';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { authorizationToken, paymentAmount = 10000, billingAddress = {} } = body;

    if (!authorizationToken) {
      return NextResponse.json(
        { success: false, errorMessage: 'Missing authorizationToken' },
        { status: 400 }
      );
    }

    const orderAmount = Math.round(paymentAmount * 100);
    const auth = Buffer.from(`${KLARNA_USERNAME}:${KLARNA_PASSWORD}`).toString('base64');

    // Create order with Klarna using the authorization token
    const orderBody = {
      purchase_country: 'US',
      purchase_currency: 'USD',
      locale: 'en-US',
      order_amount: orderAmount,
      order_tax_amount: 0,
      order_lines: [
        {
          type: 'physical',
          reference: 'mobile-app-order',
          name: 'Order from Mobile App',
          quantity: 1,
          unit_price: orderAmount,
          tax_rate: 0,
          total_amount: orderAmount,
          total_tax_amount: 0,
        },
      ],
      billing_address: {
        given_name: billingAddress.firstName || 'Test',
        family_name: billingAddress.lastName || 'User',
        street_address: billingAddress.address1 || '123 Main St',
        street_address2: billingAddress.address2 || '',
        city: billingAddress.city || 'New York',
        region: billingAddress.state || 'NY',
        postal_code: billingAddress.postalCode || '10001',
        country: billingAddress.country || 'US',
        email: billingAddress.email || 'test@example.com',
        phone: (billingAddress.phoneNumber || '5551234567').replace(/\D/g, ''),
      },
    };

    console.log('[Klarna] Creating order with auth token:', authorizationToken);

    const klarnaRes = await fetch(
      `${KLARNA_API_BASE}/payments/v1/authorizations/${authorizationToken}/order`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${auth}`,
        },
        body: JSON.stringify(orderBody),
      }
    );

    const klarnaData = await klarnaRes.json();
    console.log('[Klarna] Order response status:', klarnaRes.status);
    console.log('[Klarna] Order response:', JSON.stringify(klarnaData));

    if (!klarnaRes.ok) {
      return NextResponse.json({
        success: false,
        orderState: 'ERROR',
        errorMessage: klarnaData.error_messages?.[0] || 'Failed to create order',
      });
    }

    return NextResponse.json({
      success: true,
      orderState: 'COMPLETED',
      orderId: klarnaData.order_id,
      fraudStatus: klarnaData.fraud_status,
    });
  } catch (error) {
    console.error('[Klarna] Save auth token error:', error);
    return NextResponse.json(
      { success: false, orderState: 'ERROR', errorMessage: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
