import Marquee from "react-fast-marquee";

import { ReloadButton } from "../Buttons/ReloadButton/ReloadButton";
import { SettingButton } from "../Buttons/SettingButton/SettingButton";
// import { SideMenuBarButton } from "../Buttons/SideMenuBarButton/SideMenuBarButton";
// import { TitleBarButton } from "../Buttons/TitleBarButton/TitleBarButton";
// import { TrafficLightButton } from "../Buttons/TrafficLightButton/TrafficLightButton";

type HeaderProps = {
  alwaysOnTopView: boolean;
  setAlwaysOnTopView: (value: boolean) => void;
  isPrivacyMode: boolean;
  setIsPrivacyMode: (value: boolean) => void;
  isOpenSetting: boolean;
  setIsOpenSetting: (value: boolean) => void;
  spotityTrackInfo: string;
  setSpotityTrackInfo: (value: string) => void;
};

export const Header = ({
  isPrivacyMode,
  setIsPrivacyMode,
  isOpenSetting,
  setIsOpenSetting,
  spotityTrackInfo,
}: HeaderProps) => {
  return (
    <header
      id="Header"
      data-tauri-drag-region
      className="z-50 flex h-6 items-end justify-end"
    >
      <div className="flex items-center justify-between space-x-1 rounded border border-white px-1">
        {/* spotify */}
        <div className="flex h-4 w-48 cursor-default items-center justify-center rounded bg-black text-sm text-amber-500">
          <Marquee gradient={false} speed={40} delay={2}>
            &nbsp;&nbsp; {"♪"} &nbsp; {spotityTrackInfo} &nbsp;&nbsp;
          </Marquee>
        </div>
        {/* privacy mode */}
        <button
          onClick={() => {
            setIsPrivacyMode(!isPrivacyMode);
          }}
          className="flex h-5 w-6 cursor-pointer items-center justify-center rounded-sm hover:bg-neutral-800"
        >
          {isPrivacyMode ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 -960 960 960"
              height="16px"
              width="16px"
              fill="#EBDCB2"
            >
              <path d="M80-120v-80h80v-640h640v640h80v80H550q0 29-20.5 49.5T480-50q-29 0-49.5-20.5T410-120H80Zm160-240h480v-400H240v400Zm0 160h200v-80H240v80Zm280 0h200v-80H520v80ZM240-760h480-480Z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 -960 960 960"
              height="16px"
              width="16px"
              fill="#EBDCB2"
            >
              <path d="M80-120v-80h80v-640h640v640h80v80H80Zm160-400h480v-240H240v240Zm0 320h480v-240H520v72q14 10 22 25t8 33q0 29-20.5 49.5T480-240q-29 0-49.5-20.5T410-310q0-18 8-32.5t22-24.5v-73H240v240Zm0-560h480-480Z" />
            </svg>
          )}
        </button>
        {/* setting button */}
        <SettingButton
          isOpenSetting={isOpenSetting}
          setIsOpenSetting={setIsOpenSetting}
        />
        {/* reload button */}
        <ReloadButton />
        {/* always on top button */}
        {/* <GithubButton /> */}
      </div>
    </header>
  );
};
