import { DefaultSettingButton } from "../Buttons/DefaultSettingButton/DefaultSettingButton";
import { ResetStoreButton } from "../Buttons/ResetStoreButton/ResetStoreButton";

export const SettingReset = () => {
  return (
    <fieldset className="w-full rounded border border-[#EBDCB2] px-1 pb-1">
      <legend className="px-1 text-xs">Reset</legend>
      <div className="mb-1 flex items-center justify-between px-1">
        <div className="cursor-pointer select-none text-[10px]">
          Reset Store
        </div>
        <ResetStoreButton />
      </div>
      <div className="flex items-center justify-between px-1">
        <div className="cursor-pointer select-none text-[10px]">
          Default Setting
        </div>
        <DefaultSettingButton />
      </div>
    </fieldset>
  );
};
