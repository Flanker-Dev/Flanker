import { v4 as uuidv4 } from "uuid";

import { FileConfig } from "@/types/types";
import { handleSave } from "@/utils/saveConfig";

export const handleGenerate = async (
  config: FileConfig | null,
  newFile: string,
  setNewFile: (value: string) => void,
  setConfig: (config: FileConfig | null) => void
) => {
  if (config) {
    config.bookmark.bookmarkTitle = newFile;
  }
  await handleSave(config, newFile);
  setNewFile("");
  setConfig({
    bookmark: {
      bookmarkTitle: newFile,
      bookmarkDescription: "",
      bookmarkTags: [],
      emoji: "",
      nsfw: false,
      createdAt: "",
      updatedAt: "",
      bookmarkList: [
        {
          bookmarkInfo: [
            {
              id: uuidv4(),
              title: "",
              url: "",
              description: "",
              tags: [],
            },
          ],
        },
      ],
    },
  });
};
