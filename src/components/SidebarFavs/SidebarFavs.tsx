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
import { restrictToParentElement } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ExternalLinkIcon, TrashIcon } from "@radix-ui/react-icons";
import { shell } from "@tauri-apps/api";
import { homeDir } from "@tauri-apps/api/path";
import { invoke } from "@tauri-apps/api/tauri";
import { useEffect, useState } from "react";

import { handleAddFav } from "./handleAddFav";
import { SidebarFavsButton } from "./SidebarFavsButton";
import { Button } from "../ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ui/context-menu";
import { Input } from "../ui/input";
import { Popover, PopoverContent } from "../ui/popover";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { toast } from "@/hooks/use-toast";

interface SidebarFavsProps {
  getFavicon: string;
}

const SortableFav = ({
  id,
  url,
  keyName,
  getFavicon,
  openUrl,
  handleDeleteFav,
}: {
  id: string;
  url: string;
  keyName: string;
  getFavicon: string;
  openUrl: (url: string) => void;
  handleDeleteFav: (key: string) => void;
}) => {
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
    <li
      ref={setNodeRef}
      style={{
        transform: transformStyle,
        transition: transitionStyle,
      }}
      className={`${
        isDragging
          ? "is-dragging pointer-events-none z-10"
          : "pointer-events-auto z-0"
      }`}
      {...attributes}
      {...listeners}
    >
      <ContextMenu>
        <ContextMenuTrigger>
          <a
            href={url.startsWith("http") ? url : `https://${url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="relative cursor-default"
          >
            <img
              src={`${getFavicon}${url}`}
              alt={keyName}
              className="z-10 h-6 w-6 rounded-sm bg-white hover:sepia hover:backdrop-filter"
            />
          </a>
        </ContextMenuTrigger>
        <ContextMenuContent className="space-y-1 bg-black">
          <div className="flex flex-col">
            <span className="text-sm font-bold capitalize text-white">
              {keyName}
            </span>
            <span className="text-sm capitalize text-muted-foreground">
              {url}
            </span>
          </div>
          <ContextMenuItem>
            <Button
              variant="secondary"
              onClick={() => {
                openUrl(url);
              }}
              className="w-full"
            >
              <ExternalLinkIcon />
              Open
            </Button>
          </ContextMenuItem>
          <ContextMenuItem>
            <Button
              variant="destructive"
              onClick={() => handleDeleteFav(keyName)}
              className="w-full"
            >
              <TrashIcon />
              Delete
            </Button>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </li>
  );
};

export const SidebarFavs = ({ getFavicon }: SidebarFavsProps) => {
  const [urls, setUrls] = useState<{ [key: string]: string }>({});
  const [newUrl, setNewUrl] = useState("");
  const [newKey, setNewKey] = useState("");
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const loadFavs = async () => {
      try {
        const home = await homeDir();
        const favsPath = `${home}.config/flk/sidebar_favs/favs.json`;
        const data = await invoke<string>("read_file", { filePath: favsPath });
        setUrls(JSON.parse(data));
      } catch (err) {
        console.error("Error reading favs.json:", err);
      }
    };
    loadFavs();
  }, []);

  const handleDeleteFav = async (key: string) => {
    const updatedUrls = { ...urls };
    delete updatedUrls[key];
    setUrls(updatedUrls);
    try {
      const home = await homeDir();
      const favsPath = `${home}.config/flk/sidebar_favs/favs.json`;
      await invoke("write_file", {
        filePath: favsPath,
        contents: JSON.stringify(updatedUrls),
      });
    } catch (err) {
      console.error("Error writing to favs.json:", err);
    }
  };

  const openUrl = async (url: string) => {
    await shell.open(url.startsWith("http") ? url : `https://${url}`);
  };

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

  const handleSaveFavs = () => {
    toast({
      description: "Saved",
    });
    // 実際の保存処理をここに追加
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
      setUrls((items) => {
        const keys = Object.keys(items);
        const oldIndex = keys.indexOf(active.id as string);
        const newIndex = keys.indexOf(over?.id as string);

        const newItems = arrayMove(keys, oldIndex, newIndex).reduce(
          (acc, key) => {
            acc[key] = items[key];
            return acc;
          },
          {} as { [key: string]: string }
        );

        if (saveTimeout) {
          clearTimeout(saveTimeout);
        }
        const timeout = setTimeout(handleSaveFavs, 5000);
        setSaveTimeout(timeout);
        return newItems;
      });
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
    document.body.style.cursor = "";
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      modifiers={[restrictToParentElement]}
    >
      <div
        className={
          `${window.innerHeight > 82 ? "" : "invisible"}` +
          ` ` +
          `flex h-[calc(100vh-90px)] flex-col items-center`
        }
      >
        <div className="relative">
          <Separator className="w-[52px]" />
        </div>

        <SortableContext
          items={Object.keys(urls)}
          strategy={rectSortingStrategy}
        >
          <ScrollArea className="relative right-[0px] h-fit p-1 pb-0 pt-1">
            <ul className="grid h-full grid-cols-2 gap-1">
              {Object.entries(urls).map(([key, url]) => (
                <SortableFav
                  key={key}
                  id={key}
                  url={url}
                  keyName={key}
                  getFavicon={getFavicon}
                  openUrl={openUrl}
                  handleDeleteFav={handleDeleteFav}
                />
              ))}
            </ul>
          </ScrollArea>
        </SortableContext>

        <div className="my-1 ml-[8px] flex w-[60px] items-center">
          <Popover>
            <SidebarFavsButton />
            <PopoverContent className="relative left-20 top-0 bg-black">
              <span className="text-sm font-bold capitalize text-white">
                Add a new favorite
              </span>
              <div className="flex flex-col space-y-2">
                <Input
                  type="text"
                  placeholder="Name"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                />
                <Input
                  type="text"
                  placeholder="URL"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                />
                <Button
                  variant={"secondary"}
                  onClick={() => {
                    handleAddFav(urls, setUrls, newKey, newUrl);
                    setNewKey("");
                    setNewUrl("");
                  }}
                >
                  Add
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="relative right-[0px] mb-2">
          <Separator className="w-[52px]" />
        </div>
      </div>
    </DndContext>
  );
};
