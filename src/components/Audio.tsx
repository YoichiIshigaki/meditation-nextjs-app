"use client";
import React, {
  forwardRef,
  useImperativeHandle,
  HTMLAttributes,
  useEffect,
  useState,
} from "react";
import { Play, Pause, VolumeOff, Volume2, Volume1 } from "lucide-react";

import { Slider } from "./ui/slider";
import { CustomText } from "./CustomText";
import { Button } from "./Button";
import { Howl, HowlOptions } from "howler";
import { cn } from "@/styles/classMerge";

const defaultSource = "/sounds/meditation-piano1.mp3";

type AudioProps = {
  source: string;
} & HTMLAttributes<HTMLDivElement>;

type AudioParam<K extends keyof Howl> = Parameters<Howl[K]>[0];
// 公開したいメソッドの定義
export type AudioHandlers = Partial<{
  play: (param?: AudioParam<"play">) => void;
  stop: (param?: AudioParam<"stop">) => void;
  pause: (param?: AudioParam<"pause">) => void;
  setVolume: (param: AudioParam<"volume">) => void;
  isPlaying: (param?: AudioParam<"playing">) => boolean;
  duration: (param?: AudioParam<"duration">) => number;
  seek: (param?: AudioParam<"duration">) => number;
}>;

class AudioManager {
  private static instance: AudioManager | null;
  private howl: Howl;

  // コンストラクタをプライベートにして、外部からインスタンス化できないようにする
  private constructor(source: string, option?: HowlOptions) {
    this.howl = new Howl({
      ...option,
      src: [source],
    });
  }

  // インスタンスを一度だけ作成し、それを返す
  public static getInstance(
    source: string,
    option?: HowlOptions,
  ): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager(source, option);
    }
    return AudioManager.instance;
  }
  public static clearInstance(): void {
    AudioManager.instance = null;
  }
  // 音楽を再生
  public play(param?: AudioParam<"play">) {
    if (this.isPlaying()) return;
    this.howl.play(param);
  }

  // 音楽を一時停止
  public pause(param?: AudioParam<"pause">) {
    this.howl.pause(param);
  }
  // 音楽を中止
  public stop(param?: AudioParam<"stop">) {
    this.howl.pause(param);
    this.seek(0);
  }
  // 音量を設定
  public setVolume(volume: AudioParam<"volume">) {
    this.howl.volume(volume);
  }
  // 生成中か判定
  public isPlaying(param?: AudioParam<"playing">) {
    return this.howl.playing(param);
  }
  // 全体の音声の時間を取得
  public duration(param?: AudioParam<"duration">) {
    return this.howl.duration(param);
  }
  // 現在の音声の時間を取得
  public seek(param?: AudioParam<"seek">) {
    return this.howl.seek(param);
  }
}

const soundIcon = (volume: number, className?: string) => {
  if (volume === 0) return <VolumeOff className={className} />;
  else if (volume > 0 && volume < 50) return <Volume1 className={className} />;
  return <Volume2 className={className} />;
};

// TODO: svgアイコンを上下左右、中央揃えにする。
export const Audio = forwardRef<AudioHandlers, AudioProps>(
  function Audio(props, ref) {
    const { source = defaultSource, className, ...rest } = props;

    const audioManager = AudioManager.getInstance(source);
    const wholeTimeSec = Math.round(audioManager.duration());

    const [currentTime, setCurrentTime] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [soundVolume, setSoundVolume] = useState(100);

    console.log({ soundVolume });

    useEffect(() => {
      let interval: NodeJS.Timeout | null = null;

      if (isActive && !isPaused) {
        interval = setInterval(() => {
          setCurrentTime((second) => {
            if (second >= wholeTimeSec) {
              clearInterval(interval!);
              setIsActive(false);
              return 0;
            }
            return second + 1;
          });
        }, 1000);
      } else {
        clearInterval(interval!);
      }

      return () => clearInterval(interval!);
    }, [isActive, isPaused, wholeTimeSec]);

    useImperativeHandle(ref, () => ({
      play(param) {
        console.log("sound play");
        audioManager.play(param);
      },
      stop(param) {
        console.log("sound stop");
        audioManager.stop(param);
      },
      pause(param) {
        console.log("sound pause");
        audioManager.pause(param);
      },
      setVolume(param) {
        console.log("sound set volume");
        audioManager.setVolume(param);
      },
      isPlaying(param) {
        console.log("sound confirm playing");
        return audioManager.isPlaying(param);
      },
      duration(param) {
        console.log("sound confirm duration");
        return audioManager.duration(param);
      },
      /**
       * @deprecate
       * 一秒ごとに時間を取得できないため、getterとして使うのは不適
       */
      seek(param) {
        console.log("sound confirm current time or set current time");
        return audioManager.seek(param);
      },
    }));

    const formatTimeString = (second: number): string => {
      const min = Math.floor(second / 60);
      const sec = second % 60;
      return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
    };

    if (wholeTimeSec === null) {
      return <div>loading</div>;
    }

    return (
      <div className={cn("w-full p-4", className)} {...rest}>
        {/* 再生時間のシークバー */}
        <div className="flex gap-3 [&>p]:m-auto">
          <Button
            onClick={() => {
              setIsActive(true);
              setIsPaused(false);
              audioManager.play();
            }}
            className="text-center"
          >
            <Play />
            <p>play</p>
          </Button>
          <Button
            onClick={() => {
              setIsActive(false);
              setIsPaused(true);
              audioManager.pause();
            }}
            className="text-center"
          >
            <Pause />
            <p>pause</p>
          </Button>
          <CustomText text={formatTimeString(currentTime)} />
          <Slider
            className="w-[60%]"
            max={wholeTimeSec}
            step={1}
            value={[currentTime]}
            onValueChange={([value]) => {
              setCurrentTime(value);
              audioManager.pause();
              setIsActive(false);
              setIsPaused(true);
            }}
            onValueCommit={([value]) => {
              audioManager.seek(value);
              audioManager.play();
              setIsActive(true);
              setIsPaused(false);
            }}
          />

          <CustomText text={formatTimeString(wholeTimeSec)} />
          {/* 音声バー */}
          {soundIcon(soundVolume)}
          <Slider
            className="w-20"
            max={100}
            step={5}
            value={[soundVolume]}
            onValueChange={([value]) => {
              setSoundVolume(value);
              audioManager.setVolume(value / 100);
            }}
          />

          <CustomText text={`${soundVolume}%`} />
        </div>
      </div>
    );
  },
);
