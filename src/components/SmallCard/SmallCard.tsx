import { ClipboardCopyIcon } from "@radix-ui/react-icons";
// import Marquee from "react-fast-marquee";

import { Button } from "../ui/button";
import { toast } from "@/hooks/use-toast";
import { getFavicon } from "@/shared/const/Favicon";

interface Bookmark {
  title: string;
  description: string;
  url: string;
  tags: string[];
}

export const SmallCard = ({
  selectedFileContent,
  open,
}: {
  selectedFileContent: {
    bookmark: { bookmarkList: { name: string; bookmarkInfo: Bookmark[] }[] };
  };
  open: boolean;
}) => {
  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(`https://${url}`);
    toast({
      description: "Copied!",
    });
  };

  const hasBookmarks = (content: typeof selectedFileContent) =>
    content && content.bookmark.bookmarkList;

  const renderBookmark = (
    bookmark: Bookmark,
    groupIndex: number,
    bookmarkIndex: number
  ) => (
    <div
      key={`${groupIndex}-${bookmarkIndex}`}
      className="mt-0.5 rounded border p-2"
    >
      <div className="flex items-center justify-between">
        <a
          href={bookmark.url}
          className="flex items-center"
          target="_blank"
          rel="noopener noreferrer"
        >
          {bookmark.url !== "" && (
            <img
              src={`${getFavicon}${bookmark.url.replace(/https?:\/\//, "")}`}
              alt={bookmark.title}
              className="mr-1 h-6 w-6"
            />
          )}
          <p className="truncate capitalize">{bookmark.title}</p>
        </a>
        <Button
          variant={"clipboard"}
          size={"clipboard"}
          onClick={() => handleCopyUrl(bookmark.url)}
        >
          <ClipboardCopyIcon />
        </Button>
      </div>
      {/* <p className="truncate">{bookmark.description}</p> */}
    </div>
  );

  return (
    <ul
      className={`grid gap-1 lg:grid-cols-3 ${open ? "sm:grid-cols-1" : "sm:grid-cols-1"}`}
    >
      {hasBookmarks(selectedFileContent) ? (
        selectedFileContent.bookmark.bookmarkList.map((group, groupIndex) =>
          group.bookmarkInfo
            ? group.bookmarkInfo.map((bookmark, bookmarkIndex) =>
                renderBookmark(bookmark, groupIndex, bookmarkIndex)
              )
            : null
        )
      ) : (
        <p>No bookmarks available</p>
      )}
    </ul>
  );
};
