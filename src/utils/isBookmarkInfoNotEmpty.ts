import { FileContent } from "../types/types";

export const isBookmarkInfoNotEmpty = (
  selectedFileContent: FileContent | null
) => {
  return (
    selectedFileContent?.bookmark.bookmarkList[0]?.bookmarkInfo[0]?.title !== ""
  );
};
