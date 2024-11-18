import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getFavicon } from "@/shared/const/Favicon";
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
    bookmark: { bookmarkList: { name: string; bookmarkInfo: Bookmark[] }[] };
  };
}) => {
  return (
    <div className="flex h-full overflow-auto rounded border backdrop-blur-sm">
      <Table>
        <TableHeader className="sticky top-0 z-10">
          <TableRow>
            <TableHead className="text-white">Title</TableHead>
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
                  <TableCell className="flex items-center justify-start truncate">
                    <img
                      src={
                        bookmark.url !== ""
                          ? `${getFavicon}${bookmark.url.replace(/https?:\/\//, "")}`
                          : ""
                      }
                      alt={bookmark.title}
                      className="mr-1 h-6 w-6"
                    />
                    <p>{bookmark.title}</p>
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
