import { useState, useEffect } from 'react';
import { useTTS } from '../hooks/useTTS';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { useVLibras } from '../hooks/useVLibras';

export const useAppController = () => {
    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem('fono-settings');
        // Default to voice only settings, hardcoding kids theme
        return saved ? {
            voiceURI: '',
            rate: 1,
            theme: 'kids',
            settingsBtnPosition: 'header',
            vlibrasEnabled: false,
            ...JSON.parse(saved)
        } : {
            voiceURI: '',
            rate: 1,
            theme: 'kids',
            settingsBtnPosition: 'header',
            vlibrasEnabled: false
        };
    });

    const { speak, voices, cancel } = useTTS();
    const { playAudio } = useAudioPlayer();
    const { translate: vlibrasTranslate } = useVLibras(settings?.vlibrasEnabled);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    // Persistence
    useEffect(() => {
        localStorage.setItem('fono-settings', JSON.stringify(settings));
    }, [settings]);

    // Force kids theme logic
    useEffect(() => {
        document.body.setAttribute('data-theme', 'kids');
    }, []);

    const handleSpeak = async (symbol) => {
        // Trigger VLibras if enabled
        if (settings.vlibrasEnabled) {
            vlibrasTranslate(symbol.text);
        }

        if (symbol.audio) {
            try {
                await playAudio(symbol.audio);
                return;
            } catch (error) {
                console.warn(`Failed to play MP3 for ${symbol.label}, falling back to TTS`, error);
            }
        }
        await speak(symbol.text, settings.voiceURI, settings.rate);
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
