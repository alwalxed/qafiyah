export const ERAS_SORT_ORDER = [
  "جاهلي",
  "مخضرم",
  "إسلامي",
  "أموي",
  "عباسي",
  "أندلسي",
  "أيوبي",
  "مملوكي",
  "عثماني",
  "متأخر",
];

export const FORMAL_METERS = [
  "الطويل",
  "المديد",
  "البسيط",
  "الوافر",
  "الكامل",
  "الهزج",
  "الرجز",
  "الرمل",
  "السريع",
  "المنسرح",
  "الخفيف",
  "المضارع",
  "المقتضب",
  "المجتث",
  "المتقارب",
  "المتدارك",
];

export const ARABIC_LETTERS_MAP = new Map<string, string[]>([
  ["ألف", ["ا", "أ", "إ", "آ", "ء", "الف", "ألف", "الالف", "الألف"]],
  ["باء", ["ب", "باء", "الباء"]],
  ["تاء", ["ت", "ة", "تاء", "التاء"]],
  ["ثاء", ["ث", "ثاء", "الثاء"]],
  ["جيم", ["ج", "جيم", "الجيم"]],
  ["حاء", ["ح", "حاء", "الحاء"]],
  ["خاء", ["خ", "خاء", "الخاء"]],
  ["دال", ["د", "دال", "الدال"]],
  ["ذال", ["ذ", "ذال", "الذال"]],
  ["راء", ["ر", "راء", "الراء"]],
  ["زاي", ["ز", "زاي", "الزاي", "زاى"]],
  ["سين", ["س", "سين", "السين"]],
  ["شين", ["ش", "شين", "الشين"]],
  ["صاد", ["ص", "صاد", "الصاد"]],
  ["ضاد", ["ض", "ضاد", "الضاد"]],
  ["طاء", ["ط", "طاء", "الطاء"]],
  ["ظاء", ["ظ", "ظاء", "الظاء"]],
  ["عين", ["ع", "عين", "العين"]],
  ["غين", ["غ", "غين", "الغين"]],
  ["فاء", ["ف", "فاء", "الفاء"]],
  ["قاف", ["ق", "قاف", "القاف"]],
  ["كاف", ["ك", "كاف", "الكاف"]],
  ["لام", ["ل", "لام", "اللام"]],
  ["ميم", ["م", "ميم", "الميم"]],
  ["نون", ["ن", "نون", "النون"]],
  ["هاء", ["ه", "هاء", "الهاء"]],
  ["واو", ["و", "ؤ", "واو", "الواو"]],
  ["ياء", ["ي", "ى", "ئ", "ياء", "الياء"]],
]);

export const FETCH_PER_PAGE = 30;
export const MAX_URLS_PER_SITEMAP = 1000;
export const MAX_EXCERPT_LENGTH = 280;

export const DOMAIN = "qafiyah.com";
export const SITE_NAME = "قافية";
export const SITE_URL = `https://${DOMAIN}`;
export const API_URL = `https://api.${DOMAIN}`;
export const TWITTER_HANDLE = "@qafiyahdotcom";

export const defaultMetadata = {
  title: "قافية | موسوعة الشعر العربي",
  description: "موقع يُعنى بجمع الشعر العربي وحفظه وتيسير الوصول إليه",
  keywords:
    "شعر، شعر عربي، قصائد، غزل، معلقات، شعر جاهلي، شعر حديث، قافية، ديوان العرب، أدب، قصائد مشهورة، شعر نبطي",
  openGraphUrl: `${SITE_URL}/open-graph-white.png`,
  poetName: "قافية",
  author: "قافية",
  articleSection: "شعر",
};

export const NAV_LINKS = [
  {
    name: "التواصل",
    href: `https://x.com/${TWITTER_HANDLE}`,
    external: true,
  },
  { name: "المواضيع", href: "/themes", external: false },
  { name: "القوافي", href: "/rhymes", external: false },
  { name: "البحور", href: "/meters", external: false },
  { name: "العصور", href: "/eras", external: false },
  { name: "الشعراء", href: "/poets/page/1", external: false },
  { name: "الرئيسة", href: "/", external: false },
];

export const FALLBACK_RANDOM_POEM_LINES = `تُضحي إِذا دَقَّ المَطِيُّ كَأَنَّها\nفَدَنُ اِبنِ حَيَّةَ شادَهُ بِالآجُرِ\n\nثعلبة المازني`;

export const FALLBACK_RANDOM_POEM_SLUG = "eabca780-811f-4ea4-949e-21df6efba15d";
