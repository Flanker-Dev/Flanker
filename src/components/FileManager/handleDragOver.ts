// handleDragOver.ts
export const handleDragOver = (
  e: React.DragEvent<HTMLDivElement>,
  infoIndex: number,
  setDragOverIndex: (index: number | null) => void
) => {
  e.preventDefault();
  setDragOverIndex(infoIndex);
};
