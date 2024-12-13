import Favicon from "../Favicon/Favicon";
import { FileConfig } from "@/types/types";

export const BigCard = ({
  selectedFileContent,
}: {
  selectedFileContent: FileConfig;
}) => {
  return (
    <ul className="flex flex-wrap gap-1">
      {selectedFileContent && selectedFileContent.bookmark.bookmarkList ? (
        selectedFileContent.bookmark.bookmarkList.map((group, groupIndex) =>
          group.bookmarkInfo.map((bookmark, bookmarkIndex) => (
            <li key={`${groupIndex}-${bookmarkIndex}`}>
              <Favicon url={bookmark.url} title={bookmark.title} />
            </li>
          ))
        )
      ) : (
        <p>No bookmarks available</p>
      )}
    </ul>
  );
};
