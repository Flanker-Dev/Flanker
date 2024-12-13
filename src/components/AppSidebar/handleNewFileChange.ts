import { handleError } from "@/utils/errorToast";

export const handleNewFileChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  newFile: string,
  setNewFile: React.Dispatch<React.SetStateAction<string>>
) => {
  const value = e.target.value;
  if (value.length === 100 && newFile.length < 100) {
    handleError(); // 100文字になった瞬間にのみトーストを表示
  }
  setNewFile(e.target.value);
};
