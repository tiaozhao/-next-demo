import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentAmount = 10000, billingAddress = {} } = body;

    const orderAmount = Math.round(paymentAmount * 100); // Convert dollars to cents

    // Build orderInfo matching the format the mobile app expects
    const orderInfo = {
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
      payment_method_category: 'pay_over_time',
    };

    console.log('[Klarna] Apply payment orderInfo:', JSON.stringify(orderInfo));

    return NextResponse.json({ orderInfo });
  } catch (error) {
    console.error('[Klarna] Apply payment error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
