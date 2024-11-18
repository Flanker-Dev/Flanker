import { ClipboardCopyIcon } from "@radix-ui/react-icons";
// import Marquee from "react-fast-marquee";

import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
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
}: {
  selectedFileContent: {
    bookmark: { bookmarkList: { name: string; bookmarkInfo: Bookmark[] }[] };
  };
}) => {
  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(`https://${url}`);
    toast({
      description: "Copied!",
    });
  };

  const renderBookmark = (
    bookmark: Bookmark,
    groupIndex: number,
    bookmarkIndex: number
  ) => (
    <Card
      key={`${groupIndex}-${bookmarkIndex}`}
      className="w-32 select-none space-y-1 rounded border"
    >
      <CardHeader className="flex flex-row justify-between">
        <a
          href={bookmark.url}
          className="flex items-center justify-start"
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
          <CardTitle className="flex w-20 flex-row items-center justify-center capitalize leading-none">
            {/* <Marquee
              gradient={false}
              speed={40}
              pauseOnHover={true}
              autoFill={false}
            >
              {bookmark.title}&nbsp;
            </Marquee> */}
          </CardTitle>
        </a>
      </CardHeader>
      <CardContent>
        <CardDescription className="truncate">
          {bookmark.description}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex flex-row items-center justify-between">
        <div className="w-5/6 select-text">
          {/* <Marquee gradient={false} speed={40} pauseOnHover={true}>
            {bookmark.url}&nbsp;
          </Marquee> */}
        </div>
        <Button
          variant={"clipboard"}
          size={"clipboard"}
          onClick={() => handleCopyUrl(bookmark.url)}
          className="w-1/6 border-l"
        >
          <ClipboardCopyIcon />
        </Button>
      </CardFooter>
    </Card>
  );

  const renderBookmarkGroup = (
    group: { bookmarkInfo: Bookmark[] },
    groupIndex: number
  ) =>
    group.bookmarkInfo.map((bookmark, bookmarkIndex) =>
      renderBookmark(bookmark, groupIndex, bookmarkIndex)
    );

  return (
    <div className="flex flex-wrap gap-2">
      {selectedFileContent ? (
        selectedFileContent.bookmark.bookmarkList.map(renderBookmarkGroup)
      ) : (
        <p>No bookmarks available</p>
      )}
    </div>
  );
};
