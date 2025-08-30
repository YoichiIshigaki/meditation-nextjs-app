"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { TranslateText } from "@/components";
import { Audio, AudioHandlers } from "@/components/Audio";

type PageProps = { params: { lang: string } };

const getGreeting = (): string => {
  const nowHour = new Date().getHours();
  if (nowHour > 4 && nowHour < 11) {
    return "meditation:greeting.good_morning";
  } else if (nowHour > 11 && nowHour < 18) {
    return "meditation:greeting.good_afternoon";
  }
  return "meditation:greeting.good_evening";
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function Page(_props: PageProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [userName, _setUserName] = useState("john");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [breatheCycleTime, _setBreatheCycleTime] = useState(7500);
  const [breathe, setBreathe] = useState<"breathe" | "stop" | "exhale">(
    "breathe",
  );
  const breatheMap = {
    breathe: {
      message: "meditation:breathe.breathe",
      className: "scale-[1.0]",
      // className: "animate-grow",
    },
    stop: {
      message: "meditation:breathe.stop",
      className: "scale-[1.0]",
      // className: "scale-[1.2]"
    },
    exhale: {
      message: "meditation:breathe.exhale",
      className: "scale-[1.0]",
      // className: "animate-shrink",
    },
  };

  const breatheTime = (breatheCycleTime / 5) * 2; // 3s
  const holdTime = breatheCycleTime / 5; // 1.5s

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const breatheAnimation = useCallback(async () => {
    // console.log("breathe");

    setBreathe("breathe");
    await sleep(breatheTime);
    // console.log("stop");
    setBreathe("stop");
    await sleep(holdTime);
    // console.log("exhale");
    setBreathe("exhale");
  }, [setBreathe, breatheTime, holdTime]);

  const breathAnimationInterval = useCallback(
    () => setInterval(breatheAnimation, breatheCycleTime),
    [breatheCycleTime, breatheAnimation],
  );

  const audioRef = useRef<AudioHandlers | null>(null);

  useEffect(() => {
    const execBreathAnimationInterval = breathAnimationInterval();
    return () => {
      clearInterval(execBreathAnimationInterval);
    };
  }, [breathAnimationInterval]);

  return (
    <div>
      <video
        src="/videos/sea_twilight.mp4"
        autoPlay
        muted
        loop
        className="absolute top-[63px] left-0 w-full h-full object-fill opacity-80"
      />

      <div className="grid grid-rows-[20px_1fr_20px] items-center text-center p-0 h-screen w-screen font-meditation bg-sea bg-cover bg-no-repeat bg-center">
        <div className="h-screen w-screen container flex items-center justify-center m-auto relative scale-100 bg-opacity-80">
          <div
            data-testid="container"
            className={cn(
              "h-[300px] w-[300px] m-auto flex relative scale-100 items-center justify-center",
              breatheMap[breathe].className,
            )}
          >
            <div
              data-testid="circle"
              className="h-full w-full bg-[#010f1c] absolute top-0 left-0 rounded-full "
            ></div>
            <p className="text-2lx text-white z-10 mr-2">
              <TranslateText translateKey={getGreeting()} element={null} />
              {userName}
            </p>
            <TranslateText
              className="text-white text-xl z-10"
              translateKey={breatheMap[breathe].message}
            />

            <div
              data-testid="pointer-container"
              className="w-[20px] h-[190px] absolute top-[-40px] left-[140px] origin-bottom animate-pointer"
            >
              <div
                data-testid="pointer"
                className="w-[20px] h-[20px] bg-white rounded-full"
              ></div>
            </div>
            <div
              data-testid="outer-circle"
              className="h-[320px] w-[320px] bg-conic-gradient rounded-full absolute z-[-2] top-[-10px] left-[-10px]"
            ></div>
          </div>
        </div>
      </div>
      <Audio ref={audioRef} source="/sounds/meditation-piano1.mp3" />
    </div>
  );
}
