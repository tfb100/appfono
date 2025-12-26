import React from 'react';
import { X, Star, Zap } from 'lucide-react';
import { QuoteSymbols } from '../models/QuoteSymbols.jsx';
import { translations } from '../utils/translations';

const SettingsPanel = ({ settings, setSettings, isOpen, onClose, voices }) => {
  if (!isOpen) return null;

  const toggleManualFavorite = (id) => {
    const current = settings.manualFavorites || [];
    const updated = current.includes(id)
      ? current.filter(fid => fid !== id)
      : [...current, id];
    setSettings(prev => ({ ...prev, manualFavorites: updated }));
  };

  const t = translations[settings.language || 'pt'];

  return (
    <div className="settings-overlay">
      <div className="settings-modal">
        <div className="settings-header">
          <h2>{t.settingsTitle}</h2>
          <button onClick={onClose} aria-label={t.close} className="close-btn">
            <X size={24} />
          </button>
        </div>

        <div className="settings-body" style={{ maxHeight: '70vh', overflowY: 'auto', paddingRight: '10px' }}>
          <div className="settings-section">
            <h3>{t.voiceSettings}</h3>
            <label style={{ fontSize: '0.9rem', marginBottom: '0.25rem', display: 'block' }}>{t.voice}</label>
            <select
              value={settings.voiceURI}
              onChange={(e) => setSettings(prev => ({ ...prev, voiceURI: e.target.value }))}
              className="voice-select"
              style={{ marginBottom: '1rem' }}
            >
              <option value="">{t.white} (System Default)</option>
              {voices.map(v => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name.slice(0, 30)} ({v.lang})
                </option>
              ))}
            </select>

            <label style={{ fontSize: '0.9rem', marginBottom: '0.25rem', display: 'block' }}>{t.speed}</label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={settings.rate || 1}
              onChange={(e) => setSettings(prev => ({ ...prev, rate: parseFloat(e.target.value) }))}
              className="speed-range"
            />
          </div>

          <div className="settings-section">
            <h3>{t.visualSettings}</h3>
            <label style={{ fontSize: '0.9rem', marginBottom: '0.25rem', display: 'block' }}>{t.theme}</label>
            <select
              value={settings.theme || 'neutral'}
              onChange={(e) => setSettings(prev => ({ ...prev, theme: e.target.value }))}
              className="voice-select"
              style={{ marginBottom: '1rem' }}
            >
              <option value="kids">{t.kids}</option>
              <option value="neutral">{t.neutral}</option>
            </select>

            <label style={{ fontSize: '0.9rem', marginBottom: '0.25rem', display: 'block' }}>{t.palette}</label>
            <select
              value={settings.buttonPalette || 'classic'}
              onChange={(e) => setSettings(prev => ({ ...prev, buttonPalette: e.target.value }))}
              className="voice-select"
              style={{ marginBottom: '1rem' }}
            >
              <option value="classic">{t.classic}</option>
              <option value="pastel">{t.pastel}</option>
              <option value="high-contrast">{t.highContrast}</option>
            </select>

            <label style={{ fontSize: '0.9rem', marginBottom: '0.25rem', display: 'block' }}>{t.fontColor}</label>
            <select
              value={settings.fontColor || 'white'}
              onChange={(e) => setSettings(prev => ({ ...prev, fontColor: e.target.value }))}
              className="voice-select"
              style={{ marginBottom: '1rem' }}
            >
              <option value="white">{t.white}</option>
              <option value="black">{t.black}</option>
            </select>

            <label style={{ fontSize: '0.9rem', marginBottom: '0.25rem', display: 'block' }}>{t.barPosition}</label>
            <select
              value={settings.headerPosition || 'top'}
              onChange={(e) => setSettings(prev => ({ ...prev, headerPosition: e.target.value }))}
              className="voice-select"
              style={{ marginBottom: '1rem' }}
            >
              <option value="top">{t.top}</option>
              <option value="bottom">{t.bottom}</option>
            </select>

            <label style={{ fontSize: '0.9rem', marginBottom: '0.25rem', display: 'block' }}>{t.language}</label>
            <select
              value={settings.language || 'pt'}
              onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
              className="voice-select"
              style={{ marginBottom: '1rem' }}
            >
              <option value="pt">Português</option>
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>

            <label className="setting-toggle">
              <input
                type="checkbox"
                checked={settings.vlibrasEnabled}
                onChange={(e) => setSettings(prev => ({ ...prev, vlibrasEnabled: e.target.checked }))}
              />
              <span>{t.vlibras}</span>
            </label>
          </div>

          <div className="settings-section">
            <h3>{t.manageShortcuts}</h3>
            <label className="setting-toggle">
              <input
                type="checkbox"
                checked={settings.showManualFavorites}
                onChange={(e) => setSettings(prev => ({ ...prev, showManualFavorites: e.target.checked }))}
              />
              <Star size={16} style={{ marginRight: '4px' }} />
              <span>{t.showFavorites}</span>
            </label>

            <label className="setting-toggle" style={{ marginTop: '0.5rem' }}>
              <input
                type="checkbox"
                checked={settings.showFrequentSymbols}
                onChange={(e) => setSettings(prev => ({ ...prev, showFrequentSymbols: e.target.checked }))}
              />
              <Zap size={16} style={{ marginRight: '4px' }} />
              <span>{t.showFrequent}</span>
            </label>

            <label className="setting-toggle" style={{ marginTop: '0.5rem' }}>
              <input
                type="checkbox"
                checked={settings.showAllSymbols}
                onChange={(e) => setSettings(prev => ({ ...prev, showAllSymbols: e.target.checked }))}
              />
              <span style={{ fontSize: '1.2rem', marginRight: '4px' }}>☰</span>
              <span>{t.showAll}</span>
            </label>

            {settings.showManualFavorites && (
              <div className="favorites-manager" style={{ marginTop: '1rem' }}>
                <p style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '0.5rem' }}>{t.markFavorites}</p>
                <div className="fav-selection-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  {QuoteSymbols.map(s => {
                    const currentLang = settings.language || 'pt';
                    const label = typeof s.label === 'object' ? s.label[currentLang] : s.label;

                    return (
                      <button
                        key={s.id}
                        onClick={() => toggleManualFavorite(s.id)}
                        style={{
                          padding: '8px',
                          borderRadius: '8px',
                          border: (settings.manualFavorites || []).includes(s.id) ? '2px solid var(--color-primary)' : '1px solid #ddd',
                          background: (settings.manualFavorites || []).includes(s.id) ? '#fff8e1' : 'white',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '0.85rem',
                          textAlign: 'left'
                        }}
                      >
                        <Star size={14} fill={(settings.manualFavorites || []).includes(s.id) ? 'var(--color-primary)' : 'none'} color={(settings.manualFavorites || []).includes(s.id) ? 'var(--color-primary)' : '#ccc'} />
                        <span style={{ flex: 1 }}>{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default SettingsPanel;
