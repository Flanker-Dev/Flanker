import { Button } from "../../ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "../../ui/context-menu";
import { ScrollArea } from "../../ui/scroll-area";
import { NSFWBadge } from "../NSFWBadge/NSFWBadge";
import { DELETE, NOTFOUND } from "@/constants/Text";
import { FileInfo } from "@/types/types";

interface AccordionContentComponentProps {
  fileInfos: FileInfo[];
  loadFileContent: (fileName: string) => void;
  handleDeleteFile: (fileName: string) => void;
}

export const AccordionContentComponent = ({
  fileInfos,
  loadFileContent,
  handleDeleteFile,
}: AccordionContentComponentProps) => {
  return (
    <ScrollArea className="relative left-[1px] h-[calc(100vh-130px)] border-t">
      <ul className="mt-0.5 flex flex-col gap-0.5">
        {fileInfos.length > 0 ? (
          fileInfos
            .filter((fileInfo) => fileInfo.name !== ".DS_Store")
            .map((fileInfo) => (
              <li key={fileInfo.name}>
                <ContextMenu>
                  <ContextMenuTrigger>
                    <Button
                      variant={"menu"}
                      onClick={() => loadFileContent(fileInfo.name)}
                      className="flex h-fit w-[255px] cursor-auto truncate p-0 px-1"
                    >
                      <span className="mr-1 text-xs">{fileInfo.emoji}</span>
                      <span className={"w-64 truncate text-left text-xs"}>
                        {fileInfo.name.replace(/\.[^/.]+$/, "")}
                      </span>
                      {fileInfo.nsfw && <NSFWBadge />}
                    </Button>
                  </ContextMenuTrigger>
                  <ContextMenuContent className="relative left-20 top-0 bg-black">
                    <span className="text-sm font-bold text-white">
                      {fileInfo.name.replace(/\.[^/.]+$/, "")}
                    </span>
                    <div className="flex flex-col space-y-2">
                      <Button
                        variant="destructive"
                        onClick={() => {
                          handleDeleteFile(fileInfo.name);
                        }}
                      >
                        {DELETE}
                      </Button>
                    </div>
                  </ContextMenuContent>
                </ContextMenu>
              </li>
            ))
        ) : (
          <div className="ml-1" key="not-found">
            {NOTFOUND}
          </div>
        )}
      </ul>
    </ScrollArea>
  );
};
