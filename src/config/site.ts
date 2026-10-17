/**
 * Site-wide configuration.
 *
 * Contact details are NOT in the company profile yet (it shows "[أدخل رقم الهاتف]" etc.),
 * so they are read from environment variables. Leave them empty and the site will hide
 * the related buttons and show a clearly labelled "to be confirmed" placeholder instead.
 * See `.env.example`.
 */

const clean = (v: string | undefined) => (v && v.trim() ? v.trim() : null);

export const siteConfig = {
  url: (clean(process.env.NEXT_PUBLIC_SITE_URL) ?? "http://localhost:3000").replace(/\/$/, ""),
  /** International format, digits only, e.g. 2499XXXXXXXX. Enables WhatsApp buttons. */
  whatsapp: clean(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER)?.replace(/\D/g, "") || null,
  /** Display phone number, e.g. +249 9X XXX XXXX. Enables tel: links. */
  phone: clean(process.env.NEXT_PUBLIC_PHONE),
  email: clean(process.env.NEXT_PUBLIC_EMAIL),
  /** From the company profile. */
  facebook: "https://www.facebook.com/share/1ELgHkRDLZ",
  facebookLabel: "facebook.com/share/1ELgHkRDLZ",
} as const;

export function whatsappLink(message: string): string | null {
  if (!siteConfig.whatsapp) return null;
  return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function telLink(): string | null {
  return siteConfig.phone ? `tel:${siteConfig.phone.replace(/[^\d+]/g, "")}` : null;
}
