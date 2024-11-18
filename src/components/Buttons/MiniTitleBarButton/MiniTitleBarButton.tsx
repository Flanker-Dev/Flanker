type MiniTitleBarButtonProps = {
  setTitlebarView: (value: boolean) => void;
  titlebarView: boolean;
};

export const MiniTitleBarButton = ({
  setTitlebarView,
  titlebarView,
}: MiniTitleBarButtonProps) => {
  return (
    <button
      className="fixed left-[50%] right-[50%] top-[1px] z-[9999] h-2 w-[50px] translate-x-[-50%] rounded-full border border-white bg-[#d95e00] hover:bg-[#c68031]"
      onClick={() => setTitlebarView(!titlebarView)}
    ></button>
  );
};
