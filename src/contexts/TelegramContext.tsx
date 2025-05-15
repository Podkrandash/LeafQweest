import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import WebApp from '@twa-dev/sdk';
import type { User } from '../types';

interface TelegramContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  theme: 'light' | 'dark';
}

const TelegramContext = createContext<TelegramContextType>({
  user: null,
  isLoading: true,
  error: null,
  theme: 'light',
});

export const useTelegram = () => useContext(TelegramContext);

interface TelegramProviderProps {
  children: ReactNode;
}

export const TelegramProvider = ({ children }: TelegramProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    try {
      // Инициализация Telegram WebApp
      WebApp.ready();
      WebApp.expand();
      
      // Получаем темное/светлое оформление
      const currentTheme = WebApp.colorScheme === 'dark' ? 'dark' : 'light';
      setTheme(currentTheme);
      
      // Получаем данные пользователя
      if (WebApp.initDataUnsafe?.user) {
        const telegramUser = WebApp.initDataUnsafe.user;
        
        setUser({
          id: telegramUser.id,
          username: telegramUser.username || `user${telegramUser.id}`,
          firstName: telegramUser.first_name || 'Пользователь',
          lastName: telegramUser.last_name || '',
          photoUrl: telegramUser.photo_url,
          completedQuests: 0, // Будет загружено с сервера позже
        });
      } else {
        setError('Не удалось получить данные пользователя');
      }
      
      // Слушаем изменения темы
      WebApp.onEvent('themeChanged', () => {
        setTheme(WebApp.colorScheme === 'dark' ? 'dark' : 'light');
      });
      
      // Предупреждение при закрытии
      WebApp.enableClosingConfirmation();
      
    } catch (err) {
      setError('Ошибка при инициализации Telegram WebApp');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <TelegramContext.Provider value={{ user, isLoading, error, theme }}>
      {children}
    </TelegramContext.Provider>
  );
}; 