import React, { useMemo } from 'react';
import { QuoteSymbols } from '../models/QuoteSymbols.jsx';
import { Star, Zap } from 'lucide-react';

const FavoriteBar = ({ settings, onSpeak }) => {
    const { manualFavorites = [], usageStats = {}, showFavoritesBar } = settings;

    const favoriteSymbols = useMemo(() => {
        if (!showFavoritesBar) return [];

        // Manual Favorites
        const manual = QuoteSymbols.filter(s => manualFavorites.includes(s.id));

        // Frequent Favorites (excluding manual ones, top 5, at least 2 clicks)
        const frequent = QuoteSymbols
            .filter(s => !manualFavorites.includes(s.id) && (usageStats[s.id] || 0) >= 2)
            .sort((a, b) => (usageStats[b.id] || 0) - (usageStats[a.id] || 0))
            .slice(0, 5);

        return { manual, frequent };
    }, [manualFavorites, usageStats, showFavoritesBar]);

    if (!showFavoritesBar || (favoriteSymbols.manual.length === 0 && favoriteSymbols.frequent.length === 0)) {
        return null;
    }

    const renderSymbol = (s, isManual) => (
        <button
            key={`${isManual ? 'm' : 'f'}-${s.id}`}
            className={`fav-button category-${s.category}`}
            onClick={() => onSpeak(s)}
            aria-label={`Falar: ${s.label}`}
        >
            <div className="fav-icon">
                {React.isValidElement(s.icon) && s.icon.type !== 'span'
                    ? React.cloneElement(s.icon, { size: 24, strokeWidth: 2.5 })
                    : s.icon
                }
            </div>
            <span className="fav-label">{s.label}</span>
            <div className="fav-badge">
                {isManual ? <Star size={10} fill="currentColor" /> : <Zap size={10} fill="currentColor" />}
            </div>
        </button>
    );

    return (
        <div className="favorite-bar">
            {favoriteSymbols.manual.length > 0 && (
                <div className="fav-section">
                    <div className="fav-section-title">⭐ Favoritos</div>
                    <div className="fav-list">
                        {favoriteSymbols.manual.map(s => renderSymbol(s, true))}
                    </div>
                </div>
            )}
            {favoriteSymbols.frequent.length > 0 && (
                <div className="fav-section">
                    <div className="fav-section-title">⚡ Frequentes</div>
                    <div className="fav-list">
                        {favoriteSymbols.frequent.map(s => renderSymbol(s, false))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FavoriteBar;
