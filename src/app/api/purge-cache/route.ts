import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { paths } = await request.json();

    // 验证 paths 参数
    if (!paths || (Array.isArray(paths) && paths.length === 0)) {
      return NextResponse.json(
        { error: 'Invalid paths parameter' },
        { status: 400 }
      );
    }

    // 确保 paths 是数组
    const pathsToPurge = Array.isArray(paths) ? paths : ['/'];
    
    // 验证每个路径
    const validPaths = pathsToPurge.filter(path => 
      typeof path === 'string' && path.startsWith('/')
    );

    if (validPaths.length === 0) {
      return NextResponse.json(
        { error: 'No valid paths to purge' },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://api.vercel.com/v1/cache/purge`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer Yk7eBYKVU3gZ3lRxJ9OFNJ7g`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paths: validPaths,
        }),
      }
    );

    const text = await response.text();
    console.log('Vercel API response:', text);

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to purge cache', message: text },
        { status: response.status }
      );
    }

    try {
      const result = JSON.parse(text);
      return NextResponse.json(result);
    } catch {
      return NextResponse.json({
        success: true,
        message: 'Cache purged successfully',
        response: text
      });
    }
  } catch (error) {
    console.error('Cache purge error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
} 