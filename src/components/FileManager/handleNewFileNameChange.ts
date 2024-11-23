import { handleError } from "@/utils/errorToast";

export const handleNewFileNameChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  setNewFile: (value: string) => void
) => {
  const value = e.target.value;
  if (value.length === 100) {
    handleError();
  }
  setNewFile(value);
};
