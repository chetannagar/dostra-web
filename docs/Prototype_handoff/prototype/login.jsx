// Login screen — 1440x900. Split: brand marquee left, form right.
// No social, no forgot, no remember. Email + password only, matching API.

function LoginScreen({ t }) {
  return (
    <div style={{ width: 1440, height: 900, display: 'flex', background: t.bg, fontFamily: DOSTRA_TYPE.sans, color: t.ink }}>
      {/* Left: brand column */}
      <div style={{ width: 620, background: t.surface, borderRight: `1px solid ${t.line}`, display: 'flex', flexDirection: 'column', padding: '40px 52px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <DostraLogo t={t} size={26} />
          <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: -0.3 }}>Dostra</div>
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div style={{ fontSize: 11.5, fontFamily: DOSTRA_TYPE.mono, color: t.inkFaint, textTransform: 'uppercase', letterSpacing: 1.2 }}>Lead Operations · v0.4</div>
          <h1 style={{ fontSize: 44, fontWeight: 500, lineHeight: 1.05, letterSpacing: -1.2, margin: 0, color: t.ink, maxWidth: 460 }}>
            Inbound leads,<br/>
            <span style={{ color: t.inkMuted }}>captured and accountable.</span>
          </h1>
          <p style={{ fontSize: 14.5, lineHeight: 1.55, color: t.inkMuted, maxWidth: 420, margin: 0 }}>
            Signed webhook ingestion, per-client attribution, and a clean review surface for every message that lands.
          </p>

          {/* Small operational feed — suggests what the app is for */}
          <div style={{ border: `1px solid ${t.line}`, borderRadius: 8, padding: 14, background: t.bg, fontFamily: DOSTRA_TYPE.mono, fontSize: 11.5, color: t.inkMuted, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: t.inkFaint, fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.8, paddingBottom: 4, borderBottom: `1px dashed ${t.line}` }}>
              <span>Recent ingest</span><span>last 60 min</span>
            </div>
            {[
              { c: 'acme_plumbing',  n: 4, ok: true },
              { c: 'harbor_dental',  n: 2, ok: true },
              { c: 'northstar_legal', n: 1, ok: true },
              { c: 'meridian_hvac',  n: 0, ok: true },
            ].map(r => (
              <div key={r.c} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{r.c}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: t.ink }}>{String(r.n).padStart(2, '0')} leads</span>
                  <span style={{ width: 6, height: 6, borderRadius: 3, background: r.n > 0 ? t.signal : t.inkFaint }}/>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 36, display: 'flex', justifyContent: 'space-between', fontSize: 11, color: t.inkFaint, fontFamily: DOSTRA_TYPE.mono }}>
          <span>api · 127.0.0.1:8000</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: 3, background: t.signal }}/>
            operational
          </span>
        </div>
      </div>

      {/* Right: form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <div style={{ width: 380, display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div>
            <div style={{ fontSize: 11.5, fontFamily: DOSTRA_TYPE.mono, color: t.inkFaint, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Sign in</div>
            <h2 style={{ fontSize: 28, fontWeight: 500, letterSpacing: -0.5, margin: 0 }}>Welcome back</h2>
            <p style={{ fontSize: 13.5, color: t.inkMuted, marginTop: 6, marginBottom: 0 }}>Use your Dostra credentials to continue.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Field t={t} label="Email">
              <input defaultValue="admin@example.com" style={fieldStyle(t)} />
            </Field>
            <Field t={t} label="Password">
              <input type="password" defaultValue="••••••••" style={fieldStyle(t)} />
            </Field>
          </div>

          <button style={{
            padding: '11px 16px', borderRadius: 7, background: t.ink, color: t.bg,
            border: 'none', fontFamily: DOSTRA_TYPE.sans, fontSize: 14, fontWeight: 500,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            Sign in <Icon name="chevron" size={14} color={t.bg}/>
          </button>

          <div style={{ fontSize: 11.5, fontFamily: DOSTRA_TYPE.mono, color: t.inkFaint, borderTop: `1px dashed ${t.line}`, paddingTop: 14, display: 'flex', justifyContent: 'space-between' }}>
            <span>No account? Contact your admin.</span>
            <span>↵ enter</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ t, label, children }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontSize: 11.5, fontFamily: DOSTRA_TYPE.mono, color: t.inkMuted, textTransform: 'uppercase', letterSpacing: 0.8 }}>{label}</span>
      {children}
    </label>
  );
}
function fieldStyle(t) {
  return {
    padding: '10px 12px', background: t.surface, border: `1px solid ${t.line}`,
    borderRadius: 6, fontFamily: DOSTRA_TYPE.sans, fontSize: 14, color: t.ink, outline: 'none',
  };
}

Object.assign(window, { LoginScreen });
