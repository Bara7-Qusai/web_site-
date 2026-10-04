import type { DataTable, L, Product, SpecRow } from "./types";

/*
 * Al-Kunooz Agricultural Solutions — product catalog (59 products).
 *
 * Source: "Al-Kunooz Company Profile & Product Catalog" (الملف التعريفي للشركة).
 * - Arabic text is reproduced from the source document.
 * - English text is a translation of the Arabic source; product names in English are the
 *   official names printed in the catalog.
 * - Nothing has been added that is not in the source. Where the source says
 *   "[يُحدد لاحقاً]" (to be determined), `packages` is `null`.
 *
 * To add/edit/remove a product: edit the array below. Run `npm run validate:data` afterwards.
 */

/**
 * In Arabic text, digits that follow Arabic letters are treated as "Arabic numbers" by the Unicode
 * bidi algorithm, which reverses hyphenated NPK formulas (18-46-5 would display as 5-46-18).
 * Wrap such formulas in Left-to-Right Isolate marks, as the printed catalog does.
 */
const FORMULA = /\d+(?:\.\d+)?(?:-\d+(?:\.\d+)?){2,}(?:\s*\+\s*T\.E)?/g;
export const isolateFormulas = (ar: string) => ar.replace(FORMULA, (m) => `\u2066${m}\u2069`);

const t = (ar: string, en: string): L => ({ ar: isolateFormulas(ar), en });
const row = (ar: string, en: string, value: string): SpecRow => ({ label: t(ar, en), value });

type Unit = "kg" | "kgj" | "L" | "ml" | "g";
const UNIT: Record<Unit, L> = {
  kg: t("كغم", "kg"),
  kgj: t("كجم", "kg"),
  L: t("لتر", "L"),
  ml: t("مل", "ml"),
  g: t("غم", "g"),
};
const pk = (unit: Unit, ...sizes: number[]): L[] =>
  sizes.map((n) => t(`${n} ${UNIT[unit].ar}`, `${n} ${UNIT[unit].en}`));

// Shared composition labels
const N = (v: string) => row("نيتروجين (N)", "Nitrogen (N)", v);
const P2O5 = (v: string) => row("فسفور (P₂O₅)", "Phosphorus (P₂O₅)", v);
const K2O = (v: string) => row("بوتاسيوم (K₂O)", "Potassium (K₂O)", v);
const CaO = (v: string) => row("كالسيوم (CaO)", "Calcium (CaO)", v);
const MgO = (v: string) => row("مغنيسيوم (MgO)", "Magnesium (MgO)", v);
const B2O3 = (v: string) => row("بورون (B₂O₃)", "Boron (B₂O₃)", v);
const OM = (v: string) => row("مادة عضوية", "Organic matter", v);
const AA = (v: string) => row("أحماض أمينية", "Amino acids", v);

const PRECAUTIONS_STD: L[] = [
  t("يُنصح بارتداء الملابس والنظارات الواقية عند الرش.", "Wearing protective clothing and goggles is recommended when spraying."),
  t("يُحفظ في عبوته الأصلية محكمة الإغلاق بعيداً عن متناول الأطفال.", "Keep in the original, tightly closed container, out of the reach of children."),
  t("قابلية الخلط: يُخلط مع جميع الأسمدة والمبيدات ما عدا القلوية منها.", "Compatibility: can be mixed with all fertilizers and pesticides except alkaline ones."),
];

const COL_CROP = t("المحصول", "Crop");
const COL_RATE = t("المعدل", "Rate");

const SOLUBLE_RATES: DataTable = {
  columns: [COL_CROP, COL_RATE],
  rows: [
    [t("الخضراوات المحمية", "Protected (greenhouse) vegetables"), t("1 – 3 كغم / بيت (500 م²)", "1 – 3 kg / greenhouse (500 m²)")],
    [t("الخضراوات المكشوفة", "Open-field vegetables"), t("6 – 8 كغم / فدان", "6 – 8 kg / feddan")],
    [t("المحاصيل الحقلية (قمح، شعير، برسيم)", "Field crops (wheat, barley, alfalfa)"), t("رشاً على الأوراق بمعدل 1 – 2 كغم / فدان", "Foliar spray at 1 – 2 kg / feddan")],
    [t("أشجار الفاكهة", "Fruit trees"), t("50 – 100 غم / شجرة", "50 – 100 g / tree")],
    [t("نباتات الزينة", "Ornamental plants"), t("1 – 2.5 غم / لتر ماء للتربة", "1 – 2.5 g / L of water, to the soil")],
    [t("القطن", "Cotton"), t("6 – 8 كغم / فدان", "6 – 8 kg / feddan")],
  ],
};

const EDTA_TE = (ar: string, en: string): L =>
  t(
    `عناصر صغرى (${ar}): حديد (Fe) · زنك (Zn) · منغنيز (Mn) · نحاس (Cu) · بورون (B)`,
    `Micronutrients (${en}): iron (Fe) · zinc (Zn) · manganese (Mn) · copper (Cu) · boron (B)`,
  );

const SOLUBLE_FORM = t("بودرة قابلة للذوبان (سماد ورقي فعّال)", "Soluble powder (effective foliar fertilizer)");

export const products: Product[] = [
  // ───────────────────────── 03 · Al-Kunooz Private Label ─────────────────────────
  {
    number: 1,
    slug: "al-kunooz-soluble-npk-20-20-20",
    category: "private-label",
    name: t("الكنوز الذائب NPK 20-20-20", "Al-Kunooz Soluble NPK 20-20-20"),
    image: "/images/products/al-kunooz-soluble-npk-20-20-20.jpg",
    basis: "W/W",
    form: SOLUBLE_FORM,
    formulation: "20-20-20 + T.E",
    packages: pk("kgj", 1),
    composition: [N("20%"), P2O5("20%"), K2O("20%")],
    compositionNote: EDTA_TE("عناصر مخلبة بـ EDTA", "EDTA-chelated"),
    keyFeature: t(
      "مركز عالي الجودة وسريع الذوبان، يحتوي على جميع العناصر المغذية الضرورية مخلبة بـ EDTA وبأحدث الطرق التكنولوجية.",
      "A high-quality, fast-dissolving concentrate containing all essential nutrients, EDTA-chelated using the latest technological methods.",
    ),
    benefits: [
      t("يعزز نمو النبات بشكل متوازن ويحسن جودة الثمار ويزيد مقاومة الإجهاد.", "Promotes balanced plant growth, improves fruit quality and increases stress resistance."),
      t(
        "يساهم في تنظيم التوازن الفسيولوجي والهرموني للنبات؛ فبمجرد ملامسته للأوراق أو الجذور ينفصل العنصر عن المخلب ويمتصه النبات.",
        "Helps regulate the plant's physiological and hormonal balance; on contact with leaves or roots the nutrient separates from the chelate and is absorbed by the plant.",
      ),
      t(
        "يسمح للنبات أن ينمو وينتج من جديد في حالة الحوادث الجوية أو الصدمات بالمواد الكيماوية.",
        "Allows the plant to resume growth and production after weather events or chemical shock.",
      ),
    ],
    usage: t(
      "ملائم للخضروات والمحاصيل الحقلية والأشجار المثمرة ونباتات الزينة، ويُستخدم بكفاءة عالية تحت أنظمة الري والرش الورقي. المعدل العام للرش الورقي: 700 – 750 غم / 200 لتر ماء.",
      "Suitable for vegetables, field crops, fruit trees and ornamentals; used with high efficiency through irrigation systems and foliar spraying. General foliar rate: 700 – 750 g / 200 L of water.",
    ),
    rates: SOLUBLE_RATES,
  },
  {
    number: 2,
    slug: "al-kunooz-soluble-npk-11-44-11",
    category: "private-label",
    name: t("الكنوز الذائب NPK 11-44-11", "Al-Kunooz Soluble NPK 11-44-11"),
    image: "/images/products/al-kunooz-soluble-npk-11-44-11.jpg",
    basis: "W/W",
    form: SOLUBLE_FORM,
    formulation: "11-44-11 + T.E",
    packages: pk("kgj", 1),
    composition: [N("11%"), P2O5("44%"), K2O("11%")],
    compositionNote: EDTA_TE("على هيئة شيلات عالية الجودة", "as high-quality chelates"),
    keyFeature: t(
      "نسبة عالية من الفسفور الذي له دور أساسي في تقوية ونمو المجموع الجذري وتشجيع النبات على الإزهار.",
      "A high phosphorus content, which plays an essential role in strengthening root growth and encouraging flowering.",
    ),
    benefits: [
      t("يزيد عدد الأزهار ويعمل على تثبيت عقد الثمار والتقليل من تساقطها.", "Increases the number of flowers, helps fix fruit set and reduces fruit drop."),
      t("نسبة متوازنة من النيتروجين والبوتاسيوم تساعد على النمو الخضري ومضاعفة الإنتاج.", "A balanced ratio of nitrogen and potassium supports vegetative growth and higher production."),
      t("يحتوي على مواد إضافية تساعد على تحسين امتصاص السماد.", "Contains additives that help improve fertilizer uptake."),
      t(
        "يُوصى باستخدامه في المراحل الأولى من الزراعة وعند تكوين الأزهار وبداية تكوين الثمار.",
        "Recommended in the early stages of cultivation, at flower formation and at the start of fruit formation.",
      ),
    ],
    usage: t(
      "ملائم لجميع محاصيل الخضراوات والمحاصيل الحقلية والأشجار المثمرة ونباتات الزينة، ويُستخدم بكفاءة عالية تحت أنظمة الري المختلفة والرش الورقي. المعدل العام للرش الورقي: 700 – 750 غم / 200 لتر ماء.",
      "Suitable for all vegetables, field crops, fruit trees and ornamentals; used with high efficiency through various irrigation systems and foliar spraying. General foliar rate: 700 – 750 g / 200 L of water.",
    ),
    rates: SOLUBLE_RATES,
  },
  {
    number: 3,
    slug: "kunooz-npk-18-46-5",
    category: "private-label",
    name: t("كنوز 18-46-5", "Kunooz NPK 18-46-5"),
    image: "/images/products/kunooz-npk-18-46-5.jpg",
    form: t("سماد مركب سائل", "Liquid compound fertilizer"),
    formulation: "18-46-5",
    packages: pk("L", 5),
    composition: [row("نيتروجين (N)", "Nitrogen (N)", "18%"), row("فسفور (P)", "Phosphorus (P)", "46%"), row("بوتاسيوم (K)", "Potassium (K)", "5%")],
    keyFeature: t("تركيبة عالية الكفاءة للمحاصيل.", "A high-efficiency formulation for crops."),
    benefits: [
      t("يرفع مقاومة النبات للإجهاد.", "Raises the plant's resistance to stress."),
      t("يساعد النبات على تحمل الجفاف والإجهاد الحراري.", "Helps the plant tolerate drought and heat stress."),
      t(
        "سريع الذوبان والامتصاص: تركيبة متطورة تضمن امتصاص العناصر الغذائية بسرعة وسهولة.",
        "Fast dissolving and absorption: an advanced formulation that ensures nutrients are taken up quickly and easily.",
      ),
    ],
    usage: t("يُضاف عبر الأوراق (رش ورقي) أو من خلال شبكات الري.", "Applied to the leaves (foliar spray) or through irrigation networks."),
  },
  {
    number: 4,
    slug: "al-kunooz-liquid-0-30-40",
    category: "private-label",
    name: t("الكنوز السائل 0-30-40", "Al-Kunooz Liquid 0-30-40"),
    image: "/images/products/al-kunooz-liquid-0-30-40.jpg",
    basis: "W/V",
    form: t("سماد سائل", "Liquid fertilizer"),
    formulation: "0-30-40",
    packages: pk("L", 1),
    composition: [N("0%"), P2O5("30%"), K2O("40%")],
    keyFeature: t(
      "امتصاص عالٍ من الجذور (خاصة أيون البوتاسيوم) ومن الأوراق، مع انتقال سريع داخل أجزاء النبات.",
      "High uptake through the roots (especially the potassium ion) and the leaves, with rapid movement within the plant.",
    ),
    benefits: [
      t(
        "يحسن تكوين الجذور وتزهير النبات، ويعزز نمو المجموع الجذري لزيادة امتصاص الماء والعناصر.",
        "Improves root formation and flowering, and boosts root growth to increase water and nutrient uptake.",
      ),
      t(
        "مؤشر ملوحة منخفض (Salt Index) يجعله السماد الآمن للإضافة إلى الجذور أو بالرش الورقي.",
        "A low salt index makes it a safe fertilizer for root application or foliar spraying.",
      ),
      t("آمن على المحاصيل الغذائية لمحتواه المتدني من العناصر الثقيلة وامتصاصه العالي.", "Safe on food crops thanks to its low heavy-metal content and high absorption."),
      t(
        "رجحان محتواه من البوتاسيوم على الفسفور يجعله مثالياً للإضافة في بداية الموسم وأثنائه.",
        "Its higher potassium-to-phosphorus content makes it ideal for application at the start of and during the season.",
      ),
    ],
    usage: t(
      "يُضاف عن طريق التربة (التسميد مع الري) أو رشاً على الأوراق ضمن برنامج تسميد متكامل.",
      "Applied to the soil (fertigation) or as a foliar spray as part of an integrated fertilization programme.",
    ),
    rates: {
      columns: [COL_CROP, t("توقيت الإضافة", "Timing"), t("عن طريق التربة", "Soil application"), t("رشاً على الأوراق", "Foliar spray")],
      rows: [
        [
          t("البطاطا", "Potatoes"),
          t("بعد الإنبات بثلاثة أسابيع، وتكرر 3 مرات دفعة كل أسبوع", "Three weeks after emergence; repeat 3 times, one dose per week"),
          t("3 – 4 لتر / دونم", "3 – 4 L / dunam"),
          t("150 – 200 سم³ / 100 لتر ماء", "150 – 200 cm³ / 100 L of water"),
        ],
        [
          t("الأشجار المثمرة", "Fruit trees"),
          t("قبيل سريان العصارة / الدفع الربيعي، وتكرر مرتين حتى قبيل الحصاد", "Just before sap flow / spring flush; repeat twice until shortly before harvest"),
          t("3 – 4 لتر / دونم", "3 – 4 L / dunam"),
          t("150 – 200 سم³ / 100 لتر ماء", "150 – 200 cm³ / 100 L of water"),
        ],
        [
          t("الخضار المحمية والمكشوفة", "Protected and open-field vegetables"),
          t("قبيل مرحلة الإزهار وتتوزع حتى نهاية الموسم", "Just before flowering, spread until the end of the season"),
          t("3 – 4 لتر / دونم", "3 – 4 L / dunam"),
          t("150 – 200 سم³ / 100 لتر ماء", "150 – 200 cm³ / 100 L of water"),
        ],
        [
          t("المحاصيل الحقلية", "Field crops"),
          t("من قبيل مرحلة التفريع", "From just before the tillering stage"),
          t("3 – 4 لتر / دونم", "3 – 4 L / dunam"),
          t("150 – 200 سم³ / 100 لتر ماء", "150 – 200 cm³ / 100 L of water"),
        ],
      ],
    },
    precautions: PRECAUTIONS_STD,
  },
  {
    number: 5,
    slug: "al-kunooz-liquid-npk-11-8-6",
    category: "private-label",
    name: t("الكنوز السائل 11-8-6", "Al-Kunooz Liquid NPK 11-8-6"),
    image: "/images/products/al-kunooz-liquid-npk-11-8-6.jpg",
    basis: "W/V",
    form: t("سماد مركب سائل كامل الذوبان", "Fully soluble liquid compound fertilizer"),
    formulation: "11-8-6 + T.E",
    packages: null,
    composition: [
      N("11%"),
      P2O5("8%"),
      K2O("6%"),
      row("حديد (Fe)", "Iron (Fe)", "50 ppm"),
      row("زنك (Zn)", "Zinc (Zn)", "50 ppm"),
      row("منغنيز (Mn)", "Manganese (Mn)", "25 ppm"),
      row("نحاس (Cu)", "Copper (Cu)", "25 ppm"),
    ],
    keyFeature: t(
      "يحتوي على جميع العناصر الغذائية الضرورية بشكل متوازن وجاهز للامتصاص.",
      "Contains all essential nutrients in a balanced, ready-to-absorb form.",
    ),
    benefits: [
      t("يعطي نمواً خضرياً فورياً وإنتاجاً وفيراً وثماراً ذات نوعية جيدة.", "Gives immediate vegetative growth, abundant production and good-quality fruit."),
      t(
        "نسب معتدلة من العناصر الكبرى إضافة إلى العناصر الصغرى والثانوية الضرورية لنمو النبات وتطوره.",
        "Moderate levels of macronutrients plus the micro- and secondary nutrients needed for plant growth and development.",
      ),
      t(
        "فعالية عالية في التسميد الورقي، ويُستعمل في شبكات الري بالتنقيط والرذاذ والرشاشات المحورية.",
        "Highly effective as a foliar fertilizer; also used in drip, mist and centre-pivot irrigation networks.",
      ),
    ],
    usage: t(
      "يُستعمل على كافة المحاصيل الحقلية والأشجار المثمرة والخضار ونباتات الزينة رشاً على الأوراق أو عن طريق التربة.",
      "Used on all field crops, fruit trees, vegetables and ornamentals, as a foliar spray or via the soil.",
    ),
    rates: {
      columns: [COL_CROP, COL_RATE],
      rows: [
        [t("الخضراوات المحمية", "Protected (greenhouse) vegetables"), t("2 – 3 لتر / بيت (500 م²)", "2 – 3 L / greenhouse (500 m²)")],
        [t("الخضراوات المكشوفة", "Open-field vegetables"), t("1.5 – 2 لتر / فدان", "1.5 – 2 L / feddan")],
        [t("المحاصيل الحقلية (قمح، شعير، برسيم)", "Field crops (wheat, barley, alfalfa)"), t("رشاً على الأوراق بمعدل 4 – 5 لتر / فدان", "Foliar spray at 4 – 5 L / feddan")],
        [t("أشجار الفاكهة", "Fruit trees"), t("50 – 75 مل / شجرة", "50 – 75 ml / tree")],
        [
          t("نباتات المنازل", "House plants"),
          t("25 مل (سعة الغطاء) لكل لتر ماء، تُروى بها النباتات مرة كل أسبوع", "25 ml (one cap) per litre of water, watered once a week"),
        ],
        [t("الرش الورقي", "Foliar spray"), t("150 – 250 مل / 100 لتر ماء", "150 – 250 ml / 100 L of water")],
      ],
    },
  },
  {
    number: 6,
    slug: "colonel",
    category: "private-label",
    alsoIn: ["smart-nutrition-protection"],
    name: t("كولونيل COLONEL", "COLONEL – Liquid Compound Fertilizer"),
    image: "/images/products/colonel.jpg",
    basis: "W/V",
    form: t("سماد مركب سائل (W/V)", "Liquid compound fertilizer (W/V)"),
    formulation: "0-40-60",
    packages: [...pk("ml", 250), ...pk("L", 1)],
    composition: [N("0%"), P2O5("40%"), K2O("60%")],
    keyFeature: t("معدل استخدام منخفض يعطي مفعولاً أكبر من المواد الأخرى.", "A low application rate that delivers a greater effect than other products."),
    benefits: [
      t(
        "تكنولوجيا جديدة في التسميد الورقي لزيادة نمو النبات وتنشيطه وزيادة الإزهار وتثبيت العقد وتحسين نوعية الثمار.",
        "New foliar-feeding technology to boost and activate plant growth, increase flowering, fix fruit set and improve fruit quality.",
      ),
      t(
        "مركبات فوسفاتية وبوتاسية ذات أثر ملحي منخفض (Low Salt Index) مما يتيح الأمان حتى مع زيادة التركيز رشاً على الأوراق.",
        "Phosphate and potash compounds with a low salt index, keeping it safe even at higher concentrations in foliar sprays.",
      ),
      t("آمن على النبات مع زيادة التركيز في الظروف الجوية المختلفة.", "Safe on plants at higher concentrations under different weather conditions."),
    ],
    usage: t(
      "سماد مركب سائل للرش الورقي في مراحل الإزهار والعقد وتحسين الثمار.",
      "A liquid compound fertilizer for foliar spraying at flowering, fruit set and fruit-improvement stages.",
    ),
  },
  {
    number: 7,
    slug: "phosphoro-0-60-5",
    category: "private-label",
    alsoIn: ["smart-nutrition-protection"],
    name: t("فسفورو PHOSPHORO", "PHOSPHORO 0-60-5 + T.E"),
    image: "/images/products/phosphoro-0-60-5.jpg",
    basis: "W/V",
    form: t("سماد سائل + عناصر صغرى (W/V)", "Liquid fertilizer + micronutrients (W/V)"),
    formulation: "0-60-5 + T.E",
    packages: pk("L", 1),
    composition: [
      N("0%"),
      P2O5("60%"),
      row("بوتاسيوم (K)", "Potassium (K)", "5%"),
      row("عناصر صغرى (T.E)", "Trace elements (T.E)", "✓"),
    ],
    keyFeature: t(
      "يساعد على مقاومة الأمراض الفطرية بحث النبات على تكوين مواد دفاعية (PhytoAlexines).",
      "Helps resist fungal diseases by stimulating the plant to produce defence compounds (phytoalexins).",
    ),
    benefits: [
      t(
        "مركب سائل متميز بجودته يحتوي على نسبة عالية من الفسفور إضافة إلى العناصر الغذائية الصغرى.",
        "A high-quality liquid compound with a high phosphorus content plus micronutrients.",
      ),
      t(
        "يعمل على الوقاية من الإصابة بالفطريات المسببة للبياض الزغبي واللفحات المبكرة والمتأخرة وعفن الجذور وغيرها من الأمراض الفطرية.",
        "Helps prevent infection by fungi causing downy mildew, early and late blight, root rot and other fungal diseases.",
      ),
    ],
    usage: t(
      "يُستخدم في تسميد الخضروات المحمية والمكشوفة، والمحاصيل الحقلية، وأشجار الفاكهة.",
      "Used to fertilize protected and open-field vegetables, field crops and fruit trees.",
    ),
  },
  {
    number: 8,
    slug: "cal-mag",
    category: "private-label",
    name: t("كال ماك CAL MAG", "CAL MAG – Calcium & Magnesium Supplement"),
    image: "/images/products/cal-mag.jpg",
    basis: "W/V",
    form: t("سائل – مكمل كالسيوم ومغنيسيوم", "Liquid – calcium & magnesium supplement"),
    formulation: "N 12% + CaO 15% + MgO 7.5%",
    packages: [...pk("ml", 250), ...pk("L", 1)],
    composition: [N("12%"), row("أكسيد الكالسيوم (CaO)", "Calcium oxide (CaO)", "15%"), row("أكسيد المغنيسيوم (MgO)", "Magnesium oxide (MgO)", "7.5%")],
    keyFeature: t(
      "تركيبة غنية بعنصري الكالسيوم والمغنيسيوم الضروريين للنبات في مراحل النمو المختلفة، تساهم في إنتاج ثمار ذات مواصفات عالية.",
      "A formulation rich in calcium and magnesium — essential at every growth stage — that contributes to high-specification fruit.",
    ),
    benefits: [
      t(
        "تحول دون ظهور: تعفن مؤخرة الثمار (Blossom End Rot)، والتبقعات البنية على ثمار التفاح (Bitter Pit)، والاصفرار بين عروق الأوراق القديمة.",
        "Prevents blossom-end rot, bitter pit (brown spotting) on apples, and interveinal yellowing of older leaves.",
      ),
      t(
        "تمنع ظاهرة الثمرة الملتوية خاصة في الخيار، وتساقط الأوراق من قاعدة النموات الحديثة.",
        "Prevents curved fruit, especially in cucumbers, and leaf drop from the base of new growth.",
      ),
      t(
        "تقسية الساق والأوراق وزيادة قدرة النبات على مقاومة الأمراض والظروف الجوية المتقلبة.",
        "Hardens stems and leaves and increases the plant's resistance to disease and changeable weather.",
      ),
      t(
        "المغنيسيوم: يبني جزيئات الكلوروفيل، ينشط الإنزيمات، ويحفز بناء البروتينات والهرمونات النباتية.",
        "Magnesium: builds chlorophyll molecules, activates enzymes and stimulates the synthesis of proteins and plant hormones.",
      ),
      t(
        "الكالسيوم: يبني الجدار الخلوي، يرفع القدرة التخزينية للثمار، ويزيد صلابة الأنسجة ومقاومة الأمراض.",
        "Calcium: builds the cell wall, improves fruit storage life, and increases tissue firmness and disease resistance.",
      ),
    ],
    usage: t(
      "فعّال جداً في الري المسمّد لأن الكالسيوم والمغنيسيوم بصورة سهلة الامتصاص ومستقرة في محلول الري في مختلف الظروف.",
      "Very effective in fertigation because the calcium and magnesium are in an easily absorbed form that stays stable in the irrigation solution under different conditions.",
    ),
    rates: {
      columns: [COL_CROP, t("التسميد الورقي", "Foliar"), t("التسميد الأرضي", "Soil"), t("مواعيد الاستعمال", "Timing")],
      rows: [
        [
          t("البندورة، الخيار، الفلفل، الباذنجان", "Tomato, cucumber, pepper, eggplant"),
          t("200 – 400 سم³ / 200 لتر", "200 – 400 cm³ / 200 L"),
          t("4 لتر / فدان", "4 L / feddan"),
          t("قبل الإزهار وبعد تكوّن الثمار", "Before flowering and after fruit formation"),
        ],
        [
          t("البطيخ والشمام", "Watermelon and melon"),
          t("200 – 250 سم³ / 200 لتر", "200 – 250 cm³ / 200 L"),
          t("4 – 8 لتر / فدان", "4 – 8 L / feddan"),
          t("مرحلة النمو الخضري", "Vegetative growth stage"),
        ],
        [
          t("التفاحيات", "Pome fruits"),
          t("400 – 600 سم³ / 200 لتر", "400 – 600 cm³ / 200 L"),
          t("50 – 75 سم³ / شجرة", "50 – 75 cm³ / tree"),
          t("يبدأ الرش بعد 4 أسابيع من عقد الثمار ويكرر أسبوعياً حتى النضج", "Start 4 weeks after fruit set and repeat weekly until maturity"),
        ],
        [
          t("العنب", "Grapes"),
          t("250 – 500 سم³ / 200 لتر", "250 – 500 cm³ / 200 L"),
          t("25 – 50 سم³ / شجرة", "25 – 50 cm³ / vine"),
          t("يبدأ الرش بعد 3 أسابيع من العقد", "Start 3 weeks after fruit set"),
        ],
      ],
    },
    precautions: PRECAUTIONS_STD,
  },
  {
    number: 9,
    slug: "sulfur-green-ks",
    category: "private-label",
    alsoIn: ["smart-nutrition-protection"],
    name: t("سلفر جرين KS", "Sulfur Green KS – Organic Formula"),
    image: "/images/products/sulfur-green-ks.jpg",
    basis: "W/V",
    form: t("سائل – تركيبة عضوية (W/V)", "Liquid – organic formula (W/V)"),
    formulation: "S 40% + K₂O 35%",
    packages: pk("L", 1, 5),
    composition: [row("كبريت (S)", "Sulfur (S)", "40%"), row("بوتاش (K₂O)", "Potash (K₂O)", "35%")],
    keyFeature: t("امتصاص عالٍ من الجذور والأوراق.", "High uptake through roots and leaves."),
    benefits: [
      t(
        "يُستخدم بفعالية لمكافحة البياض الدقيقي، وله أثر ملموس على صانعات الأنفاق (Leaf Miner) والعناكب (Mites).",
        "Used effectively against powdery mildew, with a noticeable effect on leaf miners and mites.",
      ),
      t(
        "بفضل احتوائه على المغذيات يزيد نمو النبات ويقويه ويجعله أكثر قدرة على مقاومة الأمراض ومنع اختراق هيفات الفطر لأنسجة النبات.",
        "Thanks to its nutrient content it increases and strengthens plant growth, improving disease resistance and preventing fungal hyphae from penetrating plant tissue.",
      ),
      t(
        "يُستخدم بالتناوب مع مبيدات البياض الدقيقي للحصول على نتائج أفضل وللحيلولة دون حصول المناعة.",
        "Used in rotation with powdery-mildew fungicides for better results and to prevent resistance.",
      ),
    ],
    usage: t("تغذية ووقاية: يجمع بين التسميد وتقوية دفاعات النبات.", "Nutrition and protection: combines fertilization with strengthening plant defences."),
  },

  // ───────────────────────── 04 · Fortal Compound NPK ─────────────────────────
  {
    number: 10,
    slug: "fortal-water-soluble-npk",
    category: "fortal-npk",
    name: t("أسمدة فورتال الذوّابة", "Fortal Water Soluble NPK"),
    image: "/images/products/fortal-water-soluble-npk.jpg",
    basis: "W/W",
    form: t("سماد مركب ذوّاب", "Water-soluble compound fertilizer"),
    packages: pk("kg", 1, 10, 25),
    formulations: [
      "20-20-20+T.E", "19-19-19+T.E", "30-10-10+T.E", "28-14-14+T.E", "15-30-15+T.E",
      "10-20-10+T.E", "10-0-40+T.E", "5-5-40+T.E", "12-6-36+T.E", "15-15-30+T.E",
    ],
    benefits: [
      t("فورتال الذائب متميز بجودته العالية ويحتوي على جميع العناصر المغذية الضرورية للنبات.", "Fortal soluble is distinguished by its high quality and contains all the nutrients a plant needs."),
      t(
        "يُستخدم بكفاءة عالية تحت أنظمة الري المختلفة لأن ذائبيته أعلى من مثيلاتها كونه مصنّعاً من خامات نقية.",
        "Used with high efficiency in various irrigation systems because its solubility is higher than comparable products, being made from pure raw materials.",
      ),
    ],
  },
  {
    number: 11,
    slug: "fortal-suspension-npk",
    category: "fortal-npk",
    name: t("أسمدة فورتال المعلّقة", "Fortal Suspension NPK"),
    image: "/images/products/fortal-suspension-npk.jpg",
    basis: "W/V",
    form: t("سماد مركب معلّق", "Suspension compound fertilizer"),
    packages: pk("kg", 1, 5, 15, 20),
    formulations: [
      "22-22-22+1MgO+T.E", "20-20-20+3MgO+T.E", "40-10-10+T.E", "24-24-18+0.25MgO+T.E", "20-10-20+6MgO+T.E",
      "10-50-10+MgO+T.E", "0-50-30+T.E", "12-61-0+T.E", "10-10-60+T.E", "13-6-46+3MgO+T.E",
      "12-12-44+3MgO+T.E", "16-8-32+6MgO+T.E", "8-16-32+3MgO+T.E",
    ],
    benefits: [
      t("سماد جاهز ومذاب في المحلول ومُعد للاستعمال المباشر، لذلك يكون امتصاصه مضموناً.", "A ready-to-use fertilizer already dissolved in solution, so its uptake is assured."),
      t(
        "يمنع التفاعلات الجانبية مع مكونات التربة، مما يفسر سرعة استجابة النبات وتحقيق أعلى إفادة.",
        "Prevents side reactions with soil components, which explains the plant's rapid response and maximum benefit.",
      ),
    ],
  },
  {
    number: 12,
    slug: "fortal-liquid-npk",
    category: "fortal-npk",
    name: t("أسمدة فورتال السائلة", "Fortal Liquid NPK"),
    image: "/images/products/fortal-liquid-npk.jpg",
    basis: "W/V",
    form: t("سماد مركب سائل", "Liquid compound fertilizer"),
    packages: pk("L", 1, 5, 20),
    formulations: ["10-10-10+T.E", "40-0-0+T.E", "11-8-6+T.E", "5-75-3+T.E", "0-34-43+T.E"],
    benefits: [
      t("يمكن إضافته للتربة أو رشاً على الأوراق.", "Can be applied to the soil or as a foliar spray."),
      t(
        "يحتوي على نسبة من الأحماض الأمينية تقلل الإجهاد الذي يعاني منه النبات، ويمكن تلمّس نتائجه بسرعة.",
        "Contains amino acids that reduce plant stress, with results that can be seen quickly.",
      ),
      t("سماد عالي الكفاءة لاحتوائه على الإضافات العضوية.", "A high-efficiency fertilizer thanks to its organic additives."),
    ],
  },
  {
    number: 13,
    slug: "fortal-granular-npk",
    category: "fortal-npk",
    name: t("أسمدة فورتال المحبّبة", "Fortal Granular NPK"),
    image: "/images/products/fortal-granular-npk.jpg",
    basis: "W/W",
    form: t("سماد مركب محبب", "Granular compound fertilizer"),
    packages: pk("kg", 25, 50),
    formulations: ["15-15-15+MgO+S+Fe+T.E", "18-18-5+1.5MgO+S+Fe+T.E", "11-22-16+MgO+S+Fe+T.E", "12-12-17+MgO+S+Fe+T.E"],
    benefits: [
      t(
        "سماد مركب محبب ذو ذوبان تدريجي يحتوي على العناصر الأساسية ونسبة جيدة من المغنيسيوم إضافة إلى الحديد والعناصر الأخرى.",
        "A gradually dissolving granular compound fertilizer containing the major nutrients, a good level of magnesium, plus iron and other elements.",
      ),
      t(
        "يمد النبات بالمغذيات لفترة طويلة حسب الري، حيث يذوب جزء من السماد في كل رية.",
        "Feeds the plant over a long period according to irrigation, as part of the fertilizer dissolves with each watering.",
      ),
    ],
  },

  // ───────────────────────── 05 · Micronutrients ─────────────────────────
  {
    number: 14,
    slug: "microfert-combi",
    category: "micronutrients",
    name: t("ميكروفيرت كومبي", "Microfert Combi"),
    subtitle: t("خليط العناصر الصغرى المخلبة", "Chelated micronutrient mix"),
    image: "/images/products/microfert-combi.jpg",
    basis: "W/W",
    packages: pk("kg", 1, 5),
    compositionTables: [
      {
        columns: [
          t("التركيبة", "Formula"),
          t("حديد", "Fe"),
          t("زنك", "Zn"),
          t("منغنيز", "Mn"),
          t("نحاس", "Cu"),
          t("مغنيسيوم", "Mg"),
          t("بورون", "B"),
          t("موليبدنيوم", "Mo"),
        ],
        rows: [
          [t("كومبي 1", "Combi 1"), "4%", "4%", "3%", "2%", "0.5%", "1.5%", "0.05%"],
          [t("كومبي 2", "Combi 2"), "4%", "2.5%", "1.5%", "1.5%", "5.0%", "—", "0.03%"],
          [t("كومبي 3", "Combi 3"), "9.3%", "0.2%", "2%", "0.15%", "2%", "0.4%", "0.1%"],
        ],
      },
    ],
    benefits: [
      t("خليط من العناصر الصغرى المخلبة على شكل EDTA وحامض الستريك.", "A mix of micronutrients chelated with EDTA and citric acid."),
      t(
        "سهل وسريع الامتصاص من قبل النبات، ويعالج بكفاءة المشاكل الناتجة عن نقص العناصر الصغرى.",
        "Easily and quickly absorbed by the plant, and efficiently treats problems caused by micronutrient deficiency.",
      ),
    ],
  },
  {
    number: 15,
    slug: "zinca-boro",
    category: "micronutrients",
    name: t("زنكابورو", "Zinca Boro"),
    image: "/images/products/zinca-boro.jpg",
    basis: "W/W",
    packages: pk("kg", 1, 5),
    composition: [
      row("زنك (Zn)", "Zinc (Zn)", "48 g/kg"),
      B2O3("145 g/kg"),
      row("فولفيك (Fulvic)", "Fulvic acid", "40 g/kg"),
      row("نيتروفينول", "Nitrophenol", "30 g/kg"),
      AA("40 g/kg"),
    ],
    benefits: [
      t("مركب حديث له دور كبير في حماية النباتات خصوصاً في فترة الجفاف.", "A modern compound that plays a major role in protecting plants, especially during drought."),
      t("ينشط مركب التربتوفان الذي ينتج IAA في فترة تفتح البراعم الزهرية وعقد الثمار.", "Activates tryptophan, which produces IAA during flower-bud opening and fruit set."),
      t("ينظم انتقال الماء داخل النبات ويمنع ظاهرة التقزم أو التورد.", "Regulates water movement within the plant and prevents stunting or rosetting."),
      t(
        "يزيد تخزين الزنك والبورون في البراعم الساكنة للموسم القادم ويحسن نقلهما داخل أنسجة النبات.",
        "Increases storage of zinc and boron in dormant buds for the next season and improves their movement within plant tissue.",
      ),
    ],
  },
  {
    number: 16,
    slug: "microfert-fe-eddha-6",
    category: "micronutrients",
    name: t("حديد ميكروفيرت مخلب EDDHA 6%", "Microfert Fe EDDHA 6%"),
    image: "/images/products/microfert-fe-eddha-6.jpg",
    basis: "W/W",
    packages: pk("kg", 1, 5),
    composition: [row("حديد مخلب EDDHA (Fe)", "EDDHA-chelated iron (Fe)", "6%")],
    benefits: [
      t(
        "يحتوي على عنصر الحديد بصورة مركزة متجانسة ومتوازنة لمعالجة النقص الظاهر، ويمنع ظهور أعراض النقص عند استخدامه حسب التعليمات.",
        "Contains iron in a concentrated, homogeneous and balanced form to treat visible deficiency, and prevents deficiency symptoms when used as directed.",
      ),
      t("سهل الامتصاص ويساهم في زيادة الإنتاج وتحسين نوعيته.", "Easily absorbed; helps increase yield and improve its quality."),
      t("يُستخدم بفاعلية في التربة القلوية والكلسية والجيرية.", "Effective in alkaline, calcareous and limestone soils."),
    ],
  },
  {
    number: 17,
    slug: "microfert-single-chelates",
    category: "micronutrients",
    name: t("ميكروفيرت عناصر", "Microfert Single Chelates"),
    image: "/images/products/microfert-single-chelates.jpg",
    basis: "W/W",
    packages: pk("kg", 1, 5),
    composition: [
      row("زنك مخلب (EDTA Zn)", "Chelated zinc (EDTA Zn)", "15%"),
      row("حديد مخلب (EDTA Fe)", "Chelated iron (EDTA Fe)", "13%"),
      row("نحاس مخلب (EDTA Cu)", "Chelated copper (EDTA Cu)", "15%"),
      row("منغنيز مخلب (EDTA Mn)", "Chelated manganese (EDTA Mn)", "13%"),
      row("كالسيوم مخلب (EDTA Ca)", "Chelated calcium (EDTA Ca)", "10%"),
      row("مغنيسيوم مخلب (EDTA Mg)", "Chelated magnesium (EDTA Mg)", "6%"),
    ],
    compositionNote: t("كل عنصر في عبوة مستقلة.", "Each element is supplied in a separate pack."),
    benefits: [
      t("أسمدة عالية الجودة مصنّعة من مواد نقية، كل عنصر في عبوة مستقلة.", "High-quality fertilizers made from pure materials, each element in its own pack."),
      t("مواد سريعة الامتصاص من قبل النبات مما يحقق الإفادة القصوى.", "Rapidly absorbed by the plant for maximum benefit."),
    ],
  },
  {
    number: 18,
    slug: "power-boron-b15",
    category: "micronutrients",
    name: t("باور بورون", "Power Boron B 15%"),
    image: "/images/products/power-boron-b15.jpg",
    packages: null,
    composition: [row("بورون (B)", "Boron (B)", "15%")],
    benefits: [
      t("سماد بورون مركّز بنسبة 15%.", "A concentrated 15% boron fertilizer."),
      t("البورون عنصر أساسي في عمليات الإزهار والتلقيح وعقد الثمار.", "Boron is essential for flowering, pollination and fruit set."),
    ],
  },

  // ───────────────────────── 06 · Calcium & Fruit-Set ─────────────────────────
  {
    number: 19,
    slug: "max-cal-bor",
    category: "calcium-fruit-set",
    name: t("ماكس كالبور 18 / 30", "Max Cal Bor 18 / 30"),
    image: "/images/products/max-cal-bor.jpg",
    basis: "W/W",
    packages: pk("kg", 1, 5),
    composition: [
      row("ماكس كالبور 30", "Max Cal Bor 30", "CaO 30% + B 1%"),
      row("ماكس كالبور 18", "Max Cal Bor 18", "CaO 18% + B 6%"),
    ],
    benefits: [
      t(
        "تركيبة غنية بعنصري الكالسيوم والبورون للتقليل من تنفيل الأزهار وتساقط الثمار وتحسين نوعيتها.",
        "A formulation rich in calcium and boron to reduce flower and fruit drop and improve fruit quality.",
      ),
      t("يُستخدم رشاً على الأوراق أو بإضافته للتربة.", "Used as a foliar spray or applied to the soil."),
      t("يدخل الكالسيوم في بناء الجدار الخلوي، ويقوم البورون بتثبيت الكالسيوم على جدار الخلية.", "Calcium builds the cell wall, and boron fixes calcium in the cell wall."),
    ],
  },
  {
    number: 20,
    slug: "microfert-cal",
    category: "calcium-fruit-set",
    name: t("ميكروفيرت كال", "Microfert Cal"),
    image: "/images/products/microfert-cal.jpg",
    basis: "W/V",
    packages: pk("L", 1, 5, 20),
    composition: [N("12%"), CaO("20%"), MgO("3%")],
    benefits: [
      t("يساهم في إنتاج ثمار ذات مواصفات عالية.", "Contributes to producing high-specification fruit."),
      t("يمنع تعفن مؤخرة الثمار وظهور التبقعات البنية على ثمار التفاح.", "Prevents blossom-end rot and brown spotting (bitter pit) on apples."),
      t("يمنع الاصفرار بين عروق الأوراق القديمة وظاهرة الثمرة الملتوية خاصة في الخيار.", "Prevents interveinal yellowing of older leaves and curved fruit, especially in cucumbers."),
      t("يمنع تساقط الأوراق من قاعدة النموات الحديثة.", "Prevents leaf drop from the base of new growth."),
    ],
  },
  {
    number: 21,
    slug: "microfert-cal-mag",
    category: "calcium-fruit-set",
    name: t("ميكروفيرت كال ماك", "Microfert Cal Mag"),
    image: "/images/products/microfert-cal-mag.jpg",
    basis: "W/V",
    packages: pk("L", 1, 5, 20),
    composition: [N("12%"), CaO("16%"), MgO("7.5%")],
    benefits: [
      t("يحتوي على منشطات للجذور ومركبات عضوية مخلبة للكالسيوم والمغنيسيوم.", "Contains root stimulants and organic compounds that chelate calcium and magnesium."),
      t(
        "يؤدي إلى تقسية الساق والأوراق وزيادة قدرة النبات على مقاومة الأمراض والظروف الجوية المتقلبة.",
        "Hardens stems and leaves and increases the plant's resistance to disease and changeable weather.",
      ),
      t(
        "فعّال جداً في الري المسمّد لأن الكالسيوم والمغنيسيوم بصورة سهلة الامتصاص ومستقرة في محلول الري.",
        "Very effective in fertigation because the calcium and magnesium are easily absorbed and stable in the irrigation solution.",
      ),
    ],
  },
  {
    number: 22,
    slug: "fruitium",
    category: "calcium-fruit-set",
    name: t("فروتيوم", "Fruitium"),
    image: "/images/products/fruitium.jpg",
    basis: "W/W",
    packages: pk("g", 100),
    composition: [N("4%"), row("موليبدنيوم (Mo)", "Molybdenum (Mo)", "3%"), P2O5("21%")],
    benefits: [
      t("مركب من عدة عناصر سمادية وعضوية تمتصه خلايا النبات بسرعة وسهولة.", "A compound of several fertilizer and organic elements that plant cells absorb quickly and easily."),
      t(
        "يزيد حفز هرمونات العقد الطبيعية عند رشه على الخضروات المحمية والمكشوفة في جميع الظروف.",
        "Boosts natural fruit-set hormones when sprayed on protected and open-field vegetables under all conditions.",
      ),
      t(
        "يتغلب على تأثير درجة الحرارة على نسبة العقد: يُرش شتاءً عند انخفاض الحرارة وصيفاً عند ارتفاعها.",
        "Overcomes the effect of temperature on fruit set: spray in winter when temperatures are low and in summer when they are high.",
      ),
    ],
  },

  // ───────────────────────── 07 · Smart Nutrition & Protection ─────────────────────────
  {
    number: 23,
    slug: "phosphogreen-zn",
    category: "smart-nutrition-protection",
    name: t("فوسفوجرين Zn", "Phosphogreen Zn"),
    subtitle: t("فسفونات الزنك", "Zinc phosphonate"),
    image: "/images/products/phosphogreen-zn.jpg",
    basis: "W/V",
    packages: pk("L", 1, 5),
    composition: [row("زنك (Zn)", "Zinc (Zn)", "40 g/L"), B2O3("10 g/L"), CaO("60 g/L"), P2O5("100 g/L")],
    benefits: [
      t("مركب حديث يحمي النبات ضد التقلبات الجوية خصوصاً في فترة الجفاف.", "A modern compound that protects plants against weather fluctuations, especially during drought."),
      t("ينشط مركب التربتوفان المنتج لهرمون IAA في فترة تفتح البراعم الزهرية وعقد الثمار.", "Activates tryptophan, which produces the hormone IAA, during flower-bud opening and fruit set."),
      t("ينظم انتقال الماء داخل النبات ويمنع ظاهرة التقزم أو التورد (Rosetting).", "Regulates water movement within the plant and prevents stunting or rosetting."),
    ],
  },
  {
    number: 24,
    slug: "phosphogreen-k",
    category: "smart-nutrition-protection",
    name: t("فوسفوجرين K", "Phosphogreen K"),
    subtitle: t("فسفونات البوتاس", "Potassium phosphonate"),
    image: "/images/products/phosphogreen-k.jpg",
    basis: "W/V",
    packages: pk("L", 1, 5),
    composition: [N("3%"), K2O("18%"), P2O5("27%")],
    benefits: [
      t(
        "سماد سائل غني بالفوسفور والبوتاس إضافة إلى النيتروجين والعناصر الصغرى المخلبة.",
        "A liquid fertilizer rich in phosphorus and potash, plus nitrogen and chelated micronutrients.",
      ),
      t("للوقاية من أمراض اللفحات والبياض الزغبي وفطريات التربة.", "For prevention of blights, downy mildew and soil-borne fungi."),
      t(
        "يحسن صفات الثمار من حيث اللون والطعم والشكل، ويزيد صلابتها وقابليتها للتخزين.",
        "Improves fruit colour, taste and shape, and increases firmness and storability.",
      ),
      t("وجود النيتروجين يزيد قدرة المنتج على امتصاص العناصر عن طريق الأوراق.", "Its nitrogen content increases the product's foliar nutrient uptake."),
    ],
  },
  {
    number: 25,
    slug: "phosphogreen-mg",
    category: "smart-nutrition-protection",
    name: t("فوسفوجرين Mg", "Phosphogreen Mg"),
    subtitle: t("فسفونات البوتاس والمغنيسيوم", "Potassium & magnesium phosphonate"),
    image: "/images/products/phosphogreen-mg.jpg",
    basis: "W/V",
    packages: pk("L", 1, 5),
    composition: [K2O("6%"), P2O5("19%"), MgO("6%")],
    benefits: [
      t("مخصب زراعي ومبيد بيوكيميائي في وقت واحد.", "An agricultural fertilizer and a biochemical protectant at the same time."),
      t("يزيد التوافق بين العناصر الغذائية (Synergetic)، فالمغنيسيوم يزيد امتصاص الفوسفور.", "Increases synergy between nutrients — magnesium increases phosphorus uptake."),
      t("يجمع المغنيسيوم والبوتاسيوم معاً بالرغم من خاصية التضاد (Antagonism) بينهما.", "Combines magnesium and potassium despite the antagonism between them."),
      t(
        "تزداد كفاءته وقت الإثمار حين تكون حاجة النبات للبوتاسيوم والمغنيسيوم في أعلى مستوياتها.",
        "Most efficient at fruiting, when the plant's need for potassium and magnesium is highest.",
      ),
    ],
  },
  {
    number: 26,
    slug: "phosphogreen-ca",
    category: "smart-nutrition-protection",
    name: t("فوسفوجرين Ca", "Phosphogreen Ca"),
    subtitle: t("فسفونات الكالسيوم", "Calcium phosphonate"),
    image: "/images/products/phosphogreen-ca.jpg",
    basis: "W/V",
    packages: pk("L", 1, 5),
    composition: [B2O3("3%"), CaO("6%"), P2O5("33%")],
    benefits: [
      t("تركيبة فريدة تجمع الكالسيوم والفوسفور بدون أي تضاد.", "A unique formulation combining calcium and phosphorus without antagonism."),
      t("مخصب زراعي ومبيد بيوكيميائي في وقت واحد.", "An agricultural fertilizer and a biochemical protectant at the same time."),
      t(
        "يوفر الكالسيوم والفوسفور معاً في الوقت الذي تكون حاجة النبات إليهما أكبر ما يمكن.",
        "Supplies calcium and phosphorus together when the plant needs them most.",
      ),
    ],
  },
  {
    number: 27,
    slug: "turbo",
    category: "smart-nutrition-protection",
    name: t("تيربو", "TURBO"),
    image: "/images/products/turbo.jpg",
    basis: "W/V",
    packages: pk("L", 1, 5),
    composition: [K2O("60%")],
    benefits: [
      t(
        "من المغذيات الحديثة في التغذية الورقية؛ ينشط النبات ويزيد النمو والإزهار وتثبيت العقد ويحسن نوعية الثمار.",
        "A modern foliar nutrient that activates the plant, increases growth, flowering and fruit set, and improves fruit quality.",
      ),
      t(
        "البوتاسيوم منشط للإنزيمات خلال عمليات التمثيل الضوئي وبناء السكريات والبروتينات.",
        "Potassium activates enzymes during photosynthesis and the synthesis of sugars and proteins.",
      ),
      t(
        "النبات المعامل بتيربو يصبح أقوى ومقاوماً للظروف الجوية القاسية ونقص المياه.",
        "Plants treated with TURBO become stronger and more resistant to harsh weather and water shortage.",
      ),
    ],
  },
  {
    number: 28,
    slug: "actival",
    category: "smart-nutrition-protection",
    name: t("أكتيفال", "ACTIVAL"),
    image: "/images/products/actival.jpg",
    basis: "W/V",
    packages: pk("L", 1, 5),
    composition: [N("25%"), K2O("25%"), P2O5("25%")],
    benefits: [
      t(
        "تكنولوجيا جديدة في التسميد الورقي لزيادة النمو والإزهار وتثبيت العقد وتحسين نوعية الثمار.",
        "New foliar-feeding technology to increase growth, flowering and fruit set and improve fruit quality.",
      ),
      t("يصلح لجميع مراحل النمو.", "Suitable for all growth stages."),
      t(
        "ذو أثر ملحي منخفض (Low Salt Index) مما يتيح الأمان حتى مع زيادة التركيز وفي الظروف الجوية المختلفة.",
        "Low salt index, keeping it safe even at higher concentrations and under different weather conditions.",
      ),
    ],
  },
  {
    number: 29,
    slug: "solo-k",
    category: "smart-nutrition-protection",
    name: t("سولو-ك", "SOLO-K"),
    image: "/images/products/solo-k.jpg",
    basis: "W/V",
    packages: pk("L", 1, 5),
    composition: [K2O("8%"), row("كبريت (S)", "Sulfur (S)", "75%")],
    benefits: [
      t(
        "كبريت بنسبة عالية في صورة محلول معلق سهل الذوبان ومتجانس، يعطي أفضل النتائج وتأثيراً سريعاً على الأمراض الفطرية.",
        "High-concentration sulfur in an easily dispersed, homogeneous suspension that gives the best results and a rapid effect on fungal diseases.",
      ),
      t(
        "ينتشر على أوراق النبات مكوّناً طبقة عازلة تمنع الفطريات من العيش على سطح الورقة.",
        "Spreads over the leaves, forming a barrier layer that prevents fungi from living on the leaf surface.",
      ),
      t(
        "يمنع هيفات الفطر من الدخول إلى أنسجة النبات، وخاصة فطريات البياض الدقيقي والزغبي.",
        "Prevents fungal hyphae from entering plant tissue, especially powdery and downy mildew fungi.",
      ),
    ],
  },
  {
    number: 30,
    slug: "corrector",
    category: "smart-nutrition-protection",
    name: t("كوركتر", "CORRECTOR"),
    image: "/images/products/corrector.jpg",
    basis: "W/V",
    packages: pk("L", 1, 5, 20),
    composition: [N("10%"), OM("20%")],
    benefits: [
      t("معدّل للحموضة ومُصلح للتربة.", "An acidity regulator and soil conditioner."),
      t(
        "يحرر العناصر المغذية المثبتة في التربة ويتيحها للامتصاص بخفض حموضة التربة والمياه.",
        "Releases nutrients locked in the soil and makes them available for uptake by lowering soil and water pH.",
      ),
      t("ينظف أنظمة الري ويفتح شبكاتها من الترسبات الكلسية والطحالب.", "Cleans irrigation systems and clears networks of lime deposits and algae."),
      t("يزيد كفاءة امتصاص العناصر المغذية من التربة والسماد.", "Increases the efficiency of nutrient uptake from soil and fertilizer."),
    ],
  },
  {
    number: 31,
    slug: "max-cuivre",
    category: "smart-nutrition-protection",
    name: t("ماكس كويفر", "MAX CUIVRE"),
    image: "/images/products/max-cuivre.jpg",
    basis: "W/W",
    packages: pk("kg", 1, 5),
    composition: [row("نحاس ثنائي الكربوكسيل (Cu)", "Copper dicarboxylate (Cu)", "91%")],
    benefits: [
      t("سماد نحاسي عضوي واسع التأثير.", "A broad-acting organic copper fertilizer."),
      t(
        "يحتوي على النحاس بالشكل العضوي بأعلى تركيز ممكن، مما ينعكس على نسب الاستخدام وكفاءة التأثير.",
        "Contains organic copper at the highest possible concentration, reflected in application rates and effectiveness.",
      ),
      t("النحاس بصيغة قابلة للامتصاص والنفاذ إلى الأوراق.", "Copper in a form that is absorbed by and penetrates the leaves."),
      t("من المركبات الآمنة ويمكن استخدامه ضمن برامج الزراعة العضوية.", "A safe compound that can be used in organic farming programmes."),
    ],
  },

  // ───────────────────────── 08 · Smart Organic Fertilizers ─────────────────────────
  {
    number: 32,
    slug: "nitrofert",
    category: "smart-organic",
    name: t("نيتروفيرت", "NITROFERT"),
    image: "/images/products/nitrofert.jpg",
    basis: "W/V",
    packages: pk("L", 1, 5),
    composition: [AA("5%"), OM("26%"), row("نيتروجين عضوي", "Organic nitrogen", "10%")],
    benefits: [
      t(
        "مغذٍ عضوي سائل غني بالمادة العضوية والأحماض الأمينية والنيتروجين العضوي من مصادرها الطبيعية.",
        "A liquid organic nutrient rich in organic matter, amino acids and organic nitrogen from natural sources.",
      ),
      t("يزيد مقاومة النبات للظروف الجوية ويشجع النمو خاصة مرحلة النمو الخضري.", "Increases resistance to weather conditions and encourages growth, especially vegetative growth."),
      t("يزيد إنتاجية وحدة المساحة ويعطي النباتات مظهراً صحياً يانعاً.", "Increases yield per unit area and gives plants a healthy, fresh appearance."),
      t("يمكن استعماله على كافة المحاصيل وفي جميع المراحل.", "Can be used on all crops and at all stages."),
    ],
  },
  {
    number: 33,
    slug: "orga-micro",
    category: "smart-organic",
    name: t("أورجا مايكرو", "ORGA MICRO"),
    image: "/images/products/orga-micro.jpg",
    basis: "W/V",
    packages: pk("L", 1, 5),
    composition: [row("نحاس (Cu)", "Copper (Cu)", "1.2%"), K2O("14.4%"), P2O5("14.4%")],
    benefits: [
      t(
        "سماد سائل يحتوي على الفسفور والنحاس والبوتاس والمادة العضوية، يجمع تأثير الفسفور المنشط لدفاعات النبات الطبيعية.",
        "A liquid fertilizer containing phosphorus, copper, potash and organic matter, combining the effect of phosphorus in activating the plant's natural defences.",
      ),
      t("يقلل النحاس انتشار العدوى بعمله كحاجز ضد اختراق المسببات المرضية.", "Copper reduces the spread of infection by acting as a barrier against pathogen penetration."),
      t("يزيد مخزون النبات من العناصر الغذائية مما يزيد مقاومته للأمراض.", "Increases the plant's nutrient reserves, raising its disease resistance."),
      t("يمكن إضافته خلال جميع مراحل النمو.", "Can be applied at all growth stages."),
    ],
  },
  {
    number: 34,
    slug: "microsept-liquide",
    category: "smart-organic",
    name: t("ميكروسات السائل", "MICROSEPT LIQUIDE"),
    image: "/images/products/microsept-liquide.jpg",
    basis: "W/V",
    packages: pk("L", 1, 5),
    composition: [row("حديد (Fe)", "Iron (Fe)", "7%"), N("8%"), AA("25%")],
    benefits: [
      t(
        "سماد يحتوي على النيتروجين والحديد إضافة إلى المواد العضوية والعناصر الغذائية من مصادرها الطبيعية.",
        "A fertilizer containing nitrogen and iron, plus organic matter and nutrients from natural sources.",
      ),
      t(
        "تقوم المواد العضوية بالتخليب الطبيعي للعناصر مما يضمن امتصاصها، فيحسّن النوعية ويزيد الإنتاج بشكل طبيعي وآمن.",
        "The organic matter naturally chelates the nutrients, ensuring their uptake and improving quality and yield naturally and safely.",
      ),
      t(
        "عالي الجودة ومصنّع من مواد نقية، سهل وسريع الامتصاص عن طريق الأوراق والجذور.",
        "High quality and made from pure materials; easily and quickly absorbed through leaves and roots.",
      ),
    ],
  },
  {
    number: 35,
    slug: "organocopper",
    category: "smart-organic",
    name: t("أورجانوكبر", "ORGANOCOPPER"),
    image: "/images/products/organocopper.jpg",
    basis: "W/V",
    packages: pk("L", 1, 5),
    composition: [row("نحاس كاربوكسيل مخلب (Cu)", "Chelated copper carboxylate (Cu)", "15%")],
    benefits: [
      t(
        "سماد سائل غني بالنحاس على الشكل العضوي كاربوكسيل، يوفر قدرة عالية على الامتصاص من خلال مسامات الأوراق.",
        "A liquid fertilizer rich in copper in organic carboxylate form, offering high absorption through leaf stomata.",
      ),
      t(
        "النحاس مغذٍ حيوي يقوي النبات ويجعله أكثر قدرة على تحمل الظروف البيئية غير المناسبة.",
        "Copper is a vital nutrient that strengthens the plant and helps it tolerate unfavourable environmental conditions.",
      ),
      t(
        "يحسّن تكوين الكلوروفيل وبناء البروتينات والفيتامينات ويزيد هرمونات النمو الطبيعية.",
        "Improves chlorophyll formation and the synthesis of proteins and vitamins, and increases natural growth hormones.",
      ),
    ],
  },
  {
    number: 36,
    slug: "organocopperfostyl-10",
    category: "smart-organic",
    name: t("أورجانوكبرفوستيل 10%", "ORGANOCOPPERFOSTYL 10%"),
    image: "/images/products/organocopperfostyl-10.jpg",
    basis: "W/V",
    packages: pk("L", 1),
    composition: [row("نحاس (Cu)", "Copper (Cu)", "10%"), P2O5("10%")],
    benefits: [
      t(
        "مركب فوسفونات النحاس المغلفة عضوياً، أكثر ثباتاً على سطح الأوراق وداخل التربة، وفعّال رشاً وفي الري الأرضي.",
        "An organically coated copper phosphonate, more persistent on leaf surfaces and in the soil; effective as a spray and through soil irrigation.",
      ),
      t(
        "له تأثير كبير على الأعفان والأنثراكنوز واللفحات والبيثيوم والفيرتسيليوم والفيوزاريوم والبياض الزغبي.",
        "Strong effect on rots, anthracnose, blights, Pythium, Verticillium, Fusarium and downy mildew.",
      ),
      t("قدرة عالية على تثبيط نمو وتكاثر الفطريات والبكتيريا.", "High ability to inhibit the growth and reproduction of fungi and bacteria."),
      t("يعالج بكفاءة عالية أعراض نقص النحاس والفوسفور.", "Efficiently treats copper and phosphorus deficiency symptoms."),
    ],
  },
  {
    number: 37,
    slug: "marina-x",
    category: "smart-organic",
    name: t("مارينا إكس", "MARINA X – Seaweed Extract"),
    subtitle: t("مستخلص الأعشاب البحرية", "Seaweed extract"),
    image: "/images/products/marina-x.jpg",
    basis: "W/V",
    packages: pk("L", 1, 5),
    composition: [N("2%"), K2O("3%"), P2O5("2%")],
    benefits: [
      t(
        "مخصب طبيعي مستخلص من العشبة البحرية (Ascophyllum) يحتوي على أكثر من 60 عنصراً من العناصر الكبرى والصغرى.",
        "A natural fertilizer extracted from seaweed (Ascophyllum) containing more than 60 macro- and micro-elements.",
      ),
      t("يحتوي على منظمات النمو الطبيعية والأحماض العضوية والسكريات.", "Contains natural growth regulators, organic acids and sugars."),
      t("يجعل النبات صحياً باستمرار ويقلل احتياجه للري والتسميد والمبيدات.", "Keeps plants consistently healthy and reduces their need for irrigation, fertilizers and pesticides."),
    ],
  },
  {
    number: 38,
    slug: "aminofert",
    category: "smart-organic",
    name: t("أمينوفيرت", "AMINOFERT"),
    subtitle: t("عناصر صغرى محملة على الأحماض الأمينية الحرة", "Micronutrients carried on free amino acids"),
    image: "/images/products/aminofert.jpg",
    basis: "W/V",
    packages: pk("L", 1, 5, 20),
    compositionTables: [
      {
        columns: [t("المنتج", "Product"), t("التركيب الكيميائي", "Chemical composition")],
        rows: [
          [t("أمينوفيرت كومبي", "Aminofert Combi"), "Fe 1.5%, Zn 1.6%, MgO 2.4%, B 0.5%, Mn 1%, Mo 0.1%, Amino Acid 12%"],
          [t("أمينوفيرت مايكرو", "Aminofert Micro"), "N 10%, P₂O₅ 5%, K₂O 8%, O.M 15%, Amino Acid 12%"],
          [t("أمينوفيرت نايترو", "Aminofert Nitro"), "N 1.5%, O.M 30%, Amino Acid 24%"],
          [t("أمينوفيرت حديد", "Aminofert Iron"), "N 6%, Fe 6%, Amino Acid 12%"],
          [t("أمينوفيرت مغنيسيوم", "Aminofert Magnesium"), "N 1.2%, MgO 6%, Amino Acid 12%"],
          [t("أمينوفيرت منغنيز", "Aminofert Manganese"), "N 1.2%, Zn 6%, Amino Acid 12%"],
        ],
      },
    ],
    benefits: [
      t(
        "للأحماض الأمينية أهمية في التمثيل الضوئي وتكوين البروتين والتنفس، وتزويد النبات بها يسرّع التفاعلات البيوكيميائية وينشط النمو ويوفر الطاقة.",
        "Amino acids are important in photosynthesis, protein formation and respiration; supplying them speeds up biochemical reactions, activates growth and saves the plant energy.",
      ),
      t(
        "تعمل الأحماض الأمينية كمخلب طبيعي للعناصر وتضمن كفاءتها وجاهزيتها للامتصاص عن طريق الأوراق.",
        "Amino acids act as a natural chelator, ensuring nutrient efficiency and availability for foliar uptake.",
      ),
    ],
  },
  {
    number: 39,
    slug: "biohume-fe-80",
    category: "smart-organic",
    name: t("بيوهيوم Fe 80%", "BIOHUME Fe 80%"),
    image: "/images/products/biohume-fe-80.jpg",
    basis: "W/W",
    packages: pk("kg", 1, 5),
    composition: [row("حديد (Fe)", "Iron (Fe)", "1%"), row("حامض الهيومك", "Humic acid", "80%")],
    benefits: [
      t("يحتوي على 80% مادة عضوية على شكل حامض الهيومك وحامض الفولفيك.", "Contains 80% organic matter in the form of humic and fulvic acids."),
      t("يُستعمل كمخصب عضوي طبيعي لكافة أنواع الترب وجميع المحاصيل.", "Used as a natural organic fertilizer for all soil types and all crops."),
      t("يزيد قدرة التربة على الاحتفاظ بالماء ويزيد خصوبتها وإنتاجيتها.", "Increases the soil's water-holding capacity, fertility and productivity."),
      t("يرفع نسبة إنبات البذور ويحسن نوعية الإنتاج ويزيد إنتاجية وحدة المساحة.", "Raises seed germination, improves produce quality and increases yield per unit area."),
    ],
  },
  {
    number: 40,
    slug: "bioextract",
    category: "smart-organic",
    name: t("بيواكستراكت", "BIOEXTRACT"),
    image: "/images/products/bioextract.jpg",
    basis: "W/W",
    packages: pk("kg", 1, 5),
    composition: [N("4%"), K2O("2%"), P2O5("2%")],
    benefits: [
      t("مسحوق مستخلص من الطحالب البحرية (Ascophyllum) كامل الذوبان.", "A fully soluble powder extracted from seaweed (Ascophyllum)."),
      t(
        "يحتوي على منظمات النمو والبروتينات والأحماض الأمينية والكربوهيدرات والفيتامينات والسايتوكاينين والأوكسينات والألجينك أسيد والجبريللين.",
        "Contains growth regulators, proteins, amino acids, carbohydrates, vitamins, cytokinins, auxins, alginic acid and gibberellins.",
      ),
      t("محفّز لنمو وتطور الأفرع والسيقان والجذور.", "Stimulates the growth and development of branches, stems and roots."),
      t("يزيد مقاومة المحصول للظروف الجوية الصعبة ويقلل من تأثير الإجهاد.", "Increases crop resistance to difficult weather and reduces the effect of stress."),
    ],
  },
  {
    number: 41,
    slug: "biofert-powder",
    category: "smart-organic",
    name: t("بيوفيرت بودرة", "BIOFERT Powder"),
    image: "/images/products/biofert-powder.jpg",
    basis: "W/W",
    packages: pk("kg", 1, 5),
    composition: [row("أحماض الهيومك والفولفيك", "Humic and fulvic acids", "85%")],
    benefits: [
      t("أحماض عضوية بودرة كاملة الذوبان بالماء.", "Organic acids in a fully water-soluble powder."),
      t("تزيد قدرة التربة على الاحتفاظ بالماء وتزيد خصوبتها وإنتاجيتها.", "Increase the soil's water-holding capacity, fertility and productivity."),
      t("تفكك الترب الثقيلة وتساعد في تماسك الترب الرملية وتزيد نمو الجذور.", "Loosen heavy soils, help bind sandy soils and increase root growth."),
      t("تحرر العناصر المثبتة في التربة مما يقلل الحاجة إلى الأسمدة الكيماوية.", "Release nutrients locked in the soil, reducing the need for chemical fertilizers."),
    ],
  },
  {
    number: 42,
    slug: "biofert-liquid",
    category: "smart-organic",
    name: t("بيوفيرت السائل", "BIOFERT Liquid"),
    subtitle: t("مخصب عضوي طبيعي", "Natural organic fertilizer"),
    image: "/images/products/biofert-liquid.jpg",
    basis: "W/V",
    packages: pk("L", 1, 5, 20),
    composition: [row("حامض الفولفيك", "Fulvic acid", "3%"), row("حامض الهيومك", "Humic acid", "12%")],
    benefits: [
      t("يحث النبات على تكوين وتطوير نظامه الجذري بسرعة.", "Stimulates the plant to form and develop its root system quickly."),
      t("يزيد سرعة التبادل الأيوني مما يزيد قدرة الجذور على امتصاص العناصر.", "Increases the rate of ion exchange, improving the roots' ability to absorb nutrients."),
      t("يساعد على مقاومة النبات للظروف الجوية والآفات والأمراض.", "Helps the plant resist weather conditions, pests and diseases."),
      t("معادل لدرجة حموضة التربة (pH)، يحد من تأثير الأملاح ويحرر العناصر المثبتة.", "Balances soil pH, limits the effect of salts and releases locked-up nutrients."),
    ],
  },
  {
    number: 43,
    slug: "fortal-organic-3-14-3",
    category: "smart-organic",
    name: t("فورتال العضوي 3-14-3", "FORTAL ORGANIC 3-14-3"),
    subtitle: t("سماد عضوي معدني محبب", "Granular organo-mineral fertilizer"),
    image: "/images/products/fortal-organic-3-14-3.jpg",
    basis: "W/W",
    formulation: "3-14-3",
    packages: pk("kg", 25),
    composition: [N("3%"), P2O5("14%"), K2O("3%"), row("حامض الهيومك", "Humic acid", "5%"), CaO("6%"), OM("35%")],
    benefits: [
      t(
        "سماد محبب غني بالعناصر المخلبة على المركبات العضوية، بنسبة عالية من الفسفور بصورتين بطيئة وسريعة التحلل.",
        "A granular fertilizer rich in nutrients chelated on organic compounds, with a high phosphorus content in both slow- and fast-release forms.",
      ),
      t(
        "يحتوي على الأحياء الدقيقة النافعة وحامض الدوبال التي تزيد الإفادة من الأسمدة المعدنية.",
        "Contains beneficial micro-organisms and humic (dubal) acid, which increase the benefit from mineral fertilizers.",
      ),
      t(
        "لا يؤدي تكرار إضافته إلى نشوء مركبات غير مرغوبة لتوازن محتواه المعدني والعضوي.",
        "Repeated application does not create undesirable compounds, thanks to its balanced mineral and organic content.",
      ),
    ],
  },
  {
    number: 44,
    slug: "elbarak",
    category: "smart-organic",
    name: t("البرق", "ELBARAK"),
    image: "/images/products/elbarak.jpg",
    basis: "W/V",
    packages: pk("L", 1, 5),
    composition: [B2O3("0.5%"), N("3.5%"), K2O("13%"), row("موليبدنيوم (Mo)", "Molybdenum (Mo)", "0.2%"), OM("30%")],
    benefits: [
      t("تركيبة مميزة تحتوي على مستخلصات ومحفزات نمو طبيعية.", "A distinctive formulation containing natural extracts and growth stimulants."),
      t(
        "تحتوي على المادة العضوية والنيتروجين العضوي والبوتاس المهم في الإثمار وزيادة الإنتاجية وتحسين نوع الثمار ولونها.",
        "Contains organic matter, organic nitrogen and potash — important for fruiting, higher yield and better fruit quality and colour.",
      ),
      t("تحمي النبات ضد التقلبات الجوية وتزيد مقاومته للأمراض المختلفة.", "Protects the plant against weather fluctuations and increases resistance to various diseases."),
    ],
  },
  {
    number: 45,
    slug: "organobro-5-15-5",
    category: "smart-organic",
    name: t("أورجانوبرو 5-15-5", "ORGANOBRO 5-15-5"),
    subtitle: t("مسحوق عضوي معدني", "Organo-mineral powder"),
    image: "/images/products/organobro-5-15-5.jpg",
    basis: "W/W",
    formulation: "5-15-5",
    packages: pk("kg", 25),
    composition: [row("N-P-K", "N-P-K", "5-15-5"), row("حامض الهيومك", "Humic acid", "6%")],
    benefits: [
      t("سماد غني بالعناصر المخلبة على المركبات العضوية.", "A fertilizer rich in nutrients chelated on organic compounds."),
      t("نسبة عالية من المادة العضوية بصورتين بطيئة وسريعة التحلل.", "A high organic-matter content in both slow- and fast-release forms."),
      t(
        "يحتوي على الأحياء الدقيقة النافعة ونسبة عالية من حامض الدوبال المخصب بالعناصر المغذية.",
        "Contains beneficial micro-organisms and a high level of nutrient-enriched humic (dubal) acid.",
      ),
      t("تم تخليب العناصر المعدنية بطريقة عضوية ومن مصادر عضوية بالكامل.", "Mineral nutrients are chelated organically, from entirely organic sources."),
    ],
  },
  {
    number: 46,
    slug: "anti-sal",
    category: "smart-organic",
    name: t("أنتي صال", "ANTI-SAL"),
    image: "/images/products/anti-sal.jpg",
    basis: "W/V",
    packages: pk("L", 1, 5),
    composition: [CaO("10%"), OM("30%")],
    benefits: [
      t(
        "فعّال في معالجة تراكم الأملاح السامة في التربة مثل أملاح الصوديوم والكلور، ويقلل ملوحة مياه الري.",
        "Effective in treating the build-up of toxic salts in the soil, such as sodium and chloride salts, and reduces irrigation-water salinity.",
      ),
      t("يطرد أملاح التربة ويتخلص منها.", "Displaces and removes soil salts."),
      t(
        "يخفف أثر الملوحة على الجذور بتقليل الضغط الأسموزي ويحسن امتصاص العناصر الغذائية.",
        "Eases the effect of salinity on roots by reducing osmotic pressure, and improves nutrient uptake.",
      ),
      t("يحسن الخواص الفيزيائية للتربة ويزيد فعالية الكائنات الدقيقة فيها.", "Improves the soil's physical properties and increases the activity of soil micro-organisms."),
    ],
  },

  // ───────────────────────── 09 · Plant Growth Regulators ─────────────────────────
  {
    number: 47,
    slug: "fertil-floral",
    category: "growth-regulators",
    name: t("فرتل فلورل", "FERTIL FLORAL (4CPA + BNOA)"),
    image: "/images/products/fertil-floral.jpg",
    packages: pk("ml", 100),
    composition: [
      row("4-CPA", "4-CPA", "Para Chloro Phenoxy Acetic Acid"),
      row("BNOA", "BNOA", "Beta Naphthyloxy Acetic Acid"),
    ],
    benefits: [t("منظم عقد ثمار البندورة والباذنجان والفلفل.", "A fruit-set regulator for tomato, eggplant and pepper.")],
  },
  {
    number: 48,
    slug: "beta-hour",
    category: "growth-regulators",
    name: t("بيتا هور", "BETA HOUR (BNOA)"),
    image: "/images/products/beta-hour.jpg",
    packages: pk("ml", 100),
    composition: [row("Beta Naphthyloxy Acetic Acid (BNOA)", "Beta Naphthyloxy Acetic Acid (BNOA)", "50 g/L")],
    benefits: [
      t("منظم عقد نباتي للظروف الحرجة والقاسية.", "A plant fruit-set regulator for critical and harsh conditions."),
      t(
        "يُستعمل لزيادة عقد ثمار البندورة والباذنجان والفلفل والكوسا داخل البيوت البلاستيكية وخارجها.",
        "Used to increase fruit set of tomato, eggplant, pepper and squash inside and outside plastic greenhouses.",
      ),
    ],
  },
  {
    number: 49,
    slug: "cipa-hour",
    category: "growth-regulators",
    name: t("سيبا هور", "CIPA HOUR (4-CPA)"),
    image: "/images/products/cipa-hour.jpg",
    packages: pk("ml", 100),
    composition: [row("Para Chloro Phenoxyacetic Acid", "Para Chloro Phenoxyacetic Acid", "7 g/L")],
    benefits: [
      t(
        "منظم حيوي نباتي يُستخدم لعقد ثمار العائلة الباذنجانية (البندورة، الباذنجان، الفلفل).",
        "A plant bio-regulator used for fruit set in the nightshade family (tomato, eggplant, pepper).",
      ),
      t("يُستخدم عند درجات الحرارة المنخفضة.", "Used at low temperatures."),
    ],
  },
  {
    number: 50,
    slug: "gibberelyine-ga3",
    category: "growth-regulators",
    name: t("جبرلين", "GIBBERELYINE (GA3)"),
    image: "/images/products/gibberelyine-ga3.jpg",
    packages: pk("ml", 100),
    composition: [row("Gibberellic Acid (GA3)", "Gibberellic Acid (GA3)", "20 g/L")],
    benefits: [
      t(
        "محمول بصورة عضوية فعالة يعمل على زيادة استطالة الخلايا، ولكسر طور السكون في البطاطا.",
        "Carried in an effective organic form; increases cell elongation and breaks dormancy in potatoes.",
      ),
      t("لتكبير حجم الثمار في العنب والحمضيات، وخاصة العنب عديم البذور والموز.", "Increases fruit size in grapes and citrus, especially seedless grapes, and bananas."),
      t("يزيد من استطالة الساق لنباتات الزينة.", "Increases stem elongation in ornamental plants."),
      t("له أثر واضح في زيادة عقد الأزهار في أشجار الحمضيات.", "Has a clear effect on increasing flower set in citrus trees."),
    ],
  },
  {
    number: 51,
    slug: "endolin-iba",
    category: "growth-regulators",
    name: t("إندولين", "ENDOLIN (IBA)"),
    image: "/images/products/endolin-iba.jpg",
    packages: pk("ml", 100),
    composition: [row("Liquid Indole-3-Butyric Acid (IBA)", "Liquid Indole-3-Butyric Acid (IBA)", "10 g/L")],
    benefits: [
      t(
        "منظم نمو نباتي لتشجيع العقل الساقية على التجذير، محمول بصورة عضوية سائلة تعطي ضماناً للنتائج.",
        "A plant growth regulator that encourages stem cuttings to root, carried in a liquid organic form for reliable results.",
      ),
      t("يُستخدم لجميع أنواع العقل الغضة والصلبة.", "Used for all types of softwood and hardwood cuttings."),
    ],
    rates: {
      columns: [t("نوع العقل", "Cutting type"), t("نسبة التخفيف", "Dilution")],
      rows: [
        [t("العقل الطرية", "Soft cuttings"), t("جزء واحد من إندولين + 10 أجزاء ماء", "1 part Endolin + 10 parts water")],
        [t("العقل المتوسطة", "Semi-hard cuttings"), t("جزء واحد من إندولين + 5 أجزاء ماء", "1 part Endolin + 5 parts water")],
        [t("العقل الخشنة", "Hard cuttings"), t("جزء واحد من إندولين + جزءان ماء", "1 part Endolin + 2 parts water")],
      ],
    },
  },

  // ───────────────────────── 10 · Eco-Friendly Organic Protection ─────────────────────────
  {
    number: 52,
    slug: "bioact-1",
    category: "organic-protection",
    name: t("بيوأكت (1)", "BIOACT (1)"),
    image: "/images/products/bioact-1.jpg",
    basis: "W/V",
    packages: pk("ml", 250),
    composition: [N("5%"), K2O("5%"), P2O5("2%"), OM("25%")],
    benefits: [
      t("تكنولوجيا حديثة من المستخلصات النباتية للتغذية والوقاية في آن واحد.", "Modern plant-extract technology for nutrition and protection at the same time."),
      t("ملائم للزراعات العضوية وأنظمة الزراعة المستدامة، ويُستخدم في برامج IPM.", "Suitable for organic and sustainable farming systems, and used in IPM programmes."),
      t("مستخلص نباتي له تأثير على العناكب والديدان وصانعات الأنفاق.", "A plant extract with an effect on mites, worms and leaf miners."),
    ],
  },
  {
    number: 53,
    slug: "bioact-2",
    category: "organic-protection",
    name: t("بيوأكت (2)", "BIOACT (2)"),
    image: "/images/products/bioact-2.jpg",
    basis: "W/V",
    packages: pk("ml", 250),
    composition: [N("6%"), K2O("3%"), P2O5("2%"), OM("25%")],
    benefits: [
      t("تكنولوجيا حديثة من المستخلصات النباتية للتغذية والوقاية في آن واحد.", "Modern plant-extract technology for nutrition and protection at the same time."),
      t("ملائم للزراعات العضوية وأنظمة الزراعة المستدامة، ويُستخدم في برامج IPM.", "Suitable for organic and sustainable farming systems, and used in IPM programmes."),
      t("له تأثير على المنّ والتربس والذبابة البيضاء، ولا يؤثر على عقد الأزهار.", "Effective on aphids, thrips and whitefly, without affecting flower set."),
    ],
  },
  {
    number: 54,
    slug: "nemaguard",
    category: "organic-protection",
    name: t("نيماجارد", "NEMAGUARD"),
    image: "/images/products/nemaguard.jpg",
    basis: "W/V",
    packages: [...pk("ml", 250), ...pk("L", 1)],
    composition: [N("2.5%"), row("بوتاس", "Potash", "2.5%"), OM("25%")],
    benefits: [
      t(
        "يُستخدم في برامج التسميد الورقي لاحتوائه على النيتروجين والبوتاس ومنظمات نمو من مصدر طبيعي نباتي، ويزيد نفاذية الرطوبة في الأوراق ويحافظ عليها.",
        "Used in foliar feeding programmes as it contains nitrogen, potash and growth regulators of natural plant origin; increases and maintains moisture permeability in leaves.",
      ),
      t(
        "زيت نباتي مستخلص من أشجار النيم يحتوي على مادة الأزادراكتين والنيمبين والسالانين.",
        "A plant oil extracted from neem trees, containing azadirachtin, nimbin and salannin.",
      ),
      t("يُستخدم في الزراعات العضوية، ومجاز من هيئة الزراعة العضوية OMRI.", "Used in organic farming; listed by the organic-farming body OMRI."),
    ],
  },
  {
    number: 55,
    slug: "micro-stick",
    category: "organic-protection",
    name: t("ميكروستيك", "MICRO STICK"),
    image: "/images/products/micro-stick.jpg",
    basis: "W/V",
    packages: pk("L", 1),
    composition: [row("نيتروجين بوليمري (Polymer Nitrogen)", "Polymer nitrogen", "100 g/L")],
    benefits: [
      t(
        "مادة عضوية مستحلبة (EC) ناشرة ولاصقة ومغذية، تعمل على ترطيب الأسطح النباتية المعالجة.",
        "An emulsifiable (EC) organic spreader, sticker and nutrient that wets treated plant surfaces.",
      ),
      t(
        "ذات قدرة توافقية عالية (Synergist) مع معظم المواد التي ترش على المجموع الخضري، خاصة المبيدات والأسمدة الورقية.",
        "Highly synergistic with most products sprayed on foliage, especially pesticides and foliar fertilizers.",
      ),
      t(
        "تحتوي على نيتروجين بطيء التحلل (Slow release) مما يكسب المبيدات فترة أطول من التأثير.",
        "Contains slow-release nitrogen, giving pesticides a longer period of effect.",
      ),
    ],
  },

  // ───────────────────────── 11 · Pesticides ─────────────────────────
  {
    number: 56,
    slug: "agrocel-44-ec",
    category: "pesticides",
    name: t("أجروسيل 44% إي سي", "AGROCEL 44% EC"),
    image: "/images/products/agrocel-44-ec.jpg",
    basis: "EC",
    packages: pk("L", 1),
    pesticide: true,
    composition: [
      row("بروفينوفوس (Profenofos)", "Profenofos", "40% (400 g/L)"),
      row("سايبرمثرين (Cypermethrin)", "Cypermethrin", "4% (40 g/L)"),
    ],
    benefits: [
      t(
        "مبيد حشري مستحلب خليط لمكافحة الديدان وجميع أنواع الحشرات القارضة والماصة.",
        "A mixed emulsifiable insecticide for controlling worms and all types of chewing and sucking insects.",
      ),
      t("المنتج مصنف «سام»: يُستخدم وفق تعليمات الملصق فقط.", "The product is classified as \"toxic\": use only according to the label instructions."),
    ],
  },
  {
    number: 57,
    slug: "agromethrin-10-ec",
    category: "pesticides",
    name: t("أكروميثرين 10% إي سي", "AGROMETHRIN 10% EC"),
    image: "/images/products/agromethrin-10-ec.jpg",
    basis: "EC",
    packages: pk("ml", 100),
    pesticide: true,
    composition: [row("سايبرمثرين (Cypermethrin)", "Cypermethrin", "10% EC")],
    benefits: [
      t("مبيد حشري (Insecticide).", "Insecticide."),
      t("رقم التسجيل: 1678 — بلد المنشأ: الهند.", "Registration number: 1678 — Country of origin: India."),
    ],
  },
  {
    number: 58,
    slug: "saadsate-36-sl",
    category: "pesticides",
    name: t("سعد سيت 36% إس إل", "SAADSATE 36% SL"),
    image: "/images/products/saadsate-36-sl.jpg",
    basis: "SL",
    packages: pk("L", 1, 20),
    pesticide: true,
    composition: [row("غليفوسات (Glyphosate)", "Glyphosate", "36% SL")],
    benefits: [
      t("مبيد حشائش جهازي غير اختياري (مركز قابل للذوبان).", "A systemic, non-selective herbicide (soluble concentrate)."),
      t("لمكافحة الحشائش الحولية والمعمرة رفيعة وعريضة الأوراق.", "Controls annual and perennial narrow-leaf and broad-leaf weeds."),
      t("درجة السمية: III.", "Toxicity class: III."),
    ],
  },
  {
    number: 59,
    slug: "agrogoal-24-ec",
    category: "pesticides",
    name: t("أجروقول 24% إي سي", "AGROGOAL 24% EC"),
    image: "/images/products/agrogoal-24-ec.jpg",
    basis: "EC",
    packages: pk("L", 1),
    pesticide: true,
    composition: [row("أوكسيفلورفين (Oxyfluorfen)", "Oxyfluorfen", "24% EC")],
    benefits: [
      t(
        "مبيد حشائش لمكافحة الحشائش الحولية عريضة الأوراق ومعظم الحشائش النجيلية الحولية.",
        "A herbicide for controlling annual broad-leaf weeds and most annual grass weeds.",
      ),
      t("يُستخدم في البصل والثوم والقطن، قبل الإنبات وبعده.", "Used in onion, garlic and cotton, pre- and post-emergence."),
    ],
  },
];

export const productBySlug = new Map(products.map((p) => [p.slug, p]));

export function getProduct(slug: string): Product | undefined {
  return productBySlug.get(slug);
}

/** Products whose primary group is `id` (matches the counts printed in the catalog). */
export function productsInCategory(id: Product["category"]): Product[] {
  return products.filter((p) => p.category === id);
}

/** Products the catalog cross-lists under `id` although their primary group is another one. */
export function crossListedIn(id: Product["category"]): Product[] {
  return products.filter((p) => p.alsoIn?.includes(id));
}
