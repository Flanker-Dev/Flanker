import { readTextFile } from "@tauri-apps/api/fs";
import { homeDir } from "@tauri-apps/api/path";
import { invoke } from "@tauri-apps/api/tauri";
import { PlugZap, Unplug } from "lucide-react";
import { useEffect, useState, useCallback, useMemo } from "react";

import { AccordionContentComponent } from "./FinderContent";
import { OutlineContentComponent } from "./OutlineContent";
import { FileManager } from "../FileManager/FileManager";
import { DevModeIndicator } from "./DevModeIndicator/DevModeIndicator";
import { NSFWBadge } from "./NSFWBadge/NSFWBadge";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../ui/accordion";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from "../ui/sidebar";
import { isDev } from "@/constants/Mode";
import { FINDER, OUTLINE } from "@/constants/Text";
import { FileContent, FileInfo } from "@/types/types";
import { handleCreateNewFile } from "@/utils/createNewFile";
import { handleError } from "@/utils/errorToast";
import { listFilesInDirectory } from "@/utils/listFilesInDirectory";

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
  // setImageSrc,
}) => {
  const [newFile, setNewFile] = useState("");
  const [fileInfos, setFileInfos] = useState<FileInfo[]>([]);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

  const handleNewFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length === 100 && newFile.length < 100) {
      handleError(); // 100文字になった瞬間にのみトーストを表示
    }
    setNewFile(e.target.value);
  };

  const loadFileContent = useCallback(
    async (fileName: string) => {
      const home = await homeDir();
      const path = `${home}.config/flk/bookmarks/${fileName}`;
      const content = await readTextFile(path);
      const parsedContent = JSON.parse(content);

      setSelectedFileContent(parsedContent);
    },
    [setSelectedFileContent]
  );

  const handleDeleteFile = useCallback(
    async (fileName: string) => {
      const home = await homeDir();
      const path = `${home}.config/flk/bookmarks/${fileName}`;
      try {
        await invoke("delete_file", { filePath: path });
        listFilesInDirectory(setLoading, setFiles);
        setSelectedFileContent(null); // ファイル削除後にコンテンツをリセット
      } catch (error) {
        console.error("ファイルの削除エラー:", error);
      }
    },
    [setLoading, setFiles, setSelectedFileContent]
  );

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

  const refreshFileList = useCallback(() => {
    listFilesInDirectory(setLoading, setFiles);
    if (files.length > 0) {
      fetchFileInfos();
    }
  }, [files, fetchFileInfos, setLoading, setFiles]);

  useEffect(() => {
    refreshFileList();

    const intervalId = setInterval(refreshFileList, 5000);

    return () => clearInterval(intervalId);
  }, [refreshFileList]);

  useEffect(() => {
    console.log("selectedFileContentが変更されました:", selectedFileContent);
  }, [selectedFileContent]);

  const fileInfosMemo = useMemo(() => fileInfos, [fileInfos]);

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
                    onClick={() =>
                      setActiveAccordion(
                        activeAccordion === "item-1" ? null : "item-1"
                      )
                    }
                  >
                    <AccordionTrigger className="flex-grow pb-0 text-xs font-bold leading-3">
                      <p className="hover:underline">{FINDER}</p>
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
                  <AccordionContent isVisible={activeAccordion === "item-1"}>
                    <AccordionContentComponent
                      loading={loading}
                      fileInfos={fileInfosMemo}
                      loadFileContent={loadFileContent}
                      handleDeleteFile={handleDeleteFile}
                    />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <div
                    className="flex min-w-0 items-center justify-between border-y"
                    onClick={() =>
                      setActiveAccordion(
                        activeAccordion === "item-2" ? null : "item-2"
                      )
                    }
                  >
                    <AccordionTrigger className="flex-grow pb-0 text-xs font-bold leading-3">
                      <p className="hover:underline">{OUTLINE}</p>
                      <div className="flex w-full items-center justify-end">
                        {selectedFileContent ? (
                          <div className="flex gap-0.5">
                            <p className="text-xs">
                              {selectedFileContent?.bookmark.bookmarkTitle}
                            </p>
                            <p className="text-xs">
                              {selectedFileContent?.bookmark.nsfw && (
                                <NSFWBadge />
                              )}
                            </p>
                            <p className="text-xs text-stone-500">
                              (
                              {
                                selectedFileContent?.bookmark.bookmarkList
                                  .length
                              }
                              )
                            </p>
                            <PlugZap className="h-4 w-4" />
                          </div>
                        ) : (
                          // 右寄せ
                          <div className="flex w-full items-center justify-end">
                            <Unplug className="h-3.5 w-3.5" />
                          </div>
                        )}
                      </div>
                    </AccordionTrigger>
                  </div>
                  <AccordionContent isVisible={activeAccordion === "item-2"}>
                    <OutlineContentComponent
                      selectedFileContent={selectedFileContent}
                    />
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
