import React from 'react';

/**
 * TurfGate SVG Logo Component
 * Transparent background — works on any theme (light or dark).
 * @param {number} size - Height in pixels (width scales proportionally)
 * @param {string} className - Extra Tailwind classes
 */
const TurfGateLogo = ({ size = 36, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="TurfGate Logo"
  >
    <defs>
      {/* Brand gradient: emerald → cyan */}
      <linearGradient id="tg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#06b6d4" />
      </linearGradient>

      {/* Glow filter */}
      <filter id="tg-glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="1.5" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* Grass gradient */}
      <linearGradient id="tg-grass" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#10b981" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#065f46" stopOpacity="0.7" />
      </linearGradient>

      {/* Ball gradient */}
      <radialGradient id="tg-ball" cx="40%" cy="35%" r="60%">
        <stop offset="0%" stopColor="#f87171" />
        <stop offset="100%" stopColor="#991b1b" />
      </radialGradient>
    </defs>

    {/* === STADIUM GATE / ARCH (background) === */}
    {/* Left pillar */}
    <rect x="6" y="18" width="5" height="28" rx="2" fill="url(#tg-grad)" opacity="0.7" filter="url(#tg-glow)" />
    {/* Right pillar */}
    <rect x="53" y="18" width="5" height="28" rx="2" fill="url(#tg-grad)" opacity="0.7" filter="url(#tg-glow)" />
    {/* Arch top */}
    <path
      d="M11 18 Q32 4 53 18"
      stroke="url(#tg-grad)"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
      opacity="0.85"
      filter="url(#tg-glow)"
    />
    {/* Arch inner subtle glow line */}
    <path
      d="M13 20 Q32 8 51 20"
      stroke="url(#tg-grad)"
      strokeWidth="1"
      strokeLinecap="round"
      fill="none"
      opacity="0.35"
    />

    {/* === GRASS STRIP === */}
    <rect x="4" y="46" width="56" height="8" rx="4" fill="url(#tg-grass)" />
    {/* Grass blades highlights */}
    <rect x="10" y="43" width="2" height="5" rx="1" fill="#10b981" opacity="0.8" />
    <rect x="18" y="44" width="2" height="4" rx="1" fill="#10b981" opacity="0.6" />
    <rect x="30" y="43" width="2" height="5" rx="1" fill="#10b981" opacity="0.8" />
    <rect x="42" y="44" width="2" height="4" rx="1" fill="#10b981" opacity="0.6" />
    <rect x="52" y="43" width="2" height="5" rx="1" fill="#10b981" opacity="0.8" />

    {/* === CRICKET BAT === */}
    {/* Bat blade */}
    <rect
      x="26" y="26" width="8" height="20" rx="3"
      fill="url(#tg-grad)"
      filter="url(#tg-glow)"
    />
    {/* Bat handle */}
    <rect x="28.5" y="18" width="3" height="10" rx="1.5" fill="#06b6d4" opacity="0.9" />
    {/* Handle grip wrap */}
    <rect x="28.5" y="19" width="3" height="1.5" rx="0.5" fill="#0e7490" opacity="0.7" />
    <rect x="28.5" y="21.5" width="3" height="1.5" rx="0.5" fill="#0e7490" opacity="0.7" />
    <rect x="28.5" y="24" width="3" height="1.5" rx="0.5" fill="#0e7490" opacity="0.7" />

    {/* === CRICKET BALL === */}
    <circle cx="44" cy="39" r="6" fill="url(#tg-ball)" filter="url(#tg-glow)" />
    {/* Ball seam */}
    <path
      d="M40 37 Q44 33 48 37"
      stroke="white"
      strokeWidth="0.8"
      fill="none"
      opacity="0.7"
      strokeLinecap="round"
    />
    <path
      d="M40 41 Q44 45 48 41"
      stroke="white"
      strokeWidth="0.8"
      fill="none"
      opacity="0.7"
      strokeLinecap="round"
    />

    {/* === TG subtle monogram in arch === */}
    <text
      x="32"
      y="22"
      textAnchor="middle"
      fontSize="6"
      fontWeight="900"
      fontFamily="system-ui, sans-serif"
      fill="url(#tg-grad)"
      opacity="0.5"
      letterSpacing="0.5"
    >
      TG
    </text>
  </svg>
);

export default TurfGateLogo;
