import React from 'react';
import { X, Star, Zap } from 'lucide-react';
import { QuoteSymbols } from '../models/QuoteSymbols.jsx';

const SettingsPanel = ({ settings, setSettings, isOpen, onClose, voices }) => {
  if (!isOpen) return null;

  const toggleManualFavorite = (id) => {
    const current = settings.manualFavorites || [];
    const updated = current.includes(id)
      ? current.filter(fid => fid !== id)
      : [...current, id];
    setSettings(prev => ({ ...prev, manualFavorites: updated }));
  };

  return (
    <div className="settings-overlay">
      <div className="settings-modal">
        <div className="settings-header">
          <h2>Configurações</h2>
          <button onClick={onClose} aria-label="Fechar configurações" className="close-btn">
            <X size={24} />
          </button>
        </div>

        <div className="settings-body" style={{ maxHeight: '70vh', overflowY: 'auto', paddingRight: '10px' }}>
          <div className="settings-section">
            <h3>Voz (TTS)</h3>
            <select
              value={settings.voiceURI}
              onChange={(e) => setSettings(prev => ({ ...prev, voiceURI: e.target.value }))}
              className="voice-select"
            >
              <option value="">Padrão do Dispositivo</option>
              {voices.map(v => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name.slice(0, 30)} ({v.lang})
                </option>
              ))}
            </select>
          </div>

          <div className="settings-section">
            <h3>Interface</h3>
            <label style={{ fontSize: '0.9rem', marginBottom: '0.25rem', display: 'block' }}>Barra de configurações</label>
            <select
              value={settings.settingsBtnPosition || 'header'}
              onChange={(e) => setSettings(prev => ({ ...prev, settingsBtnPosition: e.target.value }))}
              className="voice-select"
              style={{ marginBottom: '1rem' }}
            >
              <option value="header">Cabeçalho (Padrão)</option>
              <option value="float-tr">Flutuante: Canto Superior Direito</option>
              <option value="float-br">Flutuante: Canto Inferior Direito</option>
              <option value="float-bl">Flutuante: Canto Inferior Esquerdo</option>
              <option value="float-tl">Flutuante: Canto Superior Esquerdo</option>
              <option value="hidden">Oculto (Clique 3x no Leão)</option>
            </select>

            <label style={{ fontSize: '0.9rem', marginBottom: '0.25rem', display: 'block' }}>Posição da Barra de menu</label>
            <select
              value={settings.headerPosition || 'top'}
              onChange={(e) => setSettings(prev => ({ ...prev, headerPosition: e.target.value }))}
              className="voice-select"
              style={{ marginBottom: '1rem' }}
            >
              <option value="top">Topo</option>
              <option value="bottom">Inferior</option>
            </select>

            <label className="setting-toggle">
              <input
                type="checkbox"
                checked={settings.vlibrasEnabled}
                onChange={(e) => setSettings(prev => ({ ...prev, vlibrasEnabled: e.target.checked }))}
              />
              <span>Ativar VLibras</span>
            </label>
          </div>

          <div className="settings-section">
            <h3>Gerenciar Atalhos</h3>
            <label className="setting-toggle">
              <input
                type="checkbox"
                checked={settings.showManualFavorites}
                onChange={(e) => setSettings(prev => ({ ...prev, showManualFavorites: e.target.checked }))}
              />
              <Star size={16} style={{ marginRight: '4px' }} />
              <span>Mostrar Favoritos</span>
            </label>

            <label className="setting-toggle" style={{ marginTop: '0.5rem' }}>
              <input
                type="checkbox"
                checked={settings.showFrequentSymbols}
                onChange={(e) => setSettings(prev => ({ ...prev, showFrequentSymbols: e.target.checked }))}
              />
              <Zap size={16} style={{ marginRight: '4px' }} />
              <span>Mostrar Mais Usados</span>
            </label>

            {settings.showManualFavorites && (
              <div className="favorites-manager" style={{ marginTop: '1rem' }}>
                <p style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '0.5rem' }}>Marque os botões favoritos:</p>
                <div className="fav-selection-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  {QuoteSymbols.map(s => (
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
                      <span style={{ flex: 1 }}>{s.label}</span>
                    </button>
                  ))}
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
