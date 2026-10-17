import type { Translation } from './en';

// Typed against the English file: a missing or extra key is a compile error.
export const ar: Translation = {
  app: { title: 'نظام إدارة الصيدليات' },
  common: { loading: 'جارٍ التحميل…' },
  nav: { label: 'التنقل الرئيسي', skipToContent: 'تخطَّ إلى المحتوى', systemStatus: 'حالة النظام' },
  language: { label: 'اللغة', en: 'English', ar: 'العربية' },
  status: {
    heading: 'حالة الخادم',
    checking: 'جارٍ فحص الخادم…',
    ok: 'الخادم متصل.',
    environment: 'البيئة: {{environment}}',
    error: 'تعذّر الاتصال بالخادم.',
    retry: 'حاول مرة أخرى',
  },
  notFound: {
    title: 'الصفحة غير موجودة',
    body: 'الصفحة التي طلبتها غير موجودة.',
    back: 'العودة إلى الصفحة الرئيسية',
  },
  error: {
    title: 'حدث خطأ ما',
    body: 'حدث خطأ غير متوقع. يمكنك إعادة تحميل الصفحة.',
    reload: 'إعادة التحميل',
  },
};
