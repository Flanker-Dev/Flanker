// BookmarkEditor.jsx
import { invoke } from "@tauri-apps/api";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export const BookmarkEditor = ({
  fileName,
  isOpen,
  onClose,
  loadFileContent,
}) => {
  const [bookmark, setBookmark] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    const loadBookmark = async () => {
      try {
        const data = await invoke("read_json", { fileName });
        setBookmark(data);
        setEditData(data);
      } catch (error) {
        // eslint-disable-next-line no-undef
        console.log(error);
      }
    };
    if (isOpen) {
      loadBookmark();
    }
  }, [fileName, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await invoke("save_json", { fileName, bookmark: editData });
      loadFileContent(fileName); // 更新後にリロード
      onClose();
    } catch (error) {
      // eslint-disable-next-line no-undef
      console.log(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>ブックマーク編集</Dialog.Title>
        </Dialog.Header>
        {bookmark && (
          <div>
            <label>
              タイトル:
              <Input
                type="text"
                name="bookmarkTitle"
                value={editData.bookmarkTitle || ""}
                onChange={handleChange}
              />
            </label>
            <label>
              説明:
              <Input
                type="text"
                name="bookmarkDescription"
                value={editData.bookmarkDescription || ""}
                onChange={handleChange}
              />
            </label>
            <Button onClick={handleSave}>保存</Button>
          </div>
        )}
      </Dialog.Content>
    </Dialog>
  );
};
