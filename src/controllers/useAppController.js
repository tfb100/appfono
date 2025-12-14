import { useState, useEffect } from 'react';
import { useTTS } from '../hooks/useTTS';

export const useAppController = () => {
    const { speak, voices, cancel } = useTTS();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem('fono-settings');
        // Default to voice only settings, hardcoding kids theme
        return saved ? { ...JSON.parse(saved), theme: 'kids' } : {
            voiceURI: '',
            rate: 1,
            theme: 'kids'
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

    const handleSpeak = (text) => {
        speak(text, settings.voiceURI, settings.rate);
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
