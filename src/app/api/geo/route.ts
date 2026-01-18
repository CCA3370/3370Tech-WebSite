import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Try to get country from CDN's geo header (EO-Client-IPCountry from Tencent EdgeOne)
  // Falls back to Vercel's header for local development or other deployments
  const country = request.headers.get('EO-Client-IPCountry')
    || request.headers.get('x-vercel-ip-country');

  // Check if user is in China mainland (ISO 3166-1 alpha-2 code)
  const isChina = country === 'CN';

  return NextResponse.json({
    isChina,
    country: country || 'unknown',
  });
}
