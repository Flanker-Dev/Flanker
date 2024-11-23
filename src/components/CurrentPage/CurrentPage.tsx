export const CurrentPage = ({ currentPage }: { currentPage: string }) => {
  const urls = {
    facebook: "https://www.facebook.com/",
    x: "https://twitter.com/",
    instagram: "https://www.instagram.com/",
    youtube: "https://www.youtube.com/",
    tiktok: "https://www.tiktok.com/",
  };
  const getFavicon = "https://www.google.com/s2/favicons?domain=";
  return (
    <div data-tauri-drag-region>
      <div className="flex h-full flex-col items-start justify-start">
        <p className="cursor-default text-[10px]">{currentPage}</p>
        {Object.entries(urls).map(([key, url]) => (
          <div className="flex items-center" key={key}>
            <img src={`${getFavicon}${url}`} alt={key} key={key} />
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="ml-0.5 truncate text-xs"
            >
              {key}
            </a>
          </div>
        ))}
        https://www.youtube.com/
        <iframe src="https://www.youtube.com/" title="YouTube" />
      </div>
    </div>
  );
};
