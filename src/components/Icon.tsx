import type { SVGProps } from "react";

/** Lightweight inline icon set (stroke icons, 24×24). */
const paths: Record<string, React.ReactNode> = {
  sprout: (
    <>
      <path d="M12 21v-9" />
      <path d="M12 12c0-4 3-7 8-7 0 5-3 7-8 7Z" />
      <path d="M12 14c0-3.5-2.5-6-7-6 0 4.5 2.5 6 7 6Z" />
    </>
  ),
  root: (
    <>
      <path d="M12 3v8" />
      <path d="M8 6c0 2 2 3 4 3s4-1 4-3" />
      <path d="M12 11c-3 1-5 4-5 9" />
      <path d="M12 11c3 1 5 4 5 9" />
      <path d="M12 11v10" />
    </>
  ),
  flower: (
    <>
      <circle cx="12" cy="9" r="2.5" />
      <path d="M12 6.5c0-2 1-3.5 0-4.5-1 1 0 2.5 0 4.5ZM14.4 8.2c1.8-.9 3.6-.6 3.8-2-1.4-.4-2.4 1.1-3.8 2ZM9.6 8.2c-1.8-.9-3.6-.6-3.8-2 1.4-.4 2.4 1.1 3.8 2Z" />
      <path d="M12 11.5V21" />
      <path d="M12 17c-2.5 0-4-1.5-4.5-3.5 2.5 0 4 1.5 4.5 3.5ZM12 15.5c2.5 0 4-1.5 4.5-3.5-2.5 0-4 1.5-4.5 3.5Z" />
    </>
  ),
  thermometer: (
    <>
      <path d="M14 14.8V5a2 2 0 1 0-4 0v9.8a4 4 0 1 0 4 0Z" />
      <path d="M12 9v7" />
    </>
  ),
  fruit: (
    <>
      <path d="M12 7c-4-2-8 0-8 5s3.5 9 6 9c1 0 1.5-.5 2-.5s1 .5 2 .5c2.5 0 6-4 6-9s-4-7-8-5Z" />
      <path d="M12 7c0-2 1-4 3-4" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  atom: (
    <>
      <circle cx="12" cy="12" r="1.5" />
      <ellipse cx="12" cy="12" rx="9" ry="3.8" />
      <ellipse cx="12" cy="12" rx="9" ry="3.8" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="9" ry="3.8" transform="rotate(120 12 12)" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.2 7.5 9.5 4.3-1.3 7.5-4.9 7.5-9.5V6L12 3Z" />
      <path d="m8.8 12 2.2 2.2 4.2-4.4" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 13 9 5 9-5" />
      <path d="m3 17.5 9 5 9-5" />
    </>
  ),
  bug: (
    <>
      <rect x="8" y="7" width="8" height="13" rx="4" />
      <path d="M12 7V4M9 4.5 10.5 7M15 4.5 13.5 7M8 11H4M16 11h4M8 16H5M16 16h3" />
    </>
  ),
  grass: (
    <>
      <path d="M3 21c2-4 3-9 2-14 2 3 3 8 3 14" />
      <path d="M10 21c0-5 1-10 4-14-1 5-1 9 0 14" />
      <path d="M16 21c1-4 3-7 5-9-1 3-1.5 6-1.5 9" />
    </>
  ),
  scissors: (
    <>
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M20 4 8.1 15.9M14.5 14.5 20 20M8.1 8.1 12 12" />
    </>
  ),
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />,
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 1 1 14 0C19 14.8 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
  facebook: <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v7h4v-7h3l1-4h-4V8.5a.5.5 0 0 1 .5-.5Z" />,
  whatsapp: (
    <>
      <path d="M3.5 20.5 5 16a8.5 8.5 0 1 1 3 3l-4.5 1.5Z" />
      <path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.6-2-1-1 .8a4.5 4.5 0 0 1-2.2-2.2l.8-1-1-2L9.5 8Z" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </>
  ),
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  download: (
    <>
      <path d="M12 4v11M7 10l5 5 5-5" />
      <path d="M5 20h14" />
    </>
  ),
  compare: (
    <>
      <rect x="3" y="4" width="7" height="16" rx="1.5" />
      <rect x="14" y="4" width="7" height="16" rx="1.5" />
    </>
  ),
  leaf: (
    <>
      <path d="M5 19C5 10 10 5 20 4c-1 10-6 15-15 15Z" />
      <path d="M5 19 13 11" />
    </>
  ),
  droplet: <path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z" />,
  package: (
    <>
      <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
      <path d="m4 7.5 8 4.5 8-4.5M12 12v9" />
    </>
  ),
  alert: (
    <>
      <path d="M12 3 2 20h20L12 3Z" />
      <path d="M12 10v4M12 17h.01" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1-4 4.5-6 8-6s7 2 8 6" />
    </>
  ),
  star: <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.5 2.9 1-6.1L3.2 9.5l6.1-.9L12 3Z" />,
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6M12 7.5h.01" />
    </>
  ),
  handshake: (
    <>
      <path d="m11 17 2 2a1.5 1.5 0 0 0 2-2" />
      <path d="m14 14 2.5 2.5a1.5 1.5 0 0 0 2-2L15 11l-2 1a2 2 0 0 1-2.5-3L13 6.5 21 8v7" />
      <path d="M3 8l5-1.5L10 8M3 8v7l6 5a1.5 1.5 0 0 0 2-2" />
    </>
  ),
};

export type IconName = keyof typeof paths;

export function Icon({ name, className = "size-5", ...rest }: { name: string } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
      {...rest}
    >
      {paths[name] ?? paths.leaf}
    </svg>
  );
}
