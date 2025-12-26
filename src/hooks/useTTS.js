import { useState, useEffect, useCallback } from 'react';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { Capacitor } from '@capacitor/core';

export const useTTS = () => {
    const [voices, setVoices] = useState([]);
    const [speaking, setSpeaking] = useState(false);
    const [supported, setSupported] = useState(true);
    const isNative = Capacitor.isNativePlatform();

    useEffect(() => {
        const loadVoices = async () => {
            try {
                if (isNative) {
                    const result = await TextToSpeech.getSupportedVoices();
                    setVoices(result.voices.map(v => ({
                        voiceURI: v.name, // Mapping to a common format
                        name: v.name,
                        lang: v.lang
                    })));
                } else {
                    if (!('speechSynthesis' in window)) {
                        setSupported(false);
                        return;
                    }
                    const available = window.speechSynthesis.getVoices();
                    setVoices(available);

                    window.speechSynthesis.onvoiceschanged = () => {
                        setVoices(window.speechSynthesis.getVoices());
                    };
                }
            } catch (error) {
                console.error('Error loading voices:', error);
            }
        };

        loadVoices();

        return () => {
            if (!isNative && 'speechSynthesis' in window) {
                window.speechSynthesis.onvoiceschanged = null;
            }
        };
    }, [isNative]);

    const speak = useCallback(async (text, voiceURI = null, rate = 1, pitch = 1, lang = null) => {
        if (!supported || !text) return;

        try {
            if (isNative) {
                await TextToSpeech.stop();
                setSpeaking(true);
                const voiceIndex = voices.findIndex(v => v.voiceURI === voiceURI);
                await TextToSpeech.speak({
                    text,
                    rate: rate,
                    pitch: pitch,
                    volume: 1.0,
                    voice: voiceIndex !== -1 ? voiceIndex : undefined,
                    lang: lang || undefined,
                    category: 'playback'
                });
                setSpeaking(false);
            } else {
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(text);
                if (voiceURI) {
                    const selectedVoice = voices.find(v => v.voiceURI === voiceURI);
                    if (selectedVoice) utterance.voice = selectedVoice;
                } else if (lang) {
                    utterance.lang = lang;
                }
                utterance.rate = rate;
                utterance.pitch = pitch;
                utterance.onstart = () => setSpeaking(true);
                utterance.onend = () => setSpeaking(false);
                utterance.onerror = (e) => {
                    console.error('TTS Error:', e);
                    setSpeaking(false);
                };
                window.speechSynthesis.speak(utterance);
            }
        } catch (error) {
            console.error('Speak error:', error);
            setSpeaking(false);
        }
    }, [voices, supported, isNative]);

    const cancel = useCallback(async () => {
        if (!supported) return;

        try {
            if (isNative) {
                await TextToSpeech.stop();
            } else {
                window.speechSynthesis.cancel();
            }
            setSpeaking(false);
        } catch (error) {
            console.error('Cancel error:', error);
        }
    }, [supported, isNative]);

    return { voices, speak, cancel, speaking, supported };
};
