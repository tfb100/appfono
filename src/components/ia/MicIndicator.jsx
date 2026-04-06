import React from 'react';
import { Mic, MicOff, Loader2, AlertCircle } from 'lucide-react';
import { useWhisperController } from '../../controllers/useWhisperController';

/**
 * MicIndicator — Botão Push-to-Talk
 * 
 * Estados visuais:
 * - CARREGANDO: Spinner + "Baixando Modelos..."
 * - PRONTO (idle): Microfone cinza + "Toque para Escutar"
 * - ESCUTANDO: Microfone vermelho pulsando + "Escutando... toque para parar"
 * - PROCESSANDO: Spinner + "Analisando fala..."
 * - ERRO: Ícone de alerta + "Erro IA"
 */
const MicIndicator = () => {
    const { whisperStatus, toggleListening } = useWhisperController();
    const { isReady, isLoading, isListening, isProcessing, lastTranscript, error } = whisperStatus;

    // Estado de ERRO
    if (error) {
        return (
            <div className="mic-hud-container">
                <div className="mic-pulse-circle" style={{ background: '#ef4444' }}>
                    <AlertCircle size={24} />
                </div>
                <small style={{ color: '#ef4444', fontWeight: 'bold' }}>Erro IA</small>
            </div>
        );
    }

    // Determina estado visual
    const getState = () => {
        if (isLoading) return 'loading';
        if (isProcessing) return 'processing';
        if (isListening) return 'listening';
        if (isReady) return 'idle';
        return 'standby';
    };

    const state = getState();

    const stateConfig = {
        standby: {
            icon: <MicOff size={24} />,
            label: 'IA em Standby',
            sublabel: '',
            circleClass: 'mic-pulse-circle standby',
            circleStyle: { background: '#94a3b8', cursor: 'default' },
            labelColor: '#64748b',
        },
        loading: {
            icon: <Loader2 size={24} className="animate-spin" />,
            label: 'Baixando Modelos...',
            sublabel: '',
            circleClass: 'mic-pulse-circle loading',
            circleStyle: { cursor: 'default' },
            labelColor: '#64748b',
        },
        idle: {
            icon: <Mic size={24} />,
            label: 'Toque para Escutar',
            sublabel: 'Push-to-Talk',
            circleClass: 'mic-pulse-circle idle',
            circleStyle: { background: '#3b82f6', cursor: 'pointer' },
            labelColor: '#3b82f6',
        },
        listening: {
            icon: <Mic size={24} />,
            label: 'Escutando...',
            sublabel: 'Toque para Parar',
            circleClass: 'mic-pulse-circle listening pulse-active',
            circleStyle: { background: '#ef4444', cursor: 'pointer' },
            labelColor: '#ef4444',
        },
        processing: {
            icon: <Loader2 size={24} className="animate-spin" />,
            label: 'Analisando fala...',
            sublabel: '',
            circleClass: 'mic-pulse-circle processing',
            circleStyle: { background: '#f59e0b', cursor: 'default' },
            labelColor: '#f59e0b',
        },
    };

    const config = stateConfig[state];
    const isClickable = state === 'idle' || state === 'listening';

    return (
        <div className="mic-hud-container">
            {/* Balão de Transcrição */}
            {lastTranscript && !lastTranscript.match(/\[.*\]/) && (
                <div className="transcript-bubble">
                    <span className="transcript-label">Interlocutor</span>
                    {lastTranscript}
                </div>
            )}

            {/* Botão Push-to-Talk */}
            <div 
                className={config.circleClass}
                style={config.circleStyle}
                onClick={isClickable ? toggleListening : undefined}
                role={isClickable ? 'button' : undefined}
                aria-label={config.label}
                tabIndex={isClickable ? 0 : undefined}
            >
                {config.icon}
            </div>

            {/* Status */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <small style={{ 
                    opacity: 0.9, 
                    fontSize: '0.7rem', 
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: config.labelColor,
                }}>
                    {config.label}
                </small>
                {config.sublabel && (
                    <small style={{ fontSize: '0.6rem', opacity: 0.6 }}>{config.sublabel}</small>
                )}
            </div>
        </div>
    );
};

export default MicIndicator;
