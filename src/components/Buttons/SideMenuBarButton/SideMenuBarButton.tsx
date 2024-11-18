import { SideMenuBarButtonSVG } from "./SideMenuBarButtonSVG";

type SideMenuBarButtonProps = {
  sideMenuView: boolean;
  setSideMenuView: (value: boolean) => void;
  // setSideMenuWidth: (value: number) => void;
};

export const SideMenuBarButton = ({
  sideMenuView,
  setSideMenuView,
  // setSideMenuWidth,
}: SideMenuBarButtonProps) => {
  return (
    <button
      onClick={() => {
        setSideMenuView(!sideMenuView);
        // if (!sideMenuView) {
        //   setSideMenuWidth(40);
        // }
      }}
      className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-sm hover:bg-neutral-800"
    >
      <SideMenuBarButtonSVG />
    </button>
  );
};
