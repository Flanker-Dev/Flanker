import { readTextFile, exists, BaseDirectory } from "@tauri-apps/api/fs";
import { homeDir } from "@tauri-apps/api/path";

import { FileConfig } from "@/types/types";

export const loadConfig = async (): Promise<FileConfig | null> => {
  const homePath = await homeDir();
  const configFilePath = `${homePath}.config/flk/config.json`;

  if (await exists(configFilePath, { dir: BaseDirectory.Home })) {
    const config = JSON.parse(
      await readTextFile(configFilePath, { dir: BaseDirectory.Home })
    ) as FileConfig;
    return config;
  } else {
    console.error(`コンフィグファイルが見つかりません: ${configFilePath}`);
    return null;
  }
};
