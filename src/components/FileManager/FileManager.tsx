// FileManager.tsx
import { PlusIcon, TrashIcon } from "@radix-ui/react-icons";
// import { ScrollArea } from "@radix-ui/react-scroll-area";
import Picker, { Theme } from "emoji-picker-react";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { handleDeleteBookmarkInfo } from "./handleDeleteBookmarkInfo";
import { handleDragLeave } from "./handleDragLeave";
import { handleDragOver } from "./handleDragOver";
import { handleDrop } from "./handleDrop";
import { handleNewFileNameChange } from "./handleNewFileNameChange";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { handleAddBookmarkInfo } from "@/components/FileManager/handleAddBookmarkInfo";
import { handleChange } from "@/components/FileManager/handleChange";
import { handleGenerate } from "@/components/FileManager/handleGenerate";
import { handleSwitchChange } from "@/components/FileManager/handleSwitchChange";
import { FileConfig } from "@/types/types";
import { loadConfig } from "@/utils/loadConfig";

interface FileManagerProps {
  newFile: string;
  setNewFile: (value: string) => void;
  files: string[];
  loading: boolean;
  handleNewFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCreateNewFile: (
    fileName: string,
    setNewFile: (value: string) => void
  ) => void;
  loadFileContent: (file: string) => void;
  handleDeleteFile: (file: string) => void;
}

export const FileManager: React.FC<FileManagerProps> = () => {
  const [config, setConfig] = useState<FileConfig | null>(null);
  const [newFile, setNewFile] = useState("");
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [pickerState, setPickerState] = useState({
    isOpen: false,
    chosenEmoji: { emoji: "😃" },
  });

  const toggleEmojiPicker = () => {
    setPickerState((prevState) => ({
      ...prevState,
      isOpen: !prevState.isOpen,
    }));
  };

  useEffect(() => {
    const fetchConfig = async () => {
      const configData = await loadConfig();
      if (configData) {
        configData.bookmark.bookmarkList[0].bookmarkInfo =
          configData.bookmark.bookmarkList[0].bookmarkInfo.map((info) => ({
            id: info.id || uuidv4(),
            title: info.title,
            url: info.url,
            description: info.description,
            tags: info.tags,
          }));
      }
      setConfig(configData);
    };

    fetchConfig();

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // 依存配列から pickerState.isOpen を削除

  const handleClickOutside = (event: MouseEvent) => {
    const emojiPicker = document.getElementById("emoji-picker");
    const emojiButton = document.getElementById("emoji-button");
    const target = event.target as Node;

    if (
      pickerState.isOpen &&
      emojiPicker &&
      emojiButton &&
      !emojiPicker.contains(target) &&
      !emojiButton.contains(target)
    ) {
      setPickerState({ ...pickerState, isOpen: false });
    }
  };
  const handleEmojiClick = (emojiObject) => {
    setPickerState((prevState) => ({ ...prevState, chosenEmoji: emojiObject }));
  };

  return (
    <Dialog>
      <DialogTrigger className="flex items-center justify-center rounded hover:bg-stone-800 hover:text-white">
        <PlusIcon className="h-4 w-4" />
      </DialogTrigger>
      <DialogContent className="h-fit max-h-[calc(60vh)] max-w-screen-md overflow-scroll lg:max-h-[calc(75vh)] xl:max-h-[calc(80vh)] 2xl:max-h-[calc(85vh)]">
        <DialogHeader>
          <DialogTitle>Generate New File</DialogTitle>
          <DialogDescription>
            Enter the name of the new file you want to generate.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2 flex justify-between">
          <div className="flex-1 space-y-1">
            <div className="flex items-center space-x-2">
              <Label className="w-20 whitespace-nowrap">
                File Name
                <span className="text-red-500">*</span>
              </Label>
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="ex. my-bookmarks"
                  autoCorrect="off"
                  value={newFile}
                  onChange={(e) => handleNewFileNameChange(e, setNewFile)}
                  maxLength={100}
                  className={
                    newFile.length === 100
                      ? "w-full flex-1 border-red-500 pr-16 text-left duration-500"
                      : "w-full pr-16 text-left"
                  }
                />
                <span
                  className={`absolute ml-auto bg-black text-sm ${
                    newFile.length === 100
                      ? "bottom-2 right-1 font-black text-red-500"
                      : "bottom-2 right-1"
                  }`}
                >
                  {newFile.length}/100
                </span>
              </div>
              <span>.json</span>
            </div>

            {/* bookmarkTitle */}
            <div className="flex items-center space-x-2">
              <Label className="w-20 whitespace-nowrap">Title</Label>
              <div className="flex flex-1 items-center">
                <p className="px-[13px] py-1 text-sm">{newFile}</p>
              </div>
              {/* <Input
                    type="text"
                    disabled={true}
                    name="bookmarkTitle"
                    autoCorrect="off"
                    className="flex-1"
                    value={newFile}
                    onChange={(e) => handleNewFileNameChange(e, setNewFile)}
                    placeholder="ex. YouTube channel list"
                  /> */}
            </div>

            {/* bookmarkDescription */}
            <div className="flex items-center space-x-2">
              <Label className="w-20 whitespace-nowrap">Desc</Label>
              <Input
                type="text"
                name="bookmarkDescription"
                autoCorrect="off"
                className="flex-1"
                value={config?.bookmark.bookmarkDescription || ""}
                onChange={(e) => handleChange(e, config, setConfig)}
                placeholder="ex. My favorite YouTube channels"
              />
            </div>

            {/* bookmarkTags */}
            <div className="flex items-center space-x-2">
              <Label className="w-20 whitespace-nowrap">Tags</Label>
              <Input
                type="text"
                name="bookmarkTags"
                autoCorrect="off"
                className="flex-1"
                value={config?.bookmark.bookmarkTags.join(",") || ""}
                onChange={(e) => handleChange(e, config, setConfig)}
                placeholder="ex. youtube,channel,list"
              />
            </div>

            {/* emoji */}
            <div className="flex items-center">
              <Label className="mr-1 w-20 whitespace-nowrap">Emoji</Label>
              <Button
                id="emoji-button"
                variant={"outline"}
                className="ml-1 h-[36px] w-[36px]"
                onClick={toggleEmojiPicker}
              >
                {pickerState.chosenEmoji.emoji}
              </Button>
            </div>

            {/* nsfw */}
            <div className="flex h-8 items-center space-x-2">
              <Label className="w-20 whitespace-nowrap">Nsfw</Label>
              <Switch
                name="nsfw"
                className="max-w-12 flex-1"
                checked={Boolean(config?.bookmark.nsfw)}
                onCheckedChange={(checked) =>
                  handleSwitchChange(checked, config, setConfig)
                }
              />
            </div>

            {/* bookmarkList Title */}
            <div className="flex items-center space-x-2 pb-1">
              <Label className="w-20 whitespace-nowrap">
                List Title
                <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                name="bookmarkList"
                autoCorrect="off"
                className="flex-1"
                value={config?.bookmark.bookmarkList[0].name || ""}
                onChange={(e) => handleChange(e, config, setConfig)}
                placeholder="ex. YouTube channel list"
              />
            </div>

            {config?.bookmark.bookmarkList[0].bookmarkInfo.map(
              (info, infoIndex) => (
                <div
                  key={infoIndex}
                  className="relative flex border-t pb-1 pt-2"
                  onDrop={(e) =>
                    handleDrop(
                      e,
                      infoIndex,
                      config,
                      setConfig,
                      setDragOverIndex
                    )
                  }
                  onDragOver={(e) =>
                    handleDragOver(e, infoIndex, setDragOverIndex)
                  }
                  onDragLeave={() => handleDragLeave(setDragOverIndex)}
                >
                  {dragOverIndex === infoIndex && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50 text-white">
                      ここにドロップ
                    </div>
                  )}
                  <div className="flex-1">
                    {/* bookmarkInfo.title */}
                    <div className="flex items-center space-x-2 pb-1">
                      <Label className="min-w-[80px] whitespace-nowrap">
                        Title
                      </Label>
                      <Input
                        type="text"
                        name="title"
                        autoCorrect="off"
                        value={info.title}
                        onChange={(e) =>
                          handleChange(e, config, setConfig, infoIndex)
                        }
                        placeholder="ex. HikakinTV"
                      />
                    </div>
                    {/* bookmarkInfo.url */}
                    <div className="flex items-center space-x-2 pb-1">
                      <Label className="min-w-20 whitespace-nowrap">URL</Label>
                      <Input
                        type="text"
                        name="url"
                        autoCorrect="off"
                        value={info.url}
                        onChange={(e) =>
                          handleChange(e, config, setConfig, infoIndex)
                        }
                        placeholder="ex. https://www.youtube.com/user/HikakinTV"
                      />
                    </div>
                    {/* bookmarkInfo.description */}
                    <div className="flex items-center space-x-2 pb-1">
                      <Label className="min-w-20 whitespace-nowrap">Desc</Label>
                      <Input
                        type="text"
                        name="description"
                        autoCorrect="off"
                        value={info.description}
                        onChange={(e) =>
                          handleChange(e, config, setConfig, infoIndex)
                        }
                        placeholder="ex. HikakinTV channel"
                      />
                    </div>
                    {/* bookmarkInfo.tags */}
                    <div className="flex items-center space-x-2">
                      <Label className="min-w-20 whitespace-nowrap">Tags</Label>
                      <Input
                        type="text"
                        name="tags"
                        autoCorrect="off"
                        value={info.tags.join(",")}
                        onChange={(e) =>
                          handleChange(e, config, setConfig, infoIndex)
                        }
                        placeholder="ex. hikakin,channel,youtube"
                      />
                    </div>
                  </div>
                  <pre className="ml-1 max-h-[156px] w-[367px] overflow-scroll rounded border bg-black p-2 text-xs">
                    {JSON.stringify(info, null, 2)}
                  </pre>
                  <Button
                    variant={"destructive"}
                    className="ml-1 h-[156px] w-8 border p-0"
                    onClick={() =>
                      handleDeleteBookmarkInfo(config, setConfig, infoIndex)
                    }
                  >
                    <TrashIcon />
                  </Button>
                </div>
              )
            )}
            <Button
              variant={"secondary"}
              className="w-full"
              onClick={() => handleAddBookmarkInfo(config, setConfig)}
            >
              <PlusIcon />
            </Button>
          </div>

          {pickerState.isOpen && (
            <div
              id="emoji-picker"
              key="emoji-picker"
              className="absolute right-10 top-1/2 -translate-y-1/2 transform"
            >
              <Picker
                onEmojiClick={handleEmojiClick}
                theme={Theme.DARK}
                width={"300px"}
                height={"450px"}
              />
            </div>
          )}
        </div>
        <DialogClose asChild>
          <Button
            variant={"blur"}
            className={
              // required fields are empty
              `mt-2 ${
                // !config?.bookmark.bookmarkTitle || // bookmarkTitle
                !config?.bookmark.bookmarkList[0].name || // bookmarkList title
                newFile.length === 0 || // 0 length
                newFile.length === 100 // 100 length
                  ? "pointer-events-none w-[718px] cursor-not-allowed opacity-50"
                  : "w-[720px]"
              }`
            }
            onClick={() =>
              handleGenerate(
                {
                  ...config,
                  bookmark: {
                    bookmarkTitle: config?.bookmark.bookmarkTitle || "",
                    bookmarkDescription:
                      config?.bookmark.bookmarkDescription || "",
                    bookmarkTags: config?.bookmark.bookmarkTags || [],
                    emoji: pickerState.chosenEmoji.emoji,
                    nsfw: config?.bookmark.nsfw || false,
                    createdAt: config?.bookmark.createdAt || "",
                    updatedAt: config?.bookmark.updatedAt || "",
                    bookmarkList: config?.bookmark.bookmarkList || [],
                  },
                },
                newFile,
                setNewFile,
                setConfig
              )
            }
          >
            Generate
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};
