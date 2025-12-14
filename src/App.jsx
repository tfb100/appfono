import { Settings } from 'lucide-react'
import SymbolGrid from './components/SymbolGrid'
import SettingsPanel from './components/SettingsPanel'
import { useAppController } from './controllers/useAppController'
import './styles/main.css'
import './styles/components.css'

function App() {
  const {
    handleSpeak,
    toggleSettings,
    setSettings,
    settings,
    isSettingsOpen,
    voices
  } = useAppController();

  return (
    <div className="app-container">
      <div className="app-background" />
      <header className="app-header">
        <div className="logo-area">
          <span className="logo-icon">🦁</span>
          <h1>Fono Kids</h1>
        </div>
        <button
          className="settings-btn"
          onClick={() => toggleSettings(true)}
          aria-label="Abrir configurações"
        >
          <Settings size={28} />
        </button>
      </header>

      <main>
        <SymbolGrid onSpeak={handleSpeak} />
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
