// Generic, brand-free icons drawn as SVG.

export const Star: React.FC<{ size: number; fill?: string; stroke?: string; strokeWidth?: number }> = ({
  size,
  fill = "#FBBC05",
  stroke = "none",
  strokeWidth = 0,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path
      d="M12 2.5l2.94 5.96 6.58.96-4.76 4.64 1.12 6.55L12 17.52l-5.88 3.09 1.12-6.55L2.48 9.42l6.58-.96z"
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
  </svg>
);

export const Heart: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path
      d="M12 21s-7.5-4.6-9.6-9.4C.9 8.1 3.1 4 6.9 4c2.1 0 3.6 1.1 5.1 3 1.5-1.9 3-3 5.1-3 3.8 0 6 4.1 4.5 7.6C19.5 16.4 12 21 12 21z"
      fill={color}
    />
  </svg>
);

export const NfcWaves: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round">
    <path d="M6 8.5a5 5 0 010 7" />
    <path d="M9.5 6a9 9 0 010 12" />
    <path d="M13 3.5a13 13 0 010 17" />
  </svg>
);

export const NoApp: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round">
    <rect x="4" y="4" width="16" height="16" rx="4.5" />
    <path d="M3 21L21 3" />
  </svg>
);

export const PhoneIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round">
    <rect x="6.5" y="2.5" width="11" height="19" rx="3" />
    <path d="M10.5 18.5h3" />
  </svg>
);

export const LinkIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round">
    <path d="M10 14a4.5 4.5 0 006.4 0l3-3a4.5 4.5 0 00-6.4-6.4l-1.3 1.3" />
    <path d="M14 10a4.5 4.5 0 00-6.4 0l-3 3a4.5 4.5 0 006.4 6.4l1.3-1.3" />
  </svg>
);

export const Check: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);
