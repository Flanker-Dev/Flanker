export const BackgroundImageButton = ({
  isBackgroundImage,
  setIsBackgroundImage,
}: {
  isBackgroundImage: boolean;
  setIsBackgroundImage: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const toggleBackgroundImage = () => {
    setIsBackgroundImage(!isBackgroundImage);
  };
  return (
    <button
      className={`relative h-[22px] min-w-24 cursor-pointer rounded border border-[#EBDCB2] 
                ${isBackgroundImage ? "bg-[#d92800]" : ""}`}
      onClick={toggleBackgroundImage}
    >
      <div
        className={`absolute left-[1px] top-[1px] h-[18px] w-12 transform rounded-sm text-[8px] leading-[18px] text-[#d92800] transition-transform duration-100 ${
          isBackgroundImage ? "translate-x-[44px] bg-[#EBDCB2]" : "bg-[#EBDCB2]"
        }`}
      >
        {isBackgroundImage ? "ON" : "OFF"}
      </div>
    </button>
  );
};
