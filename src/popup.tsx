export default function Popup() {
  const platforms = [
    { name: 'Claude', url: 'https://claude.ai' },
    { name: 'Gemini', url: 'https://gemini.google.com' },
    { name: 'Perplexity', url: 'https://www.perplexity.ai' },
  ]

  const handleOpenCurrentPage = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id!, { action: 'show-sidebar' }).catch(() => {
          // Sidebar not loaded yet, will appear when it initializes
        })
        setTimeout(() => window.close(), 100)
      }
    })
  }

  const handleOpenPlatform = (url: string) => {
    chrome.tabs.create({ url })
  }

  return (
    <div style={{
      width: 300,
      padding: 20,
      fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif',
      background: '#0f0f1e',
      color: '#ffffff',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <h2 style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 700, color: '#ffffff' }}>
        Phrased
      </h2>
      <p style={{ margin: '0 0 16px', fontSize: 12, color: '#a0a0b0', lineHeight: 1.5 }}>
        100 AI prompt templates. Works on any page!
      </p>

      {/* Primary: Open on this page */}
      <button
        onClick={handleOpenCurrentPage}
        style={{
          width: '100%',
          padding: '12px 14px',
          background: '#ff8c42',
          color: '#0f0f1e',
          border: 'none',
          borderRadius: 8,
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          marginBottom: 12,
          transition: 'all 0.15s'
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        title="Use Phrased on this page for copy/paste mode"
      >
        ✨ Use on this page
      </button>

      {/* Divider */}
      <div style={{ height: 1, background: '#1a1a2e', marginBottom: 12 }} />

      {/* Supported Platforms */}
      <p style={{ margin: '0 0 8px', fontSize: 11, color: '#808090', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Supported Platforms
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
        {platforms.map(p => (
          <button
            key={p.name}
            onClick={() => handleOpenPlatform(p.url)}
            style={{
              display: 'block',
              padding: '10px 12px',
              background: '#1a1a2e',
              border: '1.5px solid #2a2a3e',
              borderRadius: 6,
              fontSize: 13,
              color: '#e0e0e0',
              textDecoration: 'none',
              fontWeight: 500,
              transition: 'all 0.15s',
              cursor: 'pointer',
              width: '100%',
              textAlign: 'left'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#ff8c42'
              e.currentTarget.style.background = '#252535'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#2a2a3e'
              e.currentTarget.style.background = '#1a1a2e'
            }}
            title={`Open ${p.name}`}
          >
            Open {p.name} →
          </button>
        ))}
      </div>

      {/* Footer */}
      <p style={{ margin: '0', fontSize: 11, color: '#808090', lineHeight: 1.4 }}>
        <span style={{ color: '#ff8c42', fontWeight: 600 }}>Free</span> · No account · Zero data collected
      </p>
    </div>
  )
}
