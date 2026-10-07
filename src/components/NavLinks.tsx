"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export interface NavItem {
  href: string;
  label: string;
}

export function NavLinks({ items, className = "", itemClassName = "", onNavigate }: { items: NavItem[]; className?: string; itemClassName?: string; onNavigate?: () => void }) {
  // Static exports use trailing slashes ("/ar/products/").
  const pathname = usePathname().replace(/(.)\/$/, "$1");
  return (
    <ul className={className}>
      {items.map((item) => {
        const isHome = item.href.split("/").length === 2;
        const active = isHome ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              onClick={onNavigate}
              className={`${itemClassName} ${active ? "text-forest-800 after:scale-x-100" : "text-ink-700 hover:text-forest-800"}`}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
