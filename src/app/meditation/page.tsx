"use client";
import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/styles/utils";

type PageProps = { data: any };
export default function Page(props: PageProps) {
  console.log("data = ", JSON.stringify(props, null, 2));
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [userName, _setUserName] = useState("john");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [breatheCycleTime, _setBreatheCycleTime] = useState(7500);
  const [breathe, setBreathe] = useState<"breathe" | "stop" | "exhale">(
    "breathe"
  );
  // if(!data){
  //   return <div className="animate-spin w-6 h-6 text-purple-400"></div>
  // }

  const breatheMap = {
    breathe: { message: "吸って!", className: "animate-grow" },
    stop: { message: "止めて!", className: "scale-[1.2]" },
    exhale: { message: "吐いて!", className: "animate-shrink" },
  };

  const getGreeting = () => {
    const nowHour = new Date().getHours();
    if (nowHour > 4 && nowHour < 11) {
      return "おはよう";
    } else if (nowHour > 11 && nowHour < 18) {
      return "こんにちは";
    }
    return "こんばんわ";
  };

  const breatheTime = (breatheCycleTime / 5) * 2; // 3s
  const holdTime = breatheCycleTime / 5; // 1.5s

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const breatheAnimation = useCallback(async () => {
    console.log("breathe");

    setBreathe("breathe");
    await sleep(breatheTime);
    console.log("stop");
    setBreathe("stop");
    await sleep(holdTime);
    console.log("exhale");
    setBreathe("exhale");
  }, [setBreathe, breatheTime, holdTime]);

  const breathAnimationInterval = useCallback(
    () => setInterval(breatheAnimation, breatheCycleTime),
    [breatheCycleTime, breatheAnimation]
  );

  useEffect(() => {
    const execBreathAnimationInterval = breathAnimationInterval();
    return () => {
      clearInterval(execBreathAnimationInterval);
    };
  }, [breathAnimationInterval]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center text-center p-0 h-screen w-screen font-meditation bg-sea bg-cover bg-no-repeat bg-center">
      <div className="h-screen w-screen container flex items-center justify-center m-auto relative scale-100 bg-opacity-80">
        <div
          data-testid="container"
          className={cn(
            "h-[300px] w-[300px] m-auto flex relative scale-100 items-center justify-center",
            breatheMap[breathe].className
          )}
        >
          <div
            data-testid="circle"
            className="h-full w-full bg-[#010f1c] absolute top-0 left-0 rounded-full"
          ></div>
          <p className="text-2lx text-white z-10">
            {getGreeting()} {userName}
          </p>
          <p className="text-white text-xl z-10">
            {breatheMap[breathe].message}
          </p>

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
  );
}
