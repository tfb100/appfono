import React from 'react';
import { X } from 'lucide-react';

const SettingsPanel = ({ settings, setSettings, isOpen, onClose, voices }) => {
  if (!isOpen) return null;

  return (
    <div className="settings-overlay">
      <div className="settings-modal">
        <div className="settings-header">
          <h2>Configurações</h2>
          <button onClick={onClose} aria-label="Fechar configurações" className="close-btn">
            <X size={24} />
          </button>
        </div>

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

          <label style={{ fontSize: '0.9rem', marginBottom: '0.25rem', display: 'block' }}>Posição da Barra</label>
          <select
            value={settings.headerPosition || 'top'}
            onChange={(e) => setSettings(prev => ({ ...prev, headerPosition: e.target.value }))}
            className="voice-select"
            style={{ marginBottom: '1rem' }}
          >
            <option value="top">Topo</option>
            <option value="bottom">Fundo</option>
          </select>

          <label className="setting-toggle">
            <input
              type="checkbox"
              checked={settings.vlibrasEnabled}
              onChange={(e) => setSettings(prev => ({ ...prev, vlibrasEnabled: e.target.checked }))}
            />
            <span>Ativar VLibras (Língua de Sinais)</span>
          </label>
        </div>
      </div>
    </div>
  );
};
export default SettingsPanel;
