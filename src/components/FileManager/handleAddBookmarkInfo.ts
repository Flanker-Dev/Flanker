import { FileConfig } from "@/shared/types/types";

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
              bookmarkInfo: [
                ...item.bookmarkInfo,
                { title: "", url: "", description: "", tags: [] },
              ],
            }
          : item
      ),
    },
  };

  setConfig(updatedConfig);
};
