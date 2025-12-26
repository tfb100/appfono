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
            manualFavorites: [],
            usageStats: {},
            showManualFavorites: true,
            showFrequentSymbols: true,
            ...JSON.parse(saved)
        } : {
            voiceURI: '',
            rate: 1,
            theme: 'kids',
            settingsBtnPosition: 'header',
            vlibrasEnabled: false,
            headerPosition: 'top',
            manualFavorites: [],
            usageStats: {},
            showManualFavorites: true,
            showFrequentSymbols: true
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
        // Track usage
        setSettings(prev => ({
            ...prev,
            usageStats: {
                ...prev.usageStats,
                [symbol.id]: (prev.usageStats[symbol.id] || 0) + 1
            }
        }));

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

    const toggleFavorite = (id) => {
        setSettings(prev => {
            const manualFavorites = prev.manualFavorites || [];
            const isFavorite = manualFavorites.includes(id);
            return {
                ...prev,
                manualFavorites: isFavorite
                    ? manualFavorites.filter(fid => fid !== id)
                    : [...manualFavorites, id]
            };
        });
    };

    const toggleSettings = (isOpen) => {
        setIsSettingsOpen(isOpen);
    };

    return {
        handleSpeak,
        toggleFavorite,
        toggleSettings,
        setSettings,
        settings,
        isSettingsOpen,
        voices
    };
};
