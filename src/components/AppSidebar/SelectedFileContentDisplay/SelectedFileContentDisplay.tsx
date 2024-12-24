import { PlugZap, ShieldAlert, Unplug } from "lucide-react";

import { FileContent } from "@/types/types";

interface SelectedFileContentDisplayProps {
  selectedFileContent: FileContent | null;
}
const NSFW = "NSFW";
export const SelectedFileContentDisplay = ({
  selectedFileContent,
}: SelectedFileContentDisplayProps) => {
  return (
    <div className="flex w-full items-center justify-end">
      {selectedFileContent ? (
        <div className="flex">
          {selectedFileContent?.bookmark.nsfw && (
            <div className="flex px-0.5">
              <ShieldAlert
                strokeWidth={2.7}
                className="h-3.5 w-3.5 text-red-500"
              />
              <p className="text-xs font-bold text-red-500">{NSFW}</p>
            </div>
          )}
          <p className="mr-1 border-x border-white bg-white px-[1px] text-xs font-semibold tracking-tight text-black">
            {selectedFileContent?.bookmark.bookmarkList[0].bookmarkInfo.length}
          </p>
          <PlugZap className="h-3.5 w-3.5" />
        </div>
      ) : (
        <div className="flex w-full items-center justify-end">
          <Unplug className="h-3.5 w-3.5" />
        </div>
      )}
    </div>
  );
};
