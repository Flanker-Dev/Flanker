import { writeTextFile } from "@tauri-apps/api/fs";
import { homeDir } from "@tauri-apps/api/path";

import { FileConfig } from "../types/types";

export const saveConfig = async (config: FileConfig, fileName: string) => {
  const configString = JSON.stringify(config, null, 2);
  const home = await homeDir();
  const path = `${home}.config/flk/bookmarks/${fileName}`;

  await writeTextFile({
    path: `${path}.json`,
    contents: configString,
  });
};

export const handleSave = async (
  config: FileConfig | null,
  fileName: string
) => {
  // createdAtとupdatedAtを更新する
  if (config) {
    config.bookmark.updatedAt = new Date().toISOString();
    if (!config.bookmark.createdAt) {
      config.bookmark.createdAt = new Date().toISOString();
    }
  }

  if (config) {
    await saveConfig(config, fileName);
  }
};
