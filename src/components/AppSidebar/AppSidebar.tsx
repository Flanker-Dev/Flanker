import { ReloadIcon } from "@radix-ui/react-icons";
import { readTextFile } from "@tauri-apps/api/fs";
import { homeDir } from "@tauri-apps/api/path";
import { invoke } from "@tauri-apps/api/tauri";
// import { SquareArrowOutUpRight } from "lucide-react";
// import { Scroll } from "lucide-react";
import {
  CornerRightDown,
  MessageSquareText,
  Signature,
  SquareArrowOutUpRight,
  Tag,
  Tags,
} from "lucide-react";
import { useEffect, useState, useCallback } from "react";

// import { ImageUploaderButton } from "../Buttons/ImageUploaderButton/ImageUploaderButton";
// import Favicon from "../Favicon/Favicon";
import { FileManager } from "../FileManager/FileManager";
import { Button } from "../ui/button";
import { DevModeIndicator } from "./DevModeIndicator/DevModeIndicator";
import { NSFWBadge } from "./NSFWBadge/NSFWBadge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "../ui/context-menu";
import { ScrollArea } from "../ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { getFavicon } from "@/constants/Favicon";
import { handleCreateNewFile } from "@/utils/createNewFile";
import { handleError } from "@/utils/errorToast";
import { listFilesInDirectory } from "@/utils/listFilesInDirectory";

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

interface FileInfo {
  name: string;
  nsfw: boolean;
  emoji: string;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  files,
  loading,
  selectedFileContent,
  setSelectedFileContent,
  setFiles,
  setLoading,
  // setImageSrc,
}) => {
  const [newFile, setNewFile] = useState("");
  const [fileInfos, setFileInfos] = useState<FileInfo[]>([]);

  const handleNewFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length === 100 && newFile.length < 100) {
      handleError(); // 100文字になった瞬間にのみトーストを表示
    }
    setNewFile(e.target.value);
  };

  const loadFileContent = async (fileName: string) => {
    const home = await homeDir();
    const path = `${home}.config/flk/bookmarks/${fileName}`;
    const content = await readTextFile(path);
    const parsedContent = JSON.parse(content);
    console.log("ファイルの内容:", parsedContent);

    setSelectedFileContent(parsedContent);
    console.log("選択されたファイルの内容:", parsedContent);
  };

  const handleDeleteFile = async (fileName: string) => {
    const home = await homeDir();
    const path = `${home}.config/flk/bookmarks/${fileName}`;
    try {
      await invoke("delete_file", { filePath: path });
      listFilesInDirectory(setLoading, setFiles);
      setSelectedFileContent(null); // ファイル削除後にコンテンツをリセット
    } catch (error) {
      console.error("ファイルの削除エラー:", error);
    }
  };

  const fetchFileInfos = useCallback(async () => {
    const home = await homeDir();
    const fileInfos = await Promise.all(
      files
        .filter((file) => file !== ".DS_Store")
        .map(async (file) => {
          const path = `${home}.config/flk/bookmarks/${file}`;
          const content = await readTextFile(path);
          const parsedContent = JSON.parse(content);
          return {
            name: file,
            nsfw: parsedContent.bookmark.nsfw,
            emoji: parsedContent.bookmark.emoji,
          };
        })
    );
    setFileInfos(fileInfos);
  }, [files]);

  useEffect(() => {
    listFilesInDirectory(setLoading, setFiles);
    if (files.length > 0) {
      fetchFileInfos();
    }
  }, [setLoading, setFiles, files, fetchFileInfos]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      listFilesInDirectory(setLoading, setFiles);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [setLoading, setFiles]);

  useEffect(() => {
    console.log("selectedFileContentが変更されました:", selectedFileContent);
  }, [selectedFileContent]);

  const isDev = import.meta.env.MODE === "development";

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup className="mt-6 p-0">
          <SidebarGroupContent>
            <SidebarMenu className="max-h-[calc(100vh-95px)]">
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <div
                    className={`flex min-w-0 items-center justify-between border-t`}
                  >
                    <AccordionTrigger className="flex-grow pb-0 text-xs font-bold leading-3">
                      Finder
                    </AccordionTrigger>
                    <div className="flex-shrink-0 pb-0 leading-3">
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
                    </div>
                  </div>
                  <AccordionContent>
                    {/* <ImageUploaderButton setImageSrc={setImageSrc} /> */}
                    <ScrollArea className="relative left-[1px] h-[calc(100vh-130px)] border-t">
                      {loading ? (
                        <div className="flex h-6 w-full items-center justify-start">
                          <span className="mr-1">Loading</span>
                          <ReloadIcon className="h-4 w-4 animate-spin" />
                        </div>
                      ) : (
                        <ul className="mt-0.5 flex flex-col gap-0.5">
                          {fileInfos.length > 0 ? (
                            fileInfos
                              .filter(
                                (fileInfo) => fileInfo.name !== ".DS_Store"
                              )
                              .map((fileInfo) => (
                                <li key={fileInfo.name}>
                                  <ContextMenu>
                                    <ContextMenuTrigger>
                                      <Button
                                        variant={"menu"}
                                        onClick={() =>
                                          loadFileContent(fileInfo.name)
                                        }
                                        className="flex h-fit w-[255px] cursor-auto truncate p-0 px-1"
                                      >
                                        {/* emoji */}
                                        <span className="mr-1 text-xs">
                                          {fileInfo.emoji}
                                        </span>
                                        <span
                                          className={
                                            "w-64 truncate text-left text-xs"
                                          }
                                        >
                                          {fileInfo.name.replace(
                                            /\.[^/.]+$/,
                                            ""
                                          )}
                                        </span>
                                        {fileInfo.nsfw && <NSFWBadge />}
                                      </Button>
                                    </ContextMenuTrigger>
                                    <ContextMenuContent className="relative left-20 top-0 bg-black">
                                      <span className="text-sm font-bold text-white">
                                        {fileInfo.name.replace(/\.[^/.]+$/, "")}
                                      </span>
                                      <div className="flex flex-col space-y-2">
                                        <Button
                                          variant="destructive"
                                          onClick={() => {
                                            handleDeleteFile(fileInfo.name);
                                          }}
                                        >
                                          Delete
                                        </Button>
                                      </div>
                                    </ContextMenuContent>
                                  </ContextMenu>
                                </li>
                              ))
                          ) : (
                            <div key="no-files">No files found</div>
                          )}
                        </ul>
                      )}
                    </ScrollArea>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <div className="flex min-w-0 items-center justify-between border-y">
                    <AccordionTrigger className="flex-grow pb-0 text-xs font-bold leading-3">
                      <p className="hover:underline">Outline</p>
                      <div className="flex items-center whitespace-nowrap px-1">
                        <p className="text-xs">
                          {selectedFileContent?.bookmark.bookmarkTitle}
                        </p>
                        {/* nsfw */}
                        <p className="ml-1 text-xs">
                          {selectedFileContent?.bookmark.nsfw && <NSFWBadge />}
                        </p>
                        <span className="ml-2 text-xs text-stone-400">
                          ({selectedFileContent?.bookmark.bookmarkList.length}{" "}
                          items)
                        </span>
                      </div>
                    </AccordionTrigger>
                  </div>
                  <AccordionContent>
                    <ScrollArea className="relative left-[1px] h-[calc(100vh-130px)] border-b">
                      {selectedFileContent ? (
                        <div>
                          {selectedFileContent.bookmark.bookmarkList.map(
                            (bookmarkList, index) => (
                              <div key={`${bookmarkList.name}-${index}`}>
                                {bookmarkList.bookmarkInfo.map((bookmark) => (
                                  <div
                                    key={bookmark.id}
                                    className="border-b border-transparent"
                                  >
                                    <div className="flex cursor-default flex-col text-sm">
                                      <div className="flex items-center gap-1 pl-1 hover:bg-stone-600">
                                        <img
                                          src={`${getFavicon}${bookmark.url.replace(/https?:\/\//, "")}`}
                                          alt={bookmark.title}
                                          className="h-3 w-3 rounded bg-white"
                                        />
                                        <p className="text-xs">
                                          {bookmark.title}
                                        </p>
                                      </div>
                                      <div className="ml-[9px] flex items-center gap-1 border-l border-stone-400 pl-2 text-stone-400 hover:bg-stone-600">
                                        <Signature className="h-3 w-3 text-blue-500" />
                                        <p className="w-52 truncate text-xs">
                                          {bookmark.id}
                                        </p>
                                      </div>
                                      <div className="ml-[9px] flex cursor-pointer items-center gap-1 border-l border-stone-400 pl-2 text-stone-400 hover:bg-stone-600 hover:text-white">
                                        <SquareArrowOutUpRight className="h-3 w-3 text-purple-500" />
                                        {/* 親幅いっぱいにリンク */}
                                        {bookmark.url ? (
                                          <a
                                            className="w-52 truncate text-xs"
                                            href={bookmark.url}
                                            target="_blank"
                                            rel="noreferrer"
                                          >
                                            {bookmark.url}
                                          </a>
                                        ) : (
                                          <p className="w-52 truncate text-xs">
                                            No Url
                                          </p>
                                        )}
                                      </div>
                                      <div className="ml-[9px] flex items-center gap-1 border-l border-stone-400 pl-2 text-stone-400 hover:bg-stone-600">
                                        <MessageSquareText className="h-3 w-3 text-green-500" />
                                        {bookmark.description ? (
                                          <p className="w-52 truncate text-xs">
                                            {bookmark.description}
                                          </p>
                                        ) : (
                                          <p className="w-52 truncate text-xs">
                                            No Description
                                          </p>
                                        )}
                                      </div>
                                      {/* tags */}
                                      <div className="ml-[9px] flex flex-col border-l border-stone-400 text-stone-400">
                                        <div className="group/item flex items-center gap-1 pl-2 hover:bg-stone-600">
                                          <Tags className="h-3 w-3 text-yellow-500" />
                                          <p className="text-xs">Tags</p>
                                          <CornerRightDown className="h-3 w-3 text-transparent group-hover/item:text-stone-400" />
                                        </div>
                                        <div className="flex flex-col pl-2">
                                          {bookmark.tags.length > 0 ? (
                                            bookmark.tags.map((tag) => (
                                              <div
                                                key={tag}
                                                className="ml-1.5 flex items-center border-l border-stone-400 pl-2.5 text-xs hover:bg-stone-600"
                                              >
                                                <Tag className="mr-1 h-3 w-3 text-neutral-400" />{" "}
                                                <p>{tag}</p>
                                              </div>
                                            ))
                                          ) : (
                                            <span className="ml-1.5 border-l border-stone-400 px-1 pl-2.5 text-xs">
                                              No Tags
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )
                          )}
                        </div>
                      ) : (
                        <div>No file selected</div>
                      )}
                    </ScrollArea>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <DevModeIndicator isDev={isDev} />
    </Sidebar>
  );
};
