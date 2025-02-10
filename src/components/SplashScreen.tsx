import { useEffect } from "react";

import { FlankerFullLogo } from "./Logos/FlankerFullLogo";

interface SplashScreenProps {
  fadeOut: boolean;
  progress: number;
}

export const SplashScreen = ({ fadeOut, progress }: SplashScreenProps) => {
  const playAudio = () => {
    const se = "se.mp3";
    const audio = new Audio(se);
    audio.volume = 0;
    audio.addEventListener("canplaythrough", () => {
      audio.play();
      let volume = 0;
      const fadeIn = setInterval(() => {
        if (volume < 0.5) {
          volume += 0.01;
          audio.volume = volume;
        } else {
          clearInterval(fadeIn);
        }
      }, 50);
    });
  };

  useEffect(() => {
    playAudio();
  }, []);

  return (
    <div
      className={`fixed inset-0 left-0 z-0 m-[1px] flex flex-col items-center justify-center rounded-[8px] border border-white bg-background transition-all duration-1000 dark:bg-background ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* 画面いっぱい */}
      <img
        src="/splash.jpg"
        alt="favicon"
        className="absolute z-10 h-full w-full rounded-[8px] border border-white bg-background object-cover dark:bg-background"
      />
      {/* <div className="absolute z-10 h-full w-full rounded-[8px] border bg-background object-cover dark:border dark:bg-background"></div> */}
      <div className="absolute z-20 flex h-full w-full flex-col items-center justify-center rounded-[8px] shadow-[inset_0_0_200px_100px_black]"></div>
      <FlankerFullLogo className="svg-elem irregular-blink-animation absolute bottom-4 right-2 z-50 w-24 min-w-24 cursor-default" />
      <div className="absolute bottom-2 right-2 z-50 w-24 min-w-24 cursor-default">
        <div className="irregular-blink-animation flex h-1 justify-start overflow-hidden">
          <div
            className="absolute h-1 transition-all duration-300"
            style={{
              width: `${progress}%`,
              background: "white",
              animation: "move-stripes 3s linear infinite",
            }}
          ></div>
        </div>
        {/* <div className="w-10 font-bold text-white">{progress}%</div> */}
      </div>
    </div>
  );
};
