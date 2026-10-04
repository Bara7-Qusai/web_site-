"use client";

import { useEffect, useId, useRef, useState } from "react";
import { siteConfig } from "@/config/site";
import type { Locale } from "@/data/types";
import { getDictionary } from "@/i18n/dictionaries";
import { fieldErrors, INQUIRY_TYPES, inquirySchema, type InquiryErrorCode, type InquiryType } from "@/lib/inquiry";
import { Icon } from "./Icon";

type Status = "idle" | "sending" | "success" | "error" | "not_configured" | "rate_limited";

export function InquiryForm({ locale, products }: { locale: Locale; products: { slug: string; name: string }[] }) {
  const dict = getDictionary(locale).form;
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [type, setType] = useState<InquiryType>("product");
  const [product, setProduct] = useState("");
  const [errors, setErrors] = useState<Record<string, InquiryErrorCode>>({});
  const [status, setStatus] = useState<Status>("idle");

  // Pre-fill from links such as /contact?product=cal-mag&type=product
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const t = sp.get("type");
    const p = sp.get("product");
    if (t && (INQUIRY_TYPES as readonly string[]).includes(t)) setType(t as InquiryType);
    if (p && products.some((x) => x.slug === p)) setProduct(p);
  }, [products]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const raw = Object.fromEntries(Array.from(fd.entries()).map(([k, v]) => [k, String(v)]));
    const parsed = inquirySchema.safeParse({ ...raw, locale });
    if (!parsed.success) {
      const errs = fieldErrors(parsed.error);
      setErrors(errs);
      setStatus("idle");
      const first = Object.keys(errs)[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setErrors({});
    setStatus("sending");
    try {
      // Static hosting has no /api route: set NEXT_PUBLIC_INQUIRY_ENDPOINT (e.g. Formspree) instead.
      const res = await fetch(process.env.NEXT_PUBLIC_INQUIRY_ENDPOINT || "/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const body = (await res.json().catch(() => ({}))) as { errors?: Record<string, InquiryErrorCode>; error?: string };
      if (res.ok) {
        setStatus("success");
        formRef.current?.reset();
        setProduct("");
      } else if (res.status === 400 && body.errors) {
        setErrors(body.errors);
        setStatus("idle");
      } else if ([404, 405, 501, 503].includes(res.status)) setStatus("not_configured");
      else if (res.status === 429) setStatus("rate_limited");
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  const err = (name: string) => (errors[name] ? dict.errors[errors[name]] : null);
  const fieldProps = (name: string) => ({
    id: `${uid}-${name}`,
    name,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${uid}-${name}-err` : undefined,
    className: "field mt-1.5",
  });
  const label = (name: string, text: string, required = false) => (
    <label htmlFor={`${uid}-${name}`} className="text-sm font-semibold text-ink-900">
      {text}
      {required && (
        <span className="text-soil-500" aria-hidden="true">
          {" "}*
        </span>
      )}
    </label>
  );
  const errorFor = (name: string) =>
    err(name) ? (
      <p id={`${uid}-${name}-err`} className="mt-1.5 text-sm text-red-700">
        {err(name)}
      </p>
    ) : null;

  if (status === "success") {
    return (
      <div role="status" className="card flex flex-col items-center gap-4 p-10 text-center">
        <span className="inline-flex size-16 items-center justify-center rounded-full bg-leaf-500 text-white">
          <Icon name="check" className="size-8" strokeWidth={2.5} />
        </span>
        <p className="max-w-md text-lg font-semibold text-forest-900">{dict.success}</p>
        <button type="button" className="btn btn-outline btn-sm" onClick={() => setStatus("idle")}>
          {dict.title}
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="card p-6 sm:p-8" aria-labelledby={`${uid}-title`}>
      <h2 id={`${uid}-title`} className="text-2xl font-bold text-forest-900">
        {dict.title}
      </h2>

      <fieldset className="mt-6">
        <legend className="text-sm font-semibold text-ink-900">{dict.type}</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {INQUIRY_TYPES.map((t) => (
            <label key={t} className={`cursor-pointer rounded-full px-3.5 py-2 text-sm font-medium ring-1 transition has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-leaf-500 ${type === t ? "bg-forest-800 text-white ring-forest-800" : "bg-white text-ink-700 ring-sand-300 hover:ring-leaf-500"}`}>
              <input type="radio" name="type" value={t} checked={type === t} onChange={() => setType(t)} className="sr-only" />
              {dict.types[t]}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          {label("name", dict.name, true)}
          <input {...fieldProps("name")} type="text" autoComplete="name" required maxLength={120} />
          {errorFor("name")}
        </div>
        <div>
          {label("phone", dict.phone)}
          <input {...fieldProps("phone")} type="tel" autoComplete="tel" inputMode="tel" dir="ltr" maxLength={30} />
          {errorFor("phone")}
        </div>
        <div>
          {label("email", dict.email)}
          <input {...fieldProps("email")} type="email" autoComplete="email" dir="ltr" maxLength={160} />
          {errorFor("email")}
        </div>
        <p className="-mt-2 text-xs text-ink-500 sm:col-span-2">{dict.contactHint}</p>
        <div>
          {label("company", dict.company)}
          <input {...fieldProps("company")} type="text" autoComplete="organization" maxLength={160} />
        </div>
        <div>
          {label("location", dict.location)}
          <input {...fieldProps("location")} type="text" autoComplete="address-level2" maxLength={120} />
        </div>
        <div className="sm:col-span-2">
          {label("product", dict.product)}
          <select {...fieldProps("product")} value={product} onChange={(e) => setProduct(e.target.value)}>
            <option value="">{dict.productNone}</option>
            {products.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          {label("message", dict.message, true)}
          <textarea {...fieldProps("message")} rows={5} required maxLength={4000} />
          {errorFor("message")}
        </div>
        {/* Honeypot for bots — hidden from people and assistive tech */}
        <div aria-hidden="true" className="absolute -start-[9999px] h-0 w-0 overflow-hidden">
          <label>
            Website
            <input type="text" name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
      </div>

      {status !== "idle" && status !== "sending" && (
        <div role="alert" className="mt-6 flex gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-900 ring-1 ring-red-200">
          <Icon name="alert" className="size-5 shrink-0" />
          <p>
            {status === "not_configured" ? dict.notConfigured : status === "rate_limited" ? dict.rateLimited : dict.errorGeneric}{" "}
            {status === "not_configured" && (
              <a href={siteConfig.facebook} target="_blank" rel="noopener noreferrer" className="font-semibold underline">
                Facebook
              </a>
            )}
          </p>
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <p className="text-xs text-ink-500">{dict.privacy}</p>
        <button type="submit" className="btn btn-primary" disabled={status === "sending"} aria-busy={status === "sending"}>
          {status === "sending" ? dict.sending : dict.submit}
          <Icon name="arrow" className="size-4 rtl:-scale-x-100" />
        </button>
      </div>
    </form>
  );
}
