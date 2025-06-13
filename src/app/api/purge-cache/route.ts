import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

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

    // 使用 revalidatePath 重新验证每个路径
    const results = await Promise.all(
      validPaths.map(async (path) => {
        try {
          // 这会清除 Next.js 的中间件缓存
          revalidatePath(path);
          return { path, status: 'success' };
        } catch (error) {
          return { 
            path, 
            status: 'error', 
            message: error instanceof Error ? error.message : 'Unknown error'
          };
        }
      })
    );

    return NextResponse.json({
      success: true,
      message: 'Cache revalidation initiated',
      results,
      note: 'Browser cache will expire in 1 minute, middleware cache has been cleared'
    });

  } catch (error) {
    console.error('Cache revalidation error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
} 