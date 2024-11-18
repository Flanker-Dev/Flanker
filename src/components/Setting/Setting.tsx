import { invoke } from "@tauri-apps/api/tauri";
import { useState, useEffect } from "react";

import { SettingLabel } from "../Labels/SettingLabel/SettingLabel";
import { SettingLegend } from "../Legends/SettingLegend/SettingLegend";
import { SettingBackgroundImage } from "../SettingBackgroundImage/SettingBackgroundImage";
import { SettingReset } from "../SettingReset/SettingReset";
interface SystemInfo {
  cpu: string;
  mem: string;
  used_mem: string;
  total_swap: string;
  used_swap: string;
  name: string;
  kernel: string;
  brand: string;
  long_os_version: string;
  host_name: string;
  uptime: string;
  display_info: string;
  mhz: string;
}
// jsonでくるpc情報を表示
const displaySystemInfo = async (
  setSystemInfo: React.Dispatch<React.SetStateAction<SystemInfo | null>>
) => {
  try {
    const systemInfo = await invoke<string>("get_system_info");
    setSystemInfo(JSON.parse(systemInfo));
  } catch (e) {
    console.error("Error fetching system info:", e);
  }
};

export const Setting = ({
  bgColor,
  setBgColor,
  setImageSrc,
}: {
  bgColor: string;
  setBgColor: (color: string) => void;
  setImageSrc: (src: string | null) => void;
}) => {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  // toggle
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isBackgroundImage, setIsBackgroundImage] = useState<boolean>(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setBgColor(newColor);
    setImageSrc(null); // 画像を削除
    document.body.style.backgroundColor = newColor; // bodyの背景色を変更
  };

  useEffect(() => {
    displaySystemInfo(setSystemInfo);
  }, []);
  return (
    <div
      id="Setting"
      data-tauri-drag-region
      className="flex h-fit w-full cursor-default select-none flex-col items-center truncate rounded text-[10px]"
    >
      {/* <div className="flex w-full items-center">
        <img src="src/assets/setting.svg" alt="setting" className="h-4 w-4" />
        <div className="ml-0.5 cursor-default select-none truncate text-base text-white">
          Setting
        </div>
      </div> */}

      <fieldset className="w-full rounded border border-white px-1 pb-1">
        <legend className="px-1 text-xs">System Info</legend>
        <div className="flex flex-col px-1">
          {systemInfo &&
            Object.entries(systemInfo).map(([key, value], index) => (
              <div key={index} className="flex w-full justify-between">
                <div className="mr-1 overflow-hidden text-right text-[10px] capitalize">
                  {key.replace(/_/g, " ")}
                </div>
                <div className="w-full flex-1 items-center justify-center py-2">
                  <div className="h-[1px] w-full border-b border-dashed border-white"></div>
                </div>
                <div className="ml-1 w-[72px] text-[10px]">
                  {/* cpu_info, display_info */}
                  {key === "cpu" || key === "display" || key === "mhz" ? (
                    value.split(", ").map((value: string, index: number) => (
                      <div key={index} className="truncate">
                        {value}
                      </div>
                    ))
                  ) : (
                    <div className="truncate">{value}</div>
                  )}
                </div>
              </div>
            ))}
        </div>
      </fieldset>

      <fieldset className="mt-1 w-full rounded border border-white px-1 pb-1">
        <SettingLegend text="App Preference" />
        <div className="mb-1 flex items-center justify-between px-1">
          <SettingLabel text="Dark Mode" />
          <div className="flex items-center">
            <button
              className={`relative h-[22px] min-w-24 cursor-pointer rounded border border-white 
                ${isDarkMode ? "bg-[#d92800]" : ""}`}
              onClick={toggleDarkMode}
            >
              <div
                className={`absolute left-[1px] top-[1px] h-[18px] w-12 transform rounded-sm text-[8px] leading-[18px] text-[#d92800] transition-transform duration-100 ${
                  isDarkMode ? "translate-x-[44px] bg-white" : "bg-white"
                }`}
              >
                {isDarkMode ? "ON" : "OFF"}
              </div>
            </button>
          </div>
        </div>
      </fieldset>

      {/* Background ColorかBackground Imageのどちらかを選択できるボタン */}
      <fieldset className="mt-1 w-full rounded border border-white px-1 pb-1">
        <SettingLegend text="Background" />
        <div className="flex items-center justify-between px-1">
          <div className="cursor-default select-none text-[10px]">
            Background
          </div>
          <div className="flex min-w-24 items-center space-x-1">
            {/* ボタンを二つ用意(Color or Image) */}
            {/* Colorを押したらImageを非表示にしてColorを選択できるようにする */}
            {/* Imageを選択したらColorを非表示にしてImageを選択できるようにする */}
            <button
              className={`relative h-[22px] w-full cursor-pointer rounded border border-white 
                ${isBackgroundImage ? "bg-zinc-700" : "bg-[#d92800] text-white"}
                `}
              onClick={() => setIsBackgroundImage(false)}
            >
              <div
                className={`absolute left-[1px] top-[1px] h-[18px] w-full transform rounded-sm text-[10px] leading-[18px] transition-transform duration-100`}
              >
                Color
              </div>
            </button>
            <button
              className={`relative h-[22px] w-full cursor-pointer rounded border border-white 
                ${isBackgroundImage ? "bg-[#d92800] text-white" : "bg-zinc-700"}
              `}
              onClick={() => setIsBackgroundImage(true)}
            >
              <div
                className={`absolute left-[1px] top-[1px] h-[18px] w-full transform rounded-sm text-[10px] leading-[18px] transition-transform duration-100                `}
              >
                Image
              </div>
            </button>
          </div>
        </div>
      </fieldset>

      {/* Background Color */}
      <fieldset className="mt-1 w-full rounded border border-white px-1 pb-1">
        <SettingLegend text="Background Color" />
        <div className="flex items-center justify-between px-1">
          <div className="cursor-default select-none text-[10px]">
            Background Color
          </div>
          {isBackgroundImage ? (
            <div className="flex h-[22px] min-w-24 cursor-default items-center rounded border border-white bg-zinc-700">
              <div className="h-4 w-full cursor-not-allowed text-center">
                Disabled
              </div>
            </div>
          ) : (
            // Color Picker
            <div className="flex h-[22px] min-w-24 cursor-pointer rounded border border-white">
              <div className="relative">
                <input
                  type="color"
                  value={bgColor}
                  onChange={
                    // bodyの背景色を変更する
                    handleColorChange
                  }
                  className="cursor-pointer"
                />
                <div className="absolute flex h-[20px] w-4 cursor-default items-center justify-center rounded-l-sm bg-white">
                  <svg
                    fill="#000000"
                    height="12px"
                    width="12px"
                    version="1.1"
                    id="Icons"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 32 32"
                  >
                    <path
                      d="M27.7,3.3c-1.5-1.5-3.9-1.5-5.4,0L17,8.6l-1.3-1.3c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4l1.3,1.3L5,20.6
                    c-0.6,0.6-1,1.4-1.1,2.3C3.3,23.4,3,24.2,3,25c0,1.7,1.3,3,3,3c0.8,0,1.6-0.3,2.2-0.9C9,27,9.8,26.6,10.4,26L21,15.4l1.3,1.3
                    c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3c0.4-0.4,0.4-1,0-1.4L22.4,14l5.3-5.3C29.2,7.2,29.2,4.8,27.7,3.3z M9,24.6
                    c-0.4,0.4-0.8,0.6-1.3,0.5c-0.4,0-0.7,0.2-0.9,0.5C6.7,25.8,6.3,26,6,26c-0.6,0-1-0.4-1-1c0-0.3,0.2-0.7,0.5-0.8
                    c0.3-0.2,0.5-0.5,0.5-0.9c0-0.5,0.2-1,0.5-1.3L17,11.4l2.6,2.6L9,24.6z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>
      </fieldset>

      <SettingBackgroundImage
        setBgColor={setBgColor}
        setImageSrc={setImageSrc}
        isBackgroundImage={isBackgroundImage}
      />

      <SettingReset />
    </div>
  );
};
