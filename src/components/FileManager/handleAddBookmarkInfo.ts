import { v4 as uuidv4 } from "uuid";

import { FileConfig } from "@/types/types";

export const handleAddBookmarkInfo = (
  config: FileConfig | null,
  setConfig: (config: FileConfig | null) => void
) => {
  if (!config) return;

  const updatedConfig = {
    ...config,
    bookmark: {
      ...config.bookmark,
      bookmarkList: config.bookmark.bookmarkList.map((item, index) =>
        index === 0
          ? {
              ...item,
              bookmarkInfo: item.bookmarkInfo
                .map((info) => ({
                  ...info,
                  id: info.id || uuidv4(),
                }))
                .concat({
                  id: uuidv4(),
                  title: "",
                  url: "",
                  description: "",
                  tags: [],
                }),
            }
          : item
      ),
    },
  };

  setConfig(updatedConfig);
};
