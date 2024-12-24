import { tauri } from "@tauri-apps/api";
import { readDir } from "@tauri-apps/api/fs";
import { homeDir } from "@tauri-apps/api/path";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { appWindow } from "@tauri-apps/api/window";
import {
  FoldVertical,
  Grid3x3,
  List,
  Maximize,
  Minimize,
  PanelLeft,
  Pin,
  PinOff,
  Table,
  UnfoldVertical,
} from "lucide-react";
import { useEffect, useState } from "react";

import { AppSidebar } from "./components/AppSidebar/AppSidebar";
import { BigCard } from "./components/BigCard/BigCard";
import { GitHubContributions } from "./components/GitHubContributions/GitHubContributions";
import { NoFile } from "./components/NoFile/NoFile";
import { SidebarFavs } from "./components/SidebarFavs/SidebarFavs";
import { SmallCard } from "./components/SmallCard/SmallCard";
import { SplashScreen } from "./components/SplashScreen";
import { TableWrapper } from "./components/TableWrapper/TableWrapper";
import { Button } from "./components/ui/button";
import { SidebarProvider } from "./components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { FileContent } from "./types/types";
import alwaysOnTop from "./utils/alwaysOnTop";
import { handleSplashScreen } from "./utils/handleSplashScreen";
import { isBookmarkInfoNotEmpty } from "./utils/isBookmarkInfoNotEmpty";
import { cn } from "./utils/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Toaster } from "@/components/ui/toaster";
import { getFavicon } from "@/constants/Favicon";

function App() {
  const [imageUrl, setImageUrl] = useState(""); // 画像URL用の状態
  const [files, setFiles] = useState<string[]>([]); // ファイルリスト用の状態
  const [loading, setLoading] = useState(true); // ローディング状態
  const [open, setOpen] = useState(false); // サイドバーの開閉状態を管理
  const [selectedFileContent, setSelectedFileContent] =
    useState<FileContent | null>(null); // 選択されたファイルの内容を管理
  const [showSplash, setShowSplash] = useState(true); // スプラッシュスクリーンの表示状態
  const [fadeOut, setFadeOut] = useState(false); // フェードアウトの状態
  const [progress, setProgress] = useState(0); // プログレスバーの状態
  const [alwaysOnTopView, setAlwaysOnTopView] = useState(false); // 常に最前面表示の状態
  const [tabKey, setTabKey] = useState("isSmallCard");

  useEffect(() => {
    async function loadImage() {
      try {
        const home = await homeDir();
        const files = await readDir(`${home}.config/flk/images`);
        const imageFiles = files.filter(
          (file) => file.name && /\.(jpg|jpeg|png|gif)$/i.test(file.name)
        );
        if (imageFiles.length > 0) {
          const filePath = imageFiles[0].path;
          const assetUrl = convertFileSrc(filePath);
          setImageUrl(assetUrl);
        }
      } catch (error) {
        console.error("Error loading image:", error);
      }
    }
    loadImage();

    handleSplashScreen(setFadeOut, setShowSplash, setProgress);
  }, []);

  useEffect(() => {
    setTabKey((prevKey) => prevKey + "_updated");
  }, [selectedFileContent]);

  useEffect(() => {
    // windowが82より小さい場合openを非表示にする
    if (window.innerHeight <= 82) {
      setOpen(false);
    }
  }, [window.innerHeight]);

  const rotateElement = () => {
    const element = document.querySelector(".active-rotate");
    if (element) {
      const currentRotation = parseInt(
        element.getAttribute("data-rotation") || "0",
        10
      );
      const newRotation = currentRotation + 450;
      (element as HTMLElement).style.transform = `rotate(${newRotation}deg)`;
      element.setAttribute("data-rotation", newRotation.toString());
    }
  };

  const fullScreen = () => {
    tauri.invoke("toggle_maximize");
    rotateElement();
  };

  const tightScreen = () => {
    tauri.invoke("toggle_tight");
    rotateElement();
  };

  const decreaseHeight = () => {
    tauri.invoke("decrease_height", { window: appWindow });
    rotateElement();
  };

  const increaseHeight = () => {
    tauri.invoke("increase_height", { window: appWindow });
    rotateElement();
  };

  const decreaseWidth = () => {
    tauri.invoke("decrease_width", { window: appWindow });
    rotateElement();
  };

  const increaseWidth = () => {
    tauri.invoke("increase_width", { window: appWindow });
    rotateElement();
  };

  useEffect(() => {
    let keydownTimeout: NodeJS.Timeout | null = null;

    const handleKeydown = (event: KeyboardEvent) => {
      if (keydownTimeout) return;

      if (event.key === "f" && event.metaKey) fullScreen();
      if (event.key === "t" && event.metaKey) tightScreen();
      if (event.key === "ArrowDown" && event.metaKey) {
        increaseHeight();
      }
      if (event.key === "ArrowUp" && event.metaKey) {
        decreaseHeight();
      }
      if (event.key === "ArrowRight" && event.metaKey) {
        increaseWidth();
      }
      if (event.key === "ArrowLeft" && event.metaKey) {
        decreaseWidth();
      }
      if (event.key === "r" && event.metaKey) window.location.reload();
      if (event.key === "i" && event.metaKey) tauri.invoke("open_devtools");
      if (event.key === "p" && event.metaKey) {
        alwaysOnTop(alwaysOnTopView, setAlwaysOnTopView);
      }

      keydownTimeout = setTimeout(() => {
        keydownTimeout = null;
      }, 50); // 200msの間隔を設定
    };

    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
      if (keydownTimeout) clearTimeout(keydownTimeout);
    };
  }, [alwaysOnTopView]);

  // アプリ画面縦と横のサイズを取得
  const [height, setHeight] = useState(window.innerHeight);
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => {
      setHeight(window.innerHeight);
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  });

  return (
    <div className="relative">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="UploadedImage"
          className="fixed h-[calc(100vh-4px)] w-[calc(100%-6px)] rounded-md object-cover"
        />
      ) : null}
      <div
        data-tauri-drag-region
        className="relative z-30 h-[calc(100vh-4px)] w-full rounded-lg"
      >
        {/* スプラッシュスクリーンの後ろの画面を表示 */}
        <SidebarProvider open={open} onOpenChange={setOpen}>
          <div
            className={`${window.innerHeight > 82 ? "" : "hidden"} flex h-[calc(100vh-90px)] flex-col items-center`}
          >
            <AppSidebar
              loading={loading}
              files={files}
              selectedFileContent={selectedFileContent}
              setSelectedFileContent={setSelectedFileContent}
              setFiles={setFiles}
              setLoading={setLoading}
              setImageSrc={(src: string | null) => setImageUrl(src || "")}
            />
          </div>
          <div className="flex">
            {/* sidemenu */}
            <div
              data-tauri-drag-region
              className="flex h-[calc(100vh-4px)] w-[64px] flex-col items-center justify-start rounded-l-md border-white backdrop-blur-[3px]"
            >
              {/* Sidebar trigger */}
              <div
                className={`${open ? "pt-2" : "pt-6"} ${window.innerHeight > 82 ? "" : "pt-6"} flex w-16 justify-center pb-2 duration-500 focus:outline-none`}
              >
                <Button
                  data-sidebar="trigger"
                  variant={window.innerHeight > 120 ? "ghost" : "disabled"}
                  size="icon"
                  className={cn("h-10 w-10 cursor-default")}
                  onClick={(event) => {
                    event.preventDefault();
                    // windowが82より小さい場合発火しない
                    if (window.innerHeight <= 120) return;
                    setOpen(!open);
                  }}
                >
                  <PanelLeft />
                </Button>
              </div>
              {/* Sidebar trigger end */}

              {/* お気に入りアイコン群 */}
              {window.innerHeight > 120 && (
                <SidebarFavs getFavicon={getFavicon} />
              )}
              {/* お気に入りアイコン群 end */}
            </div>
            {/* sidemenu end */}

            <div
              className="flex h-[calc(100vh-4px)] w-full flex-col items-start justify-start border-l"
              data-tauri-drag-region
            >
              <Tabs
                data-tauri-drag-region
                defaultValue="isSmallCard"
                className="p-0"
                key={tabKey}
              >
                <div
                  className="flex h-7 w-[calc(100%+8px)] items-center justify-between border-b p-1"
                  data-tauri-drag-region
                >
                  {/* tab trigger */}
                  <TabsList data-tauri-drag-region>
                    <TabsTrigger
                      value="isBigCard"
                      className="cursor-default p-0.5 hover:bg-white hover:text-black"
                    >
                      <Grid3x3 className="h-4 w-4" />
                    </TabsTrigger>
                    <TabsTrigger
                      value="isSmallCard"
                      className="cursor-default p-0.5 hover:bg-white hover:text-black"
                    >
                      <List className="h-4 w-4" />
                    </TabsTrigger>
                    <TabsTrigger
                      value="isTable"
                      className="cursor-default p-0.5 hover:bg-white hover:text-black"
                    >
                      <Table className="h-4 w-4" />
                    </TabsTrigger>
                  </TabsList>

                  <div className="flex items-center space-x-1">
                    <p className="active-rotate h-fit pt-[2px] leading-none duration-300">
                      {"◒"}
                    </p>
                    <div className="flex h-4 items-center justify-between rounded border">
                      <p className="w-10 text-nowrap text-center text-xs font-bold leading-3">
                        {height}
                      </p>
                      <p className="pb-0.5 text-xl">{"×"}</p>
                      <p className="w-10 text-nowrap text-center text-xs font-bold leading-3">
                        {width}
                      </p>
                    </div>
                    <Button
                      variant={"fit"}
                      size={"fit"}
                      onClick={fullScreen}
                      className="flex cursor-default items-center justify-center rounded p-0.5 hover:bg-white hover:text-black"
                    >
                      <Maximize className="h-4 w-4" />
                    </Button>
                    {window.innerWidth !== 768 || window.innerHeight !== 76 ? (
                      <Button
                        variant={
                          window.innerWidth === 768 && window.innerHeight === 76
                            ? "disabled"
                            : "fit"
                        }
                        size={"fit"}
                        onClick={
                          window.innerWidth === 768 && window.innerHeight === 76
                            ? undefined
                            : tightScreen
                        }
                        className={`flex cursor-default items-center justify-center rounded p-0.5  ${window.innerWidth === 768 && window.innerHeight === 76 ? "hover:bg-white hover:text-black" : ""}`}
                      >
                        <Minimize className="h-4 w-4" />
                      </Button>
                    ) : null}
                    <Button
                      variant={window.innerHeight > 76 ? "fit" : "disabled"}
                      size={"fit"}
                      onClick={decreaseHeight}
                      className={`flex cursor-default items-center justify-center rounded p-0.5  ${window.innerHeight > 82 ? "hover:bg-white hover:text-black" : ""}`}
                    >
                      <FoldVertical className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={"fit"}
                      size={"fit"}
                      onClick={increaseHeight}
                      className="flex cursor-default items-center justify-center rounded p-0.5 hover:bg-white hover:text-black"
                    >
                      <UnfoldVertical className="h-4 w-4 rotate-180" />
                    </Button>
                    <Button
                      variant={window.innerWidth > 768 ? "fit" : "disabled"}
                      size={"fit"}
                      onClick={decreaseWidth}
                      className={`flex cursor-default items-center justify-center rounded p-0.5  ${window.innerWidth > 768 ? "hover:bg-white hover:text-black" : ""}`}
                    >
                      <FoldVertical className="h-4 w-4 rotate-90" />
                    </Button>
                    <Button
                      variant={"fit"}
                      size={"fit"}
                      onClick={increaseWidth}
                      className="flex cursor-default items-center justify-center rounded p-0.5 hover:bg-white hover:text-black"
                    >
                      <UnfoldVertical className="h-4 w-4 -rotate-90" />
                    </Button>
                    <GitHubContributions />
                    <Button
                      variant={"fit"}
                      size={"fit"}
                      onClick={() =>
                        alwaysOnTop(alwaysOnTopView, setAlwaysOnTopView)
                      }
                      className={
                        `flex cursor-default items-center justify-center rounded p-0.5 hover:bg-white hover:text-black` +
                        (alwaysOnTopView ? " bg-white text-black" : "")
                      }
                    >
                      {alwaysOnTopView ? (
                        <Pin className="h-4 w-4" />
                      ) : (
                        <PinOff className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  {/* tab trigger end */}
                </div>

                <div
                  className={`${open ? "w-[calc(100vw-332px)]" : "w-[calc(100vw-76px)]"}`}
                >
                  {/* big card component */}
                  <TabsContent
                    key="isBigCard"
                    value="isBigCard"
                    data-tauri-drag-region
                  >
                    <ScrollArea
                      className={`${open ? "w-[calc(100vw-328px)]" : "w-[calc(100vw-72px)]"} h-[calc(100vh-32px)] px-1`}
                    >
                      {isBookmarkInfoNotEmpty(selectedFileContent) &&
                      selectedFileContent ? (
                        <BigCard selectedFileContent={selectedFileContent} />
                      ) : (
                        <NoFile />
                      )}
                    </ScrollArea>
                  </TabsContent>
                  {/* big card component end */}

                  {/* small card component */}
                  <TabsContent
                    key="isSmallCard"
                    value="isSmallCard"
                    data-tauri-drag-region
                  >
                    <ScrollArea
                      className={`${open ? "w-[calc(100vw-328px)]" : "w-[calc(100vw-72px)]"} h-[calc(100vh-32px)] px-1 pt-1`}
                    >
                      {isBookmarkInfoNotEmpty(selectedFileContent) &&
                      selectedFileContent ? (
                        <SmallCard
                          selectedFileContent={selectedFileContent}
                          closeAllAccordions={false}
                        />
                      ) : (
                        <NoFile />
                      )}
                    </ScrollArea>
                  </TabsContent>
                  {/* small card component end */}

                  {/* table component */}
                  <TabsContent
                    key="isTable"
                    value="isTable"
                    data-tauri-drag-region
                  >
                    <ScrollArea
                      className={`${open ? "w-[calc(100vw-328px)]" : "w-[calc(100vw-72px)]"} h-[calc(100vh-32px)] px-1`}
                    >
                      {isBookmarkInfoNotEmpty(selectedFileContent) &&
                      selectedFileContent ? (
                        <TableWrapper
                          selectedFileContent={selectedFileContent}
                        />
                      ) : (
                        <NoFile />
                      )}
                    </ScrollArea>
                  </TabsContent>
                  {/* table component end */}
                </div>
              </Tabs>
              {/* </ScrollArea> */}
            </div>
          </div>
        </SidebarProvider>
        {/* スプラッシュスクリーン */}
        {showSplash && <SplashScreen fadeOut={fadeOut} progress={progress} />}
      </div>

      <Toaster />
    </div>
  );
}

export default App;
