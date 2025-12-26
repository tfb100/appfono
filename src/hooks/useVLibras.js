import { useCallback, useEffect } from 'react';

/**
 * useVLibras hook
 * Provides programmatic control over the VLibras widget and synchronizes its visibility.
 */
export const useVLibras = (enabled) => {
    // Visibility Sync
    useEffect(() => {
        const vwElement = document.querySelector('div[vw]');
        if (vwElement) {
            vwElement.style.display = enabled ? 'block' : 'none';
        }
    }, [enabled]);

    const translate = useCallback((text) => {
        if (!text || !enabled) return;

        try {
            if (window.VLibras && window.VLibras.Widget && window.VLibras.Widget.instance) {
                window.VLibras.Widget.instance.translate(text);
            }
        } catch (error) {
            console.error('Error triggering VLibras translation:', error);
        }
    }, [enabled]);

    return { translate };
};
