// Audio manager for game sounds and music

export class AudioManager {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;
  private masterVolume: number = 0.5;

  // Track if audio context has been initialized (required by browser autoplay policy)
  private contextInitialized: boolean = false;

  constructor() {
    // Audio context will be initialized on first user interaction
    this.loadSettings();
  }

  // Initialize audio context on first user interaction
  initializeContext() {
    if (this.contextInitialized) return;
    
    try {
      const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioContext = new AudioContextClass();
        this.contextInitialized = true;
      }
    } catch (e) {
      console.log('Audio context not available', e);
    }
  }

  // Play a simple beep sound using Web Audio API
  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.3) {
    if (!this.enabled || !this.audioContext) return;

    try {
      const now = this.audioContext.currentTime;
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;

      gainNode.gain.setValueAtTime(volume * this.masterVolume, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

      oscillator.start(now);
      oscillator.stop(now + duration);
    } catch (e) {
      console.log('Tone playback error:', e);
    }
  }

  // Sound effects
  playSeedEat() {
    if (!this.enabled || !this.audioContext) return;
    // Happy chirp sound
    this.playTone(800, 0.1, 'sine', 0.2);
    this.playTone(1000, 0.1, 'sine', 0.2);
  }

  playBirdCaught() {
    if (!this.enabled || !this.audioContext) return;
    // Sad descending tone
    const now = this.audioContext.currentTime;
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(this.audioContext.destination);
    
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.3);
    gain.gain.setValueAtTime(0.3 * this.masterVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    
    osc.start(now);
    osc.stop(now + 0.3);
  }

  playLevelUp() {
    if (!this.enabled || !this.audioContext) return;
    // Success fanfare - ascending tones
    setTimeout(() => this.playTone(523, 0.1, 'sine', 0.25), 0);     // C5
    setTimeout(() => this.playTone(659, 0.1, 'sine', 0.25), 100);   // E5
    setTimeout(() => this.playTone(784, 0.2, 'sine', 0.25), 200);   // G5
  }

  playUIClick() {
    if (!this.enabled || !this.audioContext) return;
    // Quick click sound
    this.playTone(600, 0.05, 'sine', 0.15);
  }

  playPause() {
    if (!this.enabled || !this.audioContext) return;
    // Double beep for pause
    this.playTone(400, 0.08, 'sine', 0.2);
    setTimeout(() => this.playTone(400, 0.08, 'sine', 0.2), 120);
  }

  playResume() {
    if (!this.enabled || !this.audioContext) return;
    // Single beep for resume
    this.playTone(600, 0.1, 'sine', 0.2);
  }

  // Background ambient sound (optional)
  playAmbient() {
    if (!this.enabled || !this.audioContext) return;
    // Subtle background tone (very quiet)
    try {
      const now = this.audioContext.currentTime;
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      osc.connect(gain);
      gain.connect(this.audioContext.destination);
      
      osc.frequency.value = 264; // C4
      gain.gain.setValueAtTime(0.05 * this.masterVolume, now);
      
      osc.start(now);
      // Let it play indefinitely (very quiet)
      return osc;
    } catch (e) {
      console.log('Ambient sound error:', e);
      return null;
    }
  }

  // Settings
  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    this.saveSettings();
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  setMasterVolume(volume: number) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    this.saveSettings();
  }

  getMasterVolume(): number {
    return this.masterVolume;
  }

  private saveSettings() {
    localStorage.setItem('audioEnabled', String(this.enabled));
    localStorage.setItem('audioVolume', String(this.masterVolume));
  }

  private loadSettings() {
    const enabled = localStorage.getItem('audioEnabled');
    const volume = localStorage.getItem('audioVolume');
    
    if (enabled !== null) {
      this.enabled = enabled === 'true';
    }
    
    if (volume !== null) {
      this.masterVolume = parseFloat(volume);
    }
  }
}

// Global audio manager instance
export const audioManager = new AudioManager();
