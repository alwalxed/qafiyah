import { toArabicDigits } from 'to-arabic-digits';

// ------------------------------------->
export const FETCH_PER_PAGE = 10;
export const MAX_URLS_PER_SITEMAP = 1000;
// ------------------------------------->

// ------------------------------------->
export const isDev = process.env.NODE_ENV === 'development';
// ------------------------------------->

// ------------------------------------->
export const SITE_NAME = 'موقع قافية';
export const DOMAIN = 'qafiyah.com';
export const API_URL = isDev ? 'http://localhost:8787' : `https://api.${DOMAIN}`;
export const SITE_URL = isDev ? 'http://localhost:3000' : `https://${DOMAIN}`;
export const TWITTER_HANDLE = '@qafiyahdotcom';
export const TWITTER_ID = '1570116567538475010';
export const TWITTER_URL = `https://x.com/${TWITTER_HANDLE}`;
export const GITHUB_REPO_URL = `https://github.com/alwalxed/qafiyah`;
export const DATABASE_DUMPS_URL = 'https://github.com/alwalxed/qafiyah/tree/main/.db_dumps';
export const DB_DUMPS_URL = `https://github.com/alwalxed/qafiyah/tree/main/.db_dumps`;
export const DEVELOPER_SITE_URL = `https://alwalxed.com`;
export const DEVELOPER_TWITTER_URL = `https://x.com/alwalxed`;
export const DEVELOPER_INSTAGRAM_URL = `https://instagram.com/alwalexd`;
export const DEVELOPER_GITHUB_URL = `https://github.com/alwalxed`;
// ------------------------------------->

// ------------------------------------->
export const responsiveIconSize = 'w-5 h-5 xxs:w-6 xxs:h-6 md:w-8 md:h-8';
// ------------------------------------->

// ------------------------------------->
export const NOT_FOUND_CODE = toArabicDigits(404);
export const NOT_FOUND_MESSAGE = 'الصفحة غير موجودة';
export const NOT_FOUND_TITLE = `${NOT_FOUND_CODE} | ${NOT_FOUND_MESSAGE}`;
// ------------------------------------->
