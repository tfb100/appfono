import React from 'react';
import { Eye, EyeOff, Scan, AlertTriangle } from 'lucide-react';
import { useBlinkController } from '../../controllers/useBlinkController';

/**
 * BlinkIndicator
 * Componente visual de feedback para o recurso de acionamento por piscada.
 * Mostra o status do rastreamento facial e confirmação de ativação.
 */
const BlinkIndicator = () => {
    const { blinkState, videoRef } = useBlinkController();
    const { isTracking, isClosed, error, isReady, lastEAR } = blinkState;

    if (error) {
        return (
            <div className="blink-indicator error" style={{ 
                color: '#ef4444', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                padding: '12px',
                backgroundColor: '#fee2e2',
                borderRadius: '12px'
            }}>
                <AlertTriangle size={20} />
                <span>{error}</span>
            </div>
        );
    }

    // Se estiver carregando modelos do MediaPipe
    if (!isReady && blinkState.isReady !== undefined) {
        return (
            <div className="blink-indicator loading" style={{ opacity: 0.6 }}>
                <span>Iniciando Rastreador Facial...</span>
            </div>
        );
    }

    return (
        <div className="blink-indicator-container" style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            padding: '16px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            minWidth: '200px',
            border: '1px solid rgba(0,0,0,0.05)'
        }}>
            {/* Título e Status */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '700', fontSize: '0.9rem', color: '#1f2937' }}>
                    ACIONAMENTO OCULAR
                </span>
                <div style={{ 
                    width: '10px', height: '10px', 
                    borderRadius: '50%', 
                    backgroundColor: isTracking ? '#22c55e' : '#f59e0b',
                    boxShadow: isTracking ? '0 0 10px #22c55e80' : 'none'
                }} />
            </div>

            {/* Video Preview (Oculto ou Pequeno p/ Debug) */}
            <div style={{ 
                width: '100%', 
                height: '120px', 
                backgroundColor: '#000', 
                borderRadius: '12px', 
                overflow: 'hidden',
                position: 'relative'
            }}>
                <video 
                    ref={videoRef} 
                    muted 
                    playsInline 
                    style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        transform: 'scaleX(-1)' // Mirroring
                    }} 
                />
                
                {/* Overlay Status */}
                {!isTracking && (
                    <div style={{
                        position: 'absolute', inset: 0,
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        display: 'flex', flexDirection: 'column', 
                        alignItems: 'center', justifyContent: 'center',
                        color: '#fff', gap: '8px'
                    }}>
                        <Scan size={32} />
                        <span style={{ fontSize: '0.8rem' }}>Enquadre seu Rosto</span>
                    </div>
                )}

                {/* EAR Bar (Cálculo em tempo real) */}
                {isTracking && (
                    <div style={{
                        position: 'absolute', bottom: '8px', left: '8px', right: '8px',
                        height: '4px', backgroundColor: 'rgba(255,255,255,0.3)',
                        borderRadius: '2px'
                    }}>
                        <div style={{
                            width: `${Math.min(lastEAR * 300, 100)}%`,
                            height: '100%',
                            backgroundColor: isClosed ? '#ef4444' : '#22c55e',
                            transition: 'width 0.1s ease-out'
                        }} />
                    </div>
                )}
            </div>

            {/* Feedback de Piscada */}
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '12px',
                padding: '8px',
                backgroundColor: isClosed ? '#fee2e2' : '#f0fdf4',
                borderRadius: '12px',
                transition: 'all 0.2s'
            }}>
                {isClosed ? (
                    <>
                        <EyeOff color="#ef4444" size={24} />
                        <b style={{ color: '#ef4444' }}>FECHADO</b>
                    </>
                ) : (
                    <>
                        <Eye color="#22c55e" size={24} />
                        <b style={{ color: '#22c55e' }}>ABERTO</b>
                    </>
                )}
            </div>
        </div>
    );
};

export default BlinkIndicator;
