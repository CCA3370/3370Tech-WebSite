import { NextRequest, NextResponse } from 'next/server';

// 检查坐标是否在中国大陆范围内
function isCoordinateInChina(latitude: number, longitude: number): boolean {
  // 中国大陆的大致边界
  // 北: 53.5N (黑龙江)
  // 南: 18.2N (南沙群岛)
  // 东: 135.1E (钓鱼岛)
  // 西: 73.5E (新疆)
  
  if (latitude < 18 || latitude > 54) return false;
  if (longitude < 73 || longitude > 136) return false;

  // 排除明显不是中国大陆的地区（简化版）
  // 香港 (22.3°N, 114.2°E)
  if (latitude > 21.5 && latitude < 22.9 && longitude > 113.8 && longitude < 114.6) {
    return false;
  }
  // 澳门 (22.2°N, 113.5°E)
  if (latitude > 22.0 && latitude < 22.4 && longitude > 113.3 && longitude < 113.7) {
    return false;
  }
  // 台湾 (23.7°N, 120.9°E)
  if (latitude > 21.8 && latitude < 25.3 && longitude > 120.0 && longitude < 121.9) {
    return false;
  }

  return true;
}

export async function GET(request: NextRequest) {
  // 获取客户端IP
  const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0].trim()
    || request.headers.get('x-real-ip')
    || request.headers.get('cf-connecting-ip')
    || 'unknown';

  // 第一优先级：EdgeOne CDN头（腾讯云）
  let country = request.headers.get('EO-Client-IPCountry');
  
  // 第二优先级：Vercel CDN头
  if (!country) {
    country = request.headers.get('x-vercel-ip-country');
  }

  // 第三优先级：Cloudflare头
  if (!country) {
    country = request.headers.get('cf-ipcountry');
  }

  // 第四优先级：调用IP地理位置API（可选，使用免费服务）
  if (!country || country === 'unknown') {
    try {
      const response = await fetch(`https://ipapi.co/${clientIp}/json/`, {
        headers: { 'Accept': 'application/json' },
        next: { revalidate: 3600 }
      });
      if (response.ok) {
        const data = await response.json();
        country = data.country_code;
      }
    } catch (error) {
      console.error('IP geolocation API failed:', error);
    }
  }

  // 检查是否在中国大陆（ISO 3166-1 alpha-2 code）
  const isChina = country === 'CN';

  return NextResponse.json({
    isChina,
    country: country || 'unknown',
    clientIp: clientIp === 'unknown' ? undefined : clientIp,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { latitude, longitude } = body;

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return NextResponse.json(
        { error: 'Invalid coordinates' },
        { status: 400 }
      );
    }

    // 使用坐标检查是否在中国
    const isChina = isCoordinateInChina(latitude, longitude);

    return NextResponse.json({
      isChina,
      method: 'coordinate',
      latitude,
      longitude,
    });
  } catch (error) {
    console.error('POST /api/geo failed:', error);
    return NextResponse.json(
      { error: 'Failed to process coordinates' },
      { status: 500 }
    );
  }
}

