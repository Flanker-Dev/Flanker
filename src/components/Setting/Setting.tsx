import { invoke } from "@tauri-apps/api/tauri";
import { useState, useEffect } from "react";

import { BackgroundImageButton } from "../Buttons/BackgroundImageButton/BackgroundImageButton";
import { DefaultSettingButton } from "../Buttons/DefaultSettingButton/DefaultSettingButton";
import { ImageUploaderButton } from "../Buttons/ImageUploaderButton/ImageUploaderButton";
import { ResetStoreButton } from "../Buttons/ResetStoreButton/ResetStoreButton";
import { SettingLabel } from "../Labels/SettingLabel/SettingLabel";
import { SettingLegend } from "../Legends/SettingLegend/SettingLegend";
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
  setImageSrc,
}: {
  setImageSrc: (src: string | null) => void;
}) => {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  // toggle
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isBackgroundImage, setIsBackgroundImage] = useState<boolean>(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    displaySystemInfo(setSystemInfo);
  }, []);
  return (
    <div
      id="Setting"
      data-tauri-drag-region
      className="flex h-[calc(100vh-44px)] w-full cursor-default select-none flex-col items-center truncate rounded border border-[#EBDCB2] p-1 text-[10px]"
    >
      {/* <div className="flex w-full items-center">
        <img src="src/assets/setting.svg" alt="setting" className="h-4 w-4" />
        <div className="ml-0.5 cursor-default select-none truncate text-base text-[#EBDCB2]">
          Setting
        </div>
      </div> */}

      <fieldset className="w-full rounded border border-[#EBDCB2] px-1 pb-1">
        <legend className="px-1 text-xs">System Info</legend>
        <div className="flex flex-col px-1">
          {systemInfo &&
            Object.entries(systemInfo).map(([key, value], index) => (
              <div key={index} className="flex w-full justify-between">
                <div className="mr-1 overflow-hidden text-right text-[10px] capitalize">
                  {key.replace(/_/g, " ")}
                </div>
                <div className="w-full flex-1 items-center justify-center py-2">
                  <div className="h-[1px] w-full border-b border-dashed border-[#EBDCB2]"></div>
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

      <fieldset className="mt-1 w-full rounded border border-[#EBDCB2] px-1 pb-1">
        <SettingLegend text="App Preference" />
        <div className="mb-1 flex items-center justify-between px-1">
          <SettingLabel text="Dark Mode" />
          <div className="flex items-center">
            <button
              className={`relative h-[22px] min-w-24 cursor-pointer rounded border border-[#EBDCB2] 
                ${isDarkMode ? "bg-[#d92800]" : ""}`}
              onClick={toggleDarkMode}
            >
              <div
                className={`absolute left-[1px] top-[1px] h-[18px] w-12 transform rounded-sm text-[8px] leading-[18px] text-[#d92800] transition-transform duration-100 ${
                  isDarkMode
                    ? "translate-x-[44px] bg-[#EBDCB2]"
                    : "bg-[#EBDCB2]"
                }`}
              >
                {isDarkMode ? "ON" : "OFF"}
              </div>
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between px-1">
          <div className="cursor-default select-none text-[10px]">
            Background Image
          </div>
          <div className="flex items-center">
            <BackgroundImageButton
              isBackgroundImage={isBackgroundImage}
              setIsBackgroundImage={setIsBackgroundImage}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="my-1 w-full rounded border border-[#EBDCB2] px-1 pb-1">
        <legend className="px-1 text-xs">Background Image</legend>
        <div className="flex items-center justify-between px-1">
          <div className="cursor-default select-none text-[10px]">
            Upload Image
          </div>
          <ImageUploaderButton setImageSrc={setImageSrc} />
        </div>
      </fieldset>

      <fieldset className="w-full rounded border border-[#EBDCB2] px-1 pb-1">
        <legend className="px-1 text-xs">Reset</legend>
        <div className="mb-1 flex items-center justify-between px-1">
          <div className="cursor-pointer select-none text-[10px]">
            Reset Store
          </div>
          <ResetStoreButton />
        </div>
        <div className="flex items-center justify-between px-1">
          <div className="cursor-pointer select-none text-[10px]">
            Default Setting
          </div>
          <DefaultSettingButton />
        </div>
      </fieldset>
    </div>
  );
};
