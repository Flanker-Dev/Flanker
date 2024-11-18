import { readTextFile } from "@tauri-apps/api/fs";
import { homeDir } from "@tauri-apps/api/path";

// JSONファイルの内容を読み込む関数
export const loadFileContent = async (fileName, setSelectedFileContent) => {
  const home = await homeDir();
  const path = `${home}.config/flanker/bookmarks/${fileName}`;
  const content = await readTextFile(path);
  setSelectedFileContent(JSON.parse(content)); // 渡された関数でファイル内容を設定
};
