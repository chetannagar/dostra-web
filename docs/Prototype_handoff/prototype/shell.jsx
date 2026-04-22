// Shared app shell: Sidebar + Topbar. Used by Dashboard, Leads, Lead Detail.
// Artboard is 1440x900. Sidebar can be collapsed (64px) or expanded (232px).

function DostraLogo({ t, size = 22 }) {
  // Original monogram: a filled square "inbox" with an inbound notch cut
  // from the top edge. Reads as a lead landing in a tray. Not derived
  // from any existing brand.
  const w = size, h = size;
  return (
    <svg width={w} height={h} viewBox="0 0 22 22" fill="none">
      <rect x="1.5" y="1.5" width="19" height="19" rx="3" fill={t.ink} />
      <path d="M6 6 L9.5 9.5 L12.5 9.5 L16 6" stroke={t.bg} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <rect x="5.5" y="13" width="11" height="1.4" rx=".7" fill={t.bg} opacity=".7"/>
    </svg>
  );
}

function Icon({ name, size = 16, stroke = 1.5, color = 'currentColor' }) {
  const p = { width: size, height: size, viewBox: '0 0 20 20', fill: 'none', stroke: color, strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'dashboard': return <svg {...p}><rect x="3" y="3" width="6" height="7" rx="1"/><rect x="11" y="3" width="6" height="4" rx="1"/><rect x="3" y="12" width="6" height="5" rx="1"/><rect x="11" y="9" width="6" height="8" rx="1"/></svg>;
    case 'leads':     return <svg {...p}><path d="M3 6l7 5 7-5"/><rect x="3" y="4" width="14" height="12" rx="1.5"/></svg>;
    case 'clients':   return <svg {...p}><circle cx="7" cy="8" r="3"/><path d="M2 17c0-2.8 2.2-5 5-5s5 2.2 5 5"/><circle cx="14" cy="7" r="2.2"/><path d="M12 14c.6-1.2 2-2 3.5-2 2 0 3.5 1.3 3.5 3"/></svg>;
    case 'users':     return <svg {...p}><circle cx="10" cy="7" r="3"/><path d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6"/></svg>;
    case 'search':    return <svg {...p}><circle cx="9" cy="9" r="5"/><path d="M13 13l4 4"/></svg>;
    case 'chevron':   return <svg {...p}><path d="M7 5l5 5-5 5"/></svg>;
    case 'chevronL':  return <svg {...p}><path d="M13 5l-5 5 5 5"/></svg>;
    case 'chevronD':  return <svg {...p}><path d="M5 7l5 5 5-5"/></svg>;
    case 'dot':       return <svg {...p} fill={color} stroke="none"><circle cx="10" cy="10" r="3"/></svg>;
    case 'arrowUp':   return <svg {...p}><path d="M10 15V5M5 10l5-5 5 5"/></svg>;
    case 'arrowDn':   return <svg {...p}><path d="M10 5v10M5 10l5 5 5-5"/></svg>;
    case 'logout':    return <svg {...p}><path d="M12 15l-3 3H3V2h6l3 3"/><path d="M8 10h10M14 6l4 4-4 4"/></svg>;
    case 'copy':      return <svg {...p}><rect x="6" y="6" width="11" height="11" rx="1.5"/><path d="M4 13V4a1 1 0 011-1h9"/></svg>;
    case 'external':  return <svg {...p}><path d="M11 3h6v6M17 3l-8 8M9 5H4a1 1 0 00-1 1v10a1 1 0 001 1h10a1 1 0 001-1v-5"/></svg>;
    case 'back':      return <svg {...p}><path d="M8 4l-5 6 5 6M3 10h14"/></svg>;
    case 'filter':    return <svg {...p}><path d="M3 5h14M5 10h10M8 15h4"/></svg>;
    case 'plus':      return <svg {...p}><path d="M10 4v12M4 10h12"/></svg>;
    case 'sidebar':   return <svg {...p}><rect x="3" y="4" width="14" height="12" rx="1.5"/><path d="M8 4v12"/></svg>;
    case 'sun':       return <svg {...p}><circle cx="10" cy="10" r="3.5"/><path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.5 4.5l1.4 1.4M14.1 14.1l1.4 1.4M4.5 15.5l1.4-1.4M14.1 5.9l1.4-1.4"/></svg>;
    case 'moon':      return <svg {...p}><path d="M16 11.5A6.5 6.5 0 019.5 4a6 6 0 00-.5 11.8 6 6 0 007-4.3z"/></svg>;
    case 'check':     return <svg {...p}><path d="M4 10l4 4 8-9"/></svg>;
    case 'clock':     return <svg {...p}><circle cx="10" cy="10" r="7"/><path d="M10 6v4l3 2"/></svg>;
    case 'sparkle':   return <svg {...p}><path d="M10 3v4M10 13v4M3 10h4M13 10h4"/></svg>;
  }
  return null;
}

function Sidebar({ t, collapsed, current, user, onToggle, onNav }) {
  const w = collapsed ? 64 : 232;
  const isAdmin = user.role === 'admin';
  const items = [
    { id: 'dashboard', label: 'Dashboard', enabled: true },
    { id: 'leads',     label: 'Leads',     enabled: true, count: isAdmin ? 1247 : 48 },
    ...(isAdmin ? [
      { id: 'clients', label: 'Clients', enabled: false, soon: true },
      { id: 'users',   label: 'Users',   enabled: false, soon: true },
    ] : []),
  ];
  return (
    <aside style={{ width: w, borderRight: `1px solid ${t.line}`, background: t.surface, display: 'flex', flexDirection: 'column', flexShrink: 0, transition: 'width .18s ease' }}>
      {/* brand */}
      <div style={{ height: 56, display: 'flex', alignItems: 'center', padding: collapsed ? '0' : '0 18px', justifyContent: collapsed ? 'center' : 'flex-start', gap: 10, borderBottom: `1px solid ${t.line}` }}>
        <DostraLogo t={t} />
        {!collapsed && <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: -0.3, color: t.ink }}>Dostra</div>}
        {!collapsed && <div style={{ marginLeft: 'auto', fontSize: 10, fontFamily: DOSTRA_TYPE.mono, color: t.inkFaint, letterSpacing: 0.5, border: `1px solid ${t.line}`, padding: '1px 5px', borderRadius: 3 }}>v0.4</div>}
      </div>

      {/* nav */}
      <nav style={{ padding: collapsed ? '10px 6px' : '10px 8px', flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {!collapsed && <div style={{ fontSize: 10.5, fontFamily: DOSTRA_TYPE.mono, color: t.inkFaint, textTransform: 'uppercase', letterSpacing: 0.8, padding: '10px 10px 6px' }}>Workspace</div>}
        {items.map(it => {
          const active = current === it.id;
          return (
            <button key={it.id} onClick={() => it.enabled && onNav(it.id)} disabled={!it.enabled}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: collapsed ? '8px 0' : '7px 10px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                background: active ? t.surface2 : 'transparent', border: 'none', borderRadius: 6,
                color: active ? t.ink : it.enabled ? t.inkMuted : t.inkFaint,
                fontFamily: DOSTRA_TYPE.sans, fontSize: 13.5, fontWeight: active ? 500 : 400,
                cursor: it.enabled ? 'pointer' : 'not-allowed', width: '100%', textAlign: 'left',
                position: 'relative',
              }}>
              {active && !collapsed && <div style={{ position: 'absolute', left: 0, top: 6, bottom: 6, width: 2, background: t.accent, borderRadius: 2 }}/>}
              <Icon name={it.id} />
              {!collapsed && <>
                <span style={{ flex: 1 }}>{it.label}</span>
                {it.count != null && <span style={{ fontFamily: DOSTRA_TYPE.mono, fontSize: 11, color: t.inkFaint, fontVariantNumeric: 'tabular-nums' }}>{it.count.toLocaleString()}</span>}
                {it.soon && <span style={{ fontSize: 9.5, fontFamily: DOSTRA_TYPE.mono, color: t.inkFaint, textTransform: 'uppercase', letterSpacing: 0.6, border: `1px solid ${t.line}`, padding: '1px 4px', borderRadius: 3 }}>soon</span>}
              </>}
            </button>
          );
        })}
      </nav>

      {/* footer — user */}
      <div style={{ borderTop: `1px solid ${t.line}`, padding: collapsed ? '10px 6px' : '10px 10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: collapsed ? '2px 0' : '4px 4px', justifyContent: collapsed ? 'center' : 'flex-start' }}>
          <div style={{ width: 28, height: 28, borderRadius: 14, background: t.accentSoft, color: t.accentInk, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, fontFamily: DOSTRA_TYPE.sans, flexShrink: 0 }}>
            {(user.name || 'A').split(' ').map(x => x[0]).slice(0,2).join('')}
          </div>
          {!collapsed && <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 12.5, fontWeight: 500, color: t.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
            <div style={{ fontSize: 10.5, fontFamily: DOSTRA_TYPE.mono, color: t.inkFaint, textTransform: 'uppercase', letterSpacing: 0.8, display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 5, height: 5, borderRadius: 3, background: isAdmin ? t.accent : t.signal }}/>
              {user.role}
            </div>
          </div>}
        </div>
        <button onClick={onToggle} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '5px', background: 'transparent', border: `1px solid ${t.line}`, borderRadius: 5, color: t.inkMuted, cursor: 'pointer', fontSize: 11, fontFamily: DOSTRA_TYPE.sans }}>
          <Icon name={collapsed ? 'chevron' : 'chevronL'} size={13} />
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}

function Topbar({ t, user, title, crumbs, right }) {
  return (
    <header style={{ height: 56, borderBottom: `1px solid ${t.line}`, background: t.surface, display: 'flex', alignItems: 'center', padding: '0 20px', gap: 16, flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
        {crumbs ? crumbs.map((c, i) => (
          <React.Fragment key={i}>
            <span style={{ fontSize: 13, color: i === crumbs.length - 1 ? t.ink : t.inkMuted, fontWeight: i === crumbs.length - 1 ? 500 : 400 }}>{c}</span>
            {i < crumbs.length - 1 && <Icon name="chevron" size={12} color={t.inkFaint} />}
          </React.Fragment>
        )) : <div style={{ fontSize: 14, fontWeight: 500, color: t.ink }}>{title}</div>}
      </div>
      {/* search */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 420, display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: t.surface2, border: `1px solid ${t.line}`, borderRadius: 6, color: t.inkFaint }}>
          <Icon name="search" size={14} />
          <input placeholder="Search leads, clients, payloads…" style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontFamily: DOSTRA_TYPE.sans, fontSize: 13, color: t.ink }} readOnly />
          <kbd style={{ fontSize: 10.5, fontFamily: DOSTRA_TYPE.mono, color: t.inkFaint, border: `1px solid ${t.line}`, padding: '1px 5px', borderRadius: 3, background: t.surface }}>⌘K</kbd>
        </div>
      </div>
      {/* right slot */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {right}
        {/* client chip */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px 4px 6px', border: `1px solid ${t.line}`, borderRadius: 20, fontSize: 11.5, color: t.inkMuted, fontFamily: DOSTRA_TYPE.sans }}>
          <div style={{ width: 6, height: 6, borderRadius: 3, background: t.signal }}/>
          {user.role === 'admin'
            ? <span>All clients · <span style={{ fontFamily: DOSTRA_TYPE.mono, color: t.ink }}>6</span></span>
            : <span>{user.clients?.[0]?.name || 'Acme Plumbing'} <span style={{ fontFamily: DOSTRA_TYPE.mono, color: t.inkFaint, marginLeft: 4 }}>acme_plumbing</span></span>}
        </div>
      </div>
    </header>
  );
}

Object.assign(window, { DostraLogo, Icon, Sidebar, Topbar });
