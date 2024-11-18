import { FileConfig } from "@/shared/types/types";

export const handleDeleteBookmarkInfo = (
  config: FileConfig,
  setConfig: (config: FileConfig) => void,
  infoIndex: number
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
              bookmarkInfo: item.bookmarkInfo.filter((_, i) => i !== infoIndex),
            }
          : item
      ),
    },
  };

  setConfig(updatedConfig);
};
