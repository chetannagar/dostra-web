// Leads List — inbox-split: table left, detail preview right.

function LeadsListScreen({ t, user, selectedId = 1247 }) {
  const isAdmin = user.role === 'admin';
  const scoped = isAdmin ? DOSTRA_LEADS : DOSTRA_LEADS.filter(l => l.key === 'acme_plumbing');
  const selected = scoped.find(l => l.id === selectedId) || scoped[0];
  return (
    <div style={{ width: 1440, height: 900, display: 'flex', flexDirection: 'column', background: t.bg, color: t.ink, fontFamily: DOSTRA_TYPE.sans }}>
      <Topbar t={t} user={user} crumbs={isAdmin ? ['Leads'] : ['Leads', 'Acme Plumbing']}
        right={<>
          <button style={disabledBtn(t)} title="Not implemented"><Icon name="filter" size={13}/> Filters <span style={{ fontSize: 9.5, fontFamily: DOSTRA_TYPE.mono, color: t.inkFaint, textTransform: 'uppercase', letterSpacing: 0.6, border: `1px solid ${t.line}`, padding: '1px 4px', borderRadius: 3, marginLeft: 4 }}>soon</span></button>
          <button style={disabledBtn(t)} title="Not implemented"><Icon name="plus" size={13}/> Add lead <span style={{ fontSize: 9.5, fontFamily: DOSTRA_TYPE.mono, color: t.inkFaint, textTransform: 'uppercase', letterSpacing: 0.6, border: `1px solid ${t.line}`, padding: '1px 4px', borderRadius: 3, marginLeft: 4 }}>soon</span></button>
        </>}
      />

      {/* Filter bar (live API-supported filters only) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 28px', borderBottom: `1px solid ${t.line}`, background: t.surface }}>
        {isAdmin
          ? <FilterChip t={t} label="Client" value="All clients" />
          : <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '6px 10px', background: t.accentSoft, border: `1px solid ${t.line}`, borderRadius: 20, fontFamily: DOSTRA_TYPE.sans, fontSize: 12, color: t.accentInk }}>
              <span style={{ width: 5, height: 5, borderRadius: 3, background: t.signal }}/>
              <span style={{ color: t.inkFaint, fontFamily: DOSTRA_TYPE.mono, fontSize: 10.5, textTransform: 'uppercase', letterSpacing: 0.6 }}>Client</span>
              <span>Acme Plumbing</span>
            </div>}
        <FilterChip t={t} label="Email"  value="any" />
        <FilterChip t={t} label="From"   value="Apr 08" />
        <FilterChip t={t} label="To"     value="Apr 22" />
        <div style={{ flex: 1 }}/>
        <div style={{ fontSize: 12, fontFamily: DOSTRA_TYPE.mono, color: t.inkFaint }}>
          <span style={{ color: t.ink }}>{isAdmin ? '1,247' : '48'}</span> leads · page <span style={{ color: t.ink }}>1</span> / {isAdmin ? 50 : 2}
        </div>
        <div style={{ display: 'flex', gap: 2 }}>
          <button style={pagerBtn(t, true)}><Icon name="chevronL" size={13}/></button>
          <button style={pagerBtn(t, false)}><Icon name="chevron" size={13}/></button>
        </div>
      </div>

      {/* Split: table + preview */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 440px', minHeight: 0 }}>
        {/* Table */}
        <div style={{ borderRight: `1px solid ${t.line}`, display: 'flex', flexDirection: 'column', minHeight: 0, background: t.bg }}>
          <div style={{ display: 'grid', gridTemplateColumns: isAdmin ? '68px 1.3fr 1.1fr 1.5fr 110px' : '68px 1.3fr 2fr 110px', padding: '10px 22px', fontSize: 10.5, fontFamily: DOSTRA_TYPE.mono, color: t.inkFaint, textTransform: 'uppercase', letterSpacing: 0.8, borderBottom: `1px solid ${t.line}`, background: t.surface }}>
            <span>ID</span><span>Lead</span>{isAdmin && <span>Client</span>}<span>Message</span><span style={{ textAlign: 'right' }}>Received</span>
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            {scoped.map(l => {
              const sel = l.id === selected.id;
              return (
                <div key={l.id} style={{
                  display: 'grid', gridTemplateColumns: isAdmin ? '68px 1.3fr 1.1fr 1.5fr 110px' : '68px 1.3fr 2fr 110px',
                  padding: '14px 22px', borderBottom: `1px solid ${t.line}`,
                  background: sel ? t.surface : 'transparent',
                  borderLeft: sel ? `2px solid ${t.accent}` : '2px solid transparent',
                  paddingLeft: sel ? 20 : 22,
                  alignItems: 'center', fontSize: 13.5, cursor: 'pointer',
                }}>
                  <span style={{ fontFamily: DOSTRA_TYPE.mono, color: t.inkFaint, fontSize: 11.5 }}>#{l.id}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                    {l.fresh && <span style={{ width: 6, height: 6, borderRadius: 3, background: t.signal, flexShrink: 0 }} title="New"/>}
                    <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                      <span style={{ color: t.ink, fontWeight: sel ? 500 : 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.name}</span>
                      <span style={{ fontFamily: DOSTRA_TYPE.mono, fontSize: 11.5, color: t.inkFaint, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.email || '—'}</span>
                    </span>
                  </span>
                  {isAdmin && <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                    <span style={{ color: t.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.client}</span>
                    <span style={{ fontFamily: DOSTRA_TYPE.mono, fontSize: 11, color: t.inkFaint }}>{l.key}</span>
                  </span>}
                  <span style={{ color: t.inkMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 13 }}>{l.message}</span>
                  <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <span style={{ fontFamily: DOSTRA_TYPE.mono, fontSize: 12, color: t.ink }}>{l.ago} ago</span>
                    <span style={{ fontFamily: DOSTRA_TYPE.mono, fontSize: 10.5, color: t.inkFaint }}>{l.ts.split(' ')[1]}</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Preview pane */}
        <LeadPreview t={t} lead={selected} />
      </div>
    </div>
  );
}

function LeadPreview({ t, lead }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', background: t.surface, minHeight: 0, overflow: 'hidden' }}>
      <div style={{ padding: '18px 22px 14px', borderBottom: `1px solid ${t.line}`, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 10.5, fontFamily: DOSTRA_TYPE.mono, color: t.inkFaint, textTransform: 'uppercase', letterSpacing: 0.8 }}>Lead · #{lead.id}</div>
          <button style={{ ...secondaryBtn(t), padding: '4px 8px', fontSize: 11.5 }}>
            Open detail <Icon name="external" size={11}/>
          </button>
        </div>
        <div style={{ fontSize: 20, fontWeight: 500, letterSpacing: -0.3, color: t.ink }}>{lead.name}</div>
        <div style={{ fontFamily: DOSTRA_TYPE.mono, fontSize: 12, color: t.inkMuted }}>{lead.email || '(no email provided)'}</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {lead.fresh && <Pill t={t} tone="signal">New · {lead.ago}</Pill>}
          <Pill t={t}>{lead.source}</Pill>
          <Pill t={t}>{lead.key}</Pill>
        </div>
      </div>

      <div style={{ padding: '16px 22px', borderBottom: `1px solid ${t.line}` }}>
        <div style={{ fontSize: 10.5, fontFamily: DOSTRA_TYPE.mono, color: t.inkFaint, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>Message</div>
        <div style={{ fontSize: 13.5, color: t.ink, lineHeight: 1.55, textWrap: 'pretty' }}>{lead.message}</div>
      </div>

      <div style={{ padding: '16px 22px', borderBottom: `1px solid ${t.line}`, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <KV t={t} label="Client"   value={lead.client}/>
        <KV t={t} label="Key"      value={lead.key} mono/>
        <KV t={t} label="Received" value={lead.ts} mono/>
        <KV t={t} label="Source"   value={lead.source} mono/>
      </div>

      <div style={{ flex: 1, padding: '16px 22px', overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ fontSize: 10.5, fontFamily: DOSTRA_TYPE.mono, color: t.inkFaint, textTransform: 'uppercase', letterSpacing: 0.8 }}>Payload · preview</div>
          <div style={{ fontSize: 10.5, fontFamily: DOSTRA_TYPE.mono, color: t.accent, cursor: 'pointer' }}>view full →</div>
        </div>
        <div style={{ flex: 1, background: t.codeBg, border: `1px solid ${t.line}`, borderRadius: 6, padding: 12, overflow: 'hidden', fontFamily: DOSTRA_TYPE.mono, fontSize: 11.5, lineHeight: 1.65, minHeight: 0 }}>
          <CodeLine t={t}>{'{'}</CodeLine>
          <CodeLine t={t} indent={1}><span style={{ color: t.codeKey }}>"name"</span>: <span style={{ color: t.codeStr }}>"{lead.name}"</span>,</CodeLine>
          <CodeLine t={t} indent={1}><span style={{ color: t.codeKey }}>"email"</span>: <span style={{ color: t.codeStr }}>"{lead.email || ''}"</span>,</CodeLine>
          <CodeLine t={t} indent={1}><span style={{ color: t.codeKey }}>"message"</span>: <span style={{ color: t.codeStr }}>"{(lead.message || '').slice(0, 60)}…"</span>,</CodeLine>
          <CodeLine t={t} indent={1}><span style={{ color: t.codeKey }}>"source"</span>: <span style={{ color: t.codeStr }}>"{lead.source}"</span>,</CodeLine>
          <CodeLine t={t} indent={1}><span style={{ color: t.codeKey }}>"webhook_event_id"</span>: <span style={{ color: t.codeStr }}>"evt_{lead.id}a7c"</span></CodeLine>
          <CodeLine t={t}>{'}'}</CodeLine>
        </div>
      </div>
    </div>
  );
}

function CodeLine({ t, indent = 0, children }) {
  return <div style={{ color: t.inkMuted, paddingLeft: indent * 14 }}>{children}</div>;
}
function KV({ t, label, value, mono }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
      <span style={{ fontSize: 10.5, fontFamily: DOSTRA_TYPE.mono, color: t.inkFaint, textTransform: 'uppercase', letterSpacing: 0.8 }}>{label}</span>
      <span style={{ fontFamily: mono ? DOSTRA_TYPE.mono : DOSTRA_TYPE.sans, fontSize: mono ? 12 : 13, color: t.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</span>
    </div>
  );
}

function FilterChip({ t, label, value }) {
  return (
    <button style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '6px 10px', background: t.surface, border: `1px solid ${t.line}`, borderRadius: 20, fontFamily: DOSTRA_TYPE.sans, fontSize: 12, color: t.ink, cursor: 'pointer' }}>
      <span style={{ color: t.inkFaint, fontFamily: DOSTRA_TYPE.mono, fontSize: 10.5, textTransform: 'uppercase', letterSpacing: 0.6 }}>{label}</span>
      <span>{value}</span>
      <Icon name="chevronD" size={11} color={t.inkFaint}/>
    </button>
  );
}
function pagerBtn(t, left) {
  return { width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', background: t.surface, border: `1px solid ${t.line}`, borderRadius: 5, color: t.inkMuted, cursor: 'pointer' };
}
function disabledBtn(t) {
  return { display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', background: t.surface, border: `1px solid ${t.line}`, borderRadius: 6, fontFamily: DOSTRA_TYPE.sans, fontSize: 12.5, color: t.inkFaint, cursor: 'not-allowed', opacity: 0.75 };
}

Object.assign(window, { LeadsListScreen, LeadPreview, KV, disabledBtn });
