import { Settings } from 'lucide-react'
import SymbolGrid from './components/SymbolGrid'
import SettingsPanel from './components/SettingsPanel'
import SupportFooter from './components/SupportFooter'
import { useAppController } from './controllers/useAppController'
import { useEffect } from 'react'
import { translations } from './utils/translations'
import logoKids from './assets/logo-kids.png'
import logoNeutral from './assets/logo-neutral.png'
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

  // Sync button palette
  useEffect(() => {
    document.body.setAttribute('data-palette', settings.buttonPalette || 'classic');
    document.body.setAttribute('data-font-color', settings.fontColor || 'white');
  }, [settings.buttonPalette, settings.fontColor]);


  const t = translations[settings.language || 'pt'];

  return (
    <div className="app-container">
      <div className="app-background" />
      <header className="app-header pos-top">
        <div className="logo-area" onClick={handleLogoClick} style={{ cursor: 'pointer', userSelect: 'none' }}>
          <div className="logo-wrapper">
            <img
              src={logoKids}
              alt="Logo"
              className="app-logo-img"
            />
          </div>
          <h1>{t.appTitle}</h1>
        </div>

        <button
          className="settings-btn"
          onClick={() => toggleSettings(true)}
          aria-label={t.openSettings}
        >
          <Settings size={28} />
        </button>
      </header>


      <main>
        <SymbolGrid
          onSpeak={handleSpeak}
          settings={settings}
        />
      </main>

      <SupportFooter
        language={settings.language || 'pt'}
        onClick={() => console.log('Future donation page')}
      />

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
