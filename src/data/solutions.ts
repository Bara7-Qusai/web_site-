import type { Solution } from "./types";

/**
 * Agricultural needs → suggested products.
 * Source: "دليل الاختيار السريع" (Quick Selection Guide) in the company profile.
 * Product lists are reproduced exactly; descriptions summarize the documented product benefits.
 */
export const solutions: Solution[] = [
  {
    id: "balanced-growth",
    icon: "sprout",
    title: { ar: "نمو متوازن عام", en: "Balanced general growth" },
    description: {
      ar: "تغذية متكاملة بالعناصر الكبرى والصغرى لدعم النمو الخضري والإنتاج في جميع المراحل.",
      en: "Complete macro- and micronutrient feeding to support vegetative growth and production at every stage.",
    },
    products: ["al-kunooz-soluble-npk-20-20-20", "al-kunooz-liquid-npk-11-8-6", "actival"],
    categories: ["fortal-npk"],
  },
  {
    id: "roots-flowering",
    icon: "root",
    title: { ar: "تكوين الجذور والتزهير", en: "Root development & flowering" },
    description: {
      ar: "تركيبات غنية بالفسفور ومحفزات عضوية لتقوية المجموع الجذري وتشجيع الإزهار.",
      en: "Phosphorus-rich formulations and organic stimulants to strengthen roots and encourage flowering.",
    },
    products: ["al-kunooz-soluble-npk-11-44-11", "al-kunooz-liquid-0-30-40", "biofert-liquid"],
  },
  {
    id: "flowering-fruit-set",
    icon: "flower",
    title: { ar: "الإزهار وتثبيت العقد", en: "Flowering & fruit setting" },
    description: {
      ar: "تغذية ورقية بالبوتاسيوم والفسفور والكالسيوم والبورون لزيادة الإزهار وتثبيت العقد وتقليل التساقط.",
      en: "Foliar potassium, phosphorus, calcium and boron to increase flowering, fix fruit set and reduce drop.",
    },
    products: ["colonel", "turbo", "fruitium", "max-cal-bor"],
  },
  {
    id: "fruit-set-temperature",
    icon: "thermometer",
    title: { ar: "العقد في الحرارة المرتفعة أو المنخفضة", en: "Fruit set in high or low temperatures" },
    description: {
      ar: "منظمات عقد ومركبات تساعد على تثبيت العقد في الظروف الحرجة، شتاءً وصيفاً.",
      en: "Fruit-set regulators and compounds that help fix fruit set under critical conditions, in winter and summer.",
    },
    products: ["fruitium", "beta-hour", "cipa-hour", "fertil-floral"],
  },
  {
    id: "fruit-quality-calcium",
    icon: "fruit",
    title: { ar: "جودة الثمار ومشاكل الكالسيوم", en: "Fruit quality & calcium problems" },
    description: {
      ar: "الوقاية من تعفن مؤخرة الثمار والتبقعات البنية، وتحسين صلابة الثمار وقابليتها للتخزين.",
      en: "Prevent blossom-end rot and bitter pit, and improve fruit firmness and storability.",
    },
    products: ["cal-mag", "microfert-cal", "microfert-cal-mag", "phosphogreen-ca"],
  },
  {
    id: "drought-stress",
    icon: "sun",
    title: { ar: "تحمّل الجفاف والإجهاد", en: "Drought & stress tolerance" },
    description: {
      ar: "منتجات تساعد النبات على تحمل الجفاف والإجهاد الحراري والتقلبات الجوية.",
      en: "Products that help plants tolerate drought, heat stress and weather fluctuations.",
    },
    products: ["kunooz-npk-18-46-5", "zinca-boro", "phosphogreen-zn", "bioextract"],
  },
  {
    id: "micronutrient-deficiency",
    icon: "atom",
    title: { ar: "نقص العناصر الصغرى", en: "Micronutrient deficiencies" },
    description: {
      ar: "عناصر صغرى مخلبة سريعة الامتصاص لمعالجة أعراض النقص، بما فيها الترب القلوية والكلسية.",
      en: "Fast-absorbing chelated micronutrients to treat deficiency symptoms, including in alkaline and calcareous soils.",
    },
    products: ["microfert-combi", "microfert-fe-eddha-6", "microfert-single-chelates", "aminofert"],
  },
  {
    id: "fungal-diseases",
    icon: "shield",
    title: { ar: "الأمراض الفطرية", en: "Fungal diseases" },
    description: {
      ar: "مركبات تغذية ووقاية تقوي دفاعات النبات ضد البياض الدقيقي والزغبي واللفحات.",
      en: "Nutrition-and-protection compounds that strengthen plant defences against powdery and downy mildew and blights.",
    },
    products: ["sulfur-green-ks", "phosphoro-0-60-5", "solo-k", "organocopperfostyl-10", "phosphogreen-k"],
  },
  {
    id: "soil-salinity",
    icon: "layers",
    title: { ar: "ملوحة التربة وإصلاحها", en: "Soil salinity & soil improvement" },
    description: {
      ar: "محسنات تربة تطرد الأملاح وتعدّل الحموضة وتحرر العناصر المثبتة وتحسن خصوبة التربة.",
      en: "Soil conditioners that displace salts, adjust pH, release locked nutrients and improve soil fertility.",
    },
    products: ["anti-sal", "corrector", "biofert-powder", "biohume-fe-80"],
  },
  {
    id: "insects",
    icon: "bug",
    title: { ar: "الحشرات", en: "Insects" },
    description: {
      ar: "مبيدات حشرية مسجلة ومستخلصات نباتية ملائمة لبرامج المكافحة المتكاملة.",
      en: "Registered insecticides and plant extracts suitable for integrated pest management programmes.",
    },
    products: ["agrocel-44-ec", "bioact-1", "bioact-2", "nemaguard"],
  },
  {
    id: "weeds",
    icon: "grass",
    title: { ar: "الحشائش", en: "Weeds" },
    description: {
      ar: "مبيدات حشائش مسجلة للحشائش الحولية والمعمرة، رفيعة وعريضة الأوراق.",
      en: "Registered herbicides for annual and perennial, narrow- and broad-leaf weeds.",
    },
    products: ["saadsate-36-sl", "agrogoal-24-ec"],
  },
  {
    id: "rooting-cuttings",
    icon: "scissors",
    title: { ar: "التجذير وإكثار العقل", en: "Rooting & propagating cuttings" },
    description: {
      ar: "منظم نمو لتشجيع تجذير العقل الطرية والمتوسطة والخشنة.",
      en: "A growth regulator to encourage rooting of soft, semi-hard and hard cuttings.",
    },
    products: ["endolin-iba"],
  },
];
