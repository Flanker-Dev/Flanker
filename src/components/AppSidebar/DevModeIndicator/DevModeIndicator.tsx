import { FlankerFullLogo } from "../../Logos/FlankerFullLogo";

interface DevModeIndicatorProps {
  isDev: boolean;
}

export const DevModeIndicator = ({ isDev }: DevModeIndicatorProps) => {
  return (
    <div className="m-2">
      {isDev ? (
        <p className="cursor-default font-bold italic text-zinc-500">
          Dev Mode
        </p>
      ) : null}
      <FlankerFullLogo className="w-24 cursor-default" />
    </div>
  );
};
