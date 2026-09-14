import { NextResponse } from 'next/server';

const PROXY_BASE = process.env.PROXY_BASE_URL || 'http://127.0.0.1:3264/api';
const PROXY_KEY = process.env.PROXY_API_KEY || '';

export async function GET() {
  try {
    const headers = {};
    if (PROXY_KEY) headers['x-api-key'] = PROXY_KEY;
    const res = await fetch(`${PROXY_BASE}/models`, { headers, cache: 'no-store' });
    const data = await res.json().catch(() => null);
    return NextResponse.json(data || { models: [] });
  } catch (e) {
    return NextResponse.json({ models: [], error: e.message }, { status: 502 });
  }
}