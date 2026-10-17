import nodemailer from "nodemailer";
import { productBySlug } from "@/data/products";
import type { Inquiry } from "./inquiry";

/**
 * Server-side delivery of website inquiries. Configure ONE (or both) of:
 *  - SMTP:    SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, INQUIRY_TO_EMAIL, INQUIRY_FROM_EMAIL
 *  - Webhook: INQUIRY_WEBHOOK_URL (receives JSON; e.g. Zapier/Make/Google Apps Script/Slack-compatible)
 * Secrets are only read here, on the server, and never sent to the browser.
 */

export class NotConfiguredError extends Error {}

const env = (k: string) => process.env[k]?.trim() || undefined;

export function deliveryChannels() {
  return {
    smtp: !!(env("SMTP_HOST") && env("INQUIRY_TO_EMAIL")),
    webhook: !!env("INQUIRY_WEBHOOK_URL"),
  };
}

const TYPE_LABELS: Record<Inquiry["type"], string> = {
  product: "Product inquiry / استفسار عن منتج",
  distributor: "Distributor request / طلب توزيع",
  wholesale: "Wholesale order / طلب جملة",
  technical: "Technical question / استفسار فني",
  general: "General inquiry / استفسار عام",
};

function summarize(i: Inquiry) {
  const product = i.product ? productBySlug.get(i.product) : undefined;
  const productLabel = product ? `#${product.number} ${product.name.en} — ${product.name.ar}` : i.product || "—";
  const lines = [
    `Type: ${TYPE_LABELS[i.type]}`,
    `Name: ${i.name}`,
    `Phone: ${i.phone || "—"}`,
    `Email: ${i.email || "—"}`,
    `Company/Farm: ${i.company || "—"}`,
    `Location: ${i.location || "—"}`,
    `Product: ${productLabel}`,
    `Site language: ${i.locale}`,
    "",
    i.message,
  ];
  return { productLabel, text: lines.join("\n") };
}

export async function deliverInquiry(inquiry: Inquiry): Promise<"smtp" | "webhook" | "both" | "logged"> {
  const channels = deliveryChannels();
  const { text, productLabel } = summarize(inquiry);
  const subject = `[Al-Kunooz website] ${TYPE_LABELS[inquiry.type]} — ${inquiry.name}`;
  const done: string[] = [];

  if (channels.smtp) {
    const transporter = nodemailer.createTransport({
      host: env("SMTP_HOST"),
      port: Number(env("SMTP_PORT") ?? 587),
      secure: Number(env("SMTP_PORT") ?? 587) === 465,
      auth: env("SMTP_USER") ? { user: env("SMTP_USER")!, pass: env("SMTP_PASSWORD") ?? "" } : undefined,
    });
    await transporter.sendMail({
      from: env("INQUIRY_FROM_EMAIL") ?? env("SMTP_USER") ?? env("INQUIRY_TO_EMAIL"),
      to: env("INQUIRY_TO_EMAIL"),
      replyTo: inquiry.email || undefined,
      subject,
      text,
    });
    done.push("smtp");
  }

  if (channels.webhook) {
    const res = await fetch(env("INQUIRY_WEBHOOK_URL")!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, text, ...inquiry, productLabel, receivedAt: new Date().toISOString() }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
    done.push("webhook");
  }

  if (done.length === 2) return "both";
  if (done.length === 1) return done[0] as "smtp" | "webhook";

  if (process.env.NODE_ENV !== "production") {
    console.info(`\n[inquiry] No delivery channel configured — logging instead (development only)\n${subject}\n${text}\n`);
    return "logged";
  }
  throw new NotConfiguredError("No inquiry delivery channel configured");
}
