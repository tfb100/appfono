import { useState, useEffect, useRef } from 'react';
import { useTTS } from '../hooks/useTTS';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { useVLibras } from '../hooks/useVLibras';

export const useAppController = () => {
    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem('fono-settings');
        const defaultSettings = {
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
            customCards: [],
            customCards: [],
            iconStyle: 'minimalist',
            voiceGender: 'any'
        };

        if (!saved) return defaultSettings;

        try {
            const parsed = JSON.parse(saved);
            // Sanitize custom cards icons (must be strings)
            if (parsed.customCards && Array.isArray(parsed.customCards)) {
                parsed.customCards = parsed.customCards.map(card => ({
                    ...card,
                    icon: typeof card.icon === 'string' ? card.icon : 'Plus'
                }));
            }
            return { ...defaultSettings, ...parsed };
        } catch (e) {
            console.error('Failed to parse settings', e);
            return defaultSettings;
        }
    });

    const { speak, voices, cancel } = useTTS();
    const { playAudio } = useAudioPlayer();
    const { translate: vlibrasTranslate } = useVLibras(settings?.vlibrasEnabled);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const prevLangRef = useRef(settings.language);

    // Auto-select voice based on language
    // Auto-select voice based on language and gender
    useEffect(() => {
        if (voices.length === 0) return;

        // Helper to guess gender
        const getGender = (name) => {
            const n = name.toLowerCase();
            if (/female|woman|girl|feminino|maria|luciana|joana|vitoria|zira|samantha/i.test(n)) return 'female';
            if (/male|man|boy|masculino|daniel|ricardo|david|felipe/i.test(n)) return 'male';
            return 'unknown';
        };

        const currentLang = settings.language;
        const currentGender = settings.voiceGender || 'any';
        // Filter by language first
        const searchCodes = currentLang === 'pt' ? ['pt']
            : currentLang === 'en' ? ['en']
                : currentLang === 'es' ? ['es', 'spa']
                    : currentLang === 'de' ? ['de', 'ger']
                        : currentLang === 'fr' ? ['fr']
                            : currentLang === 'zh' ? ['zh', 'chi']
                                : currentLang === 'ja' ? ['ja', 'jpn']
                                    : [currentLang];

        // Filter by language first
        const langVoices = voices.filter(v => {
            const voiceLang = v.lang.toLowerCase();
            return searchCodes.some(code => voiceLang.startsWith(code) || voiceLang.includes(code));
        });

        // Try to find a match for gender
        let bestMatch = null;

        if (currentGender === 'any') {
            bestMatch = langVoices[0];
        } else {
            bestMatch = langVoices.find(v => getGender(v.name) === currentGender);
            // Fallback if no specific gender match found
            if (!bestMatch) bestMatch = langVoices[0];
        }

        if (bestMatch && bestMatch.voiceURI !== settings.voiceURI) {
            setSettings(prev => ({
                ...prev,
                voiceURI: bestMatch.voiceURI
            }));
        }

    }, [settings.language, settings.voiceGender, voices]);

    // Persistence
    useEffect(() => {
        localStorage.setItem('fono-settings', JSON.stringify(settings));
    }, [settings]);

    // Theme Persistence
    useEffect(() => {
        document.body.setAttribute('data-theme', settings.theme || 'neutral');
    }, [settings.theme]);

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
        /* 
        if (currentLang === 'pt' && symbol.audio) {
            try {
                await playAudio(symbol.audio);
                return;
            } catch (error) {
                console.warn(`Failed to play MP3 for ${label}, falling back to TTS`, error);
            }
        }
        */

        const langCodes = {
            pt: 'pt-BR',
            en: 'en-US',
            es: 'es-ES',
            de: 'de-DE',
            fr: 'fr-FR',
            zh: 'zh-CN',
            ja: 'ja-JP'
        };
        await speak(textToSpeak, settings.voiceURI, settings.rate, 1, langCodes[currentLang]);
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
