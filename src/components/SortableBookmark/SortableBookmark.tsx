import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { invoke } from "@tauri-apps/api";
import {
  CircleAlert,
  CircleHelp,
  ClipboardCopyIcon,
  GripVertical,
  TriangleAlert,
} from "lucide-react"; // アイコンのインポート
import { useEffect, useState, useMemo } from "react";

import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { toast } from "@/hooks/use-toast";

interface SortableBookmarkProps {
  id: string;
  title: string;
  url: string;
  description: string;
  FaviconComponent: JSX.Element;
  onStatusCountChange: (statusCount: {
    alive: number;
    dead: number;
    unknown: number;
    timeout: number;
    forbidden: number;
  }) => void;
}

export const SortableBookmark = ({
  id,
  title,
  url,
  FaviconComponent,
  onStatusCountChange,
}: SortableBookmarkProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
  });
  const [loading, setLoading] = useState(true); // ローディング状態
  const [links, setLinks] = useState<{ url: string; status: string }[]>([]);

  const linkStatus = useMemo(
    () => links.find((link) => link.url === url)?.status,
    [links, url]
  );

  // スタイルの定義
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging
      ? "transform 0ms"
      : transition || "transform 200ms ease",
    zIndex: isDragging ? 999 : 0, // ドラッグ中は最前面に表示
  };

  const handleCopyUrl = (event: React.MouseEvent) => {
    event.stopPropagation();
    navigator.clipboard.writeText(url);
    toast({ description: "URL copied to clipboard. " + url });
  };

  useEffect(() => {
    const initialLinks = [{ url, status: "unknown" }];
    setLinks(initialLinks);

    const checkAllLinks = async () => {
      const updatedLinks = await Promise.all(
        initialLinks.map(async (link) => {
          try {
            const status = await invoke("check_link_status", { url: link.url });

            if (
              status === "alive" ||
              status === "401 Unauthorized" ||
              status === "403 Forbidden"
            ) {
              return {
                ...link,
                status: status === "403 Forbidden" ? "403" : "alive",
              };
            } else {
              return { ...link, status: "dead" };
            }
          } catch (error) {
            if (error !== "Timeout error checking link") {
              return { ...link, status: "dead" };
            }
            return { ...link, status: "Timeout or Unauthorized" };
          }
        })
      );
      setLinks(updatedLinks);
      setLoading(false);
    };

    checkAllLinks();
  }, [url]);

  useEffect(() => {
    const aliveCount = links.filter((link) => link.status === "alive").length;
    const deadCount = links.filter((link) => link.status === "dead").length;
    const unknownCount = links.filter(
      (link) => link.status === "unknown"
    ).length;
    const timeoutCount = links.filter(
      (link) => link.status === "Timeout or Unauthorized"
    ).length;
    const forbiddenCount = links.filter((link) => link.status === "403").length;

    onStatusCountChange({
      alive: aliveCount,
      dead: deadCount,
      unknown: unknownCount,
      timeout: timeoutCount,
      forbidden: forbiddenCount,
    });
  }, [links, onStatusCountChange]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bookmark-item relative h-9 rounded border p-1 shadow-md backdrop-blur-[3px] ${
        isDragging
          ? "pointer-events-none z-10 border-amber-500 dark:bg-gray-700"
          : "pointer-events-auto z-0 opacity-100"
      }`}
      {...attributes}
    >
      <div className="pointer-events-auto flex h-full justify-between">
        <div className="flex cursor-grab items-center" {...listeners}>
          <GripVertical className="" />
        </div>
        <div className="flex flex-1 cursor-default items-center justify-between">
          <div className="flex items-center">
            <div>
              {loading ? (
                <div className={`mr-1 h-9 w-1.5 border-y bg-stone-500`}></div>
              ) : linkStatus === "alive" ? (
                <div
                  className={`${isDragging ? "border-y border-amber-500" : "border-white"} mr-1 h-9 w-1.5 border-y bg-green-500`}
                ></div>
              ) : linkStatus === "Timeout or Unauthorized" ? (
                <div
                  className={`${isDragging ? "border-y border-amber-500" : "border-white"} mr-1 h-9 w-1.5 border-y bg-yellow-500`}
                ></div>
              ) : linkStatus === "403" ? (
                <div
                  className={`${isDragging ? "border-y border-amber-500" : "border-white"} mr-1 h-9 w-1.5 border-y bg-yellow-500`}
                ></div>
              ) : linkStatus === "unknown" ? (
                <div
                  className={`${isDragging ? "border-y border-amber-500" : "border-white"} mr-1 h-9 w-1.5 border-y bg-stone-500`}
                ></div>
              ) : (
                <div
                  className={`${isDragging ? "border-y border-amber-500" : "border-white"} mr-1 h-9 w-1.5 border-y bg-red-500`}
                ></div>
              )}
            </div>
            {FaviconComponent}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-1 text-xs font-semibold text-white dark:text-white"
                  >
                    {title}
                  </a>
                </TooltipTrigger>
                <TooltipContent
                  className="rounded border bg-black text-white"
                  data-side="right"
                >
                  <p>{url}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {/* timeout または 403 Forbidden が返ってきた場合は、403 と表示 */}
          </div>
          <div className="flex items-center">
            {/* Timeout or Unauthorized or Forbidden */}
            {linkStatus !== "alive" &&
              linkStatus !== "dead" &&
              linkStatus !== "unknown" && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="mr-1 text-xs font-semibold text-yellow-500">
                        <CircleAlert className="h-4 w-4" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent
                      className="rounded border bg-black text-white"
                      data-side="right"
                    >
                      <p>
                        {linkStatus} link (However, you may be able to view the
                        site.)
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            {/* dead */}
            {linkStatus === "dead" && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="mr-1 text-xs font-semibold text-red-500">
                      <TriangleAlert className="h-4 w-4" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="rounded border bg-black text-white">
                    <p>{linkStatus} link (The site cannot be viewed.)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {/* unknown */}
            {linkStatus === "unknown" && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="mr-1 text-xs font-semibold text-neutral-500">
                      <CircleHelp className="h-4 w-4" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="rounded border bg-black text-white">
                    <p>{linkStatus} link (The site cannot be viewed.)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <Button
              variant="fit"
              size={"fit"}
              onClick={(event) => handleCopyUrl(event)}
              className="pointer-events-auto items-center justify-center rounded p-0.5 hover:bg-white hover:text-black"
            >
              <ClipboardCopyIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
