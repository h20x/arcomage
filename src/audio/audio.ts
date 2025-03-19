export enum Sound {
  Card,
  Damage,
  ProdDec,
  ProdInc,
  ResDec,
  ResInc,
  TowerInc,
  WallInc,
}

export class AudioPlayer {
  private static _instance?: AudioPlayer;

  private static instance(): AudioPlayer {
    if (!AudioPlayer._instance) {
      AudioPlayer._instance = new AudioPlayer('/assets/sounds.mp3', {
        [Sound.Card]: [0, 0.221],
        [Sound.Damage]: [2, 1.495],
        [Sound.ProdDec]: [5, 1.164],
        [Sound.ProdInc]: [8, 1.508],
        [Sound.ResDec]: [11, 1.152],
        [Sound.ResInc]: [14, 1.368],
        [Sound.TowerInc]: [17, 1.434],
        [Sound.WallInc]: [20, 1.1],
      });
    }

    return AudioPlayer._instance;
  }

  static play(sound: Sound): void {
    AudioPlayer.instance().play(sound);
  }

  private audioCtx?: AudioContext;

  private audioBuffer?: AudioBuffer | null;

  private soundsToPlay: Set<Sound> = new Set();

  private constructor(
    private src: string,
    private sprite: Record<Sound, [number, number]>
  ) {
    if (AudioContext) {
      this.audioCtx = new AudioContext();
    } else if ((window as any).webkitAudioContext) {
      this.audioCtx = new (window as any).webkitAudioContext();
    }
  }

  private play(sound: Sound): void {
    if (!this.audioCtx) {
      return;
    }

    if (this.audioBuffer === undefined) {
      this.audioBuffer = null;

      this.loadAudioFile().then((buffer) => {
        if (buffer) {
          this.audioBuffer = buffer;
        } else {
          this.audioCtx = undefined;
        }
      });
    }

    this.soundsToPlay.add(sound);

    if (this.soundsToPlay.size === 1) {
      queueMicrotask(() => {
        this.soundsToPlay.forEach((sound) => this.playSound(sound));
        this.soundsToPlay.clear();
      });
    }
  }

  private playSound(sound: Sound): void {
    if (!this.audioCtx || !this.audioBuffer) {
      return;
    }

    const source = this.audioCtx.createBufferSource();
    source.buffer = this.audioBuffer;
    source.connect(this.audioCtx.destination);
    source.start(0, this.sprite[sound][0], this.sprite[sound][1]);
  }

  private async loadAudioFile(): Promise<AudioBuffer | null> {
    const response = await fetch(this.src);

    if (response.ok) {
      return await this.audioCtx!.decodeAudioData(await response.arrayBuffer());
    }

    return null;
  }
}
