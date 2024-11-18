import { FileConfig } from "@/shared/types/types";

export const handleSwitchChange = (
  checked: boolean,
  config: FileConfig | null,
  setConfig: (config: FileConfig | null) => void
) => {
  if (!config) return;

  const updatedConfig = {
    ...config,
    bookmark: { ...config.bookmark, nsfw: checked },
  };

  setConfig(updatedConfig);
};
