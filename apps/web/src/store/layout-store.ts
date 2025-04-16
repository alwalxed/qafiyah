import { create } from 'zustand';

type LayoutStore = {
  navHeight: number;
  footerHeight: number;
  windowHeight: number;
  remainingHeight: number;
  setNavHeight: (height: number) => void;
  setFooterHeight: (height: number) => void;
  setWindowHeight: (height: number) => void;
};

export const useLayoutStore = create<LayoutStore>((set) => ({
  navHeight: 0,
  footerHeight: 0,
  windowHeight: typeof window !== 'undefined' ? window.innerHeight : 0,
  remainingHeight: 0,
  setNavHeight: (height: number) =>
    set((state) => ({
      navHeight: height,
      remainingHeight: state.windowHeight - height - state.footerHeight,
    })),
  setFooterHeight: (height: number) =>
    set((state) => ({
      footerHeight: height,
      remainingHeight: state.windowHeight - state.navHeight - height,
    })),
  setWindowHeight: (height: number) =>
    set((state) => ({
      windowHeight: height,
      remainingHeight: height - state.navHeight - state.footerHeight,
    })),
}));
