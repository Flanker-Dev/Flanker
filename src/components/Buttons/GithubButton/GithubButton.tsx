import { GithubButtonSVG } from "./GithubButtonSVG";

export const GithubButton = () => {
  return (
    <a
      href="https://github.com/Coordinate-Cat/Flanker"
      target="_blank"
      rel="noreferrer noopener"
      className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-sm rounded-tr-md hover:bg-neutral-800"
    >
      <GithubButtonSVG />
    </a>
  );
};
