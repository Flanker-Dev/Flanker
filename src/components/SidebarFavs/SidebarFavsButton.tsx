import { Plus } from "lucide-react";
import { forwardRef } from "react";

import { Button } from "../ui/button";
import { PopoverTrigger } from "../ui/popover";

export const SidebarFavsButton = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>((props, ref) => (
  <PopoverTrigger asChild>
    <Button
      ref={ref}
      className="z-20 h-6 w-[52px] cursor-default rounded bg-background text-black hover:text-white"
      {...props}
    >
      <Plus size={16} className="" />
    </Button>
  </PopoverTrigger>
));
