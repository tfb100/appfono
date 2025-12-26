import React from 'react';
import { QuoteSymbols } from '../models/QuoteSymbols.jsx';
import { Star } from 'lucide-react';
import FavoriteBar from './FavoriteBar';

const SymbolGrid = ({ onSpeak, onToggleFavorite, settings }) => {
  const isFavorite = (id) => (settings.manualFavorites || []).includes(id);

  return (
    <div className="grid-wrapper">
      <FavoriteBar settings={settings} onSpeak={onSpeak} />

      <div className="symbol-grid">
        {QuoteSymbols.map((s) => (
          <div key={s.id} className="symbol-card-wrapper">
            <button
              className={`symbol-card category-${s.category}`}
              onClick={() => onSpeak(s)}
              aria-label={`Falar: ${s.label}`}
            >
              <div className="symbol-icon-wrapper">
                {React.isValidElement(s.icon) && s.icon.type !== 'span'
                  ? React.cloneElement(s.icon, {
                    size: 56,
                    strokeWidth: 2.5
                  })
                  : s.icon
                }
              </div>
              <div className="symbol-label">{s.label}</div>
            </button>

            <button
              className={`fav-toggle ${isFavorite(s.id) ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(s.id);
              }}
              aria-label={isFavorite(s.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
            >
              <Star size={20} fill={isFavorite(s.id) ? "currentColor" : "none"} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SymbolGrid;
