import React, { useState, useEffect } from 'react';
import { QuoteSymbols } from '../../models/QuoteSymbols';
import { Star, X, Mic, Loader } from 'lucide-react';
import { useFeatureStore } from '../../stores/useFeatureStore';

const SmartSuggestions = ({ onSpeak, settings }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [isWaiting, setIsWaiting] = useState(false);
    const isPredictEnabled = useFeatureStore(state => state.isPredictEnabled);
    const isWhisperEnabled = useFeatureStore(state => state.isWhisperEnabled);

    // Só funciona se ambas as flags estiverem ativas
    const isActive = isPredictEnabled && isWhisperEnabled;

    const [isMicActive, setIsMicActive] = useState(false);

    useEffect(() => {
        if (!isActive) {
            setSuggestions([]);
            setIsWaiting(false);
            return;
        }

        // Push-to-Talk: inicia em idle (não aguardando)
        setIsWaiting(false);

        const triggerCache = () => {
            if (QuoteSymbols && QuoteSymbols.length > 0) {
                // Remove campos não serializáveis (React elements como icon, colorfulIcon)
                // — postMessage só aceita dados JSON-clonáveis
                const serializable = QuoteSymbols.map(({ id, label, category, text }) => ({
                    id, label, category, text
                }));
                console.log(`[SmartSuggestions] Sinalizando cache para ${serializable.length} símbolos...`);
                window.dispatchEvent(new CustomEvent('comunica:request_symbols_cache', {
                    detail: { symbols: serializable }
                }));
            }
        };

        // Dispara cache com delay e ouve re-trigger do Worker
        const timer = setTimeout(triggerCache, 1500);
        
        const handleTranscript = () => setIsWaiting(true);
        const handleContextIntent = (e) => {
            const { intent, score, rankedSymbols } = e.detail;
            console.log(`[SmartSuggestions] IA: Intent=${intent} (${score?.toFixed(2)}), Rankeados=${rankedSymbols?.length || 0}`);
            setIsWaiting(false);
            if (rankedSymbols && rankedSymbols.length > 0) {
                const curated = rankedSymbols
                    .map(rs => QuoteSymbols.find(s => s.id === rs.id))
                    .filter(Boolean);

                setSuggestions(curated.slice(0, 6));
            }
        };

        const handleMicListening = (e) => setIsMicActive(e.detail);
        const handleMicProcessing = (e) => {
            setIsMicActive(e.detail);
            if (e.detail) setIsWaiting(true);
        };

        window.addEventListener('comunica:request_symbols_retrigger', triggerCache);
        window.addEventListener('comunica:whisper_transcript', handleTranscript);
        window.addEventListener('comunica:context_intent', handleContextIntent);
        window.addEventListener('comunica:mic_listening', handleMicListening);
        window.addEventListener('comunica:mic_processing', handleMicProcessing);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('comunica:request_symbols_retrigger', triggerCache);
            window.removeEventListener('comunica:whisper_transcript', handleTranscript);
            window.removeEventListener('comunica:context_intent', handleContextIntent);
            window.removeEventListener('comunica:mic_listening', handleMicListening);
            window.removeEventListener('comunica:mic_processing', handleMicProcessing);
        };
    }, [isActive, settings?.language]);

    // Não renderiza se IA desativada
    if (!isActive) return null;

    // Se não está gravando/processando E não tem sugestões, fica invisível
    if (!isMicActive && !isWaiting && suggestions.length === 0) return null;

    // Estado: sem sugestões ainda — mostra indicador sutil
    if (suggestions.length === 0) {
        return (
            <div className="smart-suggestions-bar smart-suggestions-idle">
                <div className="suggestions-label">
                    <Mic size={14} />
                    <span>{isWaiting ? 'Processando sugestões...' : 'IA de Sugestões Pronta — use o mic para perguntar'}</span>
                </div>
                {isWaiting && <Loader size={14} className="spin-icon" />}
            </div>
        );
    }

    return (
        <div className="smart-suggestions-bar">
            <div className="suggestions-header">
                <div className="suggestions-label">
                    <Star size={14} fill="currentColor" />
                    <span>IA Sugere</span>
                </div>
                <button
                    className="close-suggestions"
                    onClick={() => setSuggestions([])}
                    aria-label="Fechar sugestões"
                >
                    <X size={16} />
                </button>
            </div>
            <div className="suggestions-list">
                {suggestions.map(s => {
                    const label = typeof s.label === 'object' ? s.label[settings?.language || 'pt'] : s.label;
                    return (
                        <button
                            key={`suggest-${s.id}`}
                            className={`suggestion-chip category-${s.category}`}
                            onClick={() => onSpeak(s)}
                        >
                            <span className="chip-icon">
                                {settings?.iconStyle === 'colorful' && s.colorfulIcon ? (
                                    <img
                                        src={`${import.meta.env.BASE_URL}icons/colorful/${s.colorfulIcon}`}
                                        alt=""
                                        style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                                    />
                                ) : (
                                    <div className="chip-icon-scale" style={{ fontSize: 32, display: 'flex' }}>
                                        {s.icon}
                                    </div>
                                )}
                            </span>
                            <span className="chip-text">{label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default SmartSuggestions;
