interface DostraLogoProps {
  className?: string
  size?: number
}

function DostraLogo({ className, size = 22 }: DostraLogoProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 22 22"
      fill="none"
      aria-hidden="true"
    >
      <rect x="1.5" y="1.5" width="19" height="19" rx="3" className="logo-fill" />
      <path
        d="M6 6 L9.5 9.5 L12.5 9.5 L16 6"
        className="logo-cut"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="5.5" y="13" width="11" height="1.4" rx=".7" className="logo-cut soft" />
    </svg>
  )
}

export default DostraLogo
