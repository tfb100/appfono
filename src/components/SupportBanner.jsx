import React, { useState } from 'react';
import { Heart, X } from 'lucide-react';
import { translations } from '../utils/translations';

const SupportBanner = ({ language }) => {
    const [visible, setVisible] = useState(true);
    const t = translations[language] || translations.pt;

    if (!visible) return null;

    return (
        <div className="support-banner">
            <div className="support-content">
                <div className="support-icon">
                    <Heart size={32} fill="#FFD700" color="#FFB703" className="heart-pulse" />
                </div>
                <div className="support-text-area">
                    <h4>{t.supportTitle}</h4>
                    <p>{t.supportText}</p>
                </div>
                <button
                    className="support-close-btn"
                    onClick={() => setVisible(false)}
                    aria-label={t.close}
                >
                    <X size={20} />
                </button>
            </div>
        </div>
    );
};

export default SupportBanner;
