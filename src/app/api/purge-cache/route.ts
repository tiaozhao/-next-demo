import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { paths } = await request.json();

    const response = await fetch(
      `https://api.vercel.com/v1/cache/purge`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer Yk7eBYKVU3gZ3lRxJ9OFNJ7g`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paths: Array.isArray(paths) ? paths : ['/'],
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: 'Failed to purge cache', details: error },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    );
  }
} 