import { appWindow } from "@tauri-apps/api/window";

const alwaysOnTop = async (
  alwaysOnTopView: boolean,
  setAlwaysOnTopView: (value: boolean) => void
) => {
  const newAlwaysOnTopView = !alwaysOnTopView;
  await appWindow.setAlwaysOnTop(newAlwaysOnTopView);
  setAlwaysOnTopView(newAlwaysOnTopView);
};

export default alwaysOnTop;
