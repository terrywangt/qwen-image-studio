'use client';

import { useState } from 'react';

const SIZES = ['1024*1024', '1024*1536', '1536*1024', '768*1024', '1024*768'];
const MODELS = ['qwen-image-plus', 'qwen-image-max', 'qwen-image', 'wan2.6-t2i', 'wan2.2-t2i-flash'];

export default function HomePage() {
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState(MODELS[0]);
  const [size, setSize] = useState(SIZES[0]);
  const [n, setN] = useState(1);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);

  async function generate(e) {
    e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, model, size, n: Number(n) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || '生成失败');
      const urls = (data.data || []).map((d) => d.url).filter(Boolean);
      setImages(urls);
      setHistory((h) => [{ prompt, urls, time: new Date().toISOString() }, ...h].slice(0, 20));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: 24 }}>
      <h1 style={{ fontSize: 24 }}>Qwen 图文生成</h1>
      <form onSubmit={generate} style={{ display: 'flex', flexDirection: 'column', gap: 14, background: '#15181f', padding: 20, borderRadius: 12, border: '1px solid #22262e' }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ color: '#9aa4b2' }}>提示词</span>
          <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={3}
            placeholder="描述你想生成的图片…"
            style={{ background: '#0f1115', border: '1px solid #2a2f3a', color: '#e6e8eb', padding: 10, borderRadius: 8, resize: 'vertical' }} />
        </label>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <label>模型
            <select value={model} onChange={(e) => setModel(e.target.value)} style={selectStyle}>
              {MODELS.map((m) => <option key={m}>{m}</option>)}
            </select>
          </label>
          <label>尺寸
            <select value={size} onChange={(e) => setSize(e.target.value)} style={selectStyle}>
              {SIZES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
          <label>数量
            <input type="number" min="1" max="4" value={n} onChange={(e) => setN(e.target.value)} style={selectStyle} />
          </label>
        </div>
        <button type="submit" disabled={loading} style={{ background: '#4f6ef7', color: '#fff', border: 0, padding: '12px 20px', borderRadius: 8, fontSize: 16, cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.6 : 1 }}>
          {loading ? '生成中…' : '生成图片'}
        </button>
        {error && <div style={{ color: '#ff6b6b' }}>⚠️ {error}</div>}
      </form>

      {images.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h2 style={{ fontSize: 18 }}>生成结果 {images.length > 1 ? `(${images.length})` : ''}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
            {images.map((url, i) => (
              <div key={i} style={{ background: '#15181f', padding: 10, borderRadius: 12, border: '1px solid #22262e' }}>
                <img src={url} alt={`生成结果 ${i + 1}`} style={{ width: '100%', borderRadius: 8, display: 'block' }} />
                <a href={url} target="_blank" rel="noreferrer" style={{ color: '#4f6ef7', fontSize: 13, marginTop: 8, display: 'inline-block' }}>打开原图 ↗</a>
              </div>
            ))}
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: 18 }}>历史记录</h2>
          {history.map((h, i) => (
            <details key={i} style={{ background: '#15181f', border: '1px solid #22262e', borderRadius: 8, padding: '8px 14px', marginBottom: 8 }}>
              <summary style={{ cursor: 'pointer', color: '#c6cdd6' }}>{h.time.slice(0, 19).replace('T', ' ')} — {h.prompt.slice(0, 60)}</summary>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                {h.urls.map((u, j) => <img key={j} src={u} alt="" style={{ width: 120, borderRadius: 6 }} />)}
              </div>
            </details>
          ))}
        </div>
      )}
    </main>
  );
}

const selectStyle = {
  background: '#0f1115',
  border: '1px solid #2a2f3a',
  color: '#e6e8eb',
  padding: '8px 10px',
  borderRadius: 8,
  marginLeft: 8,
};