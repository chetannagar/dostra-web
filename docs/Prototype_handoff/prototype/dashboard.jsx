// Dashboard — 1440x840 content area (below 60px topbar = 900 total).
// Metric cards with sparklines + 14-day bar chart + quick status + top clients + recent leads.

function Sparkline({ data, t, color, w = 90, h = 28 }) {
  const max = Math.max(...data, 1);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - (v / max) * (h - 4) - 2;
    return `${x},${y}`;
  }).join(' ');
  const last = data[data.length - 1];
  const lx = w, ly = h - (last / max) * (h - 4) - 2;
  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      <polyline points={pts} fill="none" stroke={color || t.accent} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={lx} cy={ly} r="2.2" fill={color || t.accent}/>
    </svg>
  );
}

function MetricCard({ t, label, value, delta, deltaDir, spark, sparkColor, unit }) {
  return (
    <div style={{ background: t.surface, border: `1px solid ${t.line}`, borderRadius: 8, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 11.5, fontFamily: DOSTRA_TYPE.mono, color: t.inkMuted, textTransform: 'uppercase', letterSpacing: 0.8 }}>{label}</div>
        {delta != null && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, fontFamily: DOSTRA_TYPE.mono, color: deltaDir === 'up' ? t.signal : deltaDir === 'down' ? t.danger : t.inkFaint }}>
            <Icon name={deltaDir === 'up' ? 'arrowUp' : 'arrowDn'} size={10}/>
            {delta}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ fontSize: 32, fontWeight: 500, letterSpacing: -0.8, color: t.ink, fontFamily: DOSTRA_TYPE.sans, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
          {value}{unit && <span style={{ fontSize: 14, color: t.inkFaint, fontWeight: 400, marginLeft: 4 }}>{unit}</span>}
        </div>
        <Sparkline data={spark} t={t} color={sparkColor}/>
      </div>
    </div>
  );
}

function DashboardScreen({ t, user }) {
  const isAdmin = user.role === 'admin';
  // Client view sees only their own leads. Scale the 14-day histogram to
  // their share of volume so the chart still feels real.
  const daily = isAdmin ? DOSTRA_DAILY : DOSTRA_DAILY.map(d => ({ ...d, n: Math.max(0, Math.round(d.n * 0.38)) }));
  const maxDay = Math.max(...daily.map(d => d.n), 1);
  const totalLeads = isAdmin ? '1,247' : '48';
  const newLeads   = isAdmin ? '32' : '6';
  return (
    <div style={{ width: 1440, height: 900, display: 'flex', flexDirection: 'column', background: t.bg, color: t.ink, fontFamily: DOSTRA_TYPE.sans }}>
      <Topbar t={t} user={user} crumbs={['Dashboard']} />
      <div style={{ flex: 1, overflow: 'hidden', padding: '22px 28px 28px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: -0.5 }}>Good afternoon, {user.name.split(' ')[0]}</div>
            <div style={{ fontSize: 13, color: t.inkMuted, marginTop: 2 }}>
              <span style={{ fontFamily: DOSTRA_TYPE.mono }}>Apr 22, 2026 · 14:32</span> · {isAdmin ? '9 leads today across 5 clients.' : '2 leads today for Acme Plumbing.'}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Pill t={t} tone={isAdmin ? 'neutral' : 'signal'}>{isAdmin ? 'Admin · all clients' : 'Client · 1 client'}</Pill>
            <button style={secondaryBtn(t)}><Icon name="clock" size={13}/> Last 14 days</button>
          </div>
        </div>

        {/* metrics row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          <MetricCard t={t} label="Total leads"         value={totalLeads} delta="+12%" deltaDir="up"   spark={[8,11,9,13,10,14,12,15,13,17,18,22,20,19]} sparkColor={t.accent}/>
          <MetricCard t={t} label="New · 24h"           value={newLeads}   delta="+4"   deltaDir="up"   spark={[2,5,3,6,8,4,7,6,9,10,8,11,9,12]}          sparkColor={t.signal}/>
          {isAdmin
            ? <MetricCard t={t} label="Active clients"     value="5"  unit="/ 6"  delta="—"     deltaDir="flat" spark={[5,5,5,6,6,6,5,5,5,5,5,5,5,5]}             sparkColor={t.accent}/>
            : <MetricCard t={t} label="Avg response · 24h" value="2.4" unit="hrs" delta="-18m"  deltaDir="up"   spark={[4,3.8,3.5,3.2,3,2.8,2.6,2.5,2.7,2.5,2.4,2.3,2.4,2.4]} sparkColor={t.accent}/>}
          <MetricCard t={t} label="Reachable contacts"  value="94"    unit="%"      delta="+1.2%" deltaDir="up"  spark={[88,90,91,89,92,93,91,92,94,93,94,95,94,94]} sparkColor={t.signal}/>
        </div>

        {/* middle row: chart + quick status */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: 14, minHeight: 0 }}>
          {/* Leads by day bar chart */}
          <div style={{ background: t.surface, border: `1px solid ${t.line}`, borderRadius: 8, padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 500 }}>Leads by day</div>
                <div style={{ fontSize: 11.5, fontFamily: DOSTRA_TYPE.mono, color: t.inkFaint, textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 2 }}>14d · derived</div>
              </div>
              <div style={{ display: 'flex', gap: 12, fontSize: 11.5, color: t.inkMuted }}>
                <LegendDot t={t} color={t.accent}/> All leads
                <LegendDot t={t} color={t.signal}/> New (24h)
              </div>
            </div>
            {/* bars */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 170, paddingTop: 8 }}>
              {daily.map((d, i) => {
                const isToday = i === daily.length - 1;
                const isYest = i === daily.length - 2;
                return (
                  <div key={d.d} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, minWidth: 0 }}>
                    <div style={{ fontSize: 10, fontFamily: DOSTRA_TYPE.mono, color: isToday ? t.ink : t.inkFaint, fontVariantNumeric: 'tabular-nums' }}>{d.n}</div>
                    <div style={{ width: '100%', height: 130, display: 'flex', alignItems: 'flex-end' }}>
                      <div style={{
                        width: '100%', height: `${(d.n / maxDay) * 100}%`,
                        background: isToday ? t.signal : isYest ? t.accent : t.accentSoft,
                        borderRadius: '3px 3px 1px 1px',
                        border: isToday ? `1px solid ${t.signal}` : `1px solid ${t.accentSoft}`,
                      }}/>
                    </div>
                    <div style={{ fontSize: 10, fontFamily: DOSTRA_TYPE.mono, color: isToday ? t.ink : t.inkFaint, letterSpacing: -0.2 }}>{d.d.split(' ')[1]}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick status */}
          <div style={{ background: t.surface, border: `1px solid ${t.line}`, borderRadius: 8, padding: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div style={{ fontSize: 13.5, fontWeight: 500 }}>Quick status</div>
              <div style={{ fontSize: 11.5, fontFamily: DOSTRA_TYPE.mono, color: t.inkFaint }}>session</div>
            </div>
            {(isAdmin ? [
              { k: 'Missing email',  n: 8,   tone: 'warn' },
              { k: 'Empty message',  n: 3,   tone: 'warn' },
              { k: 'Inactive client',n: 12,  tone: 'neutral' },
              { k: 'Duplicate webhook id', n: 0, tone: 'good' },
              { k: 'Ingestion errors · 24h', n: 0, tone: 'good' },
            ] : [
              { k: 'Missing email',  n: 2,   tone: 'warn' },
              { k: 'Empty message',  n: 0,   tone: 'good' },
              { k: 'Webhook status', n: 'ok', tone: 'good' },
              { k: 'Ingestion errors · 24h', n: 0, tone: 'good' },
              { k: 'Last received',  n: '2m', tone: 'good' },
            ]).map(r => (
              <div key={r.k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: `1px dashed ${t.line}` }}>
                <span style={{ fontSize: 13, color: t.ink }}>{r.k}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 13, fontFamily: DOSTRA_TYPE.mono, color: t.ink, fontVariantNumeric: 'tabular-nums' }}>{r.n}</span>
                  <span style={{ width: 6, height: 6, borderRadius: 3, background: r.tone === 'warn' ? t.warn : r.tone === 'good' ? t.signal : t.inkFaint }}/>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* bottom row: top clients (admin) / sources (client) + recent leads */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: 14, minHeight: 0, flex: 1 }}>
          <div style={{ background: t.surface, border: `1px solid ${t.line}`, borderRadius: 8, padding: 18, display: 'flex', flexDirection: 'column', gap: 10, minHeight: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div style={{ fontSize: 13.5, fontWeight: 500 }}>{isAdmin ? 'Top clients' : 'Lead sources'}</div>
              <div style={{ fontSize: 11.5, fontFamily: DOSTRA_TYPE.mono, color: t.inkFaint }}>{isAdmin ? 'by volume' : '30d'}</div>
            </div>
            {(isAdmin ? DOSTRA_CLIENTS : [
              { name: 'WPForms · Contact',  key: 'wpforms_contact',  count: 28, active: true },
              { name: 'WPForms · Quote',    key: 'wpforms_quote',    count: 14, active: true },
              { name: 'WPForms · Emergency',key: 'wpforms_emer',     count:  4, active: true },
              { name: 'WPForms · Careers',  key: 'wpforms_careers',  count:  2, active: true },
            ]).map((c, i) => {
              const list = isAdmin ? DOSTRA_CLIENTS : [{count:28},{count:14},{count:4},{count:2}];
              const maxC = list[0].count;
              return (
                <div key={c.key} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '5px 0' }}>
                  <div style={{ width: 16, fontSize: 10.5, fontFamily: DOSTRA_TYPE.mono, color: t.inkFaint, fontVariantNumeric: 'tabular-nums' }}>{String(i+1).padStart(2, '0')}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13, color: c.active ? t.ink : t.inkMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</span>
                      <span style={{ fontSize: 12, fontFamily: DOSTRA_TYPE.mono, color: t.inkMuted, fontVariantNumeric: 'tabular-nums' }}>{c.count}</span>
                    </div>
                    <div style={{ height: 3, background: t.surface2, borderRadius: 2, marginTop: 5, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${(c.count / maxC) * 100}%`, background: c.active ? t.accent : t.inkFaint, borderRadius: 2 }}/>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ background: t.surface, border: `1px solid ${t.line}`, borderRadius: 8, padding: 18, display: 'flex', flexDirection: 'column', gap: 8, minHeight: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div style={{ fontSize: 13.5, fontWeight: 500 }}>Recent leads</div>
              <div style={{ fontSize: 11.5, fontFamily: DOSTRA_TYPE.mono, color: t.accent, cursor: 'pointer' }}>View all →</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 1fr 90px', fontSize: 10.5, fontFamily: DOSTRA_TYPE.mono, color: t.inkFaint, textTransform: 'uppercase', letterSpacing: 0.8, paddingBottom: 6, borderBottom: `1px solid ${t.line}` }}>
              <span>ID</span><span>Lead</span><span>{isAdmin ? 'Client' : 'Email'}</span><span style={{ textAlign: 'right' }}>Received</span>
            </div>
            {(isAdmin ? DOSTRA_LEADS : DOSTRA_LEADS.filter(l => l.key === 'acme_plumbing')).slice(0, 6).map(l => (
              <div key={l.id} style={{ display: 'grid', gridTemplateColumns: '60px 1fr 1fr 90px', padding: '8px 0', borderBottom: `1px dashed ${t.line}`, alignItems: 'center', fontSize: 13 }}>
                <span style={{ fontFamily: DOSTRA_TYPE.mono, color: t.inkFaint, fontSize: 11.5 }}>#{l.id}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
                  {l.fresh && <span style={{ width: 5, height: 5, borderRadius: 3, background: t.signal, flexShrink: 0 }}/>}
                  <span style={{ color: t.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.name}</span>
                </span>
                <span style={{ color: t.inkMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{isAdmin ? l.client : (l.email || '—')}</span>
                <span style={{ fontFamily: DOSTRA_TYPE.mono, color: t.inkFaint, fontSize: 11.5, textAlign: 'right' }}>{l.ago} ago</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Pill({ t, children, tone = 'neutral' }) {
  const bg = tone === 'signal' ? t.signalBg : tone === 'warn' ? t.warnBg : t.surface2;
  const fg = tone === 'signal' ? t.signal : tone === 'warn' ? t.warn : t.inkMuted;
  return <span style={{ fontSize: 10.5, fontFamily: DOSTRA_TYPE.mono, textTransform: 'uppercase', letterSpacing: 0.8, padding: '3px 7px', background: bg, color: fg, borderRadius: 3, border: `1px solid ${t.line}` }}>{children}</span>;
}
function LegendDot({ t, color }) { return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><span style={{ width: 7, height: 7, borderRadius: 2, background: color }}/></span>; }
function secondaryBtn(t) {
  return { display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', background: t.surface, border: `1px solid ${t.line}`, borderRadius: 6, fontFamily: DOSTRA_TYPE.sans, fontSize: 12.5, color: t.inkMuted, cursor: 'pointer' };
}

Object.assign(window, { DashboardScreen, Pill, Sparkline, secondaryBtn });
