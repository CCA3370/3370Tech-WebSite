import { NextRequest, NextResponse } from 'next/server';

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
      // 使用 ipapi.co 或类似免费服务
      const response = await fetch(`https://ipapi.co/${clientIp}/json/`, {
        headers: { 'Accept': 'application/json' },
        next: { revalidate: 3600 } // 缓存1小时
      });
      if (response.ok) {
        const data = await response.json();
        country = data.country_code;
      }
    } catch (error) {
      // IP查询失败，尝试浏览器时区作为最后备选
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

