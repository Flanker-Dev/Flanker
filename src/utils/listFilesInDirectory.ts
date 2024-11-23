import { readDir } from "@tauri-apps/api/fs";
import { homeDir } from "@tauri-apps/api/path";

export const listFilesInDirectory = async (
  setLoading: (loading: boolean) => void,
  setFiles: (files: string[]) => void
) => {
  const home = await homeDir();
  const path = `${home}.config/flanker/bookmarks/`;

  try {
    // ディレクトリ内のファイルを取得
    const result = await readDir(path, { recursive: false });

    // ファイル名を抽出し、stateに保存
    const fileNames = result.map((file) => file.name || "");
    setFiles(fileNames); // ここでエラーが出ていることを確認
  } catch (error) {
    console.error("Error reading directory:", error);
  } finally {
    setLoading(false); // 読み込みが終了したらローディングを終了
  }
};
