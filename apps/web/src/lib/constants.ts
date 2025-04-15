import { toArabicDigits } from './utils';

// API configuration
export const FETCH_PER_PAGE = 30;
export const MAX_URLS_PER_SITEMAP = 1000;

// Environment
export const isDev = process.env.NODE_ENV === 'development';

export const API_URL = isDev ? 'http://localhost:8787' : 'https://api.qafiyah.com';
// Site information
export const DOMAIN = 'qafiyah.com';
export const SITE_NAME = 'قافية';
export const SITE_URL = `https://${DOMAIN}`;
export const TWITTER_HANDLE = '@qafiyahdotcom';

// Default metadata
export const defaultMetadata = {
  title: 'قافية | مرجع الشعر العربي',
  description: 'موقع غير ربحي مفتوح المصدر يُعنى بجمع الشعر العربي وحفظه وتيسير الوصول إليه',
  keywords:
    'شعر، شعر عربي، قصائد، غزل، معلقات، شعر جاهلي، شعر حديث، قافية، ديوان العرب، أدب، قصائد مشهورة، شعر نبطي',
  openGraphUrl: `${SITE_URL}/opengraph.png`,
  poetName: 'قافية',
  author: 'قافية',
  articleSection: 'شعر',
};

// UI constants
export const responsiveIconSize = 'size-4 xxs:size-5 md:size-6 lg:size-8';

// Data constants
export const ERAS_SORT_ORDER = [
  'جاهلي',
  'مخضرم',
  'إسلامي',
  'أموي',
  'عباسي',
  'أندلسي',
  'أيوبي',
  'مملوكي',
  'عثماني',
  'متأخر',
];

export const FORMAL_METERS = [
  'الطويل',
  'المديد',
  'البسيط',
  'الوافر',
  'الكامل',
  'الهزج',
  'الرجز',
  'الرمل',
  'السريع',
  'المنسرح',
  'الخفيف',
  'المضارع',
  'المقتضب',
  'المجتث',
  'المتقارب',
  'المتدارك',
];

// Navigation links
export const NAV_LINKS = [
  {
    name: 'التواصل',
    href: `https://x.com/${TWITTER_HANDLE}`,
    external: true,
  },
  { name: 'المواضيع', href: '/themes', external: false },
  { name: 'القوافي', href: '/rhymes', external: false },
  { name: 'البحور', href: '/meters', external: false },
  { name: 'العصور', href: '/eras', external: false },
  { name: 'الشعراء', href: '/poets/page/1', external: false },
  { name: 'الرئيسة', href: '/', external: false },
];

const NOT_FOUND_CODE = toArabicDigits(404);
const NOT_FOUND_MESSAGE = 'الصفحة غير موجودة';
export const NOT_FOUND_TITLE = `${NOT_FOUND_CODE} | ${NOT_FOUND_MESSAGE}`;
