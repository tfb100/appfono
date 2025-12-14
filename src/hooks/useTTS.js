import { useState, useEffect, useCallback } from 'react';

export const useTTS = () => {
    const [voices, setVoices] = useState([]);
    const [speaking, setSpeaking] = useState(false);
    const [supported, setSupported] = useState(true);

    useEffect(() => {
        if (!('speechSynthesis' in window)) {
            setSupported(false);
            return;
        }

        const loadVoices = () => {
            const available = window.speechSynthesis.getVoices();
            setVoices(available);
        };

        loadVoices();

        // Chrome requires this event to load voices
        window.speechSynthesis.onvoiceschanged = loadVoices;

        return () => {
            window.speechSynthesis.onvoiceschanged = null;
        };
    }, []);

    const speak = useCallback((text, voiceURI = null, rate = 1, pitch = 1) => {
        if (!supported || !text) return;

        window.speechSynthesis.cancel(); // Cancel currently playing audio

        const utterance = new SpeechSynthesisUtterance(text);

        if (voiceURI) {
            const selectedVoice = voices.find(v => v.voiceURI === voiceURI);
            if (selectedVoice) utterance.voice = selectedVoice;
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
    }, [voices, supported]);

    const cancel = useCallback(() => {
        if (supported) {
            window.speechSynthesis.cancel();
            setSpeaking(false);
        }
    }, [supported]);

    return { voices, speak, cancel, speaking, supported };
};
