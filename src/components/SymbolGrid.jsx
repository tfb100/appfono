import React, { useMemo } from 'react';
import { QuoteSymbols } from '../models/QuoteSymbols.jsx';
import { Star, Zap, Plus, MessageSquare } from 'lucide-react';
import { translations } from '../utils/translations';

const SymbolGrid = ({ onSpeak, settings }) => {
  const {
    manualFavorites = [],
    usageStats = {},
    showManualFavorites = true,
    showFrequentSymbols = true
  } = settings;

  const sections = useMemo(() => {
    const allSymbols = [...QuoteSymbols, ...(settings.customCards || [])];

    // 1. Manual Favorites
    const manual = showManualFavorites
      ? allSymbols.filter(s => manualFavorites.includes(s.id))
      : [];

    const manualIds = manual.map(s => s.id);

    // 2. Frequent Symbols (usage >= 3, excluding manual, top 4)
    const frequent = showFrequentSymbols
      ? allSymbols
        .filter(s => !manualIds.includes(s.id) && (usageStats[s.id] || 0) >= 3)
        .sort((a, b) => (usageStats[b.id] || 0) - (usageStats[a.id] || 0))
        .slice(0, 7)
      : [];

    const frequentIds = frequent.map(s => s.id);

    // 3. Others (the rest)
    const others = allSymbols.filter(s => !manualIds.includes(s.id) && !frequentIds.includes(s.id));

    // Grouping others by category
    const groupedOthers = others.reduce((acc, s) => {
      const cat = s.category || 'custom';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(s);
      return acc;
    }, {});

    return { manual, frequent, groupedOthers };
  }, [manualFavorites, usageStats, showManualFavorites, showFrequentSymbols, settings.customCards]);

  const renderCard = (s, isSmall = false) => {
    const currentLang = settings.language || 'pt';
    const label = typeof s.label === 'object' ? s.label[currentLang] : s.label;

    const IconMap = {
      Plus: Plus,
      MessageSquare: MessageSquare,
      Star: Star,
      Zap: Zap
    };

    let iconToRender = s.icon;

    if (settings.iconStyle === 'colorful' && s.colorfulIcon) {
      const iconPath = `/icons/colorful/${s.colorfulIcon}`;
      iconToRender = <img
        src={iconPath}
        alt={label}
        style={{
          width: isSmall ? '40px' : '65px',
          height: isSmall ? '40px' : '65px',
          objectFit: 'contain'
        }}
      />;
    } else if (typeof s.icon === 'string' && IconMap[s.icon]) {
      const Component = IconMap[s.icon];
      iconToRender = <Component size={isSmall ? 40 : 56} strokeWidth={2.5} />;
    } else if (React.isValidElement(s.icon) && typeof s.icon.type !== 'string') {
      iconToRender = React.cloneElement(s.icon, {
        size: isSmall ? 40 : 56,
        strokeWidth: 2.5
      });
    }

    return (
      <button
        key={s.id}
        className={`symbol-card category-${s.category || 'custom'} ${isSmall ? 'small' : ''} ${settings.largeCards ? 'large' : ''}`}
        onClick={() => onSpeak(s)}
        aria-label={`Falar: ${label}`}
      >
        <div className="symbol-icon-wrapper">
          {iconToRender}
        </div>
        <div className="symbol-label">{label}</div>
      </button>
    );
  };

  const t = translations[settings.language || 'pt'];

  const categoryLabels = {
    social: t.categorySocial,
    people: t.categoryPeople,
    verb: t.categoryVerbs,
    noun: t.categoryNouns,
    adj: t.categoryAdj,
    feelings: t.categoryFeelings,
    custom: t.categoryCustom
  };

  return (
    <div className="grid-container">
      {sections.manual.length > 0 && (
        <div className="grid-section">
          <h3 className="section-title"><Star size={20} fill="var(--color-primary)" /> {t.favorites}</h3>
          <div className={`symbol-grid ${settings.largeCards ? 'large' : ''}`}>
            {sections.manual.map(s => renderCard(s))}
          </div>
        </div>
      )}

      {sections.frequent.length > 0 && (
        <div className="grid-section">
          <h3 className="section-title"><Zap size={20} fill="#FFD700" /> {t.mostUsed}</h3>
          <div className={`symbol-grid ${settings.largeCards ? 'large' : ''}`}>
            {sections.frequent.map(s => renderCard(s))}
          </div>
        </div>
      )}

      {settings.showAllSymbols && Object.entries(sections.groupedOthers).map(([cat, symbols]) => (
        <div key={cat} className="grid-section">
          <h3 className="section-title">{categoryLabels[cat] || cat}</h3>
          <div className={`symbol-grid ${settings.largeCards ? 'large' : ''}`}>
            {symbols.map(s => renderCard(s))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SymbolGrid;
