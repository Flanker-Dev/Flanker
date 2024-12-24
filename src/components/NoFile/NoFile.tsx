// import { FileIcon } from "@radix-ui/react-icons";
import { PanelLeft } from "lucide-react";

// import { Button } from "../ui/button";

// interface FileDisplayProps {
//   files: string[];
//   loadFileContent: (file: string) => void;
// }

export const NoFile = () =>
  // { files, loadFileContent }: FileDisplayProps
  {
    return (
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform cursor-default text-center">
        {/* <div className="mb-4 flex items-center justify-center">
          <img
            src="src/assets/Flanker_full_logo.svg"
            alt="Flanker"
            className="w-40"
          />
        </div> */}
        <p className="flex">
          <span>← Please select from </span>
          <PanelLeft className="mx-1 dark:text-background" />{" "}
          <span>SideMenu.</span>
        </p>
        {/* files最新一件表示 */}
        {/* <p className="mr-2">Or...</p> */}
        {/* <div>
          {files.length > 0 &&
            files
              .filter((file) => file !== ".DS_Store")
              
              .map((file, index) => (
                <Button
                  key={index}
                  variant={"outline"}
                  size={"sm"}
                  onClick={() => loadFileContent(file)}
                >
                  <FileIcon className="mr-1 h-4 w-4" />
                  Latest File
                </Button>
              ))}
        </div> */}
      </div>
    );
  };
