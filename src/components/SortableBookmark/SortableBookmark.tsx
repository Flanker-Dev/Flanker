import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { invoke } from "@tauri-apps/api";
import {
  CircleAlert,
  CircleHelp,
  ClipboardCopyIcon,
  GripVertical,
  QrCode,
  TriangleAlert,
} from "lucide-react"; // アイコンのインポート
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState, useMemo } from "react";
import { SiTorbrowser } from "react-icons/si"; // Torアイコンのインポート

import Favicon from "../Favicon/Favicon";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
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
  onStatusCountChange: (statusCount: {
    alive: number;
    dead: number;
    unknown: number;
    timeout: number;
    forbidden: number;
    onion: number;
  }) => void;
}

export const SortableBookmark = ({
  id,
  title,
  description,
  url,
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
    const deadCount = links.filter(
      (link) => link.status === "dead" && !link.url.includes(".onion")
    ).length;
    const unknownCount = links.filter(
      (link) => link.status === "unknown"
    ).length;
    const timeoutCount = links.filter(
      (link) => link.status === "Timeout or Unauthorized"
    ).length;
    const forbiddenCount = links.filter((link) => link.status === "403").length;
    const onionCount = links.filter((link) =>
      link.url.includes(".onion")
    ).length;

    onStatusCountChange({
      alive: aliveCount,
      dead: deadCount,
      unknown: unknownCount,
      timeout: timeoutCount,
      forbidden: forbiddenCount,
      onion: onionCount,
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
        {/* draggable grip */}
        <div className="flex cursor-grab items-center" {...listeners}>
          <GripVertical className="" />
        </div>

        {/* link status ribbon */}
        <div className="flex flex-1 cursor-default items-center justify-between">
          <div className="flex items-center">
            {!url.includes(".onion") ? (
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
            ) : (
              <div
                className={`${isDragging ? "border-y border-amber-500" : "border-white"} mr-1 h-9 w-1.5 border-y bg-purple-500`}
              ></div>
            )}

            {/* Favicon */}
            <Favicon url={url} title={title} />

            {/* Title */}
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
          </div>

          {/* link status icons */}
          <div className="flex items-center">
            {/* url includes .onion */}
            {url.includes(".onion") && (
              <SiTorbrowser className="mr-1 h-4 w-4 text-purple-500" />
            )}
            {/* Timeout or Unauthorized or Forbidden */}
            {linkStatus !== "alive" &&
              linkStatus !== "dead" &&
              linkStatus !== "unknown" &&
              !url.includes(".onion") && (
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
            {linkStatus === "dead" && !url.includes(".onion") && (
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

            {/* copy url */}
            <Button
              variant="fit"
              size={"fit"}
              onClick={(event) => handleCopyUrl(event)}
              className="pointer-events-auto mr-1 items-center justify-center rounded p-0.5 hover:bg-white hover:text-black"
            >
              <ClipboardCopyIcon className="h-4 w-4" />
            </Button>

            {/* QR code */}
            <Dialog>
              <DialogTrigger className="pointer-events-auto items-center justify-center rounded p-0.5 hover:bg-white hover:text-black">
                <QrCode className="h-4 w-4" />
              </DialogTrigger>
              <DialogContent>
                <div className="flex items-center justify-center">
                  <div className="flex-1">
                    <DialogTitle className="mb-2 flex items-center gap-2">
                      <Favicon url={url} title={title} />
                      {title}
                    </DialogTitle>
                    <DialogDescription className="mb-2">
                      {description}
                    </DialogDescription>

                    <div className="flex items-center gap-2">
                      <ScrollArea className="w-[250px] border px-2 pb-1">
                        {url}
                        <ScrollBar orientation="horizontal" />
                      </ScrollArea>

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

                  <QRCodeSVG value={url} size={128} className="mr-4" />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
};
