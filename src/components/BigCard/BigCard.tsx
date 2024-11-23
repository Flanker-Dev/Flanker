import Favicon from "../Favicon/Favicon";

interface Bookmark {
  title: string;
  url: string;
}

export const BigCard = ({
  selectedFileContent,
}: {
  selectedFileContent: {
    bookmark: { bookmarkList: { name: string; bookmarkInfo: Bookmark[] }[] };
  };
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
