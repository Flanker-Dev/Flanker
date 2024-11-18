import { useEffect } from "react";

// titlebarの表示非表示(display:noneの切り替え)
const useToggleDisplay = (
  titlebarView: boolean,
  setTitlebarView: (titlebarView: boolean) => void
) => {
  useEffect(() => {
    const header = document.getElementById("Header");
    const app = document.getElementById("app");
    if (titlebarView) {
      header!.style.display = "none";
      app!.style.display = "none";
      setTitlebarView(true);
    } else {
      header!.style.display = "flex";
      app!.style.display = "flex";
      setTitlebarView(false);
    }
  }, [titlebarView, setTitlebarView]);
};

export default useToggleDisplay;
