import { Minimize } from "lucide-react";

import { Button } from "@/components/ui/button";

interface MinimizeButtonProps {
  tightScreen: () => void;
}

export const MinimizeButton = ({ tightScreen }: MinimizeButtonProps) => (
  <Button
    variant={
      window.innerWidth === 768 && window.innerHeight === 76
        ? "disabled"
        : "fit"
    }
    size={"fit"}
    onClick={
      window.innerWidth === 768 && window.innerHeight === 76
        ? undefined
        : tightScreen
    }
    className={`flex h-5 cursor-default items-center justify-center border bg-background p-[1px] text-foreground hover:bg-black hover:text-white dark:border dark:text-foreground hover:dark:bg-white hover:dark:text-black`}
  >
    <Minimize className="h-4 w-4" />
  </Button>
);
