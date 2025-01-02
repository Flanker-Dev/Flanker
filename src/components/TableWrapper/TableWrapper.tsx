import { invoke } from "@tauri-apps/api";
import { useState, useEffect } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getFavicon } from "@/constants/Favicon";
interface Bookmark {
  title: string;
  description: string;
  url: string;
  tags: string[];
}

export const TableWrapper = ({
  selectedFileContent,
}: {
  selectedFileContent: {
    bookmark: { bookmarkList: { bookmarkInfo: Bookmark[] }[] };
  };
}) => {
  const [ogpImages, setOgpImages] = useState<[string, string | null][]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOgpImages = async () => {
      try {
        const urlArray = selectedFileContent.bookmark.bookmarkList
          .flatMap((group) =>
            group.bookmarkInfo.map((bookmark) => bookmark.url)
          )
          .filter((url) => url.trim() !== "");
        const results = await invoke("fetch_ogp_images", { urls: urlArray });
        console.log(results);

        setOgpImages(results as [string, string | null][]);
        setFetchError(null); // 成功した場合はエラーメッセージをクリア
      } catch (error) {
        console.error("Failed to fetch OGP images:", error);
        setFetchError("Failed to fetch OGP images");
      }
    };

    if (selectedFileContent) {
      fetchOgpImages();
    }
  }, [selectedFileContent]);

  return (
    <div className="flex h-full overflow-auto rounded border backdrop-blur-sm">
      <Table>
        <TableHeader className="sticky top-0 z-10">
          <TableRow>
            <TableHead className="text-white">Title</TableHead>
            <TableHead className="text-white">OGP</TableHead>
            <TableHead className="text-white">Description</TableHead>
            <TableHead className="text-white">URL</TableHead>
            <TableHead className="text-white">Tags</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {selectedFileContent ? (
            selectedFileContent.bookmark.bookmarkList.map((group, groupIndex) =>
              group.bookmarkInfo.map((bookmark, bookmarkIndex) => (
                <TableRow key={`${groupIndex}-${bookmarkIndex}`}>
                  <TableCell className="truncate">
                    <div className="flex">
                      <img
                        src={
                          bookmark.url !== ""
                            ? `${getFavicon}${bookmark.url.replace(/https?:\/\//, "")}`
                            : ""
                        }
                        alt={bookmark.title}
                        className="mr-1 flex h-6 w-6 items-center"
                      />
                      {bookmark.title}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-32 truncate">
                    {fetchError ? (
                      <p>{fetchError}</p>
                    ) : (
                      ogpImages
                        .filter(([url]) => url === bookmark.url)
                        .slice(0, 1) // 1つの画像のみ表示するように制限
                        .map(([url, image]) => (
                          <div key={url} className="">
                            {image ? (
                              image === "Failed to fetch OGP image" ? (
                                <div className="flex min-h-24 w-24 items-center justify-center border bg-stone-500">
                                  <p>No OGP</p>
                                </div>
                              ) : (
                                <img
                                  src={image}
                                  alt={`OGP for ${url}`}
                                  className="min-h-24 w-24 object-cover"
                                />
                              )
                            ) : (
                              <p>No OGP</p>
                            )}
                          </div>
                        ))
                    )}
                  </TableCell>
                  <TableCell className="max-w-32 truncate">
                    {bookmark.description}
                  </TableCell>
                  <TableCell className="truncate">
                    <a
                      href={bookmark.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {bookmark.url}
                    </a>
                  </TableCell>
                  <TableCell className="truncate">
                    <ul className="flex space-x-2">
                      {bookmark.tags?.map((tag, tagIndex) => (
                        <li
                          key={tagIndex}
                          className="rounded border border-white bg-white px-1 text-xs text-black"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </TableCell>
                </TableRow>
              ))
            )
          ) : (
            <TableRow>
              <TableCell colSpan={5}>No bookmarks available</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
