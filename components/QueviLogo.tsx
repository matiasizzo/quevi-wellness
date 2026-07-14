export default function QueviLogo({
  variant = 'dark',
  className,
  width = 190,
  height = 66,
}: {
  variant?: 'dark' | 'light'
  className?: string
  width?: number
  height?: number
}) {
  const primary = variant === 'dark' ? '#2b4430' : '#e8e3d6'
  const sub = variant === 'dark' ? '#2b4430' : '#c8c2b0'

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 240 76"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="QUEVI Wellness Clinic"
      role="img"
    >
      {/* QUEVI — Cormorant/Garamond-style serif, medium weight */}
      <text
        x="120"
        y="46"
        fontFamily="var(--font-cormorant), 'Cormorant Garamond', 'Playfair Display', Georgia, serif"
        fontSize="52"
        fontWeight="600"
        textAnchor="middle"
        fill={primary}
        letterSpacing="4"
      >
        QUEVI
      </text>

      {/* Wellness Clinic — light weight, tracked */}
      <text
        x="120"
        y="72"
        fontFamily="var(--font-cormorant), 'Cormorant Garamond', 'Playfair Display', Georgia, serif"
        fontSize="12"
        fontWeight="400"
        textAnchor="middle"
        fill={sub}
        letterSpacing="5"
        opacity="0.8"
      >
        Wellness Clinic •
      </text>
    </svg>
  )
}
