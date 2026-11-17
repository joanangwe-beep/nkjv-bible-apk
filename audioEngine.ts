// Web Audio Ambient Synthesizer for Christian Reels and Contemplation
class AmbientSoundGenerator {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private intervalId: any = null;
  private masterGain: GainNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Chords in F major / D minor (Peaceful, Reverent)
  private chords = [
    [174.61, 220.00, 261.63, 349.23], // Fmaj7
    [146.83, 220.00, 261.63, 329.63], // Dm9
    [130.81, 196.00, 261.63, 329.63], // Cmaj
    [164.81, 220.00, 246.94, 329.63], // Em7
  ];

  public startAmbient(type: 'sanctuary' | 'still_waters' | 'dawn' | 'acoustic' = 'sanctuary') {
    this.initContext();
    if (this.isPlaying) return;
    this.isPlaying = true;

    let chordIdx = 0;
    const playChord = () => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;
      const chord = this.chords[chordIdx % this.chords.length];
      chordIdx++;

      chord.forEach((freq, i) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();

        // Warm sine + triangle wave for devotional string/choral warmth
        osc.type = i % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        // Soft attack and slow release
        noteGain.gain.setValueAtTime(0, now);
        noteGain.gain.linearRampToValueAtTime(0.08 / (i + 1), now + 1.2);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 4.8);

        osc.connect(noteGain);
        noteGain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 5.0);
      });
    };

    playChord();
    this.intervalId = setInterval(playChord, 4500);
  }

  public stopAmbient() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const ambientAudio = new AmbientSoundGenerator();

// Text to Speech Reader for Audio Bible
export class BibleSpeechReader {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private onVerseChangeCallback: ((verseNum: number) => void) | null = null;
  private onEndCallback: (() => void) | null = null;
  private timerId: any = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public speakVerses(
    verses: { verse: number; text: string }[],
    options: {
      lang: 'en' | 'sw';
      rate?: number;
      pitch?: number;
      onVerseChange?: (verseNum: number) => void;
      onComplete?: () => void;
    }
  ) {
    if (!this.synth) {
      console.warn('Speech synthesis not supported in this browser.');
      return;
    }

    this.stop();
    this.onVerseChangeCallback = options.onVerseChange || null;
    this.onEndCallback = options.onComplete || null;

    let currentIndex = 0;

    const playNext = () => {
      if (!this.synth || currentIndex >= verses.length) {
        if (this.onEndCallback) this.onEndCallback();
        return;
      }

      const item = verses[currentIndex];
      if (this.onVerseChangeCallback) {
        this.onVerseChangeCallback(item.verse);
      }

      const utterance = new SpeechSynthesisUtterance(item.text);
      utterance.rate = options.rate || 0.95;
      utterance.pitch = options.pitch || 1.0;
      utterance.lang = options.lang === 'sw' ? 'sw-KE' : 'en-US';

      // Pick best matching voice
      const voices = this.synth.getVoices();
      if (options.lang === 'sw') {
        const swVoice = voices.find(v => v.lang.startsWith('sw'));
        if (swVoice) utterance.voice = swVoice;
      } else {
        const enVoice = voices.find(v => v.lang.includes('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Daniel') || v.name.includes('Samantha')));
        if (enVoice) utterance.voice = enVoice;
      }

      utterance.onend = () => {
        currentIndex++;
        playNext();
      };

      utterance.onerror = (e) => {
        console.warn('Speech error:', e);
        currentIndex++;
        playNext();
      };

      this.currentUtterance = utterance;
      this.synth.speak(utterance);
    };

    playNext();
  }

  public pause() {
    if (this.synth && this.synth.speaking) {
      this.synth.pause();
    }
  }

  public resume() {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
    }
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
    }
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  public setSleepTimer(minutes: number, onTimerExpired: () => void) {
    if (this.timerId) clearTimeout(this.timerId);
    if (minutes <= 0) return;

    this.timerId = setTimeout(() => {
      this.stop();
      onTimerExpired();
    }, minutes * 60 * 1000);
  }
}

export const bibleSpeech = new BibleSpeechReader();
