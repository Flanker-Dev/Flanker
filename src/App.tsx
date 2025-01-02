import { tauri } from "@tauri-apps/api";
import { readDir } from "@tauri-apps/api/fs";
import { homeDir } from "@tauri-apps/api/path";
import { convertFileSrc, InvokeArgs } from "@tauri-apps/api/tauri";
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
  SquareArrowUpLeft,
  SquareArrowUpRight,
  SquareArrowDownLeft,
  SquareArrowDownRight,
  Keyboard,
  PanelBottomClose,
  FolderHeart,
} from "lucide-react";
import { useEffect, useState } from "react";

import { AppSidebar } from "./components/AppSidebar/AppSidebar";
import { BigCard } from "./components/BigCard/BigCard";
// import { GitHubContributions } from "./components/GitHubContributions/GitHubContributions";
import { NoFile } from "./components/NoFile/NoFile";
import { SidebarFavs } from "./components/SidebarFavs/SidebarFavs";
import { SmallCard } from "./components/SmallCard/SmallCard";
import { SplashScreen } from "./components/SplashScreen";
import { TableWrapper } from "./components/TableWrapper/TableWrapper";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./components/ui/accordion";
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
  const [tabKey, setTabKey] = useState("isSmallCard"); // タブキー
  const [isFooterVisible, setIsFooterVisible] = useState(false); // footerの表示状態
  const [height, setHeight] = useState(window.innerHeight); // windowの高さ
  const [width, setWidth] = useState(window.innerWidth); // windowの幅
  const [keyup, setKeyup] = useState(""); // 最新5件のキーを取得
  const [isLoading, setIsLoading] = useState(false); // スケルトン表示状態の管理

  // 背景画像の読み込み
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

  // ファイルリストが更新されたときにタブキーを更新
  useEffect(() => {
    setTabKey((prevKey) => prevKey + "_updated");
  }, [selectedFileContent]);

  // windowの高さが82より小さい場合sidebarの開閉ボタンを非活性にする
  useEffect(() => {
    if (window.innerHeight <= 82) {
      setOpen(false);
    }
  }, [window.innerHeight]);

  // 画面リサイズ時に回転アニメーションを実行
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

  // Tauriコマンドを呼び出す
  const invokeTauriCommand = (command: string, args?: InvokeArgs) => {
    tauri.invoke(command, args);
    rotateElement();
  };

  // screenの最大化と最小化を切り替える
  const fullScreen = () => invokeTauriCommand("toggle_maximize");
  const tightScreen = () => invokeTauriCommand("toggle_tight");

  // windowの高さと幅を変更する
  const decreaseHeight = () =>
    invokeTauriCommand("decrease_height", { window: appWindow });
  const increaseHeight = () =>
    invokeTauriCommand("increase_height", { window: appWindow });
  const decreaseWidth = () =>
    invokeTauriCommand("decrease_width", { window: appWindow });
  const increaseWidth = () =>
    invokeTauriCommand("increase_width", { window: appWindow });

  // windowの位置を変更する
  const moveWindowTopLeft = () => invokeTauriCommand("move_window_top_left");
  const moveWindowTopRight = () => invokeTauriCommand("move_window_top_right");
  const moveWindowBottomLeft = () =>
    invokeTauriCommand("move_window_bottom_left");
  const moveWindowBottomRight = () =>
    invokeTauriCommand("move_window_bottom_right");

  useEffect(() => {
    let keydownTimeout: NodeJS.Timeout | null = null;

    const handleKeydown = (event: KeyboardEvent) => {
      if (keydownTimeout) return;

      if (event.key === "f" && event.metaKey) fullScreen();
      if (event.key === "t" && event.metaKey) tightScreen();
      if (event.key === "ArrowDown" && event.metaKey) increaseHeight();
      if (event.key === "ArrowUp" && event.metaKey) decreaseHeight();
      if (event.key === "ArrowRight" && event.metaKey) increaseWidth();
      if (event.key === "ArrowLeft" && event.metaKey) decreaseWidth();
      if (event.key === "u" && event.metaKey) moveWindowTopLeft();
      if (event.key === "i" && event.metaKey) moveWindowTopRight();
      if (event.key === "j" && event.metaKey) moveWindowBottomLeft();
      if (event.key === "k" && event.metaKey) moveWindowBottomRight();
      if (event.key === "r" && event.metaKey) window.location.reload();
      if (event.key === "p" && event.metaKey)
        alwaysOnTop(alwaysOnTopView, setAlwaysOnTopView);

      keydownTimeout = setTimeout(() => {
        keydownTimeout = null;
      }, 10);
    };

    window.addEventListener("keydown", handleKeydown);

    // 最新5件のキーを取得する
    const keys: string[] = [];
    const getHandleKeydown = (event: KeyboardEvent) => {
      keys.push(event.key);
      if (keys.length > 5) keys.shift();
      setKeyup(keys.join(" "));
    };
    window && window.addEventListener("keydown", getHandleKeydown);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
      if (keydownTimeout) clearTimeout(keydownTimeout);
    };
  }, [alwaysOnTopView]);

  // アプリ画面縦と横のサイズを取得
  useEffect(() => {
    const handleResize = () => {
      setHeight(window.innerHeight);
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  });

  // footerの表示
  const footerVisible = () => {
    setIsFooterVisible(!isFooterVisible);
  };

  // スケルトン表示を制御する関数
  const handleAccordionTriggerClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 3000); // 2秒後にスケルトンを非表示にする
  };

  // 高さが76より小さい場合footerを非表示にする
  useEffect(() => {
    if (window.innerHeight <= 76) {
      setIsFooterVisible(false);
    }
  }, [window.innerHeight]);

  return (
    <div className="relative">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="UploadedImage"
          className="fixed h-[calc(100vh-4px)] w-[calc(100%-6px)] rounded-md object-cover"
        />
      ) : null}
      {/* <canvas
        ref={canvasRef}
        className="fixed h-[calc(100vh-4px)] w-[calc(100%-6px)] rounded-md bg-transparent object-cover"
      /> */}
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
              {window.innerHeight > 220 && (
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger
                      icon={<FolderHeart />}
                      iconOnly
                      className="mx-auto mb-2 flex h-10 w-10 cursor-default justify-center rounded p-0 hover:bg-accent hover:text-accent-foreground"
                      onClick={handleAccordionTriggerClick}
                    ></AccordionTrigger>
                    <AccordionContent isVisible={false}>
                      {isLoading ? (
                        <div
                          className={`skeleton flex ${open ? "h-[calc(100vh-112px)]" : "h-[calc(100vh-128px)]"} w-[52px] animate-pulse flex-col items-center rounded`}
                        ></div>
                      ) : (
                        <SidebarFavs getFavicon={getFavicon} open={open} />
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
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
                {/* header TODO: コンポーネント化 ----------------------------------- */}
                <div
                  className="flex h-7 w-[calc(100%+8px)] items-center justify-between border-b p-1"
                  data-tauri-drag-region
                >
                  <div className="flex items-center space-x-1">
                    <p className="active-rotate h-fit cursor-default pt-[2px] leading-none duration-1000">
                      {"◒"}
                    </p>
                    <div className="flex h-4 cursor-default items-center justify-between rounded border">
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
                      className={`flex cursor-default items-center justify-center rounded p-0.5 ${window.innerWidth > 768 || window.innerHeight > 76 ? "hover:bg-white hover:text-black" : ""}`}
                    >
                      <Minimize className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={window.innerHeight > 76 ? "fit" : "disabled"}
                      size={"fit"}
                      onClick={decreaseHeight}
                      className={`flex cursor-default items-center justify-center rounded p-0.5 ${window.innerHeight > 82 ? "hover:bg-white hover:text-black" : ""}`}
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
                    <Button
                      variant={"fit"}
                      size={"fit"}
                      onClick={moveWindowTopLeft}
                      className="flex cursor-default items-center justify-center rounded p-0.5 hover:bg-white hover:text-black"
                    >
                      <SquareArrowUpLeft
                        strokeWidth={1.6}
                        className="h-4 w-4"
                      />
                    </Button>
                    <Button
                      variant={"fit"}
                      size={"fit"}
                      onClick={moveWindowTopRight}
                      className="flex cursor-default items-center justify-center rounded p-0.5 hover:bg-white hover:text-black"
                    >
                      <SquareArrowUpRight
                        strokeWidth={1.6}
                        className="h-4 w-4"
                      />
                    </Button>
                    <Button
                      variant={"fit"}
                      size={"fit"}
                      onClick={moveWindowBottomLeft}
                      className="flex cursor-default items-center justify-center rounded p-0.5 hover:bg-white hover:text-black"
                    >
                      <SquareArrowDownLeft
                        strokeWidth={1.6}
                        className="h-4 w-4"
                      />
                    </Button>
                    <Button
                      variant={"fit"}
                      size={"fit"}
                      onClick={moveWindowBottomRight}
                      className="flex cursor-default items-center justify-center rounded p-0.5 hover:bg-white hover:text-black"
                    >
                      <SquareArrowDownRight
                        strokeWidth={1.6}
                        className="h-4 w-4"
                      />
                    </Button>
                    {/* <GitHubContributions /> */}
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
                    <Button
                      variant={window.innerHeight > 76 ? "fit" : "disabled"}
                      size={"fit"}
                      onClick={
                        window.innerHeight > 76 ? footerVisible : undefined
                      }
                      className={`flex cursor-default items-center justify-center rounded p-0.5 ${window.innerHeight > 76 ? "hover:bg-white hover:text-black" : ""}`}
                    >
                      <PanelBottomClose className="h-4 w-4" />
                    </Button>
                  </div>

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
                  {/* tab trigger end */}
                </div>
                {/* header end TODO: コンポーネント化 ----------------------------------- */}

                {/* main content ----------------------------------- */}
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
                      className={`${open ? "w-[calc(100vw-328px)]" : "w-[calc(100vw-72px)]"} ${isFooterVisible ? "h-[calc(100vh-60px)]" : "h-[calc(100vh-32px)]"} px-1`}
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
                  {/* footer */}

                  {isFooterVisible && window.innerHeight > 76 && (
                    <div
                      className="flex h-7 w-[calc(100%+8px)] items-center justify-end border-t p-1"
                      data-tauri-drag-region
                    >
                      <div className="flex items-center space-x-1">
                        {keyup
                          .split(" ")
                          // .reverse()
                          .map((key, index) => {
                            let displayKey = key;
                            if (key === "Meta") displayKey = "⌘";
                            else if (key === "ArrowUp") displayKey = "↑";
                            else if (key === "ArrowDown") displayKey = "↓";
                            else if (key === "ArrowLeft") displayKey = "←";
                            else if (key === "ArrowRight") displayKey = "→";
                            else if (key === "Escape") displayKey = "⎋";
                            else if (key === "Control") displayKey = "^";
                            else if (key === "Tab") displayKey = "⇥";

                            return (
                              <p
                                key={index}
                                className="h-fit min-w-4 cursor-default rounded bg-neutral-600 px-1 text-center text-xs capitalize text-white"
                              >
                                {displayKey}
                              </p>
                            );
                          })}
                        <Keyboard className="h-4 w-4" />
                      </div>
                    </div>
                  )}
                  {/* footer end */}
                </div>
                {/* main content end */}
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
