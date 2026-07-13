export default function PackSVG({ id, vol, stripe, name, code }: { id: string; vol: string; stripe: string; name: string; code: string }) {
  return (
    <svg className="w-[76%]" viewBox="0 0 420 320" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`top-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#ede9e0" />
        </linearGradient>
        <linearGradient id={`front-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbf8f1" />
          <stop offset="1" stopColor="#ede9e0" />
        </linearGradient>
        <linearGradient id={`side-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#d6cdb8" />
          <stop offset="1" stopColor="#b9ae93" />
        </linearGradient>
        <filter id={`sh-${id}`} x="-15%" y="-15%" width="130%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="10" />
          <feOffset dx="0" dy="20" />
          <feComponentTransfer><feFuncA type="linear" slope="0.18" /></feComponentTransfer>
          <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <g filter={`url(#sh-${id})`}>
        <path d="M 320 105 L 380 75 L 380 235 L 320 265 Z" fill={`url(#side-${id})`} />
        <path d="M 60 105 L 320 105 L 380 75 L 120 75 Z" fill={`url(#top-${id})`} opacity="0.86" />
        <circle cx="345" cy="92" r="6" fill="none" stroke="#9a8c70" strokeWidth="0.6" />
        <text x="345" y="94.5" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="5.5" fill="#9a8c70">{vol.replace(/ /g, '')}</text>
        <path d="M 60 105 L 320 105 L 320 265 L 60 265 Z" fill={`url(#front-${id})`} stroke="#cfc4a8" strokeWidth="0.5" />
        <path d="M 300 105 L 320 105 L 320 265 L 300 265 Z" fill="#000" opacity="0.04" />
        <text x="190" y="148" textAnchor="middle" fontFamily="Playfair Display, serif" fontWeight="700" fontSize="26" fill="#1e1e1e" letterSpacing="4">DALL&apos;O</text>
        <line x1="148" y1="158" x2="232" y2="158" stroke="#9a8c70" strokeWidth="0.5" />
        <text x="190" y="172" textAnchor="middle" fontFamily="Playfair Display, serif" fontStyle="italic" fontSize="11" fill="#2c472f" letterSpacing="2">Skin</text>
        <text x="190" y="188" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="6" letterSpacing="2.5" fill="#7a6a52">CLINICAL COSMETICS · BARCELONA</text>
        <rect x="78" y="230" width="76" height="6" fill={stripe} />
        <text x="78" y="252" fontFamily="Inter, sans-serif" fontWeight="600" fontSize="11" letterSpacing="2.5" fill="#1e1e1e">{name.toUpperCase().slice(0, 22)}</text>
        <text x="78" y="262" fontFamily="Inter, sans-serif" fontSize="6" letterSpacing="1.6" fill="#7a6a52">{code}</text>
        <line x1="320" y1="105" x2="320" y2="265" stroke="#000" strokeOpacity="0.06" strokeWidth="0.5" />
      </g>
    </svg>
  )
}
