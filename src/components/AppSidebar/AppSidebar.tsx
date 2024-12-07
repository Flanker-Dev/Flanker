import { ReloadIcon } from "@radix-ui/react-icons";
import { readTextFile } from "@tauri-apps/api/fs";
import { homeDir } from "@tauri-apps/api/path";
import { invoke } from "@tauri-apps/api/tauri";
// import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";
import { useEffect, useState } from "react";

// import { ImageUploaderButton } from "../Buttons/ImageUploaderButton/ImageUploaderButton";
import { ImageUploaderButton } from "../Buttons/ImageUploaderButton/ImageUploaderButton";
import { FileManager } from "../FileManager/FileManager";
import { Button } from "../ui/button";
import { DevModeIndicator } from "./DevModeIndicator/DevModeIndicator";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "../ui/context-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { handleCreateNewFile } from "@/utils/createNewFile";
import { handleError } from "@/utils/errorToast";
import { listFilesInDirectory } from "@/utils/listFilesInDirectory";

// Menu items.
// const items = [
//   {
//     title: "Home",
//     url: "#",
//     icon: Home,
//   },
//   {
//     title: "Inbox",
//     url: "#",
//     icon: Inbox,
//   },
//   {
//     title: "Calendar",
//     url: "#",
//     icon: Calendar,
//   },
//   {
//     title: "Search",
//     url: "#",
//     icon: Search,
//   },
//   {
//     title: "Settings",
//     url: "#",
//     icon: Settings,
//   },
// ];

interface Bookmark {
  id: string;
  title: string;
  description: string;
  url: string;
  tags: string[];
}

interface FileContent {
  bookmark: {
    bookmarkTitle: string;
    bookmarkDescription: string;
    bookmarkTags: string[];
    emoji: string;
    nsfw: boolean;
    createdAt: string;
    updatedAt: string;
    bookmarkList: {
      name: string;
      bookmarkInfo: Bookmark[];
    }[];
  };
}

interface AppSidebarProps {
  loading: boolean;
  files: string[];
  selectedFileContent: FileContent | null;
  setSelectedFileContent: React.Dispatch<
    React.SetStateAction<FileContent | null>
  >;
  setFiles: React.Dispatch<React.SetStateAction<string[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setImageSrc: (src: string | null) => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  files,
  loading,
  selectedFileContent,
  setSelectedFileContent,
  setFiles,
  setLoading,
  setImageSrc,
}) => {
  const [newFile, setNewFile] = useState("");

  const handleNewFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length === 100 && newFile.length < 100) {
      handleError(); // 100文字になった瞬間にのみトーストを表示
    }
    setNewFile(e.target.value);
  };

  const loadFileContent = async (fileName: string) => {
    const home = await homeDir();
    const path = `${home}.config/flanker/bookmarks/${fileName}`;
    const content = await readTextFile(path);
    const parsedContent = JSON.parse(content);
    console.log("ファイルの内容:", parsedContent);

    setSelectedFileContent(parsedContent);
    console.log("選択されたファイルの内容:", parsedContent);
  };

  const handleDeleteFile = async (fileName: string) => {
    const home = await homeDir();
    const path = `${home}.config/flanker/bookmarks/${fileName}`;
    try {
      await invoke("delete_file", { filePath: path });
      listFilesInDirectory(setLoading, setFiles);
      setSelectedFileContent(null); // ファイル削除後にコンテンツをリセット
    } catch (error) {
      console.error("ファイルの削除エラー:", error);
    }
  };

  useEffect(() => {
    listFilesInDirectory(setLoading, setFiles);

    const intervalId = setInterval(() => {
      listFilesInDirectory(setLoading, setFiles);
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    console.log("selectedFileContentが変更されました:", selectedFileContent);
  }, [selectedFileContent]);

  const isDev = import.meta.env.MODE === "development";

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <FileManager
                newFile={newFile}
                setNewFile={setNewFile}
                files={files}
                loading={loading}
                handleNewFileChange={handleNewFileChange}
                handleCreateNewFile={handleCreateNewFile}
                loadFileContent={loadFileContent}
                handleDeleteFile={handleDeleteFile}
              />
              <ImageUploaderButton setImageSrc={setImageSrc} />
              {/* {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))} */}
              {loading ? (
                <div className="flex h-6 w-full items-center justify-start">
                  <span className="mr-1">Loading</span>
                  <ReloadIcon className="h-4 w-4 animate-spin" />
                </div>
              ) : (
                <div className="mt-1 flex w-full flex-col space-y-1">
                  {files.length > 0 ? (
                    files
                      .filter((file) => file !== ".DS_Store")
                      .map((file) => (
                        <ContextMenu key={file}>
                          <ContextMenuTrigger>
                            <Button
                              variant={"menu"}
                              size={"sideMenu"}
                              onClick={() => loadFileContent(file)}
                              className="relative flex"
                            >
                              {/* nsfwタグ表示 */}
                              {selectedFileContent?.bookmark.nsfw && (
                                <span className="text-xs text-red-500">
                                  NSFW
                                </span>
                              )}
                              <span className={"w-64 truncate text-left"}>
                                {file.replace(/\.[^/.]+$/, "")}
                              </span>
                            </Button>
                          </ContextMenuTrigger>
                          <ContextMenuContent className="relative left-20 top-0 bg-black">
                            <span className="text-sm font-bold text-white">
                              {file.replace(/\.[^/.]+$/, "")}
                            </span>
                            <div className="flex flex-col space-y-2">
                              <Button
                                variant="destructive"
                                onClick={() => {
                                  handleDeleteFile(file);
                                }}
                              >
                                Delete
                              </Button>
                            </div>
                          </ContextMenuContent>
                        </ContextMenu>
                      ))
                  ) : (
                    <li key="no-files">No files found</li>
                  )}
                </div>
              )}
              {selectedFileContent && (
                <div className="mt-4 border-t p-2">
                  {selectedFileContent.bookmark.bookmarkList.map(
                    (bookmarkList, index) => (
                      <div
                        key={`${bookmarkList.name}-${index}`}
                        className="mb-2"
                      >
                        <h3 className="font-bold">{bookmarkList.name}</h3>
                        {/* nsfw */}
                        <div>
                          {selectedFileContent.bookmark.nsfw && (
                            <span className="text-xs text-red-500">NSFW</span>
                          )}
                        </div>
                        {bookmarkList.bookmarkInfo.map((bookmark) => (
                          <div key={bookmark.id} className="ml-2">
                            <p className="text-sm">{bookmark.title}</p>
                            <p className="text-xs text-gray-500">
                              {bookmark.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    )
                  )}
                </div>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <DevModeIndicator isDev={isDev} />
    </Sidebar>
  );
};
