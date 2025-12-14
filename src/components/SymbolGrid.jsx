import React from 'react';
import { QuoteSymbols } from '../models/QuoteSymbols.jsx';

const SymbolGrid = ({ onSpeak }) => {
  return (
    <div className="symbol-grid">
      {QuoteSymbols.map((s) => (
        <button
          key={s.id}
          className={`symbol-card category-${s.category}`}
          onClick={() => onSpeak(s.text)}
          aria-label={`Falar: ${s.text}`}
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
      ))}
    </div>
  );
};

export default SymbolGrid;
