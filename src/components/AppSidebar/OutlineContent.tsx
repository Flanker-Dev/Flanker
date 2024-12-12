import {
  CornerRightDown,
  MessageSquareText,
  Signature,
  SquareArrowOutUpRight,
  Tag,
  Tags,
} from "lucide-react";

import { ScrollArea } from "../ui/scroll-area";
import { getFavicon } from "@/constants/Favicon";
import { FileContent } from "@/types/types";

interface OutlineContentComponentProps {
  selectedFileContent: FileContent | null;
}

export const OutlineContentComponent: React.FC<
  OutlineContentComponentProps
> = ({ selectedFileContent }) => {
  return (
    <ScrollArea className="relative left-[1px] h-[calc(100vh-130px)] border-b">
      {selectedFileContent ? (
        <div>
          {selectedFileContent.bookmark.bookmarkList.map(
            (bookmarkList, index) => (
              <div key={`${bookmarkList.name}-${index}`}>
                {bookmarkList.bookmarkInfo.map((bookmark) => (
                  <div
                    key={bookmark.id}
                    className="border-b border-transparent"
                  >
                    <div className="flex cursor-default flex-col text-sm">
                      <div className="flex items-center gap-1 pl-1 hover:bg-stone-600">
                        <img
                          src={`${getFavicon}${bookmark.url.replace(
                            /https?:\/\//,
                            ""
                          )}`}
                          alt={bookmark.title}
                          className="h-3 w-3 rounded bg-white"
                        />
                        <p className="text-xs">{bookmark.title}</p>
                      </div>
                      <div className="ml-[9px] flex items-center gap-1 border-l border-stone-400 pl-2 text-stone-400 hover:bg-stone-600">
                        <Signature className="h-3 w-3 text-blue-500" />
                        <p className="w-52 truncate text-xs">{bookmark.id}</p>
                      </div>
                      <div className="ml-[9px] flex cursor-pointer items-center gap-1 border-l border-stone-400 pl-2 text-stone-400 hover:bg-stone-600 hover:text-white">
                        <SquareArrowOutUpRight className="h-3 w-3 text-purple-500" />
                        {/* 親幅いっぱいにリンク */}
                        {bookmark.url ? (
                          <a
                            className="w-52 truncate text-xs"
                            href={bookmark.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {bookmark.url}
                          </a>
                        ) : (
                          <p className="w-52 truncate text-xs">No Url</p>
                        )}
                      </div>
                      <div className="ml-[9px] flex items-center gap-1 border-l border-stone-400 pl-2 text-stone-400 hover:bg-stone-600">
                        <MessageSquareText className="h-3 w-3 text-green-500" />
                        {bookmark.description ? (
                          <p className="w-52 truncate text-xs">
                            {bookmark.description}
                          </p>
                        ) : (
                          <p className="w-52 truncate text-xs">
                            No Description
                          </p>
                        )}
                      </div>
                      {/* tags */}
                      <div className="ml-[9px] flex flex-col border-l border-stone-400 text-stone-400">
                        <div className="group/item flex items-center gap-1 pl-2 hover:bg-stone-600">
                          <Tags className="h-3 w-3 text-yellow-500" />
                          <p className="text-xs">Tags</p>
                          <CornerRightDown className="h-3 w-3 text-transparent group-hover/item:text-stone-400" />
                        </div>
                        <div className="flex flex-col pl-2">
                          {bookmark.tags.length > 0 ? (
                            bookmark.tags.map((tag) => (
                              <div
                                key={tag}
                                className="ml-1.5 flex items-center border-l border-stone-400 pl-2.5 text-xs hover:bg-stone-600"
                              >
                                <Tag className="mr-1 h-3 w-3 text-neutral-400" />{" "}
                                <p>{tag}</p>
                              </div>
                            ))
                          ) : (
                            <span className="ml-1.5 border-l border-stone-400 px-1 pl-2.5 text-xs">
                              No Tags
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      ) : (
        <div>No file selected</div>
      )}
    </ScrollArea>
  );
};
