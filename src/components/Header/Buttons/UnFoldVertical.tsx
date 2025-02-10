import { UnfoldVertical } from "lucide-react";

import { Button } from "@/components/ui/button";

interface UnFoldVerticalButtonProps {
  increaseHeight: () => void;
}

export const UnfoldVerticalButton = ({
  increaseHeight,
}: UnFoldVerticalButtonProps) => (
  <Button
    variant={"fit"}
    size={"fit"}
    onClick={increaseHeight}
    className={`flex cursor-default items-center justify-center border bg-background p-[1px] text-foreground hover:bg-black hover:text-white dark:border dark:text-foreground hover:dark:bg-white hover:dark:text-black`}
  >
    <UnfoldVertical className="h-4 w-4 rotate-180" />
  </Button>
);
