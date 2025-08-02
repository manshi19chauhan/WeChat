import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("wechat-theme") || "retro",
  setTheme: (theme) => {
    localStorage.setItem("wechat-theme", theme);
    set({ theme });
  },
}));