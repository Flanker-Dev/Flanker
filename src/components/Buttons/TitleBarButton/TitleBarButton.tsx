type TitleBarButtonProps = {
  titlebarView: boolean;
  setTitlebarView: (value: boolean) => void;
};

export const TitleBarButton = ({
  titlebarView,
  setTitlebarView,
}: TitleBarButtonProps) => {
  return (
    <button
      onClick={() => setTitlebarView(!titlebarView)}
      className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-sm hover:bg-neutral-800"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 -960 960 960"
        fill="#EBDCB2"
      >
        <path d="M240-560h360v-120H240v120Zm-40 440q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z" />
      </svg>
    </button>
  );
};
