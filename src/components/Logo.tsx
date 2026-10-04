import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/data/types";
import { href } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export function Logo({ locale, variant = "color", className = "" }: { locale: Locale; variant?: "color" | "white"; className?: string }) {
  const dict = getDictionary(locale);
  return (
    <Link href={href(locale)} className={`inline-flex items-center gap-3 ${className}`} aria-label={`${dict.meta.siteName} — ${dict.meta.home}`}>
      <Image
        src={variant === "white" ? "/images/brand/logo-white.png" : "/images/brand/logo-color.png"}
        alt={dict.meta.siteName}
        width={1614}
        height={511}
        priority={variant === "color"}
        className="h-10 w-auto sm:h-11"
        sizes="160px"
      />
    </Link>
  );
}
