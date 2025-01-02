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
import { useState, useEffect } from "react";

import Favicon from "../Favicon/Favicon";
import { SortableBookmark } from "../SortableBookmark/SortableBookmark";
import { OutlineContentComponentProps } from "@/types/types";

export const SmallCard = ({
  selectedFileContent,
}: OutlineContentComponentProps) => {
  const [bookmarks, setBookmarks] = useState(
    selectedFileContent?.bookmark.bookmarkList[0]?.bookmarkInfo.map(
      (bookmark) => ({
        ...bookmark,
        statusCount: {
          alive: 0,
          dead: 0,
          unknown: 0,
          timeout: 0,
          forbidden: 0,
        },
      })
    ) || []
  );

  useEffect(() => {
    setBookmarks(
      selectedFileContent?.bookmark.bookmarkList[0]?.bookmarkInfo.map(
        (bookmark) => ({
          ...bookmark,
          statusCount: {
            alive: 0,
            dead: 0,
            unknown: 0,
            timeout: 0,
            forbidden: 0,
          },
        })
      ) || []
    );
  }, [selectedFileContent]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

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

  const [statusCount, setStatusCount] = useState({
    alive: 0,
    dead: 0,
    unknown: 0,
    timeout: 0,
    forbidden: 0,
  });

  useEffect(() => {
    // Calculate initial status count
    const initialStatusCount = bookmarks.reduce(
      (acc, bookmark) => {
        acc.alive += bookmark.statusCount.alive;
        acc.dead += bookmark.statusCount.dead;
        acc.unknown += bookmark.statusCount.unknown;
        acc.timeout += bookmark.statusCount.timeout;
        acc.forbidden += bookmark.statusCount.forbidden;
        return acc;
      },
      { alive: 0, dead: 0, unknown: 0, timeout: 0, forbidden: 0 }
    );
    setStatusCount(initialStatusCount);
  }, [bookmarks]);

  const handleStatusCountChange = (
    id: string,
    newStatusCount: {
      alive: number;
      dead: number;
      unknown: number;
      timeout: number;
      forbidden: number;
    }
  ) => {
    setBookmarks((prevBookmarks) =>
      prevBookmarks.map((bookmark) =>
        bookmark.id === id
          ? { ...bookmark, statusCount: newStatusCount }
          : bookmark
      )
    );
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
        <div className="flex items-center gap-1">
          <div className="text-xs text-gray-500">
            Alive: {statusCount.alive}
          </div>
          <div className="text-xs text-gray-500">Dead: {statusCount.dead}</div>
          <div className="text-xs text-gray-500">
            Unknown: {statusCount.unknown}
          </div>
          <div className="text-xs text-gray-500">
            Timeout: {statusCount.timeout}
          </div>
          <div className="text-xs text-gray-500">
            Forbidden: {statusCount.forbidden}
          </div>
        </div>
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
                onStatusCountChange={(newStatusCount) =>
                  handleStatusCountChange(bookmark.id, newStatusCount)
                }
              />
            </li>
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
};
