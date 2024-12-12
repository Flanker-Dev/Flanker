import {
  MessageSquareText,
  Signature,
  SquareArrowOutUpRight,
  Tag,
  Tags,
} from "lucide-react";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../../ui/accordion";
import { ScrollArea } from "../../ui/scroll-area";
import { getFavicon } from "@/constants/Favicon";
import { NODESCRIPTION, NOTAGS, NOTFOUND, NOURL, TAGS } from "@/constants/Text";
import { OutlineContentComponentProps } from "@/types/types";

export const OutlineContentComponent = ({
  selectedFileContent,
}: OutlineContentComponentProps) => {
  return (
    <ScrollArea className="scrollbar relative left-[1px] h-[calc(100vh-130px)] border-b">
      {selectedFileContent ? (
        <Accordion type="multiple">
          {selectedFileContent.bookmark.bookmarkList.map(
            (bookmarkList, index) => (
              <AccordionItem
                key={`${bookmarkList.name}-${index}`}
                value={`${bookmarkList.name}-${index}`}
              >
                <AccordionTrigger className="flex-grow pb-0 text-xs font-bold leading-3 hover:bg-stone-600 hover:underline">
                  {bookmarkList.bookmarkInfo.map((bookmark) => (
                    <div
                      key={bookmark.id}
                      className="flex w-full items-center pl-1"
                    >
                      <img
                        src={`${getFavicon}${bookmark.url.replace(
                          /https?:\/\//,
                          ""
                        )}`}
                        alt={bookmark.title}
                        className="h-3 w-3 rounded bg-white"
                      />
                      <p className="ml-1 text-xs">{bookmark.title}</p>
                    </div>
                  ))}
                </AccordionTrigger>
                <AccordionContent isVisible={true}>
                  {bookmarkList.bookmarkInfo.map((bookmark) => (
                    <div
                      key={bookmark.id}
                      className="border-b border-transparent"
                    >
                      <div className="flex cursor-default flex-col text-sm">
                        <div className="flex flex-col">
                          <div>
                            {/* bookmark.id */}
                            <div className="ml-2 flex items-center gap-1 border-l border-stone-400 pl-2 text-stone-400 hover:bg-stone-600">
                              <Signature className="h-3 w-3 text-blue-500" />
                              <p className="w-52 truncate text-xs">
                                {bookmark.id}
                              </p>
                            </div>

                            {/* bookmark.url */}
                            <div className="ml-2 flex cursor-pointer items-center gap-1 border-l border-stone-400 pl-2 text-stone-400 hover:bg-stone-600 hover:text-white">
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
                                <p className="w-52 truncate text-xs">{NOURL}</p>
                              )}
                            </div>

                            {/* bookmark.description */}
                            <div className="ml-2 flex items-center gap-1 border-l border-stone-400 pl-2 text-stone-400 hover:bg-stone-600">
                              <MessageSquareText className="h-3 w-3 text-green-500" />
                              {bookmark.description ? (
                                <p className="w-52 truncate text-xs">
                                  {bookmark.description}
                                </p>
                              ) : (
                                <p className="w-52 truncate text-xs">
                                  {NODESCRIPTION}
                                </p>
                              )}
                            </div>

                            {/* bookmark.tags */}
                            <Accordion type="single" collapsible>
                              <AccordionItem value="tags">
                                <AccordionTrigger className="group/item flex items-center gap-1 pb-0 pl-4 hover:bg-stone-600">
                                  <Tags className="h-3 w-3 text-yellow-500" />
                                  <p className="text-xs">
                                    {TAGS}
                                    <span className="ml-0.5 text-neutral-400">
                                      ({bookmark.tags.length})
                                    </span>
                                  </p>
                                </AccordionTrigger>
                                <AccordionContent isVisible={true}>
                                  <div className="flex flex-col pl-[18px]">
                                    {bookmark.tags.length > 0 ? (
                                      bookmark.tags.map((tag) => (
                                        <div
                                          key={tag}
                                          className="ml-1.5 flex items-center border-l border-stone-400 pl-2.5 text-xs hover:bg-stone-600"
                                        >
                                          <Tag className="mr-1 h-3 w-3 text-yellow-500" />
                                          <p className="ml-0.5 text-neutral-400">
                                            {tag}
                                          </p>
                                        </div>
                                      ))
                                    ) : (
                                      <span className="ml-1.5 border-l border-stone-400 px-1 pl-2.5 text-xs">
                                        {NOTAGS}
                                      </span>
                                    )}
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            )
          )}
        </Accordion>
      ) : (
        <div className="ml-1">{NOTFOUND}</div>
      )}
    </ScrollArea>
  );
};
