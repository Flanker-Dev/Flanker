import { Maximize } from "lucide-react";

import { Button } from "../../ui/button";

interface MaximizeButtonProps {
  fullScreen: () => void;
}

export const MaximizeButton = ({ fullScreen }: MaximizeButtonProps) => (
  <Button
    variant={"fit"}
    size={"fit"}
    onClick={fullScreen}
    className="flex h-5 cursor-default items-center justify-center border bg-background p-[1px] text-foreground hover:bg-black hover:text-white dark:border dark:text-foreground hover:dark:bg-white hover:dark:text-black"
  >
    <Maximize className="h-4 w-4" />
  </Button>
);
