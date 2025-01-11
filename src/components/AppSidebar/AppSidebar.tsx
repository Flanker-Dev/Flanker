import { readTextFile } from "@tauri-apps/api/fs";
import { homeDir } from "@tauri-apps/api/path";
import { invoke } from "@tauri-apps/api/tauri";
import { SquareMinus } from "lucide-react";
import { useEffect, useState, useCallback, useMemo } from "react";

import { AccordionContentComponent } from "./FinderContent/FinderContent";
import { OutlineContentComponent } from "./OutlineContent/OutlineContent";
import { FileManager } from "../FileManager/FileManager";
// import { DevModeIndicator } from "./DevModeIndicator/DevModeIndicator";
import { SelectedFileContentDisplay } from "./SelectedFileContentDisplay/SelectedFileContentDisplay";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../ui/accordion";
import { Button } from "../ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from "../ui/sidebar";
// import { handleNewFileChange } from "@/components/AppSidebar/handleNewFileChange";
// import { isDev } from "@/constants/Mode";
import { FINDER, OUTLINE } from "@/constants/Text";
import { FileContent, FileInfo } from "@/types/types";
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

export const AppSidebar = ({
  files,
  loading,
  selectedFileContent,
  setSelectedFileContent,
  setFiles,
  setLoading,
}: AppSidebarProps) => {
  const [newFile, setNewFile] = useState("");
  const [fileInfos, setFileInfos] = useState<FileInfo[]>([]);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  const [closeAllAccordions, setCloseAllAccordions] = useState(false);

  // const [isVisibleFinder, setIsVisibleFinder] = useState(false);
  // const [isVisibleOutline, setIsVisibleOutline] = useState(false);

  // const toggleVisibilityFinder = useCallback(() => {
  //   setIsVisibleFinder((prev) => !prev);
  // }, []);

  // const toggleVisibilityOutline = useCallback(() => {
  //   setIsVisibleFinder((prev) => !prev);
  // }, []);

  // Read the content of the selected file
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

  // Delete file
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

  // Fetch file infos
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

  // Refresh the file list every 5 seconds
  const refreshFileList = useCallback(() => {
    listFilesInDirectory(setLoading, setFiles);
    if (files.length > 0) {
      fetchFileInfos();
    }
  }, [files, fetchFileInfos, setLoading, setFiles]);

  // Fetch file infos on mount
  useEffect(() => {
    refreshFileList();

    const intervalId = setInterval(refreshFileList, 5000);

    return () => clearInterval(intervalId);
  }, [refreshFileList]);

  // Prevent unnecessary re-renders
  const fileInfosMemo = useMemo(() => fileInfos, [fileInfos]);

  // 全て閉じるボタンのクリックハンドラ
  const handleCloseAllAccordions = () => {
    setCloseAllAccordions(true); // トリガーをセット
  };

  // closeAllAccordions の状態が変化した時の処理
  useEffect(() => {
    if (closeAllAccordions) {
      setCloseAllAccordions(false); // 状態をリセット
    }
  }, [closeAllAccordions]);

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup className="mt-6 p-0">
          <SidebarGroupContent>
            <SidebarMenu className="max-h-[calc(100vh-95px)]">
              <Accordion type="single" collapsible defaultValue="finder">
                {/* ---------- Finder Accordion ---------- */}
                <AccordionItem value="finder">
                  <div
                    className={`flex min-w-0 items-center justify-between border-t`}
                    onClick={() =>
                      setActiveAccordion(
                        activeAccordion === "finder" ? null : "finder"
                      )
                    }
                  >
                    <AccordionTrigger className="w-full flex-grow cursor-default justify-start pb-0 text-xs font-bold leading-3 hover:underline">
                      <p>{FINDER}</p>
                    </AccordionTrigger>
                    <div className="flex-shrink-0 pb-0 leading-3">
                      <FileManager
                        newFile={newFile}
                        setNewFile={setNewFile}
                        files={files}
                        loading={loading}
                      />
                    </div>
                  </div>
                  <AccordionContent isVisible={activeAccordion === "item-1"}>
                    <AccordionContentComponent
                      fileInfos={fileInfosMemo}
                      loadFileContent={loadFileContent}
                      handleDeleteFile={handleDeleteFile}
                    />
                  </AccordionContent>
                </AccordionItem>
                {/* ---------- Outline Accordion ---------- */}
                <AccordionItem value="outline">
                  <div
                    className="flex min-w-0 items-center justify-between"
                    onClick={() =>
                      setActiveAccordion(
                        activeAccordion === "outline" ? null : "outline"
                      )
                    }
                  >
                    <AccordionTrigger
                      className={`w-full flex-grow cursor-default pb-0 text-xs font-bold leading-3 ${
                        activeAccordion === "finder"
                          ? "rounded-bl-lg border-t"
                          : "border-y"
                      }`}
                    >
                      <p className="w-full hover:underline">{OUTLINE}</p>
                    </AccordionTrigger>
                    <div className="flex border-y">
                      <SelectedFileContentDisplay
                        selectedFileContent={selectedFileContent}
                      />
                      <Button
                        onClick={handleCloseAllAccordions}
                        variant={"fit"}
                        size={"fit"}
                        className="cursor-default rounded hover:bg-stone-800 hover:text-white"
                      >
                        <SquareMinus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <AccordionContent isVisible={activeAccordion === "item-2"}>
                    <OutlineContentComponent
                      selectedFileContent={selectedFileContent}
                      closeAllAccordions={closeAllAccordions}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {/* <DevModeIndicator isDev={isDev} /> */}
    </Sidebar>
  );
};
