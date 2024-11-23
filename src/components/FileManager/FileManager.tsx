// FileManager.tsx
import { PlusIcon, ReloadIcon, TrashIcon } from "@radix-ui/react-icons";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import Picker, { Theme } from "emoji-picker-react";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { handleDeleteBookmarkInfo } from "./handleDeleteBookmarkInfo";
import { handleNewFileNameChange } from "./handleNewFileNameChange";
import { onEmojiClick } from "./onEmojiClick";
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
  selectedFileContent: Record<string, string> | null;
}

export const FileManager: React.FC<FileManagerProps> = ({
  files,
  loading,
  loadFileContent,
  handleDeleteFile,
  selectedFileContent,
}) => {
  const [config, setConfig] = useState<FileConfig | null>(null);
  const [newFile, setNewFile] = useState("");
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [chosenEmoji, setChosenEmoji] = useState<{ emoji: string } | null>(
    null
  );

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

  useEffect(() => {
    fetchConfig();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const emojiPicker = document.getElementById("emoji-picker");
      const emojiButton = document.getElementById("emoji-button");
      const target = event.target as Node;

      if (isEmojiPickerOpen && emojiPicker && emojiButton) {
        if (!emojiPicker.contains(target) && !emojiButton.contains(target)) {
          setIsEmojiPickerOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEmojiPickerOpen]);

  return (
    <ScrollArea className="h-full w-full rounded">
      <div className="flex w-full flex-col gap-1">
        <Dialog>
          <DialogTrigger className="flex w-full items-center justify-center rounded border py-2">
            <PlusIcon />
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
                  <Label className="w-20 whitespace-nowrap">File Name</Label>
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
                  <Label className="w-20 whitespace-nowrap">
                    Title
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    name="bookmarkTitle"
                    autoCorrect="off"
                    className="flex-1"
                    value={config?.bookmark.bookmarkTitle || ""}
                    onChange={(e) => handleChange(e, config, setConfig)}
                    placeholder="ex. YouTube channel list"
                  />
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
                    onClick={() => {
                      setIsEmojiPickerOpen(!isEmojiPickerOpen);
                    }}
                  >
                    {chosenEmoji?.emoji || "😃"}
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
                    <div key={infoIndex} className="flex border-t pt-2">
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
                          <Label className="min-w-20 whitespace-nowrap">
                            URL
                          </Label>
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
                          <Label className="min-w-20 whitespace-nowrap">
                            Desc
                          </Label>
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
                          <Label className="min-w-20 whitespace-nowrap">
                            Tags
                          </Label>
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
                      <Button
                        variant={"destructive"}
                        className="ml-1 h-[156px] w-8 border p-0"
                        onClick={() =>
                          handleDeleteBookmarkInfo(config, setConfig, infoIndex)
                        }
                      >
                        <TrashIcon />
                      </Button>
                      <pre className="ml-1 max-h-[156px] w-[367px] overflow-scroll rounded border bg-black p-2 text-xs">
                        {JSON.stringify(info, null, 2)}
                      </pre>
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

              {isEmojiPickerOpen && (
                <div
                  id="emoji-picker"
                  key="emoji-picker"
                  // 上下中央
                  className="absolute right-10 top-1/2 -translate-y-1/2 transform"
                >
                  <Picker
                    onEmojiClick={(emojiObject) =>
                      onEmojiClick(
                        emojiObject,
                        config,
                        setConfig,
                        setChosenEmoji
                      )
                    }
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
                    !config?.bookmark.bookmarkTitle || // bookmarkTitle
                    !config?.bookmark.bookmarkList[0].name || // bookmarkList title
                    newFile.length === 0 || // 0 length
                    newFile.length === 100 // 100 length
                      ? "pointer-events-none w-[718px] cursor-not-allowed opacity-50"
                      : "w-[720px]"
                  }`
                }
                onClick={() =>
                  handleGenerate(config, newFile, setNewFile, setConfig)
                }
              >
                Generate
              </Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      </div>
      {loading ? (
        <div className="flex h-6 w-full items-center justify-start">
          <span className="mr-1">Loading</span>
          <ReloadIcon className="h-4 w-4 animate-spin" />
        </div>
      ) : (
        <div className="mt-1 flex w-full flex-col space-y-1">
          {files.length > 0 ? (
            files
              .filter((file) => file !== ".DS_Store")
              .map((file, index) => (
                <Button
                  key={index}
                  variant={"menu"}
                  size={"sideMenu"}
                  onClick={() => loadFileContent(file)}
                  className="group flex w-auto justify-between"
                >
                  <span className={"w-64 truncate text-left"}>
                    {file.replace(/\.[^/.]+$/, "")}
                  </span>
                  {/* delete */}
                  <span
                    onClick={() => handleDeleteFile(file)}
                    className="ml-auto hidden group-hover:block"
                  >
                    {selectedFileContent?.title === file}×
                  </span>
                </Button>
              ))
          ) : (
            <li>No files found</li>
          )}
        </div>
      )}
    </ScrollArea>
  );
};
