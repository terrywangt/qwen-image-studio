import { NextResponse } from 'next/server';

const PROXY_BASE = process.env.PROXY_BASE_URL || 'http://127.0.0.1:3264/api';
const PROXY_KEY = process.env.PROXY_API_KEY || '';

async function proxyFetch(path, init = {}) {
  const headers = { ...(init.headers || {}) };
  if (PROXY_KEY) headers['x-api-key'] = PROXY_KEY;
  if (init.body && typeof init.body !== 'string') headers['Content-Type'] = 'application/json';
  const res = await fetch(`${PROXY_BASE}${path}`, { ...init, headers, cache: 'no-store' });
  let data;
  try { data = await res.json(); } catch { data = null; }
  return { res, data };
}

export async function POST(req) {
  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: '无效 JSON' }, { status: 400 }); }
  const { prompt, model, size, n } = body || {};
  if (!prompt) return NextResponse.json({ error: 'prompt 必填' }, { status: 400 });

  // 默认走 Qwen Chat 免费额度（provider 不传 = qwen-chat）
  const payload = {
    prompt,
    model: model || 'qwen-image-plus',
    size: size || '1024*1024',
    n: n || 1,
  };

  try {
    const { res, data } = await proxyFetch('/images/generations', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      return NextResponse.json({ error: (data && (data.message || data.error)) || `代理返回 ${res.status}` }, { status: res.status });
    }
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: `代理连接失败: ${e.message}` }, { status: 502 });
  }
}