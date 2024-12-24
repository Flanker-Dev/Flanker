import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableBookmarkProps {
  id: string;
  title: string;
  url: string;
  description: string;
  // handleCopyUrl: (url: string) => void;
  FaviconComponent: JSX.Element;
}

export const SortableBookmark = ({
  id,
  title,
  url,
  description,
  // handleCopyUrl,
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

  // スタイルの定義
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging
      ? "transform 0ms"
      : transition || "transform 200ms ease",
    zIndex: isDragging ? 999 : 0, // ドラッグ中は最前面に表示
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bookmark-item relative h-6 rounded border p-1 shadow-md backdrop-blur-[3px] ${
        isDragging
          ? "pointer-events-none z-10 border-amber-500 dark:bg-gray-700"
          : "pointer-events-auto z-0 opacity-100"
      }`}
      {...attributes}
      {...listeners}
    >
      <div className="pointer-events-auto flex h-full justify-between">
        <div className="flex flex-1 items-center">
          {FaviconComponent}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 text-xs font-semibold text-white dark:text-white"
          >
            {title}
          </a>
          <div>
            <p className="truncate text-xs text-gray-500">{description}</p>
          </div>
        </div>
        {/* <div className="flex">
          <Button
            variant="default"
            size="clipboard"
            onClick={() => handleCopyUrl(url)}
            className="pointer-events-auto relative z-30"
          >
            <ClipboardCopyIcon className="h-3 w-3" />
          </Button>
        </div> */}
      </div>
    </div>
  );
};
