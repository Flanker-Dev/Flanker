import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ClipboardCopyIcon } from "@radix-ui/react-icons";

import { Button } from "../ui/button";

interface SortableBookmarkProps {
  id: string;
  title: string;
  url: string;
  description: string;
  handleCopyUrl: (url: string) => void;
  FaviconComponent: JSX.Element;
}

export const SortableBookmark = ({
  id,
  title,
  url,
  // description,
  handleCopyUrl,
  FaviconComponent,
}: SortableBookmarkProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const transformStyle = CSS.Transform.toString(transform);
  const transitionStyle = transition || "all 50ms ease";

  return (
    <div
      ref={setNodeRef}
      style={{ transform: transformStyle, transition: transitionStyle }}
      className={`bookmark-item rounded border p-2 shadow-md backdrop-blur-[3px] ${
        isDragging
          ? "is-dragging pointer-events-none z-10 border border-amber-500 dark:bg-gray-700"
          : "pointer-events-auto z-0 opacity-100"
      }`}
      {...attributes}
      {...listeners}
    >
      <div className="pointer-events-auto flex h-full justify-between">
        <div className="flex">
          {FaviconComponent}
          <a
            href={url}
            target="_blank"
            className="ml-1 font-semibold text-white dark:text-white"
          >
            {title}
          </a>
        </div>
        <Button
          variant={"clipboard"}
          size={"clipboard"}
          onClick={() => handleCopyUrl(url)}
        >
          <ClipboardCopyIcon />
        </Button>
      </div>
      {/* <p className="text-sm text-gray-500">{description}</p> */}
    </div>
  );
};
