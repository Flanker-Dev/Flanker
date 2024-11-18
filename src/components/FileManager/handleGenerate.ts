import { FileConfig } from "@/shared/types/types";
import { handleSave } from "@/shared/utils/saveConfig";

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
