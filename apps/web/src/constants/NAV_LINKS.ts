export type NavLink = {
  name: string;
  href: string;
  external: boolean;
};

export const NAV_LINKS: NavLink[] = [
  { name: 'الرئيسة', href: '/', external: false },
  { name: 'الشعراء', href: '/poets/page/1', external: false },
  { name: 'العصور', href: '/eras', external: false },
  { name: 'البحور', href: '/meters', external: false },
  { name: 'القوافي', href: '/rhymes', external: false },
  { name: 'الأغراض', href: '/themes', external: false },
];
