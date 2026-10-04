import type { Category, CategoryId } from "./types";

export const categories: Category[] = [
  {
    id: "private-label",
    section: 3,
    name: { ar: "منتجات الكنوز", en: "Al-Kunooz Private Label" },
    description: {
      ar: "منتجات تحمل علامة الكنوز، صُممت لتلبية احتياجات المحاصيل في كل مراحل نموها: من تكوين الجذور إلى الإزهار والعقد وحتى جودة الثمار.",
      en: "Products under the Al-Kunooz brand, designed to meet crop needs at every growth stage: from root formation to flowering and fruit set, through to fruit quality.",
    },
    image: "/images/categories/private-label.jpg",
  },
  {
    id: "fortal-npk",
    section: 4,
    name: { ar: "أسمدة فورتال المركبة NPK", en: "Fortal Compound NPK Fertilizers" },
    description: {
      ar: "تشكيلة واسعة من الأسمدة المركبة بأربع صيغ: ذوّابة، ومعلّقة، وسائلة، ومحبّبة، وبتركيبات متعددة تناسب كل مرحلة من مراحل نمو المحصول.",
      en: "A wide range of compound fertilizers in four forms — water-soluble, suspension, liquid and granular — with multiple formulations to suit every stage of crop growth.",
    },
    image: "/images/categories/fortal-npk.jpg",
  },
  {
    id: "micronutrients",
    section: 5,
    name: { ar: "العناصر الصغرى (النادرة)", en: "Micronutrients" },
    description: {
      ar: "عناصر صغرى مخلبة عالية النقاوة وسريعة الامتصاص لمعالجة أعراض النقص والوقاية منها، بما في ذلك الترب القلوية والكلسية.",
      en: "High-purity, fast-absorbing chelated micronutrients to treat and prevent deficiency symptoms, including in alkaline and calcareous soils.",
    },
    image: "/images/categories/micronutrients.jpg",
  },
  {
    id: "calcium-fruit-set",
    section: 6,
    name: { ar: "أسمدة الكالسيوم والعقد", en: "Calcium & Fruit-Set Specialties" },
    description: {
      ar: "تركيبات خاصة لتحسين عقد الثمار وجودتها، والوقاية من مشاكل نقص الكالسيوم مثل تعفن مؤخرة الثمار وتساقط الأزهار.",
      en: "Specialty formulations to improve fruit set and fruit quality, and to prevent calcium-deficiency problems such as blossom-end rot and flower drop.",
    },
    image: "/images/categories/calcium-fruit-set.jpg",
  },
  {
    id: "smart-nutrition-protection",
    section: 7,
    name: { ar: "المركبات الذكية للتغذية والوقاية", en: "Smart Nutrition & Protection Compounds" },
    description: {
      ar: "مركبات تجمع بين التغذية وتقوية دفاعات النبات في آن واحد، بتقنيات الفوسفونات والأثر الملحي المنخفض.",
      en: "Compounds that combine nutrition with strengthening plant defences at the same time, using phosphonate and low-salt-index technologies.",
    },
    image: "/images/categories/smart-nutrition-protection.jpg",
  },
  {
    id: "smart-organic",
    section: 8,
    name: { ar: "الأسمدة العضوية الذكية", en: "Smart Organic Fertilizers" },
    description: {
      ar: "أسمدة ومحسنات تربة عضوية ومستخلصات طبيعية (أحماض أمينية، هيوميك وفولفيك، أعشاب بحرية) لتحسين خصوبة التربة وصحة النبات وزيادة الإنتاج.",
      en: "Organic fertilizers, soil conditioners and natural extracts (amino acids, humic and fulvic acids, seaweed) to improve soil fertility and plant health and increase yield.",
    },
    image: "/images/categories/smart-organic.jpg",
  },
  {
    id: "growth-regulators",
    section: 9,
    name: { ar: "منظمات النمو", en: "Plant Growth Regulators" },
    description: {
      ar: "منظمات نمو نباتية لتحسين عقد الثمار في الظروف الحرجة، وتكبير حجم الثمار، وتشجيع تجذير العقل.",
      en: "Plant growth regulators to improve fruit set under critical conditions, increase fruit size, and encourage rooting of cuttings.",
    },
    image: "/images/categories/growth-regulators.jpg",
  },
  {
    id: "organic-protection",
    section: 10,
    name: { ar: "الوقاية النباتية العضوية", en: "Eco-Friendly Organic Plant Protection" },
    description: {
      ar: "منتجات من المستخلصات النباتية صديقة للبيئة، ملائمة للزراعات العضوية وبرامج المكافحة المتكاملة (IPM)، تجمع بين التغذية والوقاية.",
      en: "Eco-friendly plant-extract products suitable for organic farming and Integrated Pest Management (IPM) programmes, combining nutrition and protection.",
    },
    image: "/images/categories/organic-protection.jpg",
  },
  {
    id: "pesticides",
    section: 11,
    name: { ar: "المبيدات", en: "Pesticides" },
    description: {
      ar: "مبيدات حشرية ومبيدات حشائش مسجلة. تُستخدم جميع المبيدات وفق الإرشادات والجرعات المدوّنة على الملصق، مع ارتداء الملابس الواقية والالتزام بفترة الأمان قبل الحصاد، وحفظها بعيداً عن متناول الأطفال.",
      en: "Registered insecticides and herbicides. All pesticides must be used according to the instructions and doses on the label, while wearing protective clothing, observing the pre-harvest interval, and stored out of the reach of children.",
    },
    image: "/images/categories/pesticides.jpg",
  },
];

export const categoryById = Object.fromEntries(categories.map((c) => [c.id, c])) as Record<
  CategoryId,
  Category
>;
