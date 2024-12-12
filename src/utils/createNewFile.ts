import { createDir, exists } from "@tauri-apps/api/fs";
import { homeDir } from "@tauri-apps/api/path";

import { saveConfig } from "./saveConfig";
import { fileConfig } from "@/constants/NewFile";

export const handleCreateNewFile = async (
  newFile: string, // ja:新規ファイル名, en:New file name
  setNewFile: (newFile: string) => void // ja:新規ファイル名をセットする関数, en:A function that sets the new file name
) => {
  const home = await homeDir();
  const path = `${home}.config/flk/bookmarks/`;

  // ja:フォルダが存在するか確認
  // en: Check if the folder exists
  const folderExists = await exists(path);

  // ja:もし${home}.config/flk/bookmarks/が存在しない場合は作成する
  // en:If ${home}.config/flk/bookmarks/ does not exist, create it
  if (!folderExists) {
    await createDir(path, { recursive: true });
  }

  // ja:ファイル名が空でない場合は保存する
  // en:If the file name is not empty, save it
  if (newFile.trim()) {
    await saveConfig(fileConfig, newFile);
    setNewFile("");
  }
};
