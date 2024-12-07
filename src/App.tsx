import { homeDir, join } from "@tauri-apps/api/path";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { Grid3x3, List, PanelLeft, Table } from "lucide-react";
import { useEffect, useState } from "react";

import { AppSidebar } from "./components/AppSidebar/AppSidebar";
import { BigCard } from "./components/BigCard/BigCard";
import { NoFile } from "./components/NoFile/NoFile";
import { SidebarFavs } from "./components/SidebarFavs/SidebarFavs";
import { SmallCard } from "./components/SmallCard/SmallCard";
import SplashScreen from "./components/SplashScreen";
import { TableWrapper } from "./components/TableWrapper/TableWrapper";
import { Button } from "./components/ui/button";
import { SidebarProvider } from "./components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { FileContent } from "./types/types";
import { alwaysOnTop } from "./utils/alwaysOnTop";
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
        const filePath = await join(home, ".config/flanker/images/pxfuel.jpg");
        const assetUrl = convertFileSrc(filePath);
        setImageUrl(assetUrl);
      } catch (error) {
        console.error("Error loading image:", error);
      }
    }
    loadImage();

    // スプラッシュスクリーンを3秒後にフェードアウト開始
    const splashTimeout = setTimeout(() => {
      setFadeOut(true);
      // フェードアウトが完了するまでさらに1秒待つ
      setTimeout(() => {
        setShowSplash(false);
      }, 1000);
    }, 4000);

    // プログレスバーの進行をシミュレート
    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 1 : 100));
    }, 30);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(splashTimeout);
    };
  }, []);

  useEffect(() => {
    setTabKey((prevKey) => prevKey + "_updated");
  }, [selectedFileContent]);

  return (
    <div className="relative">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="UploadedImage"
          // className="fixed inset-0 left-[1px] top-[1px] z-0 h-[calc(100vh-2px)] w-[calc(100%-2px)] rounded object-cover"
          className="fixed h-[calc(100vh-4px)] w-[calc(100%-6px)] rounded-md object-cover"
        />
      ) : null}
      <div
        data-tauri-drag-region
        className="relative z-30 h-[calc(100vh-4px)] w-full rounded-lg"
      >
        <SidebarProvider open={open} onOpenChange={setOpen}>
          <AppSidebar
            loading={loading}
            files={files}
            selectedFileContent={selectedFileContent}
            setSelectedFileContent={setSelectedFileContent}
            setFiles={setFiles}
            setLoading={setLoading}
            setImageSrc={(src: string | null) => setImageUrl(src || "")}
          />
          <div className="flex">
            {/* sidemenu */}
            <div
              data-tauri-drag-region
              className="flex h-[calc(100vh-4px)] w-[64px] flex-col items-center justify-start rounded-l-md border-white backdrop-blur-[3px]"
            >
              {/* Sidebar trigger */}
              <div
                className={`${open ? "pt-2" : "pt-6"} pb-2 duration-500 focus:outline-none`}
              >
                <Button
                  data-sidebar="trigger"
                  variant="ghost"
                  size="icon"
                  className={cn("h-10 w-10")}
                  onClick={(event) => {
                    event.preventDefault();
                    setOpen(!open);
                  }}
                >
                  <PanelLeft />
                </Button>
              </div>
              {/* Sidebar trigger end */}

              {/* お気に入りアイコン群 */}
              <SidebarFavs getFavicon={getFavicon} />
              {/* お気に入りアイコン群 end */}
            </div>
            {/* sidemenu end */}

            <div className="flex h-[calc(100vh-4px)] flex-col items-start justify-start border-l">
              <Tabs
                data-tauri-drag-region
                defaultValue="isSmallCard"
                className="p-0"
                key={tabKey}
              >
                <div className="flex h-7 w-[calc(100%+8px)] items-center justify-between border-b p-1">
                  {/* tab trigger */}
                  <TabsList
                    // className="w-[calc(100%+8px)] border-b p-1"
                    data-tauri-drag-region
                  >
                    <TabsTrigger
                      value="isBigCard"
                      className="p-0.5 hover:bg-white hover:text-black"
                    >
                      <Grid3x3 className="h-4 w-4" />
                    </TabsTrigger>
                    <TabsTrigger
                      value="isSmallCard"
                      className="p-0.5 hover:bg-white hover:text-black"
                    >
                      <List className="h-4 w-4" />
                    </TabsTrigger>
                    <TabsTrigger
                      value="isTable"
                      className="p-0.5 hover:bg-white hover:text-black"
                    >
                      <Table className="h-4 w-4" />
                    </TabsTrigger>
                  </TabsList>

                  <button
                    onClick={() =>
                      alwaysOnTop(alwaysOnTopView, setAlwaysOnTopView)
                    }
                    className={
                      `flex cursor-pointer items-center justify-center rounded p-0.5 hover:bg-white hover:text-black` +
                      (alwaysOnTopView ? " bg-white text-black" : "")
                    }
                  >
                    {alwaysOnTopView ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 -930 960 960"
                        className="fill-black hover:fill-black"
                      >
                        <path d="m640-480 80 80v80H520v240l-40 40-40-40v-240H240v-80l80-80v-280h-40v-80h400v80h-40v280Zm-286 80h252l-46-46v-314H400v314l-46 46Zm126 0Z" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 -930 960 960"
                        className="fill-white hover:fill-black"
                      >
                        <path d="M680-840v80h-40v327l-80-80v-247H400v87l-87-87-33-33v-47h400ZM480-40l-40-40v-240H240v-80l80-80v-46L56-792l56-56 736 736-58 56-264-264h-6v240l-40 40ZM354-400h92l-44-44-2-2-46 46Zm126-193Zm-78 149Z" />
                      </svg>
                    )}
                  </button>
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
                          open={open}
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
      </div>

      {showSplash && <SplashScreen fadeOut={fadeOut} progress={progress} />}

      <Toaster />
    </div>
  );
}

export default App;
