export const metadata = {
  title: 'Qwen Image Studio',
  description: 'Free Qwen image generation web UI (self-hosted)',
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh">
      <body style={{ margin: 0, fontFamily: '-apple-system, "PingFang SC", "Microsoft YaHei", sans-serif', background: '#0f1115', color: '#e6e8eb' }}>
        <nav style={{ display: 'flex', gap: 16, padding: '14px 24px', borderBottom: '1px solid #22262e', alignItems: 'center', background: '#15181f' }}>
          <strong style={{ fontSize: 18 }}>🖼️ Qwen Image Studio</strong>
          <a href="/" style={{ color: '#9aa4b2', textDecoration: 'none', marginLeft: 'auto' }}>生成</a>
          <a href="/admin" style={{ color: '#9aa4b2', textDecoration: 'none' }}>管理</a>
        </nav>
        {children}
      </body>
    </html>
  );
}