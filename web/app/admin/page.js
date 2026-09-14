'use client';

import { useEffect, useState } from 'react';

export default function AdminPage() {
  const [status, setStatus] = useState(null);
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      fetch('/api/status').then((r) => r.json()),
      fetch('/api/models').then((r) => r.json()),
    ])
      .then(([s, m]) => {
        setStatus(s);
        setModels(m.models || []);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <main style={{ maxWidth: 960, margin: '0 auto', padding: 24 }}>加载中…</main>;

  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: 24 }}>
      <h1 style={{ fontSize: 24 }}>管理后台</h1>
      {error && <div style={{ color: '#ff6b6b', marginBottom: 16 }}>⚠️ {error}</div>}

      <section style={{ background: '#15181f', border: '1px solid #22262e', borderRadius: 12, padding: 18, marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, marginTop: 0 }}>代理状态</h2>
        <pre style={{ background: '#0f1115', padding: 12, borderRadius: 8, overflow: 'auto', fontSize: 13 }}>{JSON.stringify(status, null, 2)}</pre>
      </section>

      <section style={{ background: '#15181f', border: '1px solid #22262e', borderRadius: 12, padding: 18 }}>
        <h2 style={{ fontSize: 18, marginTop: 0 }}>可用模型</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ color: '#9aa4b2', textAlign: 'left' }}>
              <th style={{ padding: '8px 10px', borderBottom: '1px solid #2a2f3a' }}>模型</th>
            </tr>
          </thead>
          <tbody>
            {models.map((m) => (
              <tr key={m}>
                <td style={{ padding: '8px 10px', borderBottom: '1px solid #1c2027', fontFamily: 'monospace' }}>{typeof m === 'string' ? m : (m.id || JSON.stringify(m))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section style={{ background: '#15181f', border: '1px solid #22262e', borderRadius: 12, padding: 18, marginTop: 20 }}>
        <h2 style={{ fontSize: 18, marginTop: 0 }}>去水印检查说明</h2>
        <p style={{ color: '#9aa4b2', fontSize: 14, lineHeight: 1.7 }}>
          Qwen Chat 网页版免费生成的图片<b>本身不带水印</b>（图像由服务端直接返回，无角标叠加）。
          如果通过某些第三方中转或特定图源出现水印，可在此对生成图执行二次清理（后续版本接入 Qwen-Image-Edit-2511 inpaint 方案）。
        </p>
      </section>
    </main>
  );
}