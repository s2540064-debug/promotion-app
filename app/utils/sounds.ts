// サウンド管理ユーティリティ

// Web Audio APIを使用してサウンドを生成
class SoundManager {
  private audioContext: AudioContext | null = null;
  private isEnabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      // ユーザー操作後にAudioContextを初期化（ブラウザの自動再生ポリシー対応）
      this.initAudioContext();
    }
  }

  private initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.warn('AudioContext not supported');
    }
  }

  // レジの「チャリン！」音を生成
  playCashRegisterSound() {
    if (!this.isEnabled) return;

    // まず、音源ファイルを試す
    if (typeof window !== 'undefined') {
      try {
        const audio = new Audio('/sounds/cash-register.mp3');
        audio.volume = 0.7;
        audio.play().catch((e) => {
          // 音源ファイルがない場合、Web Audio APIで生成
          this.playCashRegisterSoundFallback();
        });
        return;
      } catch (e) {
        // フォールバック
      }
    }

    // フォールバック：Web Audio APIで生成
    this.playCashRegisterSoundFallback();
  }

  private playCashRegisterSoundFallback() {
    if (!this.audioContext) {
      this.initAudioContext();
      if (!this.audioContext) return;
    }

    try {
      const ctx = this.audioContext;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      // チャリンの音色（高音の短い音）
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);

      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.15);
    } catch (e) {
      console.warn('Failed to play cash register sound:', e);
    }
  }

  // ファンファーレ音を生成
  playFanfareSound() {
    if (!this.isEnabled || !this.audioContext) return;

    try {
      const ctx = this.audioContext;
      const notes = [
        { freq: 523.25, time: 0 }, // C5
        { freq: 659.25, time: 0.1 }, // E5
        { freq: 783.99, time: 0.2 }, // G5
        { freq: 1046.50, time: 0.3 }, // C6
      ];

      notes.forEach((note) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(note.freq, ctx.currentTime + note.time);

        gainNode.gain.setValueAtTime(0.4, ctx.currentTime + note.time);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + note.time + 0.3);

        oscillator.start(ctx.currentTime + note.time);
        oscillator.stop(ctx.currentTime + note.time + 0.3);
      });
    } catch (e) {
      console.warn('Failed to play fanfare sound:', e);
    }
  }

  // ユーザー操作後にAudioContextを再開（自動再生ポリシー対応）
  resumeAudioContext() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }
}

// シングルトンインスタンス
let soundManagerInstance: SoundManager | null = null;

export function getSoundManager(): SoundManager {
  if (!soundManagerInstance) {
    soundManagerInstance = new SoundManager();
  }
  return soundManagerInstance;
}

// 触覚フィードバック（Vibration API）
export function playHapticFeedback(pattern: number | number[] = 10) {
  if (typeof window === 'undefined' || !('vibrate' in navigator)) {
    return;
  }

  try {
    navigator.vibrate(pattern);
  } catch (e) {
    console.warn('Vibration not supported:', e);
  }
}

// 投資通知用の振動パターン（100ms）
export function playInvestmentHaptic() {
  playHapticFeedback(100);
}

