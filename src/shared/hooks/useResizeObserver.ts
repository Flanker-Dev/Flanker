import { useEffect } from "react";

// SideMenuの幅の数値を取得
const useResizeObserver = (setSideMenuWidth: (width: number) => void) => {
  useEffect(() => {
    const sidemenu = document.getElementById("SideMenu");
    if (sidemenu) {
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setSideMenuWidth(entry.contentRect.width);
        }
      });
      observer.observe(sidemenu);
      return () => observer.disconnect();
    }
  }, [setSideMenuWidth]);
};

export default useResizeObserver;
