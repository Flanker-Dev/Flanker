import { homeDir, join } from "@tauri-apps/api/path";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { Grid3x3, List, PanelLeft, Table } from "lucide-react";
import { useEffect, useState } from "react";

import { AppSidebar } from "./components/AppSidebar/AppSidebar";
import { BigCard } from "./components/BigCard/BigCard";
import { NoFile } from "./components/NoFile/NoFile";
import { SidebarFavs } from "./components/SidebarFavs/SidebarFavs";
import { SmallCard } from "./components/SmallCard/SmallCard";
import { TableWrapper } from "./components/TableWrapper/TableWrapper";
import { Button } from "./components/ui/button";
import { Separator } from "./components/ui/separator";
import { SidebarProvider } from "./components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { cn } from "./lib/utils";
import { getFavicon } from "./shared/const/Favicon";
import { FileContent } from "./shared/types/types";
import { isBookmarkInfoNotEmpty } from "./shared/utils/isBookmarkInfoNotEmpty";
// import { loadFileContent } from "./shared/utils/loadFileContent";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Toaster } from "@/components/ui/toaster";

function App() {
  const [imageUrl, setImageUrl] = useState(""); // 画像URL用の状態
  const [files, setFiles] = useState<string[]>([]); // ファイルリスト用の状態
  const [loading, setLoading] = useState(true); // ローディング状態
  const [open, setOpen] = useState(false); // サイドバーの開閉状態を管理
  const [selectedFileContent, setSelectedFileContent] =
    useState<FileContent | null>(null); // 選択されたファイルの内容を管理

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
  }, []);

  return (
    <div className="relative">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="UploadedImage"
          className="fixed inset-0 -top-[1px] left-[1px] z-10 h-[calc(100vh-0px)] w-[calc(100%-2px)] rounded-[6px] object-cover"
        />
      ) : null}
      <div
        data-tauri-drag-region
        className="relative z-30 h-[calc(100vh-2px)] w-full rounded-lg border"
      >
        <SidebarProvider open={open} onOpenChange={setOpen}>
          <AppSidebar
            loading={loading}
            files={files}
            selectedFileContent={selectedFileContent}
            setSelectedFileContent={setSelectedFileContent}
            setFiles={setFiles}
            setLoading={setLoading}
          />
          <div className="flex">
            {/* sidemenu */}
            <div
              data-tauri-drag-region
              className="flex h-[calc(100vh-4px)] w-[68px] flex-col items-center justify-start rounded-l-lg border-r border-white backdrop-blur-[3px]"
            >
              {/* Sidebar trigger */}
              <div
                className={`${open ? "pt-4" : "pt-8"} pb-4 duration-500 focus:outline-none`}
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

              {/* separator */}
              <div className="w-[calc(100% + 2px)] relative right-[1px]">
                <Separator className="w-[52px]" />
              </div>
              {/* separator end */}

              {/* お気に入りアイコン群 */}
              <SidebarFavs getFavicon={getFavicon} />
              {/* お気に入りアイコン群 end */}
            </div>
            {/* sidemenu end */}

            <div className="flex h-[calc(100vh-4px)] flex-col items-start justify-start">
              <Tabs
                data-tauri-drag-region
                defaultValue="isSmallCard"
                className="select-none p-0"
              >
                {/* tab trigger */}
                <TabsList className="w-full border-b p-1">
                  <TabsTrigger
                    value="isBigCard"
                    className="hover:bg-white hover:text-black"
                  >
                    <Grid3x3 className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger
                    value="isSmallCard"
                    className="hover:bg-white hover:text-black"
                  >
                    <List className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger
                    value="isTable"
                    className="hover:bg-white hover:text-black"
                  >
                    <Table className="h-4 w-4" />
                  </TabsTrigger>
                </TabsList>
                {/* tab trigger end */}

                <div
                  className={`${open ? "w-[calc(100vw-328px)]" : "w-[calc(100vw-72px)]"}`}
                >
                  {/* big card component */}
                  <TabsContent value="isBigCard" data-tauri-drag-region>
                    <ScrollArea
                      className={`${open ? "w-[calc(100vw-328px)]" : "w-[calc(100vw-72px)]"} h-[calc(100vh-32px)] px-1`}
                    >
                      {isBookmarkInfoNotEmpty(selectedFileContent) &&
                      selectedFileContent ? (
                        <BigCard selectedFileContent={selectedFileContent} />
                      ) : (
                        <NoFile
                        // files={files}
                        // loadFileContent={(fileName) =>
                        //   loadFileContent(fileName, setSelectedFileContent)
                        // }
                        />
                      )}
                    </ScrollArea>
                  </TabsContent>
                  {/* big card component end */}

                  {/* small card component */}
                  <TabsContent value="isSmallCard" data-tauri-drag-region>
                    <ScrollArea
                      className={`${open ? "w-[calc(100vw-328px)]" : "w-[calc(100vw-72px)]"} h-[calc(100vh-32px)] px-1`}
                    >
                      {isBookmarkInfoNotEmpty(selectedFileContent) &&
                      selectedFileContent ? (
                        <div>
                          <SmallCard
                            selectedFileContent={selectedFileContent}
                          />
                          <pre>
                            {JSON.stringify(selectedFileContent, null, 2)}
                          </pre>
                        </div>
                      ) : (
                        <NoFile
                        // files={files}
                        // loadFileContent={(fileName) =>
                        //   loadFileContent(fileName, setSelectedFileContent)
                        // }
                        />
                      )}
                    </ScrollArea>
                  </TabsContent>
                  {/* small card component end */}

                  {/* table component */}
                  {/* TODO: こっちに書き換えて (https://ui.shadcn.com/docs/components/data-table) */}
                  <TabsContent value="isTable" data-tauri-drag-region>
                    <ScrollArea
                      className={`${open ? "w-[calc(100vw-328px)]" : "w-[calc(100vw-72px)]"} h-[calc(100vh-32px)] px-1`}
                    >
                      {isBookmarkInfoNotEmpty(selectedFileContent) &&
                      selectedFileContent ? (
                        <TableWrapper
                          selectedFileContent={selectedFileContent}
                        />
                      ) : (
                        <NoFile
                        // files={files}
                        // loadFileContent={(fileName) =>
                        //   loadFileContent(fileName, setSelectedFileContent)
                        // }
                        />
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

      <Toaster />
    </div>
  );
}

export default App;
