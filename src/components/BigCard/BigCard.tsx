import { getFavicon } from "@/shared/const/Favicon";

interface Bookmark {
  title: string;
  url: string;
}

const Favicon = ({ url, title }: { url: string; title: string }) => {
  return (
    <>
      {url !== "" && (
        <a href={url} target="_blank" rel="noreferrer">
          <img
            src={`${getFavicon}${url.replace(/https?:\/\//, "")}`}
            alt={title}
            className="h-6 w-6"
          />
        </a>
      )}
    </>
  );
};

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
