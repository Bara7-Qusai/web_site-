import { z } from "zod";

export const INQUIRY_TYPES = ["product", "distributor", "wholesale", "technical", "general"] as const;
export type InquiryType = (typeof INQUIRY_TYPES)[number];

/** Error codes map to localized messages in the dictionary (`form.errors`). */
export type InquiryErrorCode = "name" | "contact" | "phone" | "email" | "message" | "type" | "tooLong";

const phoneRe = /^\+?[\d\s\-()]{7,20}$/;
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const inquirySchema = z
  .object({
    type: z.enum(INQUIRY_TYPES, { message: "type" }),
    name: z.string().trim().min(2, "name").max(120, "tooLong"),
    phone: z
      .string()
      .trim()
      .max(30, "tooLong")
      .refine((v) => v === "" || phoneRe.test(v), "phone"),
    email: z
      .string()
      .trim()
      .max(160, "tooLong")
      .refine((v) => v === "" || emailRe.test(v), "email"),
    company: z.string().trim().max(160, "tooLong").default(""),
    location: z.string().trim().max(120, "tooLong").default(""),
    product: z.string().trim().max(120, "tooLong").default(""),
    message: z.string().trim().min(10, "message").max(4000, "tooLong"),
    locale: z.enum(["ar", "en"]).default("ar"),
    /** Honeypot – must stay empty. */
    website: z.string().max(0).optional().default(""),
  })
  .refine((d) => d.phone !== "" || d.email !== "", { message: "contact", path: ["phone"] });

export type InquiryInput = z.input<typeof inquirySchema>;
export type Inquiry = z.output<typeof inquirySchema>;

/** Flatten zod issues into `{ field: errorCode }`. */
export function fieldErrors(error: z.ZodError): Record<string, InquiryErrorCode> {
  const out: Record<string, InquiryErrorCode> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message as InquiryErrorCode;
  }
  return out;
}
