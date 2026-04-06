import { useEffect, useRef, useState, useCallback } from 'react';
import { useFeatureStore } from '../stores/useFeatureStore';
import { IA_EVENTS } from '../models/events';

/**
 * useWhisperController
 * 
 * MODO PUSH-TO-TALK:
 * O áudio do microfone fica aberto (para evitar re-pedir permissão),
 * mas os chunks SÓ são enviados ao Whisper quando isListening=true.
 * O profissional controla quando gravar via toggleListening().
 * Auto-stop após MAX_LISTEN_SECONDS para economizar recursos.
 */

const MAX_LISTEN_SECONDS = 5; // Tempo máximo de escuta por sessão

export const useWhisperController = () => {
    const isEnabled = useFeatureStore(state => state.isWhisperEnabled);
    const whisperWorkerRef = useRef(null);
    const contextWorkerRef = useRef(null);
    const audioContextRef = useRef(null);
    const streamRef = useRef(null);
    const audioBufferRef = useRef([]); // Buffer de áudio acumulado durante escuta
    const autoStopTimerRef = useRef(null);
    const isListeningRef = useRef(false); // Ref para acesso síncrono no AudioWorklet
    
    const [whisperStatus, setWhisperStatus] = useState({
        isReady: false,
        isContextReady: false,
        isListening: false, // NOVO: push-to-talk state
        isProcessing: false, // NOVO: Whisper está transcrevendo
        lastTranscript: '',
        isLoading: false,
        error: null
    });

    /**
     * Alterna o modo de escuta (Push-to-Talk)
     * - Se não está escutando: começa a gravar
     * - Se está escutando: para e envia para o Whisper
     */
    const toggleListening = useCallback(() => {
        if (!whisperStatus.isReady) return;

        if (isListeningRef.current) {
            // PARAR escuta → processar áudio acumulado
            stopListening();
        } else {
            // INICIAR escuta
            startListening();
        }
    }, [whisperStatus.isReady]);

    const startListening = useCallback(() => {
        isListeningRef.current = true;
        audioBufferRef.current = []; // Limpa buffer anterior
        
        setWhisperStatus(prev => ({ 
            ...prev, 
            isListening: true, 
            isProcessing: false,
            lastTranscript: '' 
        }));

        console.log('[useWhisperController] 🎙️ Escutando...');
        window.dispatchEvent(new CustomEvent('comunica:mic_listening', { detail: true }));

        // Auto-stop de segurança após MAX_LISTEN_SECONDS
        autoStopTimerRef.current = setTimeout(() => {
            if (isListeningRef.current) {
                console.log(`[useWhisperController] ⏰ Auto-stop após ${MAX_LISTEN_SECONDS}s`);
                stopListening();
            }
        }, MAX_LISTEN_SECONDS * 1000);
    }, []);

    const stopListening = useCallback(() => {
        isListeningRef.current = false;
        clearTimeout(autoStopTimerRef.current);

        const audioData = audioBufferRef.current;
        audioBufferRef.current = [];

        setWhisperStatus(prev => ({ 
            ...prev, 
            isListening: false, 
            isProcessing: true 
        }));

        console.log(`[useWhisperController] ⏹️ Parando escuta. ${audioData.length} samples capturados.`);
        window.dispatchEvent(new CustomEvent('comunica:mic_listening', { detail: false }));

        // Envia o áudio acumulado para o Whisper processar de uma vez
        if (audioData.length > 16000 && whisperWorkerRef.current) {
            window.dispatchEvent(new CustomEvent('comunica:mic_processing', { detail: true }));
            const fullAudio = new Float32Array(audioData);
            whisperWorkerRef.current.postMessage({
                type: 'PROCESS_AUDIO',
                payload: { audio: fullAudio }
            });
        } else {
            console.warn('[useWhisperController] Áudio muito curto, ignorando.');
            setWhisperStatus(prev => ({ ...prev, isProcessing: false }));
        }
    }, []);

    /**
     * Inicia o stream de áudio (permanece aberto, mas só envia quando isListening)
     */
    const startAudioProcessing = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            
            const context = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
            audioContextRef.current = context;
            
            await context.audioWorklet.addModule(new URL('../audio/whisper-processor.js', import.meta.url));
            
            const source = context.createMediaStreamSource(stream);
            const processorNode = new AudioWorkletNode(context, 'whisper-processor');
            
            source.connect(processorNode);
            processorNode.connect(context.destination);

            // Escuta samples do Worklet — SÓ ACUMULA quando isListening
            processorNode.port.onmessage = (e) => {
                if (isListeningRef.current) {
                    const inputData = e.data;
                    audioBufferRef.current.push(...inputData);
                }
            };

        } catch (err) {
            console.error('Audio Setup Error:', err);
            setWhisperStatus(prev => ({ ...prev, error: 'Acesso ao microfone negado ou falha no áudio.' }));
        }
    }, []);

    /**
     * Bridge para permitir que componentes externos (SmartSuggestions) peçam cache
     */
    useEffect(() => {
        const handleRequestCache = (e) => {
            if (contextWorkerRef.current && e.detail.symbols) {
                console.log(`[useWhisperController] Encaminhando ${e.detail.symbols.length} símbolos para o Worker.`);
                contextWorkerRef.current.postMessage({ 
                    type: 'CONTEXT:GENERATE_SYMBOLS_CACHE', 
                    payload: { symbols: e.detail.symbols } 
                });
            } else {
                console.warn('[useWhisperController] Worker de contexto inacessível para cache.');
            }
        };

        window.addEventListener('comunica:request_symbols_cache', handleRequestCache);
        return () => window.removeEventListener('comunica:request_symbols_cache', handleRequestCache);
    }, []);

    /**
     * Ciclo de Vida da IA (Whisper + Context LLM)
     */
    useEffect(() => {
        if (isEnabled) {
            setWhisperStatus(prev => ({ ...prev, isLoading: true }));

            // 1. Inicializa Whisper (Transcrição)
            whisperWorkerRef.current = new Worker(
                new URL('../workers/whisper.worker.js', import.meta.url),
                { type: 'module' }
            );

            // 2. Inicializa Context (Intenção Semântica)
            contextWorkerRef.current = new Worker(
                new URL('../workers/context.worker.js', import.meta.url),
                { type: 'module' }
            );

            // Ouvinte Whisper
            whisperWorkerRef.current.onmessage = (event) => {
                const { type, payload } = event.data;
                switch (type) {
                    case IA_EVENTS.WHISPER.INIT:
                        setWhisperStatus(prev => ({ ...prev, isLoading: true }));
                        break;
                    case IA_EVENTS.WHISPER.READY:
                        setWhisperStatus(prev => ({ 
                            ...prev, 
                            isReady: true, 
                            isLoading: false 
                        }));
                        window.dispatchEvent(new CustomEvent('comunica:mic_ready'));
                        startAudioProcessing(); 
                        break;
                    case IA_EVENTS.WHISPER.PREDICTION_FINAL:
                        const text = payload.text.trim();
                        window.dispatchEvent(new CustomEvent('comunica:mic_processing', { detail: false }));
                        if (text) {
                            console.log(`[useWhisperController] 📝 Transcrição: "${text}"`);
                            setWhisperStatus(prev => ({ 
                                ...prev, 
                                lastTranscript: text, 
                                isProcessing: false 
                            }));
                            // Dispara evento para UI e envia ao Context Worker
                            window.dispatchEvent(new CustomEvent('comunica:whisper_transcript', { detail: text }));
                            contextWorkerRef.current?.postMessage({ type: IA_EVENTS.CONTEXT.ANALYZE, payload: text });
                        } else {
                            setWhisperStatus(prev => ({ ...prev, isProcessing: false }));
                        }
                        break;
                    case IA_EVENTS.WHISPER.ERROR:
                        window.dispatchEvent(new CustomEvent('comunica:mic_processing', { detail: false }));
                        setWhisperStatus(prev => ({ ...prev, error: payload, isLoading: false, isProcessing: false }));
                        break;
                }
            };

            // Ouvinte Context (LLM)
            contextWorkerRef.current.onmessage = (event) => {
                const { type, payload } = event.data;
                if (type === IA_EVENTS.CONTEXT.READY) {
                    setWhisperStatus(prev => ({ ...prev, isContextReady: true }));
                    window.dispatchEvent(new CustomEvent('comunica:request_symbols_retrigger'));
                } else if (type === IA_EVENTS.CONTEXT.RESULT) {
                    window.dispatchEvent(new CustomEvent('comunica:context_intent', { detail: payload }));
                } else if (type === 'CONTEXT:SYMBOLS_CACHE_READY') {
                    console.log('[useWhisperController] Cache semântico de símbolos pronto.');
                }
            };

            whisperWorkerRef.current.postMessage({ type: IA_EVENTS.WHISPER.INIT });
            contextWorkerRef.current.postMessage({ type: IA_EVENTS.CONTEXT.INIT });

            return () => {
                whisperWorkerRef.current?.terminate();
                contextWorkerRef.current?.terminate();
                clearTimeout(autoStopTimerRef.current);
            };
        } else {
            [whisperWorkerRef, contextWorkerRef].forEach(ref => {
                if (ref.current) {
                    ref.current.terminate();
                    ref.current = null;
                }
            });

            if (audioContextRef.current) {
                audioContextRef.current.close();
                audioContextRef.current = null;
            }
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(t => t.stop());
                streamRef.current = null;
            }
            setWhisperStatus({ 
                isReady: false, isContextReady: false, isListening: false,
                isProcessing: false, lastTranscript: '', isLoading: false, error: null 
            });
        }

        return () => {
            whisperWorkerRef.current?.terminate();
            contextWorkerRef.current?.terminate();
            if (audioContextRef.current) audioContextRef.current.close();
        };
    }, [isEnabled, startAudioProcessing]);

    return { whisperStatus, toggleListening };
};
