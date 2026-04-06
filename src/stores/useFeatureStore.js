import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { get, set, del } from 'idb-keyval';

/**
 * Custom storage for IndexedDB integration with Zustand
 */
const idbStorage = {
    getItem: async (name) => {
        const value = await get(name);
        return value || null;
    },
    setItem: async (name, value) => {
        await set(name, value);
    },
    removeItem: async (name) => {
        await del(name);
    },
};

/**
 * useFeatureStore
 * Centraliza o controle de ativação dos recursos de IA (Edge AI).
 * Essencial para o gerenciamento de memória em dispositivos de 2GB RAM.
 */
export const useFeatureStore = create(
    persist(
        (set) => ({
            // Feature Toggles (Estado Inicial)
            isWhisperEnabled: false,    // Escuta Ativa (WASM/ONNX)
            isBlinkEnabled: false,      // Acionamento por Piscada (MediaPipe)
            isMagnetEnabled: false,     // Magnetismo Visual (Snap-to-Grid)
            isScanningEnabled: false,   // Varredura Automática (Navegação Eye-Blink)
            isPredictEnabled: false,    // Sugestões Preditivas (Contexto Whisper)

            // Actions
            toggleWhisper: () =>
                set((state) => ({ isWhisperEnabled: !state.isWhisperEnabled })),

            toggleBlink: () =>
                set((state) => ({ isBlinkEnabled: !state.isBlinkEnabled })),

            toggleMagnet: () =>
                set((state) => ({ isMagnetEnabled: !state.isMagnetEnabled })),

            toggleScanning: () =>
                set((state) => ({ isScanningEnabled: !state.isScanningEnabled })),

            togglePredict: () =>
                set((state) => ({ isPredictEnabled: !state.isPredictEnabled })),

            // Reset de Fábrica (Segurança)
            resetFeatures: () =>
                set({
                    isWhisperEnabled: false,
                    isBlinkEnabled: false,
                    isMagnetEnabled: false,
                    isScanningEnabled: false,
                    isPredictEnabled: false,
                }),
        }),
        {
            name: 'fono-idb-features',
            storage: createJSONStorage(() => idbStorage),
        }
    )
);
