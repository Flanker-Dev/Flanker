import { appWindow } from "@tauri-apps/api/window";

// alwaysOnTop enable or disable
export const alwaysOnTop = async (
  alwaysOnTopView: boolean,
  setAlwaysOnTopView: (value: boolean) => void
) => {
  if (alwaysOnTopView) {
    await appWindow.setAlwaysOnTop(false);
    setAlwaysOnTopView(false);
  } else {
    await appWindow.setAlwaysOnTop(true);
    setAlwaysOnTopView(true);
  }
};
