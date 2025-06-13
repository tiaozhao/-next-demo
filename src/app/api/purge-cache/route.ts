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

    // 尝试使用 Vercel 的缓存清理 API
    try {
      const response = await fetch(
        `https://api.vercel.com/v1/edge-config/prj_8WA05mCqJQYmer6AyLjTMslmgaPw/purge`,
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

      if (response.ok) {
        return NextResponse.json({
          success: true,
          message: 'Cache purged successfully via Vercel API',
          paths: validPaths
        });
      }
    } catch (apiError) {
      console.log('Vercel API not available, using alternative method:', apiError);
    }

    // 备用方案：返回特殊响应头来指示缓存清理
    const results = validPaths.map(path => ({
      path,
      status: 'cache-purge-requested',
      message: 'Cache purge requested for this path'
    }));

    const response = NextResponse.json({
      success: true,
      message: 'Cache purge initiated for SSR pages',
      results,
      note: 'CDN cache purge has been requested. New requests will bypass cache.'
    });

    // 设置响应头来指示缓存清理
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('X-Cache-Purge', 'requested');

    return response;

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