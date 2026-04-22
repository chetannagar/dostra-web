interface IconProps {
  className?: string
  color?: string
  name:
    | 'dashboard'
    | 'leads'
    | 'clients'
    | 'users'
    | 'search'
    | 'chevron'
    | 'chevronL'
    | 'chevronD'
    | 'arrowUp'
    | 'arrowDn'
    | 'logout'
    | 'copy'
    | 'external'
    | 'back'
    | 'filter'
    | 'plus'
    | 'sidebar'
    | 'sun'
    | 'moon'
    | 'check'
    | 'clock'
    | 'sparkle'
  size?: number
  stroke?: number
}

function Icon({ className, color = 'currentColor', name, size = 16, stroke = 1.5 }: IconProps) {
  const commonProps = {
    className,
    fill: 'none',
    height: size,
    stroke,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    width: size,
    viewBox: '0 0 20 20',
  }

  switch (name) {
    case 'dashboard':
      return (
        <svg {...commonProps} stroke={color}>
          <rect x="3" y="3" width="6" height="7" rx="1" />
          <rect x="11" y="3" width="6" height="4" rx="1" />
          <rect x="3" y="12" width="6" height="5" rx="1" />
          <rect x="11" y="9" width="6" height="8" rx="1" />
        </svg>
      )
    case 'leads':
      return (
        <svg {...commonProps} stroke={color}>
          <path d="M3 6l7 5 7-5" />
          <rect x="3" y="4" width="14" height="12" rx="1.5" />
        </svg>
      )
    case 'clients':
      return (
        <svg {...commonProps} stroke={color}>
          <circle cx="7" cy="8" r="3" />
          <path d="M2 17c0-2.8 2.2-5 5-5s5 2.2 5 5" />
          <circle cx="14" cy="7" r="2.2" />
          <path d="M12 14c.6-1.2 2-2 3.5-2 2 0 3.5 1.3 3.5 3" />
        </svg>
      )
    case 'users':
      return (
        <svg {...commonProps} stroke={color}>
          <circle cx="10" cy="7" r="3" />
          <path d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6" />
        </svg>
      )
    case 'search':
      return (
        <svg {...commonProps} stroke={color}>
          <circle cx="9" cy="9" r="5" />
          <path d="M13 13l4 4" />
        </svg>
      )
    case 'chevron':
      return (
        <svg {...commonProps} stroke={color}>
          <path d="M7 5l5 5-5 5" />
        </svg>
      )
    case 'chevronL':
      return (
        <svg {...commonProps} stroke={color}>
          <path d="M13 5l-5 5 5 5" />
        </svg>
      )
    case 'chevronD':
      return (
        <svg {...commonProps} stroke={color}>
          <path d="M5 7l5 5 5-5" />
        </svg>
      )
    case 'arrowUp':
      return (
        <svg {...commonProps} stroke={color}>
          <path d="M10 15V5M5 10l5-5 5 5" />
        </svg>
      )
    case 'arrowDn':
      return (
        <svg {...commonProps} stroke={color}>
          <path d="M10 5v10M5 10l5 5 5-5" />
        </svg>
      )
    case 'logout':
      return (
        <svg {...commonProps} stroke={color}>
          <path d="M12 15l-3 3H3V2h6l3 3" />
          <path d="M8 10h10M14 6l4 4-4 4" />
        </svg>
      )
    case 'copy':
      return (
        <svg {...commonProps} stroke={color}>
          <rect x="6" y="6" width="11" height="11" rx="1.5" />
          <path d="M4 13V4a1 1 0 011-1h9" />
        </svg>
      )
    case 'external':
      return (
        <svg {...commonProps} stroke={color}>
          <path d="M11 3h6v6M17 3l-8 8M9 5H4a1 1 0 00-1 1v10a1 1 0 001 1h10a1 1 0 001-1v-5" />
        </svg>
      )
    case 'back':
      return (
        <svg {...commonProps} stroke={color}>
          <path d="M8 4l-5 6 5 6M3 10h14" />
        </svg>
      )
    case 'filter':
      return (
        <svg {...commonProps} stroke={color}>
          <path d="M3 5h14M5 10h10M8 15h4" />
        </svg>
      )
    case 'plus':
      return (
        <svg {...commonProps} stroke={color}>
          <path d="M10 4v12M4 10h12" />
        </svg>
      )
    case 'sidebar':
      return (
        <svg {...commonProps} stroke={color}>
          <rect x="3" y="4" width="14" height="12" rx="1.5" />
          <path d="M8 4v12" />
        </svg>
      )
    case 'sun':
      return (
        <svg {...commonProps} stroke={color}>
          <circle cx="10" cy="10" r="3.5" />
          <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.5 4.5l1.4 1.4M14.1 14.1l1.4 1.4M4.5 15.5l1.4-1.4M14.1 5.9l1.4-1.4" />
        </svg>
      )
    case 'moon':
      return (
        <svg {...commonProps} stroke={color}>
          <path d="M16 11.5A6.5 6.5 0 019.5 4a6 6 0 00-.5 11.8 6 6 0 007-4.3z" />
        </svg>
      )
    case 'check':
      return (
        <svg {...commonProps} stroke={color}>
          <path d="M4 10l4 4 8-9" />
        </svg>
      )
    case 'clock':
      return (
        <svg {...commonProps} stroke={color}>
          <circle cx="10" cy="10" r="7" />
          <path d="M10 6v4l3 2" />
        </svg>
      )
    case 'sparkle':
      return (
        <svg {...commonProps} stroke={color}>
          <path d="M10 3v4M10 13v4M3 10h4M13 10h4" />
        </svg>
      )
    default:
      return null
  }
}

export default Icon
