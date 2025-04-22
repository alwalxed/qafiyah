import { toArabicDigits } from 'to-arabic-digits';

// ------------------------------------->
export const FETCH_PER_PAGE = 10;
export const MAX_URLS_PER_SITEMAP = 1000;
// ------------------------------------->

// ------------------------------------->
export const isDev = process.env.NODE_ENV === 'development';
// ------------------------------------->

// ------------------------------------->
export const SITE_NAME = 'قافية';
export const DOMAIN = 'qafiyah.com';
export const API_URL = isDev ? 'http://localhost:8787' : `https://api.${DOMAIN}`;
export const SITE_URL = `https://${DOMAIN}`;
export const TWITTER_HANDLE = '@qafiyahdotcom';
export const TWITTER_ID = '1570116567538475010';
export const TWITTER_URL = `https://x.com/${TWITTER_HANDLE}`;
export const GITHUB_REPO_URL = `https://github.com/alwalxed/qafiyah`;
export const DB_DUMPS_URL = `https://github.com/alwalxed/qafiyah/tree/main/.db_dumps`;
// ------------------------------------->

// ------------------------------------->
export const responsiveIconSize = 'w-4 h-4 xxs:w-8 xxs:w-8 xs:w-8 xs:h-8';
// ------------------------------------->

// ------------------------------------->
export const NOT_FOUND_CODE = toArabicDigits(404);
export const NOT_FOUND_MESSAGE = 'الصفحة غير موجودة';
export const NOT_FOUND_TITLE = `${NOT_FOUND_CODE} | ${NOT_FOUND_MESSAGE}`;
// ------------------------------------->
