import { FileConfig } from "@/types/types";

export const handleDrop = (
  e: React.DragEvent<HTMLDivElement>,
  infoIndex: number,
  config: FileConfig | null,
  setConfig: (config: FileConfig | null) => void,
  setDragOverIndex: (index: number | null) => void
) => {
  e.preventDefault();
  setDragOverIndex(null);
  const url = e.dataTransfer.getData("text/plain");
  if (url && config) {
    const updatedConfig = { ...config };
    updatedConfig.bookmark.bookmarkList[0].bookmarkInfo[infoIndex].url = url;
    setConfig(updatedConfig);
  }
};
