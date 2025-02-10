import { tauri } from "@tauri-apps/api";
import { readDir } from "@tauri-apps/api/fs";
import { homeDir } from "@tauri-apps/api/path";
import { convertFileSrc, InvokeArgs } from "@tauri-apps/api/tauri";
import { appWindow } from "@tauri-apps/api/window";
import { useEffect, useRef, useState } from "react";

import { AppSidebar } from "./components/AppSidebar/AppSidebar";
import { BigCard } from "./components/BigCard/BigCard";
// import { GitHubContributions } from "./components/GitHubContributions/GitHubContributions";
import { Footer } from "./components/Footer/Footer";
import { Header } from "./components/Header/Header";
import { NoFile } from "./components/NoFile/NoFile";
import { SideMenu } from "./components/SideMenu/SideMenu";
import { SmallCard } from "./components/SmallCard/SmallCard";
import { SplashScreen } from "./components/SplashScreen";
import { TableWrapper } from "./components/TableWrapper/TableWrapper";
import { SidebarProvider } from "./components/ui/sidebar";
import { Tabs, TabsContent } from "./components/ui/tabs";
import { FileContent } from "./types/types";
import alwaysOnTop from "./utils/alwaysOnTop";
import { handleSplashScreen } from "./utils/handleSplashScreen";
import { isBookmarkInfoNotEmpty } from "./utils/isBookmarkInfoNotEmpty";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Toaster } from "@/components/ui/toaster";

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
  // const [keyup, setKeyup] = useState(""); // 最新5件のキーを取得
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

    // フォントの適用を一度だけ実行
    applyFontStyles();
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

  const [keys, setKeys] = useState<string[]>([]);

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
    const getHandleKeydown = (event: KeyboardEvent) => {
      setKeys((prevKeys) => {
        const newKeys = [...prevKeys, event.key]; // イベントのキーを追加
        if (newKeys.length > 5) newKeys.shift(); // 最大5件まで保持
        return newKeys;
      });
    };

    window.addEventListener("keydown", getHandleKeydown);
    return () => window.removeEventListener("keydown", getHandleKeydown);
  }, [alwaysOnTopView]);

  // アプリ画面縦と横のサイズを取得
  const windowSizeRef = useRef({
    height: window.innerHeight,
    width: window.innerWidth,
  });
  useEffect(() => {
    const handleResize = () => {
      windowSizeRef.current = {
        height: window.innerHeight,
        width: window.innerWidth,
      };
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  // フォントディレクトリをスキャンしてフォント情報を構築
  async function loadFontStyles() {
    const home = await homeDir();
    const fontDir = `${home}.config/flk/fonts`;

    try {
      const files = await readDir(fontDir);

      // フォントファイルをグループ化
      const fontGroups = {};
      files
        .filter((file) => file.name && file.name.endsWith(".woff"))
        .forEach((file) => {
          const fontName = file.name ? file.name.split(".")[0] : "unknown"; // Extract font name from file name
          if (!fontGroups[fontName]) {
            fontGroups[fontName] = [];
          }
          const style = file.name ? file.name.split(".")[1] : "regular"; // Extract style from file name
          fontGroups[fontName].push({
            style: style.toLowerCase(), // スタイル情報 (regular, bold, etc.)
            path: file.path,
          });
        });

      console.log("Font Groups:", fontGroups);
      return fontGroups;
    } catch (err) {
      console.error("Error reading font directory:", err);
      return {};
    }
  }

  // フォントスタイルを @font-face に登録
  async function applyFontStyles() {
    const fontGroups = await loadFontStyles();

    Object.entries(fontGroups).forEach(([fontName, styles]) => {
      (styles as { style: string; path: string }[]).forEach(
        ({ style, path }) => {
          const fontUrl = convertFileSrc(path, "asset");

          const fontWeight = style.includes("bold")
            ? "bold"
            : style.includes("semibold")
              ? "600"
              : "normal";

          const fontStyle = style.includes("italic") ? "italic" : "normal";

          const styleElement = document.createElement("style");
          styleElement.textContent = `
        @font-face {
          font-family: '${fontName}';
          src: url('${fontUrl}') format('woff');
          font-weight: ${fontWeight};
          font-style: ${fontStyle};
        }
      `;
          document.head.appendChild(styleElement);
        }
      );
    });

    // デフォルトフォントを適用
    const firstFont = Object.keys(fontGroups)[0];
    if (firstFont) {
      document.body.style.fontFamily = firstFont;
    }
  }

  useEffect(() => {
    const handleResize = () => {
      setHeight(window.innerHeight);
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    // 初期状態をローカルストレージから取得
    return localStorage.getItem("theme") === "dark";
  });

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  useEffect(() => {
    const rootElement = document.documentElement;

    if (isDarkMode) {
      rootElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      // htmlタグのborder色を変更する
      rootElement.style.borderColor = "#fff";
      // bodyタグの背景色を変更する
      rootElement.style.backgroundColor = "#000";
    } else {
      rootElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      // htmlタグのborderを変更する
      rootElement.style.borderColor = "#000";

      // bodyタグの背景色を変更する
      rootElement.style.backgroundColor = "#fff";
    }
  }, [isDarkMode]);

  return (
    <div className="relative">
      {imageUrl ? (
        // <img
        //   src={imageUrl}
        //   alt="UploadedImage"
        //   className="fixed h-[calc(100vh-3px)] w-[calc(100%-3px)] rounded-[8px] bg-background object-cover dark:bg-background"
        // />
        // <div className="fixed h-[calc(100vh-3px)] w-[calc(100%-3px)] rounded-[8px] bg-background object-cover dark:w-[calc(100%-4px)] dark:bg-background"></div>
        <div
          className={`fixed h-[calc(100vh-3px)] w-[calc(100%-3px)] rounded-[8px] object-cover dark:w-[calc(100%-4px)] ${isDarkMode ? "dot" : "dark-dot"}`}
        ></div>
      ) : // <div className="fixed h-[calc(100vh-3px)] w-[calc(100%-3px)] rounded-[8px] bg-background object-cover dark:w-[calc(100%-4px)] dark:bg-background"></div>
      null}
      <div
        data-tauri-drag-region
        className="relative z-30 h-[calc(100vh-2px)] rounded-[8px] border dark:border"
      >
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
            <SideMenu
              open={open}
              setOpen={setOpen}
              isLoading={isLoading}
              handleAccordionTriggerClick={handleAccordionTriggerClick}
            />
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
                <Header
                  isDarkMode={isDarkMode}
                  toggleTheme={toggleTheme}
                  fullScreen={fullScreen}
                  tightScreen={tightScreen}
                  increaseHeight={increaseHeight}
                  decreaseHeight={decreaseHeight}
                  increaseWidth={increaseWidth}
                  decreaseWidth={decreaseWidth}
                  moveWindowTopLeft={moveWindowTopLeft}
                  moveWindowTopRight={moveWindowTopRight}
                  moveWindowBottomLeft={moveWindowBottomLeft}
                  moveWindowBottomRight={moveWindowBottomRight}
                  height={height}
                  width={width}
                  alwaysOnTop={alwaysOnTop}
                  alwaysOnTopView={alwaysOnTopView}
                  setAlwaysOnTopView={setAlwaysOnTopView}
                  setIsFooterVisible={setIsFooterVisible}
                />
                {/* main content ----------------------------------- */}
                <div
                  className={`${open ? "min-w-[calc(100vw-325px)]" : "w-[calc(100vw-69px)] dark:w-[calc(100vw-69px)]"}`}
                >
                  {/* big card component */}
                  <TabsContent
                    key="isBigCard"
                    value="isBigCard"
                    data-tauri-drag-region
                  >
                    <ScrollArea
                      className={`${open ? "min-w-[calc(100vw-325px)]" : "w-[calc(100vw-69px)] dark:w-[calc(100vw-69px)]"} h-[calc(100vh-32px)] px-1`}
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
                </div>
                {/* main content end */}
                {/* footer */}
                {isFooterVisible && window.innerHeight > 76 && (
                  <Footer keyboardKeys={keys} />
                )}
                {/* footer end */}
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
