import React from 'react';
import { Heart } from 'lucide-react';
import { translations } from '../utils/translations';

const SupportFooter = ({ language, onClick }) => {
    const t = translations[language] || translations.pt;

    return (
        <footer className="app-footer" onClick={onClick} style={{ cursor: 'pointer' }}>
            <div className="footer-content">
                <Heart size={16} fill="#FFB703" color="#FFB703" className="heart-pulse-mini" />
                <span className="footer-title">{t.supportTitle}</span>
                <span className="footer-divider">•</span>
                <span className="footer-text">{t.supportText.substring(0, 80)}...</span>
            </div>
        </footer>
    );
};

export default SupportFooter;
