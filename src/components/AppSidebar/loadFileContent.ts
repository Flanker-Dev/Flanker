import { readTextFile } from "@tauri-apps/api/fs";
import { homeDir } from "@tauri-apps/api/path";

interface Bookmark {
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

export const loadFileContent = async (
  fileName: string,
  setSelectedFileContent: React.Dispatch<
    React.SetStateAction<FileContent | null>
  >
) => {
  const home = await homeDir();
  const path = `${home}.config/flanker/bookmarks/${fileName}`;
  const content = await readTextFile(path);

  setSelectedFileContent(JSON.parse(content));
};
