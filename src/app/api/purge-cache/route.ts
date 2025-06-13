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

    // 首先检查响应状态
    if (!response.ok) {
      // 尝试读取响应文本
      const text = await response.text();
      console.error('Vercel API error response:', text);
      
      try {
        // 尝试将响应解析为 JSON
        const error = JSON.parse(text);
        return NextResponse.json(
          { error: 'Failed to purge cache', details: error },
          { status: response.status }
        );
      } catch (e) {
        // 如果响应不是 JSON 格式，返回文本内容
        return NextResponse.json(
          { error: 'Failed to purge cache', message: text },
          { status: response.status }
        );
      }
    }

    // 尝试读取响应文本
    const text = await response.text();
    console.log('Vercel API response:', text);

    try {
      // 尝试将响应解析为 JSON
      const result = JSON.parse(text);
      return NextResponse.json(result);
    } catch (e) {
      // 如果响应不是 JSON 格式，返回文本内容
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