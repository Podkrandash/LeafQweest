import type { User, Quest, LeaderboardEntry, AppSettings } from '../types';
import { mockQuests, mockGlobalLeaderboard, mockWeeklyLeaderboard } from '../utils/mockData';

// Имитируем задержку сети
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API для пользователей
export const mockUserApi = {
  // Получить или создать пользователя
  getOrCreateUser: async (): Promise<User> => {
    await delay(800);
    
    // Создаем демонстрационного пользователя
    return {
      id: 12345678,
      username: 'demo_user',
      firstName: 'Демо',
      lastName: 'Пользователь',
      photoUrl: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
      completedQuests: 5,
    };
  },
  
  // Обновить настройки пользователя
  updateSettings: async (settings: AppSettings): Promise<User> => {
    await delay(1000);
    
    console.log('Настройки сохранены:', settings);
    
    return {
      id: 12345678,
      username: 'demo_user',
      firstName: 'Демо',
      lastName: 'Пользователь',
      photoUrl: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
      completedQuests: 5,
    };
  },
};

// Mock API для квестов
export const mockQuestApi = {
  // Получить все квесты
  getQuests: async (): Promise<Quest[]> => {
    await delay(1000);
    return mockQuests;
  },
  
  // Получить квест по ID
  getQuestById: async (id: number): Promise<Quest> => {
    await delay(800);
    
    const quest = mockQuests.find(q => q.id === id);
    if (!quest) {
      throw new Error('Квест не найден');
    }
    
    return quest;
  },
  
  // Выполнить квест
  completeQuest: async (questId: number, data: any): Promise<{ success: boolean }> => {
    await delay(1500);
    
    console.log(`Квест ${questId} выполнен. Данные:`, data);
    
    // Имитируем успешное выполнение квеста
    return { success: true };
  },
};

// Mock API для лидерборда
export const mockLeaderboardApi = {
  // Получить общий лидерборд
  getGlobalLeaderboard: async (): Promise<LeaderboardEntry[]> => {
    await delay(1200);
    return mockGlobalLeaderboard;
  },
  
  // Получить еженедельный лидерборд
  getWeeklyLeaderboard: async (): Promise<LeaderboardEntry[]> => {
    await delay(1200);
    return mockWeeklyLeaderboard;
  },
}; 