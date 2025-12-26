import { Settings } from 'lucide-react'
import SymbolGrid from './components/SymbolGrid'
import SettingsPanel from './components/SettingsPanel'
import { useAppController } from './controllers/useAppController'
import './styles/main.css'
import './styles/components.css'

function App() {
  const {
    handleSpeak,
    toggleFavorite,
    toggleSettings,
    setSettings,
    settings,
    isSettingsOpen,
    voices
  } = useAppController();

  // Secret Trigger Logic
  // Secret Trigger Logic
  const handleLogoClick = (e) => {
    // Relying on e.detail can be flaky in some browsers/test envs
    // Implementing manual triple click detection
    const now = Date.now();
    const lastClick = window.lastLogoClick || 0;
    const clickCount = window.logoClickCount || 0;

    if (now - lastClick < 500) {
      window.logoClickCount = clickCount + 1;
    } else {
      window.logoClickCount = 1;
    }

    window.lastLogoClick = now;

    if (window.logoClickCount === 3) {
      toggleSettings(true);
      window.logoClickCount = 0; // Reset
    }
  };

  const getSettingsBtnClass = () => {
    const pos = settings.settingsBtnPosition || 'header';
    if (pos === 'header') return 'settings-btn';
    return `settings-btn pos-${pos}`;
  };

  return (
    <div className="app-container">
      <div className="app-background" />
      <header className={`app-header pos-${settings.headerPosition || 'top'}`}>
        <div className="logo-area" onClick={handleLogoClick} style={{ cursor: 'pointer', userSelect: 'none' }}>
          <span className="logo-icon">🦁</span>
          <h1>Fono Kids</h1>
        </div>

        {/* Only render in header if position is 'header' */}
        {(settings.settingsBtnPosition === 'header' || !settings.settingsBtnPosition) && (
          <button
            className="settings-btn"
            onClick={() => toggleSettings(true)}
            aria-label="Abrir configurações"
          >
            <Settings size={28} />
          </button>
        )}
      </header>

      {/* Render floating button if position is NOT header and NOT hidden */}
      {settings.settingsBtnPosition && settings.settingsBtnPosition !== 'header' && settings.settingsBtnPosition !== 'hidden' && (
        <button
          className={getSettingsBtnClass()}
          onClick={() => toggleSettings(true)}
          aria-label="Abrir configurações"
        >
          <Settings size={28} />
        </button>
      )}


      <main>
        <SymbolGrid
          onSpeak={handleSpeak}
          onToggleFavorite={toggleFavorite}
          settings={settings}
        />
      </main>

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => toggleSettings(false)}
        settings={settings}
        setSettings={setSettings}
        voices={voices}
      />
    </div>
  )
}

export default App
