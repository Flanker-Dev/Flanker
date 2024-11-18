import { appWindow } from "@tauri-apps/api/window";

const closeButton = document.getElementById("titlebar-close");
if (closeButton) {
  closeButton.addEventListener("click", () => appWindow.close());
}

const minimizeButton = document.getElementById("titlebar-minimize");
if (minimizeButton) {
  minimizeButton.addEventListener("click", () => appWindow.minimize());
}

const maximizeButton = document.getElementById("titlebar-maximize");
if (maximizeButton) {
  maximizeButton.addEventListener("click", () => appWindow.toggleMaximize());
}

const changeBackgroundColor = (color: string) => {
  const titlebarClose = document.getElementById("titlebar-close");
  if (titlebarClose) {
    titlebarClose.style.backgroundColor = color;
  }

  const titlebarMinimize = document.getElementById("titlebar-minimize");
  if (titlebarMinimize) {
    titlebarMinimize.style.backgroundColor = color;
  }

  const titlebarMaximize = document.getElementById("titlebar-maximize");
  if (titlebarMaximize) {
    titlebarMaximize.style.backgroundColor = color;
  }
};

// ウィンドウがフォーカスされていない時
window.addEventListener("blur", function () {
  changeBackgroundColor("#393c3c");
});

// ウィンドウがフォーカスされている時
window.addEventListener("focus", function () {
  const titlebarClose = document.getElementById("titlebar-close");
  if (titlebarClose) {
    titlebarClose.style.backgroundColor = "#ff605c";
  }
  const titlebarMinimize = document.getElementById("titlebar-minimize");
  if (titlebarMinimize) {
    titlebarMinimize.style.backgroundColor = "#ffbd2e";
  }
  const titlebarMaximize = document.getElementById("titlebar-maximize");
  if (titlebarMaximize) {
    titlebarMaximize.style.backgroundColor = "#28ca42";
  }
});

export const TrafficLightButton = () => {
  return (
    <div id="app" className="titlebar flex">
      <button
        onClick={() => appWindow.close()}
        className="titlebar-button"
        id="titlebar-close"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          width="10"
          height="10"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      <button
        onClick={() => appWindow.minimize()}
        className="titlebar-button"
        id="titlebar-minimize"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          width="10"
          height="10"
        >
          <line x1="4" y1="12" x2="20" y2="12"></line>
        </svg>
      </button>
      <button
        onClick={() => appWindow.toggleMaximize()}
        className="titlebar-button"
        id="titlebar-maximize"
      >
        <svg
          width="10"
          height="10"
          viewBox="0 0 143 143"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M108.242 32.8833C108.797 32.8817 109.247 33.3317 109.245 33.8862L109.092 87.5891C109.09 88.4786 108.014 88.9223 107.385 88.2933L53.8351 34.7432C53.2061 34.1142 53.6499 33.0387 54.5394 33.0361L108.242 32.8833Z"
            fill="currentColor"
          />
          <path
            d="M33.8862 109.245C33.3317 109.247 32.8818 108.797 32.8833 108.242L33.0361 54.5394C33.0387 53.6499 34.1142 53.2061 34.7432 53.8351L88.2934 107.385C88.9223 108.014 88.4786 109.09 87.5891 109.092L33.8862 109.245Z"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>
  );
};
