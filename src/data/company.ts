import type { L } from "./types";

/** Company information taken from the company profile. */

export const company = {
  name: { ar: "الكنوز للحلول الزراعية", en: "Al-Kunooz Agricultural Solutions" } as L,
  tagline: { ar: "شريكك في النمو", en: "Your Partner in Growth" } as L,

  about: [
    {
      ar: "الكنوز للحلول الزراعية شركة متخصصة في توفير الأسمدة والمغذيات النباتية عالية الجودة، تقدّم للمزارعين والمستثمرين الزراعيين حلولاً متكاملة تشمل الأسمدة المركّبة الذائبة والسائلة والمحببة، ومكمّلات العناصر الثانوية والصغرى، والأسمدة العضوية ومحسنات التربة، ومنظمات النمو، ومنتجات الوقاية النباتية والمبيدات.",
      en: "Al-Kunooz Agricultural Solutions is a company specialized in supplying high-quality fertilizers and plant nutrients. We offer farmers and agricultural investors integrated solutions including soluble, liquid and granular compound fertilizers, secondary and micronutrient supplements, organic fertilizers and soil conditioners, growth regulators, and plant protection products and pesticides.",
    },
    {
      ar: "نؤمن بأن نجاح المزارع هو نجاحنا، ولذلك نختار منتجاتنا بعناية لتلبي احتياجات المحاصيل المختلفة في كل مراحل نموها، من تكوين الجذور، إلى الإزهار والعقد، وحتى رفع جودة الثمار وزيادة الإنتاجية، مع تحمّل أفضل لظروف الجفاف والإجهاد الحراري.",
      en: "We believe the farmer's success is our success. That is why we choose our products carefully to meet the needs of different crops at every stage of growth — from root formation, to flowering and fruit set, to higher fruit quality and productivity — with better tolerance of drought and heat stress.",
    },
  ] as L[],

  portfolioIntro: {
    ar: "تضم محفظة الكنوز للحلول الزراعية 59 منتجاً موزعة على 9 مجموعات متكاملة، تغطي تغذية النبات بالعناصر الكبرى والثانوية والصغرى، والأسمدة العضوية ومحسنات التربة، ومنظمات النمو، ووسائل الوقاية النباتية والمبيدات.",
    en: "The Al-Kunooz portfolio includes 59 products across 9 integrated groups, covering macro-, secondary and micronutrient plant nutrition, organic fertilizers and soil conditioners, growth regulators, and plant protection and pesticides.",
  } as L,

  /** Figures printed in the company profile. */
  stats: [
    { value: 59, label: { ar: "منتجاً زراعياً", en: "Agricultural products" } },
    { value: 9, label: { ar: "مجموعات متخصصة", en: "Specialized groups" } },
    { value: 7, label: { ar: "فروع ونقاط بيع", en: "Branches & points of sale" } },
    { value: 9, label: { ar: "منتجات بعلامة الكنوز", en: "Al-Kunooz brand products" } },
  ] as { value: number; label: L }[],

  vision: {
    ar: "أن نكون الشريك الأول والأكثر ثقة للمزارع في الحلول الزراعية وتغذية النبات.",
    en: "To be the farmer's first and most trusted partner in agricultural solutions and plant nutrition.",
  } as L,
  mission: {
    ar: "تقديم منتجات زراعية فعّالة وموثوقة ترفع إنتاجية المحاصيل وجودتها، وتدعم المزارع بالمعرفة والحلول المناسبة.",
    en: "To provide effective, reliable agricultural products that raise crop productivity and quality, and to support farmers with the right knowledge and solutions.",
  } as L,

  values: [
    {
      title: { ar: "الجودة", en: "Quality" },
      text: { ar: "منتجات بتركيبات مدروسة ونسب واضحة على كل عبوة.", en: "Products with carefully designed formulations and clear ratios on every pack." },
    },
    {
      title: { ar: "الفعالية", en: "Effectiveness" },
      text: { ar: "تركيبات عالية الذوبان والامتصاص تعطي نتائج ملموسة.", en: "Highly soluble, highly absorbable formulations that deliver tangible results." },
    },
    {
      title: { ar: "الشراكة", en: "Partnership" },
      text: { ar: "نقف إلى جانب المزارع من البذرة حتى الحصاد.", en: "We stand by the farmer from seed to harvest." },
    },
    {
      title: { ar: "الاستدامة", en: "Sustainability" },
      text: { ar: "منتجات آمنة على النبات ومناسبة لأنظمة الري الحديثة.", en: "Products that are safe for plants and suited to modern irrigation systems." },
    },
  ] as { title: L; text: L }[],

  fields: [
    { title: { ar: "أسمدة مركّبة NPK", en: "NPK compound fertilizers" }, text: { ar: "ذائبة وسائلة ومحببة", en: "Soluble, liquid and granular" } },
    { title: { ar: "عناصر صغرى وثانوية", en: "Micro & secondary nutrients" }, text: { ar: "مخلبة وسريعة الامتصاص", en: "Chelated and fast-absorbing" } },
    { title: { ar: "عضوية ومنظمات نمو", en: "Organics & growth regulators" }, text: { ar: "هيوميك، أعشاب بحرية، أمينو", en: "Humic, seaweed, amino acids" } },
    { title: { ar: "وقاية ومبيدات", en: "Protection & pesticides" }, text: { ar: "حماية متكاملة للمحصول", en: "Integrated crop protection" } },
  ] as { title: L; text: L }[],

  whyUs: [
    {
      title: { ar: "تشكيلة متكاملة", en: "A complete range" },
      text: { ar: "59 منتجاً في 9 مجموعات تغطي كل مراحل نمو النبات من الجذور حتى الحصاد.", en: "59 products in 9 groups covering every stage of plant growth, from roots to harvest." },
    },
    {
      title: { ar: "ذوبان وامتصاص عالٍ", en: "High solubility & absorption" },
      text: { ar: "تركيبات مصممة للامتصاص السريع عبر الأوراق والجذور.", en: "Formulations designed for fast uptake through leaves and roots." },
    },
    {
      title: { ar: "توافق مع الري الحديث", en: "Modern irrigation ready" },
      text: { ar: "مناسبة للرش الورقي وأنظمة الري بالتنقيط والشبكات.", en: "Suitable for foliar spraying, drip irrigation and irrigation networks." },
    },
    {
      title: { ar: "عبوات متعددة", en: "Multiple pack sizes" },
      text: { ar: "أحجام من 100 مل حتى 50 كغم تناسب المزارع الصغيرة والمشاريع الكبيرة.", en: "Sizes from 100 ml up to 50 kg, suiting small farms and large projects alike." },
    },
    {
      title: { ar: "مقاومة الإجهاد", en: "Stress resistance" },
      text: { ar: "منتجات تساعد النبات على تحمّل الجفاف والحرارة والأمراض الفطرية.", en: "Products that help plants withstand drought, heat and fungal diseases." },
    },
  ] as { title: L; text: L }[],

  management: [
    {
      name: { ar: "سعد عبد الله التوم", en: "Saad Abdalla Altoum" },
      role: { ar: "المدير العام", en: "General Manager" },
    },
  ] as { name: L; role: L }[],

  branchesIntro: {
    ar: "تمتد شبكة فروع الكنوز للحلول الزراعية من الرئاسة في الخرطوم لتغطي أهم الولايات والمناطق الزراعية، لنكون قريبين من المزارعين أينما كانوا.",
    en: "The Al-Kunooz branch network extends from the head office in Khartoum to cover the main agricultural states and regions, so that we are close to farmers wherever they are.",
  } as L,
};

export interface Branch {
  id: string;
  city: L;
  label?: L;
  covers?: L;
  headOffice?: boolean;
  /** Google Maps link — not yet provided in the source ("[رابط الموقع يُضاف لاحقاً]"). */
  mapUrl: string | null;
}

export const branches: Branch[] = [
  { id: "khartoum", city: { ar: "الخرطوم", en: "Khartoum" }, label: { ar: "الرئاسة", en: "Head Office" }, headOffice: true, mapUrl: null },
  {
    id: "wad-madani",
    city: { ar: "مدني", en: "Wad Madani" },
    label: { ar: "الفرع الأكبر", en: "Largest branch" },
    covers: { ar: "ولاية الجزيرة", en: "Al Jazirah State" },
    mapUrl: null,
  },
  { id: "kassala", city: { ar: "كسلا", en: "Kassala" }, covers: { ar: "ولاية الشرق", en: "Eastern region" }, mapUrl: null },
  { id: "sennar", city: { ar: "سنار", en: "Sennar" }, covers: { ar: "النيل الأزرق", en: "Blue Nile" }, mapUrl: null },
  { id: "rabak", city: { ar: "ربك", en: "Rabak" }, covers: { ar: "النيل الأبيض وكردفان", en: "White Nile & Kordofan" }, mapUrl: null },
  { id: "shendi", city: { ar: "شندي", en: "Shendi" }, covers: { ar: "نهر النيل", en: "River Nile" }, mapUrl: null },
  { id: "dongola", city: { ar: "دنقلا", en: "Dongola" }, covers: { ar: "الولاية الشمالية", en: "Northern State" }, mapUrl: null },
];
