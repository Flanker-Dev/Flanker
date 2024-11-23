import { FileConfig } from "@/types/types";

export const onEmojiClick = (
  emojiObject: { emoji: string },
  config: FileConfig | null,
  setConfig: React.Dispatch<React.SetStateAction<FileConfig | null>>,
  setChosenEmoji: React.Dispatch<React.SetStateAction<{ emoji: string } | null>>
) => {
  console.log(emojiObject);
  setChosenEmoji(emojiObject);

  if (config) {
    setConfig({
      ...config,
      bookmark: {
        ...config.bookmark,
        emoji: emojiObject.emoji,
      },
    });
  }
};
