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
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
// } from "../ui/dialog";
import { Input } from "../ui/input";
import { Popover, PopoverContent } from "../ui/popover";
import { ScrollArea } from "../ui/scroll-area";

interface SidebarFavsProps {
  getFavicon: string;
}

export const SidebarFavs = ({ getFavicon }: SidebarFavsProps) => {
  const [urls, setUrls] = useState<{ [key: string]: string }>({});
  const [newUrl, setNewUrl] = useState("");
  const [newKey, setNewKey] = useState("");
  // const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const loadFavs = async () => {
      try {
        const home = await homeDir();
        const favsPath = `${home}.config/flanker/sidebar_favs/favs.json`;
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
      const favsPath = `${home}.config/flanker/sidebar_favs/favs.json`;
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

  return (
    <>
      <ScrollArea className="h-full">
        <ul className="mt-2 grid w-[62px] grid-cols-2 p-1">
          {Object.entries(urls).map(([key, url]) => (
            <li key={key} className="mb-1 backdrop-sepia">
              <ContextMenu>
                <ContextMenuTrigger>
                  <a
                    href={url.startsWith("http") ? url : `https://${url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative"
                  >
                    <img
                      src={`${getFavicon}${url}`}
                      alt={key}
                      className="z-10 h-6 w-6"
                    />
                  </a>
                </ContextMenuTrigger>
                <ContextMenuContent className="space-y-1 bg-black">
                  {/* <ContextMenuItem> */}
                  <div className="flex flex-col">
                    <span className="text-sm font-bold capitalize text-white">
                      {key}
                    </span>
                    <span className="text-sm capitalize text-muted-foreground">
                      {url}
                    </span>
                  </div>
                  {/* </ContextMenuItem> */}
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
                      onClick={() => handleDeleteFav(key)}
                      className="w-full"
                    >
                      <TrashIcon />
                      Delete
                    </Button>
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            </li>
          ))}
          {/* Display the add button in the last element */}
          <li className="backdrop-sepia">
            <Popover>
              <SidebarFavsButton />
              <PopoverContent className="relative left-20 top-0 bg-black">
                <span className="text-sm font-bold capitalize text-white">
                  Add a new favorite
                </span>
                <div className="flex flex-col space-y-2">
                  <Input
                    type="text"
                    placeholder="Key"
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
          </li>
        </ul>
      </ScrollArea>
    </>
  );
};
