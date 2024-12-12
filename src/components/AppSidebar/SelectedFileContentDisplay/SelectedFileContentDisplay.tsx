import { PlugZap, Unplug } from "lucide-react";

import { NSFWBadge } from "../NSFWBadge/NSFWBadge";
import { FileContent } from "@/types/types";

interface SelectedFileContentDisplayProps {
  selectedFileContent: FileContent | null;
}

export const SelectedFileContentDisplay = ({
  selectedFileContent,
}: SelectedFileContentDisplayProps) => {
  return (
    <div className="flex w-full items-center justify-end">
      {selectedFileContent ? (
        <div className="flex gap-0.5">
          <p className="text-xs">
            {selectedFileContent?.bookmark.bookmarkTitle}
          </p>
          <p className="text-xs">
            {selectedFileContent?.bookmark.nsfw && <NSFWBadge />}
          </p>
          <p className="text-xs text-stone-500">
            ({selectedFileContent?.bookmark.bookmarkList.length})
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
