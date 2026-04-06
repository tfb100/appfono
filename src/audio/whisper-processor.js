/**
 * WhisperProcessor (AudioWorklet)
 * Processa áudio em tempo real com baixa latência, evitando ScriptProcessorNode obsoleto.
 */
class WhisperProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.buffer = new Float32Array(4096);
        this.samplesCollected = 0;
    }

    process(inputs, outputs, parameters) {
        const input = inputs[0];
        if (!input || !input[0]) return true;

        const channelData = input[0];
        
        // Envia os samples para a thread principal em blocos (message port)
        this.port.postMessage(channelData);

        return true;
    }
}

registerProcessor('whisper-processor', WhisperProcessor);
