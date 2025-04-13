// API configuration
export const API_URL = "https://api.qafiyah.com"
export const FETCH_PER_PAGE = 30
export const MAX_URLS_PER_SITEMAP = 1000

// Environment
export const isDev = process.env.NODE_ENV === "development"

// Site information
export const DOMAIN = "qafiyah.com"
export const SITE_NAME = "قافية"
export const SITE_URL = `https://${DOMAIN}`
export const TWITTER_HANDLE = "@qafiyahdotcom"

// Default metadata
export const defaultMetadata = {
  title: "قافية | موسوعة الشعر العربي",
  description: "موقع يُعنى بجمع الشعر العربي وحفظه وتيسير الوصول إليه",
  keywords: "شعر، شعر عربي، قصائد، غزل، معلقات، شعر جاهلي، شعر حديث، قافية، ديوان العرب، أدب، قصائد مشهورة، شعر نبطي",
  openGraphUrl: `${SITE_URL}/opengraph.png`,
  poetName: "قافية",
  author: "قافية",
  articleSection: "شعر",
}

// UI constants
export const responsiveIconSize = "w-4 h-4 xxs:w-8 xss:h-8"

// Data constants
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
]

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
]

// Navigation links
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
]
