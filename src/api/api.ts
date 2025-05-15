import { mockLeaderboardData, mockQuestsData } from '../utils/mockData';
import type { Quest, LeaderboardEntry, AppSettings, User } from '../types';

// Интерфейс для типов таблицы лидеров
type LeaderboardType = 'global' | 'weekly';

// Базовый класс для API клиента
class ApiClient {
  protected baseUrl: string;
  protected useMocks: boolean;
  
  constructor() {
    // В реальном приложении здесь будет URL вашего API
    this.baseUrl = 'https://api.leafqest.ru';
    // Для разработки используем моки данных
    this.useMocks = true;
  }
  
  // Общий метод для выполнения запросов к API
  protected async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // Если используем мок-данные, возвращаем их
    if (this.useMocks) {
      return this.getMockData<T>(endpoint);
    }
    
    // Иначе делаем реальный запрос
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        },
        ...options
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }
  
  // Метод для получения мок-данных вместо реальных запросов
  protected getMockData<T>(endpoint: string): Promise<T> {
    // Имитируем задержку сети
    return new Promise((resolve) => {
      setTimeout(() => {
        // Возвращаем разные мок-данные в зависимости от эндпоинта
        if (endpoint.includes('/quests')) {
          resolve(mockQuestsData as unknown as T);
        } else if (endpoint.includes('/leaderboard/global')) {
          resolve(mockLeaderboardData.global as unknown as T);
        } else if (endpoint.includes('/leaderboard/weekly')) {
          resolve(mockLeaderboardData.weekly as unknown as T);
        } else {
          resolve({} as T);
        }
      }, 800); // Добавляем задержку чтобы имитировать реальный запрос
    });
  }
}

// Класс для работы с квестами
class QuestApi extends ApiClient {
  async getQuests(): Promise<Quest[]> {
    return this.request<Quest[]>('/quests');
  }
  
  async completeQuest(questId: string | number): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/quests/${questId}/complete`, {
      method: 'POST'
    });
  }
  
  async verifyPhotoQuest(questId: string | number, photo: File): Promise<{ success: boolean }> {
    const formData = new FormData();
    formData.append('photo', photo);
    
    return this.request<{ success: boolean }>(`/quests/${questId}/verify`, {
      method: 'POST',
      body: formData,
      headers: {} // Формат FormData не требует Content-Type
    });
  }
}

// Класс для работы с данными пользователя
class UserApi extends ApiClient {
  async getUserProfile(): Promise<User> {
    return this.request<User>('/user/profile');
  }
  
  async updateSettings(settings: AppSettings): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>('/user/settings', {
      method: 'POST',
      body: JSON.stringify(settings)
    });
  }
}

// Класс для работы с таблицей лидеров
class LeaderboardApi extends ApiClient {
  async getLeaderboard(type: LeaderboardType): Promise<LeaderboardEntry[]> {
    return this.request<LeaderboardEntry[]>(`/leaderboard/${type}`);
  }
}

// Основной API объект, объединяющий все методы
export const api = {
  // Методы для квестов
  getQuests: async (): Promise<Quest[]> => {
    const questApi = new QuestApi();
    return questApi.getQuests();
  },
  
  completeQuest: async (questId: string): Promise<{ success: boolean }> => {
    const questApi = new QuestApi();
    return questApi.completeQuest(questId);
  },
  
  verifyPhotoQuest: async (questId: string, photo: File): Promise<{ success: boolean }> => {
    const questApi = new QuestApi();
    return questApi.verifyPhotoQuest(questId, photo);
  },
  
  // Методы для таблицы лидеров
  getLeaderboard: async (type: LeaderboardType): Promise<LeaderboardEntry[]> => {
    const leaderboardApi = new LeaderboardApi();
    return leaderboardApi.getLeaderboard(type);
  },
  
  // Методы для пользователя
  getUserProfile: async (): Promise<User> => {
    const userApi = new UserApi();
    return userApi.getUserProfile();
  },
  
  updateSettings: async (settings: AppSettings): Promise<{ success: boolean }> => {
    const userApi = new UserApi();
    return userApi.updateSettings(settings);
  }
};

// Также экспортируем индивидуальные API для использования по отдельности
export const questApi = new QuestApi();
export const userApi = new UserApi();
export const leaderboardApi = new LeaderboardApi(); 