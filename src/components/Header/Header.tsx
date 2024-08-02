import { alwaysOnTop } from "../../shared/utils/alwaysOnTop";
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
};

export const Header = ({
  alwaysOnTopView,
  setAlwaysOnTopView,
  isPrivacyMode,
  setIsPrivacyMode,
  isOpenSetting,
  setIsOpenSetting,
}: HeaderProps) => {
  return (
    <header
      id="Header"
      data-tauri-drag-region
      className="z-50 flex h-6 items-end justify-end"
    >
      <div className="flex items-center justify-between rounded border border-[#EBDCB2]">
        {/* privacy mode */}
        <button
          onClick={() => {
            setIsPrivacyMode(!isPrivacyMode);
          }}
          className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-sm hover:bg-neutral-800"
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
        <button
          onClick={() => alwaysOnTop(alwaysOnTopView, setAlwaysOnTopView)}
          className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-sm rounded-tr-md hover:bg-neutral-800"
        >
          {alwaysOnTopView ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 -930 960 960"
              fill="#EBDCB2"
            >
              <path d="m640-480 80 80v80H520v240l-40 40-40-40v-240H240v-80l80-80v-280h-40v-80h400v80h-40v280Zm-286 80h252l-46-46v-314H400v314l-46 46Zm126 0Z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 -930 960 960"
              fill="#EBDCB2"
            >
              <path d="M680-840v80h-40v327l-80-80v-247H400v87l-87-87-33-33v-47h400ZM480-40l-40-40v-240H240v-80l80-80v-46L56-792l56-56 736 736-58 56-264-264h-6v240l-40 40ZM354-400h92l-44-44-2-2-46 46Zm126-193Zm-78 149Z" />
            </svg>
          )}
        </button>
        {/* <GithubButton /> */}
      </div>
    </header>
  );
};
