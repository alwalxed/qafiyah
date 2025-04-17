import { TWITTER_HANDLE } from './GLOBALS';

export type NavLink = {
  name: string;
  href: string;
  external: boolean;
};

export const NAV_LINKS: NavLink[] = [
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
