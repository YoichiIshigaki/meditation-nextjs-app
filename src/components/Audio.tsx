"use client";
import React, {
  forwardRef,
  useImperativeHandle,
  AudioHTMLAttributes,
  // useEffect,
  // useState,
} from "react";

import { Howl,HowlOptions } from "howler";
import { cn } from "@/lib/utils";

const defaultSource = "/sounds/meditation-piano1.mp3";

type AudioProps = {
  source: string;
} & AudioHTMLAttributes<HTMLAudioElement>;


 type AudioParam<K extends keyof Howl> = Parameters<Howl[K]>[0]
// 公開したいメソッドの定義
export type AudioHandlers = Partial<{
  play: (param?: AudioParam<"play">) => void;
  stop: (param?: AudioParam<"stop">) => void;
  pause: (param?: AudioParam<"pause">) => void;
  volume: (param?: AudioParam<"volume">) => void;
}>;

class AudioManager {
  private static instance: AudioManager | null;
  private howl: Howl;

  // コンストラクタをプライベートにして、外部からインスタンス化できないようにする
  private constructor(source: string,option?:HowlOptions) {
    this.howl = new Howl({
      ...option,
      src: [source],
    });
  }

  // インスタンスを一度だけ作成し、それを返す
  public static getInstance(source: string,option?:HowlOptions): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager(source,option);
    }
    return AudioManager.instance;
  }
  public static clearInstance(): void {
    AudioManager.instance = null;
  }
  // 音楽を再生
  public play(param: Parameters<Howl["play"]>[0]) {
    this.howl.play(param);
  }

  // 音楽を一時停止
  public pause(param: Parameters<Howl["pause"]>[0]) {
    this.howl.pause(param);
  }
  // 音楽を中止
  public stop(param: Parameters<Howl["stop"]>[0]) {
    this.howl.pause(param);
  }
  // 音量を設定
  public setVolume(volume: Parameters<Howl["volume"]>[0]) {
    this.howl.volume(volume);
  }
}

export const Audio = forwardRef<AudioHandlers, AudioProps>((props, ref) => {
  const { source = defaultSource, className, ...rest } = props;
  
  const audioManager = AudioManager.getInstance(source);
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
    volume(param) {
      console.log("sound set volume");
      audioManager.setVolume(param);
    },
  }));
  return (
    <audio
      controls
      // ref={audioRef}
      className={cn("w-full", className)}
      {...rest}
    >
      <source src={source} type="audio/mp3" />
    </audio>
  );
});
