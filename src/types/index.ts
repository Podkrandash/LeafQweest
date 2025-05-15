// Интерфейс пользователя
export interface User {
  id: string | number;
  username: string;
  firstName: string;
  lastName: string;
  photoUrl?: string;
  completedQuests: number;
}

// Интерфейс настроек приложения
export interface AppSettings {
  theme: 'light' | 'dark';
  language: 'ru' | 'en';
  notifications: boolean;
}

// Интерфейс квеста
export interface Quest {
  id: number | string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  reward: number;
  type: 'GPS' | 'PHOTO' | 'BOTH';
  completed?: boolean;
}

// Интерфейс записи в таблице лидеров
export interface LeaderboardEntry {
  userId: string | number;
  username: string;
  score: number;
  completedQuests: number;
  isCurrentUser?: boolean;
}

// Типы для модулей
export type MapCoordinates = {
  latitude: number;
  longitude: number;
};

// Позиция на карте
export interface Position {
  latitude: number;
  longitude: number;
}

// Ответы API
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
} 