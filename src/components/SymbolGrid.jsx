import React, { useMemo } from 'react';
import { QuoteSymbols } from '../models/QuoteSymbols.jsx';
import { Star, Zap } from 'lucide-react';
import { translations } from '../utils/translations';

const SymbolGrid = ({ onSpeak, settings }) => {
  const {
    manualFavorites = [],
    usageStats = {},
    showManualFavorites = true,
    showFrequentSymbols = true
  } = settings;

  const sections = useMemo(() => {
    // 1. Manual Favorites
    const manual = showManualFavorites
      ? QuoteSymbols.filter(s => manualFavorites.includes(s.id))
      : [];

    const manualIds = manual.map(s => s.id);

    // 2. Frequent Symbols (usage >= 3, excluding manual, top 4)
    const frequent = showFrequentSymbols
      ? QuoteSymbols
        .filter(s => !manualIds.includes(s.id) && (usageStats[s.id] || 0) >= 3)
        .sort((a, b) => (usageStats[b.id] || 0) - (usageStats[a.id] || 0))
        .slice(0, 7)
      : [];

    const frequentIds = frequent.map(s => s.id);

    // 3. Others (the rest)
    const others = QuoteSymbols.filter(s => !manualIds.includes(s.id) && !frequentIds.includes(s.id));

    return { manual, frequent, others };
  }, [manualFavorites, usageStats, showManualFavorites, showFrequentSymbols]);

  const renderCard = (s, isSmall = false) => {
    const currentLang = settings.language || 'pt';
    const label = typeof s.label === 'object' ? s.label[currentLang] : s.label;

    return (
      <button
        key={s.id}
        className={`symbol-card category-${s.category} ${isSmall ? 'small' : ''}`}
        onClick={() => onSpeak(s)}
        aria-label={`Falar: ${label}`}
      >
        <div className="symbol-icon-wrapper">
          {React.isValidElement(s.icon) && s.icon.type !== 'span'
            ? React.cloneElement(s.icon, {
              size: isSmall ? 40 : 56,
              strokeWidth: 2.5
            })
            : s.icon
          }
        </div>
        <div className="symbol-label">{label}</div>
      </button>
    );
  };

  const t = translations[settings.language || 'pt'];

  return (
    <div className="grid-container">
      {sections.manual.length > 0 && (
        <div className="grid-section">
          <h3 className="section-title"><Star size={20} fill="var(--color-primary)" /> {t.favorites}</h3>
          <div className="symbol-grid">
            {sections.manual.map(s => renderCard(s))}
          </div>
        </div>
      )}

      {sections.frequent.length > 0 && (
        <div className="grid-section">
          <h3 className="section-title"><Zap size={20} fill="#FFD700" /> {t.mostUsed}</h3>
          <div className="symbol-grid">
            {sections.frequent.map(s => renderCard(s))}
          </div>
        </div>
      )}
      {settings.showAllSymbols && (
        <div className="grid-section">
          {(sections.manual.length > 0 || sections.frequent.length > 0) && (
            <h3 className="section-title">{t.allSymbols}</h3>
          )}
          <div className="symbol-grid">
            {sections.others.map(s => renderCard(s))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SymbolGrid;
