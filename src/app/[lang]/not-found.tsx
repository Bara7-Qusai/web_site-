import Link from "next/link";
import { Icon } from "@/components/Icon";

// Rendered inside the [lang] layout; the locale is not available here, so the page is bilingual.
export default function NotFound() {
  return (
    <section className="container-x flex flex-col items-center py-28 text-center">
      <Icon name="sprout" className="size-14 text-leaf-500" />
      <p className="ltr-num mt-6 text-6xl font-bold text-forest-800">404</p>
      <h1 className="mt-4 text-2xl font-bold text-forest-900">الصفحة غير موجودة · Page not found</h1>
      <p className="mt-3 text-ink-700">عذراً، لم نتمكن من العثور على الصفحة المطلوبة. · Sorry, we couldn&apos;t find that page.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/ar" className="btn btn-primary">الرئيسية</Link>
        <Link href="/en" className="btn btn-outline">Home</Link>
      </div>
    </section>
  );
}
