import { NextRequest, NextResponse } from 'next/server';

const KLARNA_API_BASE = 'https://api.playground.klarna.com';
const KLARNA_USERNAME = 'b873d66c-c5b5-49c8-b70d-483f6ab791b6';
const KLARNA_PASSWORD = 'klarna_test_api_SjJXbEc1YmhEMCQ2cXZHQ0gjJHckWm1hdS9VTmFpSzIsYjg3M2Q2NmMtYzViNS00OWM4LWI3MGQtNDgzZjZhYjc5MWI2LDEsS3VZcDlaYlpZVEJKL2t2NUFieE16c3RCbVpzWUg0TytCSXpHUitIODJFTT0';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentAmount = 10000, shippingAddress = {} } = body;

    // Build order_lines from real cart data
    const orderAmount = Math.round(paymentAmount * 100); // Convert dollars to cents

    const confirmationUrl = body.returnUrl || 'https://next-demo-rose-seven.vercel.app/api/klarna/confirmation';

    const klarnaBody = {
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
      shipping_address: {
        given_name: shippingAddress.firstName || 'Test',
        family_name: shippingAddress.lastName || 'User',
        street_address: shippingAddress.address1 || shippingAddress.shippingAddress1 || '123 Main St',
        city: shippingAddress.city || 'New York',
        region: shippingAddress.state || 'NY',
        postal_code: shippingAddress.zipCode || shippingAddress.postalCode || '10001',
        country: 'US',
        email: shippingAddress.email || shippingAddress.emailAddress || 'test@example.com',
        phone: (shippingAddress.phoneNumber || '5551234567').replace(/\D/g, ''),
      },
      merchant_urls: {
        confirmation: confirmationUrl,
        notification: 'https://next-demo-rose-seven.vercel.app/api/klarna/notification',
      },
    };

    console.log('[Klarna] Creating session:', JSON.stringify(klarnaBody));

    const auth = Buffer.from(`${KLARNA_USERNAME}:${KLARNA_PASSWORD}`).toString('base64');

    const klarnaRes = await fetch(`${KLARNA_API_BASE}/payments/v1/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify(klarnaBody),
    });

    const klarnaData = await klarnaRes.json();
    console.log('[Klarna] Session response status:', klarnaRes.status);
    console.log('[Klarna] Session response:', JSON.stringify(klarnaData));

    if (!klarnaRes.ok) {
      return NextResponse.json({
        success: false,
        errorMessage: klarnaData.error_messages?.[0] || 'Failed to create Klarna session',
      });
    }

    return NextResponse.json({
      success: true,
      createSessionResult: {
        client_token: klarnaData.client_token,
        session_id: klarnaData.session_id,
        payment_method_categories: klarnaData.payment_method_categories || [],
      },
    });
  } catch (error) {
    console.error('[Klarna] Create session error:', error);
    return NextResponse.json(
      { success: false, errorMessage: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
