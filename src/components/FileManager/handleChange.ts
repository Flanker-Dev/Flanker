import { FileConfig } from "@/types/types";

export const handleChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  config: FileConfig | null,
  setConfig: (config: FileConfig | null) => void,
  infoIndex?: number
) => {
  if (!config) return;

  const { name, value, type, checked } = e.target;
  let updatedConfig;

  if (name === "bookmarkList") {
    updatedConfig = {
      ...config,
      bookmark: {
        ...config.bookmark,
        bookmarkList: config.bookmark.bookmarkList.map((item, index) =>
          index === 0 ? { ...item, name: value } : item
        ),
      },
    };
  } else if (name === "bookmarkTags") {
    updatedConfig = {
      ...config,
      bookmark: {
        ...config.bookmark,
        bookmarkTags: value.split(","),
      },
    };
  } else if (
    ["title", "url", "description", "tags"].includes(name) &&
    infoIndex !== undefined
  ) {
    updatedConfig = {
      ...config,
      bookmark: {
        ...config.bookmark,
        bookmarkList: config.bookmark.bookmarkList.map((item, index) =>
          index === 0
            ? {
                ...item,
                bookmarkInfo: item.bookmarkInfo.map((info, i) =>
                  i === infoIndex
                    ? {
                        ...info,
                        [name]: name === "tags" ? value.split(",") : value,
                      }
                    : info
                ),
              }
            : item
        ),
      },
    };
  } else if (type === "checkbox") {
    updatedConfig = {
      ...config,
      bookmark: { ...config.bookmark, [name]: checked },
    };
  } else {
    updatedConfig = {
      ...config,
      bookmark: { ...config.bookmark, [name]: value },
    };
  }

  setConfig(updatedConfig);
};
