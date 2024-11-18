import { create } from "zustand";
import { persist } from "zustand/middleware";

// Store state type
interface StoreState {
  sideMenuView: boolean;
  setSideMenuView: (value: boolean) => void;
  contentBodyView: boolean;
  setContentBodyView: (value: boolean) => void;
  sideMenuWidth: number;
  setSideMenuWidth: (value: number) => void;
  titlebarView: boolean;
  setTitlebarView: (value: boolean) => void;
  alwaysOnTopView: boolean;
  setAlwaysOnTopView: (value: boolean) => void;
  isPrivacyMode: boolean;
  setIsPrivacyMode: (value: boolean) => void;
  fullContentBodyView: boolean;
  setFullContentBodyView: (value: boolean) => void;
  currentPage: string;
  setCurrentPage: (value: string) => void;
  isOpenSetting: boolean;
  setIsOpenSetting: (value: boolean) => void;
  savedImagePath: string | null;
  setSavedImagePath: (value: string | null) => void;
  spotityTrackInfo: string;
  setSpotityTrackInfo: (value: string) => void;
  isBackgroundImage: boolean;
  setIsBackgroundImage: (value: boolean) => void;
  bgColor: string;
  setBgColor: (value: string) => void;
}

// Q. Why the currying?
// A. https://stackoverflow.com/questions/69814018/zustand-typescript-persist-how-to-type-store
export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      // sideMenu enable or disable
      sideMenuView: true, // initial value
      setSideMenuView: (value: boolean) => set({ sideMenuView: value }),

      // ContentBody enable or disable
      contentBodyView: true,
      setContentBodyView: (value: boolean) => set({ contentBodyView: value }),

      // SideMenu width
      sideMenuWidth: window.innerWidth / 8 - 6,
      setSideMenuWidth: (value: number) => set({ sideMenuWidth: value }),

      // titlebar enable or disable
      titlebarView: false,
      setTitlebarView: (value: boolean) => set({ titlebarView: value }),

      // alwaysOnTop enable or disable
      alwaysOnTopView: false,
      setAlwaysOnTopView: (value: boolean) => set({ alwaysOnTopView: value }),

      // privacy mode
      isPrivacyMode: false,
      setIsPrivacyMode: (value: boolean) => set({ isPrivacyMode: value }),

      // fullContentBody enable or disable
      fullContentBodyView: false,
      setFullContentBodyView: (value: boolean) =>
        set({ fullContentBodyView: value }),

      // current page
      currentPage: "All",
      setCurrentPage: (value: string) => set({ currentPage: value }),

      // setting modal
      isOpenSetting: false,
      setIsOpenSetting: (value: boolean) => set({ isOpenSetting: value }),

      // saved image path
      savedImagePath: null,
      setSavedImagePath: (value: string | null) =>
        set({ savedImagePath: value }),

      // spotify track info
      spotityTrackInfo: "",
      setSpotityTrackInfo: (value: string) => set({ spotityTrackInfo: value }),

      // backgroundImage
      isBackgroundImage: false,
      setIsBackgroundImage: (value: boolean) =>
        set({ isBackgroundImage: value }),

      bgColor: "#EBDCB2",
      setBgColor: (value: string) => set({ bgColor: value }),
    }),
    {
      name: "layout-settings", // localStorage key
      storage: {
        getItem: (name) => {
          const item = localStorage.getItem(name);
          return item ? JSON.parse(item) : null; // deserialize
        },
        setItem: (name, value) => {
          // alwaysOnTopViewはlocalStorageに保存しない
          if (name !== "alwaysOnTopView") {
            localStorage.setItem(name, JSON.stringify(value)); // serialize
          }
        },
        removeItem: (name) => {
          localStorage.removeItem(name); // remove
        },
      },
    }
  )
);
