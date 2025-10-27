import { useState } from 'react'
import { useTranslation } from 'react-i18next'

function App() {
  const [count, setCount] = useState(0)
  const { t, i18n } = useTranslation()

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ko' ? 'en' : 'ko'
    i18n.changeLanguage(newLang)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4">🕯️ {t('app.name')}</h1>
        <p className="text-xl text-gray-300 mb-8">{t('app.tagline')}</p>
        <button
          onClick={() => setCount((count) => count + 1)}
          className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-6 rounded-lg transition-colors"
        >
          {t('candle.light')}: {count}
        </button>
        <div className="mt-8">
          <button
            onClick={toggleLanguage}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            {i18n.language === 'ko' ? 'English' : '한국어'}
          </button>
        </div>
        <p className="mt-4 text-gray-400">프로젝트 초기화 완료!</p>
      </div>
    </div>
  )
}

export default App
