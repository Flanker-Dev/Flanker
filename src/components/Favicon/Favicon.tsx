import { getFavicon } from "@/shared/const/Favicon";

interface FaviconProps {
  url: string;
  title: string;
}

const Favicon = ({ url, title }: FaviconProps) => {
  return (
    <>
      {url !== "" && (
        <a href={url} target="_blank" rel="noreferrer">
          <img
            src={`${getFavicon}${url.replace(/https?:\/\//, "")}`}
            alt={title}
            className="h-6 w-6"
          />
        </a>
      )}
    </>
  );
};

export default Favicon;
