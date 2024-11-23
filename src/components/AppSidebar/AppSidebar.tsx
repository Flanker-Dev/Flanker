import { readTextFile } from "@tauri-apps/api/fs";
import { homeDir } from "@tauri-apps/api/path";
import { invoke } from "@tauri-apps/api/tauri";
// import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";
import { useEffect, useState } from "react";

// import { ImageUploaderButton } from "../Buttons/ImageUploaderButton/ImageUploaderButton";
import { FileManager } from "../FileManager/FileManager";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  // SidebarMenuButton,
  // SidebarMenuItem,
} from "@/components/ui/sidebar";
import { handleCreateNewFile } from "@/shared/utils/createNewFile";
import { handleError } from "@/shared/utils/errorToast";
import { listFilesInDirectory } from "@/shared/utils/listFilesInDirectory";

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
  // setImageSrc: (src: string | null) => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  files,
  loading,
  setSelectedFileContent,
  setFiles,
  setLoading,
  // setImageSrc,
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
    console.log("ファイルの内容:", JSON.parse(content));

    setSelectedFileContent(JSON.parse(content));
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
                selectedFileContent={null}
              />
              {/* <ImageUploaderButton setImageSrc={setImageSrc} /> */}
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
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <div className="m-2">
        {isDev ? (
          <p className="cursor-default font-bold italic text-zinc-500">
            Dev Mode
          </p>
        ) : null}
        <img
          src="src/assets/Flanker_full_logo.svg"
          alt="Flanker Logo"
          className="w-24 cursor-default"
        />
      </div>
    </Sidebar>
  );
};
