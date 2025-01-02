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
      className={`fixed inset-0 left-0 z-50 m-[1px] flex flex-col items-center justify-center rounded-[7px] border bg-black transition-all duration-1000 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="relative flex flex-col items-center gap-2 p-2">
        <FlankerFullLogo className="svg-elem irregular-blink-animation w-24 cursor-default" />
        <div className="irregular-blink-animation relative -left-0 flex h-1 w-24 justify-start overflow-hidden">
          <div
            className="absolute h-1 transition-all duration-300"
            style={{
              width: `${progress}%`,
              // backgroundImage:
              //   "repeating-linear-gradient(45deg, black 0%, black 12.5%, white 12.5%, white 25%)",
              // backgroundSize: "20px 20px",
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
