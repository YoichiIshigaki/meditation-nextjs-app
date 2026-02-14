import { Howl, HowlOptions } from "howler";

type AudioParam<K extends keyof Howl> = Parameters<Howl[K]>[0];
// 公開したいメソッドの定義

export class AudioManager {
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
