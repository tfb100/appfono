import { useState, useEffect, useRef } from 'react';
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
            showAllSymbols: true,
            buttonPalette: 'classic',
            fontColor: 'white',
            language: 'pt',
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
            showFrequentSymbols: true,
            showAllSymbols: true,
            buttonPalette: 'classic',
            fontColor: 'white',
            language: 'pt'
        };
    });

    const { speak, voices, cancel } = useTTS();
    const { playAudio } = useAudioPlayer();
    const { translate: vlibrasTranslate } = useVLibras(settings?.vlibrasEnabled);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const prevLangRef = useRef(settings.language);

    // Auto-select voice based on language
    useEffect(() => {
        if (voices.length > 0 && settings.language !== prevLangRef.current) {
            const langCode = settings.language === 'pt' ? 'pt' : settings.language === 'en' ? 'en' : 'es';
            const matchingVoice = voices.find(v => v.lang.toLowerCase().startsWith(langCode));

            if (matchingVoice) {
                setSettings(prev => ({ ...prev, voiceURI: matchingVoice.voiceURI }));
            }
            prevLangRef.current = settings.language;
        }
    }, [settings.language, voices]);

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

        const currentLang = settings.language || 'pt';
        const label = typeof symbol.label === 'object' ? symbol.label[currentLang] : symbol.label;
        const textToSpeak = typeof symbol.text === 'object' ? symbol.text[currentLang] : symbol.text;

        // Trigger VLibras if enabled (mostly for PT)
        if (settings.vlibrasEnabled && currentLang === 'pt') {
            vlibrasTranslate(textToSpeak);
        }

        // Only play audio if language is PT and audio exists
        if (currentLang === 'pt' && symbol.audio) {
            try {
                await playAudio(symbol.audio);
                return;
            } catch (error) {
                console.warn(`Failed to play MP3 for ${label}, falling back to TTS`, error);
            }
        }
        await speak(textToSpeak, settings.voiceURI, settings.rate);
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
