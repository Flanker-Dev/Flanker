// import { listen } from "@tauri-apps/api/event";
import { Resizable } from "re-resizable";
import { useEffect, useState } from "react";

import { MiniSideMenuBarButton } from "./components/Buttons/MiniSideMenuBarButton/MiniSideMenuBarButton";
import { MiniTitleBarButton } from "./components/Buttons/MiniTitleBarButton/MiniTitleBarButton";
import { SideMenuBarButton } from "./components/Buttons/SideMenuBarButton/SideMenuBarButton";
import { TitleBarButton } from "./components/Buttons/TitleBarButton/TitleBarButton";
import { CurrentPage } from "./components/CurrentPage/CurrentPage";
import { Header } from "./components/Header/Header";
import { PrivacyMode } from "./components/PrivacyMode/PrivacyMode";
import { Setting } from "./components/Setting/Setting";
import { SideMenuLists } from "./components/SideMenuLists/SideMenuLists";
import { Tight } from "./components/Tight/Tight";
import useResizeObserver from "./shared/hooks/useResizeObserver";
import { useStore } from "./shared/store/store";
import { loadImageBase64 } from "./shared/utils/backgroundUtils";

function App() {
  // store
  const {
    sideMenuView,
    setSideMenuView,
    setSideMenuWidth,
    titlebarView,
    setTitlebarView,
    alwaysOnTopView,
    setAlwaysOnTopView,
    isPrivacyMode,
    setIsPrivacyMode,
    currentPage,
    isOpenSetting,
    setIsOpenSetting,
  } = useStore();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const savedImagePath = useStore((state) => state.savedImagePath);

  useEffect(() => {
    const loadImage = async () => {
      if (savedImagePath) {
        const base64 = await loadImageBase64(savedImagePath);
        if (base64) {
          setImageSrc(base64);
        }
      }
    };
    loadImage();
  }, [savedImagePath]);
  // hooks
  useResizeObserver(setSideMenuWidth);
  // useToggleDisplay(titlebarView, setTitlebarView);

  const [isContentBodyWidthLessThan200, setIsContentBodyWidthLessThan200] =
    useState(false);
  // リアルタイムでid:Contentbodyの幅をResizeObserverで取得し、200px未満の場合はtrueにする
  useEffect(() => {
    const contentBody = document.getElementById("ContentBody");
    if (contentBody) {
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.contentRect.width < 182) {
            setIsContentBodyWidthLessThan200(true);
          } else {
            setIsContentBodyWidthLessThan200(false);
          }
        }
      });
      observer.observe(contentBody);
      return () => observer.disconnect();
    }
  }, []);

  // debug
  // getLocalStorageSize();
  return (
    <div className="relative">
      {imageSrc && (
        <img
          src={imageSrc}
          alt="UploadedImage"
          className="fixed inset-0 -top-[1px] left-[1px] z-10 h-[calc(100vh-0px)] w-[calc(100%-2px)] rounded-[6px] object-cover"
        />
      )}
      <div data-tauri-drag-region className="relative z-30 p-1">
        {!titlebarView && (
          <Header
            alwaysOnTopView={alwaysOnTopView}
            setAlwaysOnTopView={setAlwaysOnTopView}
            isPrivacyMode={isPrivacyMode}
            setIsPrivacyMode={setIsPrivacyMode}
            isOpenSetting={isOpenSetting}
            setIsOpenSetting={setIsOpenSetting}
          />
        )}
        {titlebarView && (
          <MiniTitleBarButton
            setTitlebarView={setTitlebarView}
            titlebarView={titlebarView}
          />
        )}
        {!isPrivacyMode && (
          <MiniSideMenuBarButton
            setSideMenuView={setSideMenuView}
            sideMenuView={sideMenuView}
          />
        )}
        <div
          className={`flex items-start justify-center ${titlebarView ? "" : "mt-1"}`}
        >
          {/* ------------ SideMenuBar ------------ */}
          {sideMenuView && (
            <div id="SideMenu" className="scrollbar" data-tauri-drag-region>
              <Resizable
                defaultSize={{
                  width: window.innerWidth - 6,
                  height: "100%",
                }}
                minWidth="110px"
                maxWidth="182px"
                enable={{
                  top: false,
                  right: true,
                  bottom: false,
                  left: false,
                  topRight: false,
                  bottomRight: false,
                  bottomLeft: false,
                  topLeft: false,
                }}
              >
                <div
                  id="SideMenuLists"
                  data-tauri-drag-region
                  className={`z-40 mr-[5px] select-none rounded-md text-xs backdrop-blur-[3px]
                    ${titlebarView ? "h-[calc(100vh-10px)]" : "h-[calc(100vh-32px)]"}
                  `}
                >
                  <div className="flex w-full justify-end">
                    <div className="flex w-fit justify-end rounded rounded-b-none border border-b-0 border-[#EBDCB2]">
                      <div className="flex w-full justify-end">
                        {!isPrivacyMode ? (
                          <SideMenuBarButton
                            sideMenuView={sideMenuView}
                            setSideMenuView={setSideMenuView}
                          />
                        ) : (
                          <div className="flex h-5 w-5 cursor-not-allowed items-center justify-center rounded-sm">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 -960 960 960"
                              width="16"
                              height="16"
                              fill="#505050"
                            >
                              <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm120-80v-560H200v560h120Zm80 0h360v-560H400v560Zm-80 0H200h120Z" />
                            </svg>
                          </div>
                        )}
                        <TitleBarButton
                          titlebarView={titlebarView}
                          setTitlebarView={setTitlebarView}
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    className={`${titlebarView ? "h-[calc(100vh-32px)]" : "h-[calc(100vh-60px)]"}
                    `}
                  >
                    <SideMenuLists />
                  </div>
                </div>
              </Resizable>
            </div>
          )}
          {/* ------------ ContentBody ------------ */}
          <div
            id="ContentBody"
            data-tauri-drag-region
            className={`scrollbar flex w-[calc(100vw-9px)] flex-1 overflow-y-scroll rounded border border-[#EBDCB2] p-1 text-xs backdrop-blur-[3px]
            ${titlebarView ? "h-[calc(100vh-11px)]" : "h-[calc(100vh-39px)]"} 
            ${isPrivacyMode ? "gradient-background fixed left-[50%] right-[50%] ml-0 -translate-x-1/2" : ""} 
            ${isPrivacyMode && titlebarView ? "h-[calc(100vh-10px)]" : ""}
          `}
          >
            {!isContentBodyWidthLessThan200 &&
              !isPrivacyMode &&
              !isOpenSetting && <CurrentPage currentPage={currentPage} />}
            {isPrivacyMode && <PrivacyMode />}
            {!isContentBodyWidthLessThan200 &&
              isOpenSetting &&
              !isPrivacyMode && <Setting setImageSrc={setImageSrc} />}
            {isContentBodyWidthLessThan200 && <Tight />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
