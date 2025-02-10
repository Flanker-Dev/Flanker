import { PanelLeft } from "lucide-react";

export const NoFile = () => {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform cursor-default border bg-background p-1 text-center text-foreground dark:text-foreground">
      <div className="flex">
        <p className="text-nowrap">← Please select from </p>
        <PanelLeft className="mx-1" /> <p>SideMenu.</p>
      </div>
    </div>
  );
};
