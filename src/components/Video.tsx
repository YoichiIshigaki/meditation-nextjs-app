"use client"
import React, { useEffect, useRef, VideoHTMLAttributes, useMemo } from "react";

import videojs from "video.js";
import Player from "video.js/dist/types/player";
import "video.js/dist/video-js.css";
import { cn } from "@/lib/utils";

type VideoOption = {
  /**
   * 自動再生を有効にするか
   * @default false
   */
  autoplay?: boolean;
  /**
   * 動画の制御を可能にするか
   * @default false
   */
  controls?: boolean;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  controlBar?: any;
};

type VideoProps = {
  source: string;
  option?: VideoOption;
} & VideoHTMLAttributes<HTMLVideoElement>;

const defaultOption: VideoOption = {
  autoplay: false,
  controls: true,
  controlBar: {
    volumePanel: true, // ボリュームのスライダー
    playToggle: true, // 再生・一時停止ボタン
    currentTimeDisplay: true, // 現在の再生時間
    durationDisplay: true, // 音声全体の長さ
    remainingTimeDisplay: false,
    progressControl: true,
    fullscreenToggle: false, // フルスクリーンボタンを無効化
  },
};

export const Video: React.FC<VideoProps> = ({
  source,
  className,
  option = defaultOption,
  ...props
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<Player | null>(null);

  const events = useMemo(
    () => ({
      ready: () => {
        console.log("player ready");
      },
      play: () => {
        console.log("player play");
      },
      stop: () => {
        console.log("player stop");
      },
      pause: () => {
        console.log("player pause");
      },
    }),
    []
  );

  useEffect(() => {
    if (videoRef.current && !playerRef.current) {
      const player = videojs(videoRef.current, option);
      playerRef.current = player;
      // events setting
      // https://gist.github.com/alexrqs/a6db03bade4dc405a61c63294a64f97a#file-videojs-plugin-events-logger-js-L6-L28
      Object.entries(events).forEach(([key, func]) => {
        playerRef.current?.on(key, func);
      });
    }

    // return () => {
    //   if (playerRef.current) playerRef.current.dispose();
    // };
  }, [events, option]);

  return (
    <video
      controls
      ref={videoRef}
      className={cn("video-js", className)}
      {...props}
    >
      <source src={source} />
    </video>
  );
};
