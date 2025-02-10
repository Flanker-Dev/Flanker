import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@radix-ui/react-accordion";
import { PanelLeft, FolderHeart } from "lucide-react";

import { SidebarFavs } from "../SidebarFavs/SidebarFavs";
import { Button } from "../ui/button";
import { getFavicon } from "@/constants/Favicon";

// sidemenu component
export const SideMenu = ({
  open,
  setOpen,
  isLoading,
  handleAccordionTriggerClick,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  isLoading: boolean;
  handleAccordionTriggerClick: () => void;
}) => {
  return (
    <div
      data-tauri-drag-region
      className="flex h-[calc(100vh-6px)] w-[64px] flex-col items-center justify-start rounded-l-md border-white"
    >
      {/* Sidebar trigger */}
      <div
        className={`${open ? "pt-2" : "pt-6"} ${window.innerHeight > 82 ? "" : "pt-6"} flex w-16 justify-center pb-2 duration-500 focus:outline-none`}
      >
        <Button
          data-sidebar="trigger"
          variant={window.innerHeight > 120 ? "ghost" : "disabled"}
          size="icon"
          className="box-border h-10 w-10 cursor-default"
          onClick={(event) => {
            event.preventDefault();
            // windowが82より小さい場合発火しない
            if (window.innerHeight <= 120) return;
            setOpen(!open);
          }}
        >
          <PanelLeft />
        </Button>
      </div>
      {/* Sidebar trigger end */}

      {/* お気に入りアイコン群 */}
      {window.innerHeight > 220 && (
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger
              className="mx-auto mb-2 box-border flex h-10 w-10 cursor-default justify-center p-0 text-foreground hover:bg-black hover:text-white dark:border dark:text-foreground hover:dark:bg-white hover:dark:text-black"
              onClick={handleAccordionTriggerClick}
            >
              <FolderHeart />
            </AccordionTrigger>
            <AccordionContent>
              {isLoading ? (
                <div
                  className={`skeleton flex ${open ? "h-[calc(100vh-112px)]" : "h-[calc(100vh-128px)]"} w-[52px] animate-pulse flex-col items-center rounded`}
                ></div>
              ) : (
                <SidebarFavs getFavicon={getFavicon} open={open} />
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
      {/* お気に入りアイコン群 end */}
    </div>
  );
};
