import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  // DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { ClipboardCopyIcon } from "lucide-react";
import { useState, useEffect } from "react";

import Favicon from "../Favicon/Favicon";
import { SortableBookmark } from "../SortableBookmark/SortableBookmark";
import { Button } from "../ui/button";
import { toast } from "@/hooks/use-toast";
import { OutlineContentComponentProps } from "@/types/types";

export const SmallCard = ({
  selectedFileContent,
}: OutlineContentComponentProps) => {
  const [bookmarks, setBookmarks] = useState(
    selectedFileContent?.bookmark.bookmarkList[0]?.bookmarkInfo || []
  );

  useEffect(() => {
    setBookmarks(
      selectedFileContent?.bookmark.bookmarkList[0]?.bookmarkInfo || []
    );
  }, [selectedFileContent]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({ description: "URL copied to clipboard" });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setBookmarks((currentBookmarks) => {
        const oldIndex = currentBookmarks.findIndex(
          (bookmark) => bookmark.id === active.id
        );
        const newIndex = currentBookmarks.findIndex(
          (bookmark) => bookmark.id === over.id
        );
        return arrayMove(currentBookmarks, oldIndex, newIndex);
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={bookmarks.map((bookmark) => bookmark.id)}
        strategy={rectSortingStrategy}
      >
        <ul className="grid gap-1 sm:grid-cols-1 lg:grid-cols-3">
          {bookmarks.map((bookmark) => (
            <li key={bookmark.id} className="relative">
              <SortableBookmark
                id={bookmark.id}
                title={bookmark.title}
                url={bookmark.url}
                description={bookmark.description}
                FaviconComponent={
                  <Favicon url={bookmark.url} title={bookmark.title} />
                }
              />
              <Button
                variant="default"
                size="clipboard"
                onClick={() => handleCopyUrl(bookmark.url)}
                className="absolute bottom-0 right-2 top-1.5 translate-y-1/2 hover:text-neutral-400"
              >
                <ClipboardCopyIcon className="h-3 w-3" />
              </Button>
            </li>
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
};
