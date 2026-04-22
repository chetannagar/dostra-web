import type { User, DashboardData, DashboardMetric, Lead } from '../types/types.ts'
import Icon from './Icon.tsx'
import { formatLeadReceived } from '../utils/format.ts'

interface DashboardViewProps {
  activeUser: User
  dashboardData: DashboardData | null
  onLeadOpen: (leadId: number) => void
}

function Sparkline({ colorClass, data }: { colorClass: string; data: number[] }) {
  const width = 92
  const height = 28
  const max = Math.max(...data, 1)
  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * width
      const y = height - (value / max) * (height - 4) - 2
      return `${x},${y}`
    })
    .join(' ')

  const last = data[data.length - 1]
  const cx = width
  const cy = height - (last / max) * (height - 4) - 2

  return (
    <svg width={width} height={height} className="sparkline shrink-0" aria-hidden="true">
      <polyline className={colorClass} fill="none" points={points} />
      <circle className={colorClass} cx={cx} cy={cy} r="2.2" />
    </svg>
  )
}

function MetricCard({ metric }: { metric: DashboardMetric }) {
  return (
    <article className="flex flex-col gap-3 border border-(--line) rounded-lg bg-(--surface) px-4.5 py-4">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[11.5px] text-(--ink-muted) uppercase tracking-[0.8px]">
          {metric.label}
        </p>
        {metric.delta ? (
          <span
            className={`inline-flex items-center gap-0.75 font-mono text-[11px] ${metric.deltaDirection === 'up' ? 'text-(--signal)' : 'text-(--ink-faint)'}`}
          >
            {metric.deltaDirection === 'up' ? <Icon name="arrowUp" size={10} /> : null}
            {metric.delta}
          </span>
        ) : null}
      </div>
      <div className="flex items-center justify-between gap-3">
        <div className="text-[32px] font-medium leading-none tracking-[-0.8px] tabular-nums">
          {metric.value}
          {metric.unit ? <span className="ml-1 text-(--ink-faint) text-sm font-normal">{metric.unit}</span> : null}
        </div>
        <Sparkline
          colorClass={metric.sparkTone === 'signal' ? 'sparkline-signal' : 'sparkline-accent'}
          data={metric.spark}
        />
      </div>
    </article>
  )
}

function DashboardRecentRow({
  activeUser,
  lead,
  onLeadOpen,
}: {
  activeUser: User
  lead: Lead
  onLeadOpen: (leadId: number) => void
}) {
  return (
    <button
      className="grid grid-cols-[60px_1fr_1fr_90px] gap-3 items-center w-full border-0 border-b border-dashed border-(--line) bg-transparent cursor-pointer px-0 py-2 text-left text-(--ink) text-[13px] transition-all duration-180"
      onClick={() => onLeadOpen(lead.id)}
      type="button"
    >
      <span className="font-mono tabular-nums">#{lead.id}</span>
      <span className="text-(--ink)">{lead.name ?? 'Unnamed lead'}</span>
      <span className="text-(--ink-muted) overflow-hidden text-ellipsis whitespace-nowrap">
        {activeUser.role === 'admin' ? lead.clientName : lead.email ?? '—'}
      </span>
      <span className="font-mono tabular-nums text-right">{formatLeadReceived(lead)}</span>
    </button>
  )
}

function DashboardView({ activeUser, dashboardData, onLeadOpen }: DashboardViewProps) {
  if (!dashboardData) {
    return (
      <section className="flex flex-col gap-4.5 px-7 pt-5.5 pb-7 min-h-0">
        <div className="flex flex-col gap-1.5 border border-(--line) rounded-[10px] bg-(--surface) p-6 text-(--ink-muted)">
          <h3 className="text-(--ink) text-lg font-medium">Loading dashboard…</h3>
          <p>Building derived metrics from the visible lead scope.</p>
        </div>
      </section>
    )
  }

  const maxRanked = Math.max(...dashboardData.rankedList.map((item) => item.count), 1)
  const maxHistogram = Math.max(...dashboardData.histogram.map((point) => point.count), 1)

  return (
    <section className="flex flex-col gap-4.5 px-7 pt-5.5 pb-7 min-h-0">
      <div className="flex items-end justify-between gap-5">
        <div>
          <h1 className="text-[22px] font-medium tracking-[-0.5px]">
            Good afternoon, {activeUser.name.split(' ')[0]}
          </h1>
          <p className="text-(--ink-muted) text-sm mt-1">
            <span className="font-mono tabular-nums">{dashboardData.timestampLabel}</span> · {dashboardData.greeting}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded border border-(--line) px-1.75 py-0.75 text-[10.5px] uppercase tracking-[0.8px] ${activeUser.role === 'admin' ? 'bg-(--surface-2) text-(--ink-muted)' : 'bg-(--signal-bg) text-(--signal)'}`}
          >
            {activeUser.role === 'admin' ? 'Admin · all clients' : 'Client · 1 client'}
          </span>
          <button
            className="inline-flex items-center justify-center gap-1.5 rounded-md border border-(--line) bg-(--surface) text-(--ink-muted) cursor-pointer px-2.75 py-2 text-[12.5px] transition-all duration-180 ease-in-out"
            type="button"
          >
            <Icon name="clock" size={13} />
            Last 14 days
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3.5 max-[1200px]:grid-cols-1">
        {dashboardData.metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </div>

      <div className="grid grid-cols-[1.8fr_1fr] gap-3.5 min-h-0 max-[1200px]:grid-cols-1">
        <section className="border border-(--line) rounded-lg bg-(--surface) p-4.5">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-[13.5px] font-medium text-(--ink)">Leads by day</h3>
              <p className="mt-0.5 text-[11.5px] text-(--ink-faint)">
                14d{' '}
                <span className="inline-flex items-center gap-1 rounded border border-(--line) px-1.75 py-0.75 font-mono text-[10.5px] uppercase tracking-[0.8px] text-(--ink-faint)">
                  derived
                </span>
              </p>
            </div>
            <div className="flex items-center gap-3 text-(--ink-muted) text-[11.5px]">
              <span>
                <i className="inline-block w-1.75 h-1.75 rounded-xs mr-1.25 bg-(--accent)" />
                All leads
              </span>
              <span>
                <i className="inline-block w-1.75 h-1.75 rounded-xs mr-1.25 bg-(--signal)" />
                New (24h)
              </span>
            </div>
          </div>

          <div className="flex items-end gap-1.5 h-42.5 pt-2">
            {dashboardData.histogram.map((point, index) => {
              const isToday = index === dashboardData.histogram.length - 1
              const isYesterday = index === dashboardData.histogram.length - 2
              return (
                <div key={point.label} className="min-w-0 flex-1 flex flex-col items-center gap-1.5">
                  <span className="font-mono tabular-nums text-(--ink-faint) text-[10px]">{point.count}</span>
                  <div className="w-full h-32.5 flex items-end">
                    <div
                      className={`w-full rounded-[3px_3px_1px_1px] border ${
                        isToday
                          ? 'border-(--signal) bg-(--signal)'
                          : isYesterday
                            ? 'border-(--accent) bg-(--accent)'
                            : 'border-(--accent-soft) bg-(--accent-soft)'
                      }`}
                      style={{ height: `${(point.count / maxHistogram) * 100}%` }}
                    />
                  </div>
                  <span className="font-mono tabular-nums text-(--ink-faint) text-[10px]">
                    {point.label.split(' ')[0]}
                  </span>
                </div>
              )
            })}
          </div>
        </section>

        <section className="border border-(--line) rounded-lg bg-(--surface) p-4.5">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-[13.5px] font-medium text-(--ink)">Quick status</h3>
              <p className="mt-0.5 text-[11.5px] text-(--ink-faint)">session</p>
            </div>
          </div>
          <div className="flex flex-col">
            {dashboardData.quickStatus.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between gap-3 py-1.75 border-b border-dashed border-(--line) text-[13px]"
              >
                <span>{item.label}</span>
                <span className="inline-flex items-center gap-2">
                  <span className="font-mono tabular-nums">{item.value}</span>
                  <i
                    className={`w-1.5 h-1.5 rounded-full ${item.tone === 'signal' ? 'bg-(--signal)' : item.tone === 'warn' ? 'bg-(--warn)' : 'bg-(--ink-faint)'}`}
                  />
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="grid grid-cols-[1fr_1.8fr] gap-3.5 min-h-0 max-[1200px]:grid-cols-1">
        <section className="border border-(--line) rounded-lg bg-(--surface) p-4.5">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-[13.5px] font-medium text-(--ink)">
                {activeUser.role === 'admin' ? 'Top clients' : 'Lead sources'}
              </h3>
              <p className="mt-0.5 text-[11.5px] text-(--ink-faint)">
                {activeUser.role === 'admin' ? 'by volume' : '30d'}
              </p>
            </div>
          </div>

          <div className="flex flex-col">
            {dashboardData.rankedList.map((item, index) => (
              <div key={item.key} className="flex items-center gap-2.5 py-1.25">
                <span className="w-4 font-mono tabular-nums text-(--ink-faint) text-[10.5px]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2 text-[13px]">
                    <span>{item.label}</span>
                    <span className="font-mono tabular-nums">{item.count}</span>
                  </div>
                  <div className="h-0.75 overflow-hidden rounded-xs bg-(--surface-2) mt-1.25">
                    <div
                      className={`h-full rounded-xs ${item.active === false ? 'bg-(--ink-faint)' : 'bg-(--accent)'}`}
                      style={{ width: `${(item.count / maxRanked) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="border border-(--line) rounded-lg bg-(--surface) p-4.5">
          <div className="flex items-center justify-between gap-4 mb-3">
            <div>
              <h3 className="text-[13.5px] font-medium text-(--ink)">Recent leads</h3>
            </div>
            <button
              className="border-0 bg-transparent text-(--accent) cursor-pointer p-0 text-[11.5px] font-mono"
              onClick={() => onLeadOpen(dashboardData.recentLeads[0]?.id ?? 0)}
              type="button"
            >
              View all →
            </button>
          </div>

          <div className="grid grid-cols-[60px_1fr_1fr_90px] gap-3 items-center border-b border-(--line) pb-1.5 text-(--ink-faint) font-mono text-[10.5px] uppercase tracking-[0.8px]">
            <span>ID</span>
            <span>Lead</span>
            <span>{activeUser.role === 'admin' ? 'Client' : 'Email'}</span>
            <span className="text-right">Received</span>
          </div>

          <div className="flex flex-col">
            {dashboardData.recentLeads.map((lead) => (
              <DashboardRecentRow
                key={lead.id}
                activeUser={activeUser}
                lead={lead}
                onLeadOpen={onLeadOpen}
              />
            ))}
          </div>
        </section>
      </div>
    </section>
  )
}

export default DashboardView
