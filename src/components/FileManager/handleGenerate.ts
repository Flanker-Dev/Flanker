import { v4 as uuidv4 } from "uuid";

import { FileConfig } from "@/types/types";
import { handleSave } from "@/utils/saveConfig";

export const handleGenerate = async (
  config: FileConfig | null,
  newFile: string,
  setNewFile: (value: string) => void,
  setConfig: (config: FileConfig | null) => void
) => {
  await handleSave(config, newFile);
  setNewFile("");
  setConfig({
    bookmark: {
      bookmarkTitle: "",
      bookmarkDescription: "",
      bookmarkTags: [],
      emoji: "",
      nsfw: false,
      createdAt: "",
      updatedAt: "",
      bookmarkList: [
        {
          name: "",
          bookmarkInfo: [
            {
              id: uuidv4(), // Add the id property here
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
