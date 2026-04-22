// Lead Detail — full-screen detail view with pretty payload table + raw JSON toggle.

function LeadDetailScreen({ t, user }) {
  const isAdmin = user.role === 'admin';
  const lead = DOSTRA_LEADS[0]; // Sarah Connor — freshest lead (Acme Plumbing)
  // Simulated rich payload (what WPForms/Zapier actually sends)
  const payload = {
    name: lead.name,
    email: lead.email,
    message: lead.message,
    phone: '+1 (415) 555-0148',
    form_id: 'wpforms_contact_v3',
    form_title: 'Request a quote',
    page_title: 'Contact · Acme Plumbing',
    page_url: 'https://acmeplumbing.com/contact/',
    referrer: 'https://www.google.com/',
    user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4_1) AppleWebKit/605.1.15',
    ip_address: '73.15.204.62',
    utm_source: 'google',
    utm_medium: 'organic',
    utm_campaign: null,
    submitted_at: '2026-04-21T14:32:08-07:00',
  };

  return (
    <div style={{ width: 1440, height: 900, display: 'flex', flexDirection: 'column', background: t.bg, color: t.ink, fontFamily: DOSTRA_TYPE.sans }}>
      <Topbar t={t} user={user}
        crumbs={isAdmin ? ['Leads', `#${lead.id} · ${lead.name}`] : ['Leads', 'Acme Plumbing', `#${lead.id}`]}
        right={<>
          <button style={disabledBtn(t)} title="Not implemented">Edit lead <span style={{ fontSize: 9.5, fontFamily: DOSTRA_TYPE.mono, color: t.inkFaint, textTransform: 'uppercase', letterSpacing: 0.6, border: `1px solid ${t.line}`, padding: '1px 4px', borderRadius: 3, marginLeft: 4 }}>soon</span></button>
        </>}
      />

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 420px', minHeight: 0 }}>
        {/* Main column */}
        <div style={{ overflow: 'hidden', padding: '22px 28px', display: 'flex', flexDirection: 'column', gap: 18, minHeight: 0 }}>

          {/* Header card */}
          <div style={{ background: t.surface, border: `1px solid ${t.line}`, borderRadius: 10, padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button style={{ ...secondaryBtn(t), padding: '5px 8px' }}><Icon name="back" size={12}/> All leads</button>
              <div style={{ fontFamily: DOSTRA_TYPE.mono, fontSize: 11.5, color: t.inkFaint }}>/ lead</div>
              <div style={{ fontFamily: DOSTRA_TYPE.mono, fontSize: 11.5, color: t.ink }}>#{lead.id}</div>
              <div style={{ flex: 1 }}/>
              {lead.fresh && <Pill t={t} tone="signal">New · {lead.ago} ago</Pill>}
              <Pill t={t}>{lead.source}</Pill>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20 }}>
              <div>
                <h1 style={{ fontSize: 30, fontWeight: 500, letterSpacing: -0.7, margin: 0, lineHeight: 1.1 }}>{lead.name}</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8, fontFamily: DOSTRA_TYPE.mono, fontSize: 12.5, color: t.inkMuted }}>
                  <span>{lead.email}</span>
                  <span style={{ color: t.inkFaint }}>·</span>
                  <span>{payload.phone}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button style={secondaryBtn(t)}><Icon name="copy" size={13}/> Copy email</button>
                <button style={{ ...secondaryBtn(t), background: t.ink, color: t.bg, border: `1px solid ${t.ink}` }}>
                  Reply via email <Icon name="external" size={12} color={t.bg}/>
                </button>
              </div>
            </div>
          </div>

          {/* Message + payload */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 18, flex: 1, minHeight: 0, overflow: 'hidden' }}>
            <div style={{ background: t.surface, border: `1px solid ${t.line}`, borderRadius: 10, padding: '18px 22px' }}>
              <div style={{ fontSize: 10.5, fontFamily: DOSTRA_TYPE.mono, color: t.inkFaint, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 }}>Message</div>
              <div style={{ fontSize: 15, lineHeight: 1.6, color: t.ink, textWrap: 'pretty' }}>{lead.message}</div>
            </div>

            {/* Payload — pretty/raw toggle */}
            <div style={{ background: t.surface, border: `1px solid ${t.line}`, borderRadius: 10, padding: 0, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
              <div style={{ padding: '14px 22px', borderBottom: `1px solid ${t.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 500 }}>Raw payload</div>
                  <span style={{ fontSize: 10.5, fontFamily: DOSTRA_TYPE.mono, color: t.inkFaint }}>{Object.keys(payload).length} fields · 1.2kb</span>
                </div>
                <div style={{ display: 'flex', gap: 2, padding: 2, background: t.surface2, borderRadius: 6, border: `1px solid ${t.line}` }}>
                  <button style={segBtn(t, true)}>Pretty</button>
                  <button style={segBtn(t, false)}>Raw JSON</button>
                  <button style={{ ...secondaryBtn(t), padding: '4px 8px', fontSize: 11, marginLeft: 6, border: 'none', background: 'transparent' }}><Icon name="copy" size={12}/> Copy</button>
                </div>
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                {/* Pretty key/value table */}
                <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', fontFamily: DOSTRA_TYPE.mono, fontSize: 12.5 }}>
                  {Object.entries(payload).map(([k, v], i) => (
                    <React.Fragment key={k}>
                      <div style={{ padding: '10px 22px', borderBottom: `1px solid ${t.line}`, background: i % 2 ? t.surface : t.surface2, color: t.codeKey, whiteSpace: 'nowrap' }}>{k}</div>
                      <div style={{ padding: '10px 22px', borderBottom: `1px solid ${t.line}`, background: i % 2 ? t.surface : t.surface2, color: v == null ? t.inkFaint : typeof v === 'number' ? t.codeNum : t.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {v == null ? <span style={{ fontStyle: 'italic' }}>null</span> : String(v)}
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right rail */}
        <div style={{ borderLeft: `1px solid ${t.line}`, background: t.surface, overflow: 'hidden', padding: '22px 22px', display: 'flex', flexDirection: 'column', gap: 18 }}>

          <Section t={t} title="Client attribution">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: t.surface2, border: `1px solid ${t.line}`, borderRadius: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 6, background: t.accentSoft, color: t.accentInk, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600 }}>AP</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: t.ink }}>{lead.client}</div>
                <div style={{ fontFamily: DOSTRA_TYPE.mono, fontSize: 11, color: t.inkFaint }}>{lead.key}</div>
              </div>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: t.signal, fontFamily: DOSTRA_TYPE.mono }}>
                <span style={{ width: 6, height: 6, borderRadius: 3, background: t.signal }}/> active
              </span>
            </div>
          </Section>

          <Section t={t} title="Identity">
            <KV t={t} label="Lead ID"          value={`#${lead.id}`} mono/>
            <KV t={t} label="Webhook event"    value={`evt_${lead.id}a7c`} mono/>
            <KV t={t} label="Source"           value={lead.source} mono/>
            <KV t={t} label="UTM source"       value={payload.utm_source} mono/>
            <KV t={t} label="IP address"       value={payload.ip_address} mono/>
          </Section>

          <Section t={t} title="Timeline" future>
            <TLItem t={t} ts="14:32:08" label="Received" detail="POST /api/webhook/leads · 201"/>
            <TLItem t={t} ts="14:32:08" label="Verified"  detail="HMAC signature ok"/>
            <TLItem t={t} ts="14:32:09" label="Stored"    detail={`lead_id #${lead.id}`} last/>
          </Section>

          <div style={{ marginTop: 'auto', fontSize: 10.5, fontFamily: DOSTRA_TYPE.mono, color: t.inkFaint, borderTop: `1px dashed ${t.line}`, paddingTop: 12, display: 'flex', justifyContent: 'space-between' }}>
            <span>created {lead.ts}</span>
            <span>updated {lead.ts}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ t, title, children, future }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 10.5, fontFamily: DOSTRA_TYPE.mono, color: t.inkFaint, textTransform: 'uppercase', letterSpacing: 0.8 }}>{title}</div>
        {future && <span style={{ fontSize: 9.5, fontFamily: DOSTRA_TYPE.mono, color: t.inkFaint, textTransform: 'uppercase', letterSpacing: 0.6, border: `1px solid ${t.line}`, padding: '1px 5px', borderRadius: 3 }}>derived</span>}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{children}</div>
    </div>
  );
}

function TLItem({ t, ts, label, detail, last }) {
  return (
    <div style={{ display: 'flex', gap: 10, position: 'relative' }}>
      <div style={{ width: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 4, position: 'relative' }}>
        <div style={{ width: 7, height: 7, borderRadius: 4, background: t.accent, border: `2px solid ${t.surface}`, zIndex: 1 }}/>
        {!last && <div style={{ position: 'absolute', top: 12, bottom: -14, width: 1, background: t.line }}/>}
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, paddingBottom: last ? 0 : 4 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12.5, fontWeight: 500, color: t.ink }}>{label}</span>
          <span style={{ fontFamily: DOSTRA_TYPE.mono, fontSize: 10.5, color: t.inkFaint }}>{ts}</span>
        </div>
        <div style={{ fontFamily: DOSTRA_TYPE.mono, fontSize: 11, color: t.inkMuted }}>{detail}</div>
      </div>
    </div>
  );
}

function segBtn(t, active) {
  return {
    padding: '3px 9px', background: active ? t.surface : 'transparent', color: active ? t.ink : t.inkMuted,
    border: 'none', borderRadius: 4, fontFamily: DOSTRA_TYPE.sans, fontSize: 11.5, cursor: 'pointer',
    boxShadow: active ? `0 1px 2px rgba(0,0,0,.08)` : 'none',
  };
}

Object.assign(window, { LeadDetailScreen, Section, TLItem });
