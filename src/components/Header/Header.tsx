import { TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import {
  FoldVertical,
  Grid3x3,
  List,
  Moon,
  PanelBottomClose,
  Pin,
  PinOff,
  SquareArrowDownLeft,
  SquareArrowDownRight,
  SquareArrowUpLeft,
  SquareArrowUpRight,
  Sun,
  Table,
  UnfoldVertical,
} from "lucide-react";

import { Button } from "../ui/button";
import { FoldVerticalButton } from "./Buttons/FoldVerticalButton";
import { MaximizeButton } from "./Buttons/MaximizeButton";
import { MinimizeButton } from "./Buttons/MinimizeButton";
import { UnfoldVerticalButton } from "./Buttons/UnFoldVertical";

export const Header = ({
  fullScreen,
  tightScreen,
  increaseHeight,
  decreaseHeight,
  increaseWidth,
  decreaseWidth,
  moveWindowTopLeft,
  moveWindowTopRight,
  moveWindowBottomLeft,
  moveWindowBottomRight,
  height,
  width,
  alwaysOnTop,
  alwaysOnTopView,
  setAlwaysOnTopView,
  setIsFooterVisible,
  toggleTheme,
  isDarkMode,
}: {
  fullScreen: () => void;
  tightScreen: () => void;
  increaseHeight: () => void;
  decreaseHeight: () => void;
  increaseWidth: () => void;
  decreaseWidth: () => void;
  moveWindowTopLeft: () => void;
  moveWindowTopRight: () => void;
  moveWindowBottomLeft: () => void;
  moveWindowBottomRight: () => void;
  height: number;
  width: number;
  alwaysOnTop: (
    alwaysOnTopView: boolean,
    setAlwaysOnTopView: React.Dispatch<React.SetStateAction<boolean>>
  ) => void;
  alwaysOnTopView: boolean;
  setAlwaysOnTopView: React.Dispatch<React.SetStateAction<boolean>>;
  setIsFooterVisible: React.Dispatch<React.SetStateAction<boolean>>;
  toggleTheme: () => void;
  isDarkMode: boolean;
}) => {
  return (
    <header
      id="Header"
      data-tauri-drag-region
      className="flex h-7 w-[calc(100%)] items-center justify-between border-b p-1"
    >
      <div className="flex items-center space-x-1">
        {/* <div className="active-rotate cursor-default leading-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            className="box-border rounded-full border border-black"
          >
            <circle
              cx="8"
              cy="8"
              r="6"
              className="border border-black fill-current stroke-current"
              stroke-width="2"
            />
            <path d="M2,8 A6,6 0 0,0 14,8" />
          </svg>
        </div> */}
        <div className="flex h-5 cursor-default items-center justify-between border bg-background p-0.5">
          <p className="w-10 text-nowrap text-center text-xs font-bold text-foreground dark:text-foreground">
            {height}
          </p>
          <p className="pb-0.5 text-xl text-foreground dark:text-foreground">
            {"×"}
          </p>
          <p className="w-10 text-nowrap text-center text-xs font-bold text-foreground dark:text-foreground">
            {width}
          </p>
        </div>
        <MaximizeButton fullScreen={fullScreen} />
        <MinimizeButton tightScreen={tightScreen} />
        <FoldVerticalButton decreaseHeight={decreaseHeight} />
        <UnfoldVerticalButton increaseHeight={increaseHeight} />
        <Button
          variant={window.innerWidth > 768 ? "fit" : "disabled"}
          size={"fit"}
          onClick={decreaseWidth}
          className={`flex cursor-default items-center justify-center border bg-background p-[1px] text-foreground hover:bg-black hover:text-white dark:border dark:text-foreground hover:dark:bg-white hover:dark:text-black`}
        >
          <FoldVertical className="h-4 w-4 rotate-90" />
        </Button>
        <Button
          variant={"fit"}
          size={"fit"}
          onClick={increaseWidth}
          className={`flex cursor-default items-center justify-center border bg-background p-[1px] text-foreground hover:bg-black hover:text-white dark:border dark:text-foreground hover:dark:bg-white hover:dark:text-black`}
        >
          <UnfoldVertical className="h-4 w-4 -rotate-90" />
        </Button>
        <Button
          variant={"fit"}
          size={"fit"}
          onClick={moveWindowTopLeft}
          className={`flex cursor-default items-center justify-center border bg-background p-[1px] text-foreground hover:bg-black hover:text-white dark:border dark:text-foreground hover:dark:bg-white hover:dark:text-black`}
        >
          <SquareArrowUpLeft strokeWidth={1.6} className="h-4 w-4" />
        </Button>
        <Button
          variant={"fit"}
          size={"fit"}
          onClick={moveWindowTopRight}
          className={`flex cursor-default items-center justify-center border bg-background p-[1px] text-foreground hover:bg-black hover:text-white dark:border dark:text-foreground hover:dark:bg-white hover:dark:text-black`}
        >
          <SquareArrowUpRight strokeWidth={1.6} className="h-4 w-4" />
        </Button>
        <Button
          variant={"fit"}
          size={"fit"}
          onClick={moveWindowBottomLeft}
          className={`flex cursor-default items-center justify-center border bg-background p-[1px] text-foreground hover:bg-black hover:text-white dark:border dark:text-foreground hover:dark:bg-white hover:dark:text-black`}
        >
          <SquareArrowDownLeft strokeWidth={1.6} className="h-4 w-4" />
        </Button>
        <Button
          variant={"fit"}
          size={"fit"}
          onClick={moveWindowBottomRight}
          className={`flex cursor-default items-center justify-center border bg-background p-[1px] text-foreground hover:bg-black hover:text-white dark:border dark:text-foreground hover:dark:bg-white hover:dark:text-black`}
        >
          <SquareArrowDownRight strokeWidth={1.6} className="h-4 w-4" />
        </Button>
        {/* <GitHubContributions /> */}
        <Button
          variant={"fit"}
          size={"fit"}
          onClick={() => alwaysOnTop(alwaysOnTopView, setAlwaysOnTopView)}
          className={`flex cursor-default items-center justify-center border bg-background p-[1px] text-foreground hover:bg-black hover:text-white dark:border dark:text-foreground hover:dark:bg-white hover:dark:text-black`}
        >
          {alwaysOnTopView ? (
            <Pin className="h-4 w-4" />
          ) : (
            <PinOff className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant={window.innerHeight > 76 ? "fit" : "disabled"}
          size={"fit"}
          onClick={
            window.innerHeight > 76
              ? () => setIsFooterVisible((prev) => !prev)
              : undefined
          }
          className={`flex cursor-default items-center justify-center border bg-background p-[1px] text-foreground hover:bg-black hover:text-white dark:border dark:text-foreground hover:dark:bg-white hover:dark:text-black`}
        >
          <PanelBottomClose className="h-4 w-4" />
        </Button>
        <Button
          variant={"fit"}
          size={"fit"}
          onClick={toggleTheme}
          className={`flex cursor-default items-center justify-center border bg-background p-[1px] text-foreground hover:bg-black hover:text-white dark:border dark:text-foreground hover:dark:bg-white hover:dark:text-black`}
        >
          {isDarkMode ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* tab trigger */}
      <TabsList data-tauri-drag-region className="flex items-center space-x-1">
        <TabsTrigger
          value="isBigCard"
          className={`flex cursor-default items-center justify-center border bg-background p-[1px] text-foreground hover:bg-black hover:text-white dark:border dark:text-foreground hover:dark:bg-white hover:dark:text-black`}
        >
          <Grid3x3 className="h-4 w-4" />
        </TabsTrigger>
        <TabsTrigger
          value="isSmallCard"
          className={`flex cursor-default items-center justify-center border bg-background p-[1px] text-foreground hover:bg-black hover:text-white dark:border dark:text-foreground hover:dark:bg-white hover:dark:text-black`}
        >
          <List className="h-4 w-4" />
        </TabsTrigger>
        <TabsTrigger
          value="isTable"
          className={`flex cursor-default items-center justify-center border bg-background p-[1px] text-foreground hover:bg-black hover:text-white dark:border dark:text-foreground hover:dark:bg-white hover:dark:text-black`}
        >
          <Table className="h-4 w-4" />
        </TabsTrigger>
      </TabsList>
    </header>
  );
};
