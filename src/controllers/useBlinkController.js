import { useEffect, useRef, useState, useCallback } from 'react';
import { useFeatureStore } from '../stores/useFeatureStore';
import { IA_EVENTS } from '../models/events';

/**
 * useBlinkController
 * Gerencia o ciclo de vida do worker de detecção de piscadas.
 * Garante que a câmera seja acessada apenas quando o recurso está ativo.
 */
export const useBlinkController = () => {
    const isEnabled = useFeatureStore((state) => state.isBlinkEnabled);
    const workerRef = useRef(null);
    const videoRef = useRef(null);
    const requestRef = useRef(null);
    
    const [blinkState, setBlinkState] = useState({
        isTracking: false,
        lastEAR: 1.0,
        isClosed: false,
        error: null,
        isReady: false
    });

    /**
     * Ciclo de Processamento de Frames (Video -> Worker)
     */
    const processFrame = useCallback(() => {
        if (!workerRef.current || !videoRef.current || videoRef.current.readyState < 2) {
            requestRef.current = requestAnimationFrame(processFrame);
            return;
        }

        const video = videoRef.current;
        const timestamp = performance.now();
        
        // Envia o frame p/ o Worker processar em outra thread
        // No WebView Android, isso é crucial para não travar a UI
        workerRef.current.postMessage({
            type: 'PROCESS_FRAME',
            payload: { 
                image: video, 
                timestamp 
            }
        });

        requestRef.current = requestAnimationFrame(processFrame);
    }, []);

    /**
     * Start / Terminate do Worker baseado no Feature Toggle
     */
    useEffect(() => {
        if (isEnabled) {
            // Lazy Activation: Criar worker apenas quando ligado
            workerRef.current = new Worker(
                new URL('../workers/blink.worker.js', import.meta.url),
                { type: 'module' }
            );

            workerRef.current.onmessage = (event) => {
                const { type, payload } = event.data;

                switch (type) {
                    case IA_EVENTS.BLINK.READY:
                        setBlinkState(prev => ({ ...prev, isReady: true, error: null }));
                        break;
                    case IA_EVENTS.BLINK.TRACKING:
                        setBlinkState(prev => ({ 
                            ...prev, 
                            isTracking: true, 
                            lastEAR: payload.ear,
                            isClosed: payload.isClosed 
                        }));
                        break;
                    case IA_EVENTS.BLINK.LOST:
                        setBlinkState(prev => ({ ...prev, isTracking: false }));
                        break;
                    case IA_EVENTS.BLINK.CLOSE:
                        // Trigger de evento para acionamento na UI
                        window.dispatchEvent(new CustomEvent('comunica:blink_close'));
                        break;
                    case IA_EVENTS.BLINK.OPEN:
                        window.dispatchEvent(new CustomEvent('comunica:blink_open'));
                        break;
                    case IA_EVENTS.BLINK.ERROR:
                        setBlinkState(prev => ({ ...prev, error: payload }));
                        break;
                }
            };

            workerRef.current.postMessage({ type: IA_EVENTS.BLINK.INIT });
            
            // Iniciar Câmera
            navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240, facingMode: 'user' } })
                .then(stream => {
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                        videoRef.current.play();
                        processFrame();
                    }
                })
                .catch(err => {
                    setBlinkState(prev => ({ ...prev, error: 'Acesso à câmera negado.' }));
                });

        } else {
            // Limpeza de recursos e RAM (2GB limit)
            if (workerRef.current) {
                workerRef.current.terminate();
                workerRef.current = null;
            }
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
            if (videoRef.current?.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
            setBlinkState({
                isTracking: false,
                lastEAR: 1.0,
                isClosed: false,
                error: null,
                isReady: false
            });
        }

        return () => {
            if (workerRef.current) workerRef.current.terminate();
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [isEnabled, processFrame]);

    return { 
        blinkState, 
        videoRef 
    };
};
