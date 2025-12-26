import { useState, useCallback } from 'react';

/**
 * useAudioPlayer hook
 * Handles playing MP3 files from the public/audio folder.
 * Returns a play function that returns a promise, allowing for fallback logic.
 */
export const useAudioPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);

    const playAudio = useCallback((fileName) => {
        return new Promise((resolve, reject) => {
            if (!fileName) {
                reject(new Error('No audio file specified'));
                return;
            }

            const audioPath = `/audio/${fileName}`;
            const audio = new Audio(audioPath);

            audio.onplay = () => setIsPlaying(true);
            audio.onended = () => {
                setIsPlaying(false);
                resolve();
            };
            audio.onerror = (e) => {
                setIsPlaying(false);
                reject(e);
            };

            audio.play().catch(reject);
        });
    }, []);

    return { playAudio, isPlaying };
};
