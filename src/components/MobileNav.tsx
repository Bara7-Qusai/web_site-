"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Icon } from "./Icon";
import { NavLinks, type NavItem } from "./NavLinks";

export function MobileNav({ items, menuLabel, closeLabel, children }: { items: NavItem[]; menuLabel: string; closeLabel: string; children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close when the route changes.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? closeLabel : menuLabel}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex size-11 items-center justify-center rounded-full border border-sand-300 text-forest-800"
      >
        <Icon name={open ? "close" : "menu"} className="size-5" />
      </button>
      {open && (
        <div id="mobile-menu" className="fixed inset-x-0 top-[4.5rem] bottom-0 z-40 overflow-y-auto border-t border-sand-200 bg-sand-50 px-4 pb-10 pt-4 animate-rise">
          <NavLinks
            items={items}
            onNavigate={() => setOpen(false)}
            className="flex flex-col divide-y divide-sand-200"
            itemClassName="block py-4 text-lg font-semibold"
          />
          <div className="mt-6 flex flex-col gap-3">{children}</div>
        </div>
      )}
    </div>
  );
}
