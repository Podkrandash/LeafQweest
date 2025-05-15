import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import WebApp from '@twa-dev/sdk'
import './index.css'
import App from './App'

// Инициализируем Telegram Web App перед рендерингом
if (WebApp) {
  // Сообщаем Telegram, что приложение готово к работе
  WebApp.ready()
}

// Создаем корневой элемент приложения
const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element not found')

// Рендерим приложение
createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
