import { ClipboardCopyIcon } from "@radix-ui/react-icons";
// import Marquee from "react-fast-marquee";

import { Badge } from "../ui/badge";
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

export const BigCard = ({
  selectedFileContent,
}: {
  selectedFileContent: {
    bookmark: { bookmarkList: { name: string; bookmarkInfo: Bookmark[] }[] };
  };
}) => {
  return (
    <ul className="grid grid-cols-3 gap-2">
      {selectedFileContent && selectedFileContent.bookmark.bookmarkList ? (
        selectedFileContent.bookmark.bookmarkList.map((group, groupIndex) =>
          group.bookmarkInfo.map((bookmark, bookmarkIndex) => (
            <Card
              key={`${groupIndex}-${bookmarkIndex}`}
              className="select-none space-y-1 rounded border"
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
                  <CardTitle className="block items-center justify-center truncate capitalize leading-none">
                    {bookmark.title}
                  </CardTitle>
                </a>
                <Button
                  variant={"ghost"}
                  onClick={() => {
                    navigator.clipboard.writeText(`https://${bookmark.url}`);
                    toast({
                      description: "Copied!",
                    });
                  }}
                >
                  <ClipboardCopyIcon />
                </Button>
              </CardHeader>
              <CardContent>
                <CardDescription className="truncate">
                  {bookmark.description}
                </CardDescription>
                <ul className="flex flex-wrap space-x-2">
                  {bookmark.tags &&
                    bookmark.tags.map((tag, tagIndex) => (
                      <li key={tagIndex}>
                        <Badge variant="outline" className="text-nowrap">
                          {tag}
                        </Badge>
                      </li>
                    ))}
                </ul>
              </CardContent>
              <CardFooter className="flex flex-col items-start justify-start space-y-1">
                {/* <Marquee
                  gradient={false}
                  speed={40}
                  pauseOnHover={true}
                  className="select-text"
                >
                  {bookmark.url}
                </Marquee> */}
              </CardFooter>
            </Card>
          ))
        )
      ) : (
        <p>No bookmarks available</p>
      )}
    </ul>
  );
};
