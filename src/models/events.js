/**
 * IA_EVENTS
 * Padronização da comunicação entre Web Workers e Thread Principal.
 */
export const IA_EVENTS = {
    // Processamento de Áudio (Whisper)
    WHISPER: {
        INIT: 'WHISPER:INIT',
        READY: 'WHISPER:READY',
        ERROR: 'WHISPER:ERROR',
        PREDICTION_PARTIAL: 'WHISPER:PREDICTION_PARTIAL',
        PREDICTION_FINAL: 'WHISPER:PREDICTION_FINAL',
        AUDIO_BUFFER_FULL: 'WHISPER:AUDIO_BUFFER_FULL'
    },

    // Detecção de Piscada (Blink)
    BLINK: {
        TRACKING: 'BLINK:TRACKING',  // Olhos em foco
        LOST: 'BLINK:LOST',          // Rosto não detectado
        CLOSE: 'BLINK:CLOSE',        // Piscada Iniciada
        OPEN: 'BLINK:OPEN',          // Piscada Concluída (Trigger)
        CALIBRATION: 'BLINK:CALIBRATION'
    },

    // Magnetismo Visual (Magnetic Cursor)
    MAGNET: {
        HOVER: 'MAGNET:HOVER',
        SELECT: 'MAGNET:SELECT'
    },

    // Motor Semântico (LLM de Contexto)
    CONTEXT: {
        INIT: 'CONTEXT:INIT',
        READY: 'CONTEXT:READY',
        ERROR: 'CONTEXT:ERROR',
        ANALYZE: 'CONTEXT:ANALYZE',
        RESULT: 'CONTEXT:RESULT'
    }
};
