import { pipeline, env } from '@huggingface/transformers';
import { IA_EVENTS } from '../models/events';

// Configurações para rodar localmente no Worker
env.allowLocalModels = false; 
env.useBrowserCache = true;

// Silencia avisos ruidosos de forma agressiva (v2/v3)
try {
    if (typeof env !== 'undefined') {
        if (!env.onnx) env.onnx = {};
        env.onnx.logLevel = 'error';
        env.onnx.debug = false;
        
        if (!env.backends) env.backends = {};
        if (!env.backends.onnx) env.backends.onnx = {};
        env.backends.onnx.logLevel = 'error';
    }
} catch (e) {
    console.error('Worker env config error:', e);
}

let recognizer;

/**
 * Inicialização do Whisper (Modelo Tiny Quantizado)
 */
const initWhisper = async () => {
    try {
        self.postMessage({ type: IA_EVENTS.WHISPER.INIT, payload: 'Carregando modelos de áudio...' });

        // openai/whisper-tiny.en (apenas inglês) ou openai/whisper-tiny (multilíngue)
        // Usamos distil-whisper/distil-small.en ou tiny.en p/ performance máxima em 2GB RAM
        // Para Português, usamos openai/whisper-tiny
        recognizer = await pipeline('automatic-speech-recognition', 'onnx-community/whisper-tiny', {
            device: 'webgpu', // Tenta WebGPU primeiro (React 19/Android Chrome moderno)
            dtype: 'fp16',   // Menor precisão p/ poupar RAM
        }).catch(async () => {
             // Fallback para CPU WASM se WebGPU falhar no tablet
             return await pipeline('automatic-speech-recognition', 'onnx-community/whisper-tiny', {
                device: 'wasm'
            });
        });

        self.postMessage({ type: IA_EVENTS.WHISPER.READY });
    } catch (error) {
        self.postMessage({ type: IA_EVENTS.WHISPER.ERROR, payload: error.message });
    }
};

/**
 * Processamento de Áudio
 */
self.onmessage = async (event) => {
    const { type, payload } = event.data;

    if (type === IA_EVENTS.WHISPER.INIT) {
        await initWhisper();
    }

    if (type === 'PROCESS_AUDIO' && recognizer) {
        const { audio } = payload; // Float32Array a 16kHz
        
        try {
            const output = await recognizer(audio, {
                chunk_length_s: 30,
                stride_length_s: 5,
                language: 'portuguese',
                task: 'transcribe',
                return_timestamps: false
            });

            self.postMessage({ 
                type: IA_EVENTS.WHISPER.PREDICTION_FINAL, 
                payload: { text: output.text } 
            });
        } catch (err) {
            self.postMessage({ type: IA_EVENTS.WHISPER.ERROR, payload: 'Erro na transcrição: ' + err.message });
        }
    }
};
