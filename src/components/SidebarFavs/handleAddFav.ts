import { homeDir } from "@tauri-apps/api/path";
import { invoke } from "@tauri-apps/api/tauri";

export const handleAddFav = (
  urls: { [key: string]: string },
  setUrls: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>,
  newKey: string,
  newUrl: string
) => {
  // Remove any existing 'https://' or 'http://' from the beginning of the URL
  const cleanedUrl = newUrl
    .replace(/^https?:\/\//, "")
    .replace(/^http?:\/\//, "");
  const updatedUrls = { ...urls, [newKey]: cleanedUrl };
  setUrls(updatedUrls);

  // Save the updated URLs to the file
  (async () => {
    try {
      const home = await homeDir();
      const favsPath = `${home}.config/flk/sidebar_favs/favs.json`;
      await invoke("write_file", {
        filePath: favsPath,
        contents: JSON.stringify(updatedUrls),
      });
    } catch (err) {
      console.error("Error writing to favs.json:", err);
    }
  })();
};
