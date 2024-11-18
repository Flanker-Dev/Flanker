import { ImageUploaderButton } from "../Buttons/ImageUploaderButton/ImageUploaderButton";

export const SettingBackgroundImage = ({
  setBgColor,
  setImageSrc,
  isBackgroundImage,
}: {
  setBgColor: (color: string) => void;
  setImageSrc: (src: string | null) => void;
  isBackgroundImage: boolean;
}) => {
  return (
    <fieldset className="my-1 w-full rounded border border-white px-1 pb-1">
      <legend className="px-1 text-xs">Background Image</legend>
      <div className="flex items-center justify-between px-1">
        <div className="cursor-default select-none text-[10px]">
          Upload Image
        </div>
        {isBackgroundImage ? (
          <ImageUploaderButton
            setBgColor={setBgColor}
            setImageSrc={setImageSrc}
          />
        ) : (
          <div className="flex h-[22px] min-w-24 cursor-default items-center rounded border border-white bg-zinc-700">
            <div className="h-4 w-full cursor-not-allowed text-center">
              Disabled
            </div>
          </div>
        )}
      </div>
    </fieldset>
  );
};
