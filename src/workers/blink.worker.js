import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import { IA_EVENTS } from '../models/events';

let faceLandmarker;
let lastBlinkState = false; // false = open, true = closed
let blinkThreshold = 0.25; // Default sensitivity

/**
 * EYE ASPECT RATIO (EAR)
 * Calcula a abertura orbital baseada nos landmarks do MediaPipe.
 */
function calculateEAR(landmarks) {
    // Índices simplificados para cálculo de EAR (Face Mesh)
    // Left Eye vertical: 160-144, 158-153
    // Left Eye horizontal: 33-133
    const getDist = (p1, p2) => Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));

    const leftV1 = getDist(landmarks[160], landmarks[144]);
    const leftV2 = getDist(landmarks[158], landmarks[153]);
    const leftH = getDist(landmarks[33], landmarks[133]);

    const leftEAR = (leftV1 + leftV2) / (2.0 * leftH);

    // Right Eye vertical: 385-380, 387-373
    // Right Eye horizontal: 362-263
    const rightV1 = getDist(landmarks[385], landmarks[380]);
    const rightV2 = getDist(landmarks[387], landmarks[373]);
    const rightH = getDist(landmarks[362], landmarks[263]);

    const rightEAR = (rightV1 + rightV2) / (2.0 * rightH);

    return (leftEAR + rightEAR) / 2.0;
}

/**
 * Inicialização do Modelo
 */
const initBlinkDetector = async () => {
    try {
        const filesetResolver = await FilesetResolver.forVisionTasks(
            'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        );

        faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
            baseOptions: {
                modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
                delegate: 'GPU'
            },
            outputFaceBlendshapes: true,
            runningMode: 'VIDEO',
            numFaces: 1
        });

        self.postMessage({ type: IA_EVENTS.BLINK.READY });
    } catch (error) {
        self.postMessage({ type: IA_EVENTS.BLINK.ERROR, payload: error.message });
    }
};

/**
 * Loop de Processamento
 */
self.onmessage = async (event) => {
    const { type, payload } = event.data;

    if (type === IA_EVENTS.BLINK.INIT) {
        await initBlinkDetector();
    }

    if (type === 'PROCESS_FRAME' && faceLandmarker) {
        const { image, timestamp } = payload;
        
        const results = faceLandmarker.detectForVideo(image, timestamp);
        
        if (results.faceLandmarks && results.faceLandmarks.length > 0) {
            const landmarks = results.faceLandmarks[0];
            const ear = calculateEAR(landmarks);

            // Detecção de Transição (Debounce implícito pelo Worker)
            const isClosed = ear < blinkThreshold;

            if (isClosed && !lastBlinkState) {
                self.postMessage({ type: IA_EVENTS.BLINK.CLOSE, payload: { ear } });
            } else if (!isClosed && lastBlinkState) {
                self.postMessage({ type: IA_EVENTS.BLINK.OPEN, payload: { ear } });
            }

            lastBlinkState = isClosed;

            // Tracking Update
            self.postMessage({ 
                type: IA_EVENTS.BLINK.TRACKING, 
                payload: { ear, isClosed } 
            });
        } else {
            self.postMessage({ type: IA_EVENTS.BLINK.LOST });
        }
    }
    
    // Ajuste de Sensibilidade (Calibração)
    if (type === IA_EVENTS.BLINK.CALIBRATION) {
        blinkThreshold = payload.threshold;
    }
};
