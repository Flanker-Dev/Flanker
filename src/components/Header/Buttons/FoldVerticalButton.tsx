import { FoldVertical } from "lucide-react";

import { Button } from "../../ui/button";

interface FoldVerticalButtonProps {
  decreaseHeight: () => void;
}

export const FoldVerticalButton = ({
  decreaseHeight,
}: FoldVerticalButtonProps) => (
  <Button
    variant={window.innerHeight > 76 ? "fit" : "disabled"}
    size={"fit"}
    onClick={decreaseHeight}
    className={`flex cursor-default items-center justify-center border bg-background p-[1px] text-foreground hover:bg-black hover:text-white dark:border dark:text-foreground hover:dark:bg-white hover:dark:text-black`}
  >
    <FoldVertical className="h-4 w-4" />
  </Button>
);
