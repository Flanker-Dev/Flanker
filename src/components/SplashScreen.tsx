import { FlankerFullLogo } from "./Logos/FlankerFullLogo";

interface SplashScreenProps {
  fadeOut: boolean;
  progress: number;
}

export const SplashScreen = ({ fadeOut, progress }: SplashScreenProps) => {
  return (
    <div
      className={`fixed inset-0 left-0 z-50 m-[1px] flex flex-col items-end justify-end rounded-[7px] border bg-black transition-all duration-1000 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex items-center gap-2 p-2">
        <div className="flex h-1 w-[calc(100vw-174px)] justify-start overflow-hidden">
          <div
            className="h-full transition-all duration-300"
            style={{
              width: `${progress}%`,
              backgroundImage:
                "repeating-linear-gradient(45deg, black 0%, black 12.5%, white 12.5%, white 25%)",
              backgroundSize: "20px 20px",
              animation: "move-stripes 3s linear infinite",
            }}
          ></div>
        </div>
        <div className="w-10 font-bold text-white">{progress}%</div>
        <FlankerFullLogo className="svg-elem irregular-blink-animation w-24 cursor-default" />
      </div>
    </div>
  );
};
