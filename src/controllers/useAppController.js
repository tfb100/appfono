import { useState, useEffect } from 'react';
import { useTTS } from '../hooks/useTTS';
import { useAudioPlayer } from '../hooks/useAudioPlayer';

export const useAppController = () => {
    const { speak, voices, cancel } = useTTS();
    const { playAudio } = useAudioPlayer();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem('fono-settings');
        // Default to voice only settings, hardcoding kids theme
        return saved ? {
            voiceURI: '',
            rate: 1,
            theme: 'kids',
            settingsBtnPosition: 'header',
            ...JSON.parse(saved)
        } : {
            voiceURI: '',
            rate: 1,
            theme: 'kids',
            settingsBtnPosition: 'header'
        };
    });

    // Persistence
    useEffect(() => {
        localStorage.setItem('fono-settings', JSON.stringify(settings));
    }, [settings]);

    // Force kids theme logic
    useEffect(() => {
        document.body.setAttribute('data-theme', 'kids');
    }, []);

    const handleSpeak = async (symbol) => {
        if (symbol.audio) {
            try {
                await playAudio(symbol.audio);
                return;
            } catch (error) {
                console.warn(`Failed to play MP3 for ${symbol.label}, falling back to TTS`, error);
            }
        }
        speak(symbol.text, settings.voiceURI, settings.rate);
    };

    const toggleSettings = (isOpen) => {
        setIsSettingsOpen(isOpen);
    };

    return {
        handleSpeak,
        toggleSettings,
        setSettings,
        settings,
        isSettingsOpen,
        voices
    };
};
