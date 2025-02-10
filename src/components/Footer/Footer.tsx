import { Keyboard } from "lucide-react";

export const Footer = ({ keyboardKeys }: { keyboardKeys: string[] }) => {
  return (
    <div
      className="flex h-7 w-[calc(100%)] items-center justify-end border-t p-1"
      data-tauri-drag-region
    >
      <div className="flex items-center space-x-1 bg-background px-1">
        {keyboardKeys.map((key, index, array) => {
          let displayKey = key.trim(); // trimで不要な空白を削除

          if (displayKey === "Meta") displayKey = "⌘";
          else if (displayKey === "ArrowUp") displayKey = "↑";
          else if (displayKey === "ArrowDown") displayKey = "↓";
          else if (displayKey === "ArrowLeft") displayKey = "←";
          else if (displayKey === "ArrowRight") displayKey = "→";
          else if (displayKey === "Escape") displayKey = "⎋";
          else if (displayKey === "Control") displayKey = "^";
          else if (displayKey === "Tab") displayKey = "⇥";
          else if (displayKey === "") displayKey = "␣"; // スペースキーの適切な処理

          const opacity = 1 - (array.length - 1 - index) * 0.2;

          return (
            <p
              key={index}
              className="h-fit min-w-4 cursor-default border bg-secondary px-1 text-center text-xs capitalize text-secondary-foreground"
              style={{ opacity }}
            >
              {displayKey}
            </p>
          );
        })}
        <div className="flex h-5 cursor-default items-center justify-center p-[1px] text-foreground hover:bg-black dark:text-foreground">
          <Keyboard className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
};
