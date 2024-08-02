type MiniSideMenuBarButtonProps = {
  setSideMenuView: (value: boolean) => void;
  sideMenuView: boolean;
};

export const MiniSideMenuBarButton = ({
  setSideMenuView,
  sideMenuView,
}: MiniSideMenuBarButtonProps) => {
  return (
    <button
      className="fixed bottom-[50%] left-[2px] top-[50%] z-[9999] h-[25px] w-[7px] translate-y-[-50%] rounded-full border border-[#EBDCB2] bg-[#d95e00] hover:bg-[#c68031]"
      onClick={() => {
        setSideMenuView(!sideMenuView);
      }}
    ></button>
  );
};
