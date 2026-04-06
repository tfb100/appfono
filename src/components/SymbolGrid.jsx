import React, { useMemo } from 'react';
import { QuoteSymbols } from '../models/QuoteSymbols.jsx';
import { Star, Zap, Plus, MessageSquare } from 'lucide-react';
import { translations } from '../utils/translations';
import { useState, useEffect, useRef } from 'react';
import { useFeatureStore } from '../stores/useFeatureStore';

const SymbolCard = React.memo(({ s, language, settings, isFocused, isHighlighted, onSpeak }) => {
  const label = typeof s.label === 'object' ? s.label[language] : s.label;
  const isLeanMode = settings.leanMode === true;
  const isSmall = !isLeanMode && settings.largeCards === false;
  const leanCount = settings.leanCount || 4;

  let iconToRender = s.icon;

  if (settings.iconStyle === 'colorful' && s.colorfulIcon) {
    // Calculo dinâmico de tamanho para modo enxuto
    let iconSize = isSmall ? '40px' : '65px';
    if (isLeanMode) {
      iconSize = leanCount <= 2 ? '220px' : leanCount <= 4 ? '150px' : '110px';
    }

    iconToRender = (
      <img
        src={`${import.meta.env.BASE_URL}icons/colorful/${s.colorfulIcon}`}
        alt={label}
        style={{ width: iconSize, height: iconSize, objectFit: 'contain' }}
      />
    );
  } else if (s.icon) {
    let iconSize = isSmall ? 40 : 56;
    if (isLeanMode) {
        iconSize = leanCount <= 2 ? 180 : leanCount <= 4 ? 130 : 100;
    }

    iconToRender = (
      <div className="icon-scale-wrapper" style={{ 
        width: iconSize, 
        height: iconSize,
        fontSize: iconSize, 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {s.icon}
      </div>
    );
  }

  return (
    <button
      className={`symbol-card category-${s.category || 'custom'} ${isSmall ? 'small' : ''} ${settings.largeCards ? 'large' : ''} ${isLeanMode ? 'lean' : ''} ${isHighlighted ? 'smart-highlight' : ''} ${isFocused ? 'scanning-focus' : ''}`}
      style={isLeanMode ? { 
        padding: leanCount <= 4 ? '1.5rem' : '1rem',
        minHeight: leanCount <= 2 ? '280px' : leanCount <= 4 ? '200px' : '150px'
      } : {}}
      onClick={() => onSpeak(s)}
      aria-label={`Falar: ${label}`}
    >
      <div className="symbol-icon-wrapper" style={isLeanMode ? { 
        height: leanCount <= 2 ? '220px' : 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      } : {}}>{iconToRender}</div>
      <div className="symbol-label" style={isLeanMode ? { 
        fontSize: leanCount <= 2 ? '2.5rem' : leanCount <= 4 ? '1.8rem' : '1.4rem',
        marginTop: '1.5rem',
        fontWeight: '900'
      } : {}}>{label}</div>
    </button>
  );
});

const SymbolGrid = ({ onSpeak, settings }) => {
  const [highlightedIds, setHighlightedIds] = useState([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const isScanningEnabled = useFeatureStore(state => state.isScanningEnabled);
  const scanTimerRef = useRef(null);
  const {
    manualFavorites = [],
    usageStats = {},
    showManualFavorites = true,
    showFrequentSymbols = true
  } = settings;

  const sections = useMemo(() => {
    const allSymbols = [...QuoteSymbols, ...(settings.customCards || [])];

    // MODO ENXUTO: Prioritizes favorites and reduces count
    if (settings.leanMode) {
        const leanLimit = parseInt(settings.leanCount || 4);
        const favorites = allSymbols
            .filter(s => manualFavorites.includes(s.id))
            .slice(0, leanLimit);
        
        // If not enough favorites, fill with frequent
        if (favorites.length < leanLimit) {
            const frequent = allSymbols
                .filter(s => !manualFavorites.includes(s.id) && (usageStats[s.id] || 0) >= 1)
                .sort((a, b) => (usageStats[b.id] || 0) - (usageStats[a.id] || 0))
                .slice(0, leanLimit - favorites.length);
            favorites.push(...frequent);
        }

        return { manual: favorites, frequent: [], groupedOthers: {}, isLean: true };
    }

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

  // Logic for Auto-Highlight (Whisper Integration)
  // Quando a IA Preditiva está ativa, o destaque literal é DESATIVADO.
  // A barra SmartSuggestions já cuida da resposta contextual.
  const isPredictEnabled = useFeatureStore(state => state.isPredictEnabled);
  const isWhisperEnabled = useFeatureStore(state => state.isWhisperEnabled);
  
  useEffect(() => {
    // Se a IA preditiva está ativa, não faz sentido piscar cards literais
    if (isPredictEnabled && isWhisperEnabled) return;

    const handleTranscript = (e) => {
      const text = (e.detail?.toLowerCase() || '').trim();
      
      // FIX: Se for uma pergunta (voz do interlocutor), NÃO destacamos cards literais.
      if (text.endsWith('?')) {
        console.log('[SymbolGrid] Ignorando destaque literal para pergunta capturada.');
        return;
      }

      const currentLang = settings.language || 'pt';
      const allSymbols = [...QuoteSymbols, ...(settings.customCards || [])];

      const matches = allSymbols.filter(s => {
        const label = (typeof s.label === 'object' ? s.label[currentLang] : s.label).toLowerCase();
        const keywords = [label];
        if (s.text) {
            const extraText = (typeof s.text === 'object' ? s.text[currentLang] : s.text).toLowerCase();
            keywords.push(extraText);
        }
        return keywords.some(k => text.includes(k) || k.includes(text));
      }).map(s => s.id);

      if (matches.length > 0) {
        setHighlightedIds(matches);
        setTimeout(() => setHighlightedIds([]), 6000);
      }
    };

    window.addEventListener('comunica:whisper_transcript', handleTranscript);
    return () => window.removeEventListener('comunica:whisper_transcript', handleTranscript);
  }, [settings.language, isPredictEnabled, isWhisperEnabled]);

  // --- LOGICA DE VARREDURA (SCANNING) ---
  const allVisibleSymbols = useMemo(() => {
    const list = [];
    if (sections.manual.length > 0) list.push(...sections.manual);
    if (sections.frequent.length > 0) list.push(...sections.frequent);
    Object.values(sections.groupedOthers).forEach(group => {
        list.push(...group);
    });
    return list;
  }, [sections]);

  useEffect(() => {
    if (isScanningEnabled && allVisibleSymbols.length > 0) {
      setFocusedIndex(0);
      scanTimerRef.current = setInterval(() => {
        setFocusedIndex(current => (current + 1) % allVisibleSymbols.length);
      }, 2000);
    } else {
      setFocusedIndex(-1);
      if (scanTimerRef.current) clearInterval(scanTimerRef.current);
    }
    return () => { if (scanTimerRef.current) clearInterval(scanTimerRef.current); };
  }, [isScanningEnabled, allVisibleSymbols.length]);

  useEffect(() => {
    if (!isScanningEnabled) return;
    const handleBlink = () => {
        if (focusedIndex >= 0 && allVisibleSymbols[focusedIndex]) {
            onSpeak(allVisibleSymbols[focusedIndex]);
        }
    };
    window.addEventListener('comunica:blink_close', handleBlink);
    return () => window.removeEventListener('comunica:blink_close', handleBlink);
  }, [isScanningEnabled, focusedIndex, allVisibleSymbols, onSpeak]);

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

  if (sections.isLean) {
    const leanCount = parseInt(settings.leanCount || 4);
    // Determine columns based on count
    const cols = leanCount <= 2 ? 2 : leanCount <= 4 ? 2 : leanCount <= 6 ? 3 : 4;
    
    return (
      <div className="grid-container lean-mode-active" style={{ padding: '20px' }}>
        <div className="grid-section" style={{ height: '100%' }}>
          <div className="symbol-grid lean-grid" style={{ 
             display: 'grid',
             gridTemplateColumns: `repeat(${cols}, 1fr)`,
             gridAutoRows: 'auto',
             gap: '2.5rem',
             width: '100%',
             maxWidth: '1400px',
             margin: '0 auto'
          }}>
            {sections.manual.map(s => (
              <SymbolCard 
                key={`lean-${s.id}`} 
                s={s} 
                language={settings.language || 'pt'} 
                settings={settings} 
                isFocused={focusedIndex >= 0 && allVisibleSymbols[focusedIndex]?.id === s.id}
                isHighlighted={highlightedIds.includes(s.id)}
                onSpeak={onSpeak}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid-container">
      {sections.manual.length > 0 && (
        <div className="grid-section">
          <h3 className="section-title"><Star size={20} fill="var(--color-primary)" /> {t.favorites}</h3>
          <div className={`symbol-grid ${settings.largeCards ? 'large' : ''}`}>
            {sections.manual.map(s => (
              <SymbolCard 
                key={`fav-${s.id}`} 
                s={s} 
                language={settings.language || 'pt'} 
                settings={settings} 
                isFocused={focusedIndex >= 0 && allVisibleSymbols[focusedIndex]?.id === s.id}
                isHighlighted={highlightedIds.includes(s.id)}
                onSpeak={onSpeak}
              />
            ))}
          </div>
        </div>
      )}

      {sections.frequent.length > 0 && (
        <div className="grid-section">
          <h3 className="section-title"><Zap size={20} fill="#FFD700" /> {t.mostUsed}</h3>
          <div className={`symbol-grid ${settings.largeCards ? 'large' : ''}`}>
            {sections.frequent.map(s => (
                <SymbolCard 
                  key={`freq-${s.id}`} 
                  s={s} 
                  language={settings.language || 'pt'} 
                  settings={settings} 
                  isFocused={focusedIndex >= 0 && allVisibleSymbols[focusedIndex]?.id === s.id}
                  isHighlighted={highlightedIds.includes(s.id)}
                  onSpeak={onSpeak}
                />
            ))}
          </div>
        </div>
      )}

      {settings.showAllSymbols && Object.entries(sections.groupedOthers).map(([cat, symbols]) => (
        <div key={`cat-section-${cat}`} className="grid-section">
          <h3 className="section-title">{categoryLabels[cat] || cat}</h3>
          <div className={`symbol-grid ${settings.largeCards ? 'large' : ''}`}>
            {symbols.map(s => (
                <SymbolCard 
                  key={`others-${cat}-${s.id}`} 
                  s={s} 
                  language={settings.language || 'pt'} 
                  settings={settings} 
                  isFocused={focusedIndex >= 0 && allVisibleSymbols[focusedIndex]?.id === s.id}
                  isHighlighted={highlightedIds.includes(s.id)}
                  onSpeak={onSpeak}
                />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SymbolGrid;
