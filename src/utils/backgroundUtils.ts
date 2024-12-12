import {
  writeBinaryFile,
  readBinaryFile,
  createDir,
  removeFile,
  BaseDirectory,
  readDir,
} from "@tauri-apps/api/fs";
import { homeDir } from "@tauri-apps/api/path";

import { useStore } from "../store/store";

// 画像を保存する関数
export const saveImage = async (file: File): Promise<void> => {
  const homePath = await homeDir();
  const saveDir = `${homePath}.config/flk/images`;
  const savePath = `${saveDir}/${file.name}`;

  // ディレクトリが存在しない場合は作成
  await createDir(saveDir, { dir: BaseDirectory.Home, recursive: true });

  // 既存の画像を削除
  await removeExistingImages(saveDir);

  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  await writeBinaryFile(
    { path: savePath, contents: uint8Array },
    { dir: BaseDirectory.Home }
  );

  // 保存した画像のパスを保存
  useStore.getState().setSavedImagePath(file.name);
  console.log(`Image saved: ${savePath}`);
};

// 既存の画像を削除する関数
const removeExistingImages = async (directory: string): Promise<void> => {
  try {
    const files = await readDir(directory, { dir: BaseDirectory.Home });
    for (const file of files) {
      const filePath = `${directory}/${file.name}`;
      // .DS_Storeファイルをスキップ
      if (file.name === ".DS_Store") {
        continue;
      }
      console.log(`Remove existing images: ${filePath}`);
      await removeFile(filePath, { dir: BaseDirectory.Home });
    }
    console.log(`Existing images have been removed.: ${directory}`);
  } catch (error) {
    console.error("Failed to remove existing images:", error);
  }
};

// 画像を読み込む関数
export const loadImageBase64 = async (
  fileName: string
): Promise<string | null> => {
  const homePath = await homeDir();
  const imagePath = `${homePath}.config/flk/images/${fileName}`;

  try {
    const uint8Array = await readBinaryFile(imagePath, {
      dir: BaseDirectory.Home,
    });
    const blob = new Blob([uint8Array], { type: "image/png" });
    const base64 = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(blob);
    });
    return base64;
  } catch (e) {
    console.error("Error loading image:", e);
    return null;
  }
};
