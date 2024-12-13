import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  UniqueIdentifier,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";

import Favicon from "../Favicon/Favicon";
import { SortableBookmark } from "../SortableBookmark/SortableBookmark";
import { toast } from "@/hooks/use-toast";
import { Bookmark } from "@/types/types";

export const SmallCard = ({
  selectedFileContent,
  open,
}: {
  selectedFileContent: {
    bookmark: { bookmarkList: { bookmarkInfo: Bookmark[] }[] };
  };
  open: boolean;
}) => {
  const [bookmarks, setBookmarks] = useState(
    selectedFileContent.bookmark.bookmarkList
  );
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 4,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
    document.body.style.cursor = "grabbing";
  };

  const handleDragEnd = (event: {
    active: { id: UniqueIdentifier };
    over: { id: UniqueIdentifier } | null;
  }) => {
    if (!activeId) {
      return;
    }
    const { active, over } = event;
    setActiveId(null);
    document.body.style.cursor = "";

    if (active.id !== over?.id) {
      setBookmarks((items) => {
        const oldIndex = items.findIndex(
          (item) => item.bookmarkInfo[0].id === active.id
        );
        const newIndex = items.findIndex(
          (item) => over && item.bookmarkInfo[0].id === over.id
        );

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
    document.body.style.cursor = "";
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      description: "Copied!",
    });
  };

  const hasBookmarks = (content: typeof selectedFileContent) =>
    content && content.bookmark.bookmarkList;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext
        items={bookmarks.map((item) => item.bookmarkInfo[0].id)}
        strategy={rectSortingStrategy}
      >
        <ul
          className={`grid gap-1 lg:grid-cols-3 ${open ? "sm:grid-cols-1" : "sm:grid-cols-1"}`}
        >
          {hasBookmarks(selectedFileContent) ? (
            bookmarks.map((group) =>
              group.bookmarkInfo
                ? group.bookmarkInfo.map((bookmark) => (
                    <li key={bookmark.id}>
                      <SortableBookmark
                        key={bookmark.id}
                        id={bookmark.id}
                        title={bookmark.title}
                        url={bookmark.url}
                        description={bookmark.description}
                        handleCopyUrl={handleCopyUrl}
                        FaviconComponent={
                          <Favicon url={bookmark.url} title={bookmark.title} />
                        }
                      />
                    </li>
                  ))
                : null
            )
          ) : (
            <p>No bookmarks available</p>
          )}
        </ul>
      </SortableContext>
    </DndContext>
  );
};
