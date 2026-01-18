import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Try to get country from Vercel's geo headers (works on Vercel deployment)
  const country = request.headers.get('x-vercel-ip-country');

  // Check if user is in China mainland
  const isChina = country === 'CN';

  return NextResponse.json({
    isChina,
    country: country || 'unknown',
  });
}
