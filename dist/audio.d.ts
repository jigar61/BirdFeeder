export declare class AudioManager {
    private audioContext;
    private enabled;
    private masterVolume;
    private contextInitialized;
    constructor();
    initializeContext(): void;
    private playTone;
    playSeedEat(): void;
    playBirdCaught(): void;
    playLevelUp(): void;
    playUIClick(): void;
    playPause(): void;
    playResume(): void;
    playAmbient(): OscillatorNode | null | undefined;
    setEnabled(enabled: boolean): void;
    isEnabled(): boolean;
    setMasterVolume(volume: number): void;
    getMasterVolume(): number;
    private saveSettings;
    private loadSettings;
}
export declare const audioManager: AudioManager;
