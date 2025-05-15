import type { Quest, LeaderboardEntry } from '../types';

// Мок-данные для квестов
export const mockQuests: Quest[] = [
  // Москва
  {
    id: 1,
    title: 'Загадка Александровского сада',
    description: 'Найдите грот в Александровском саду и сделайте фото с фонтаном «Рутичка».',
    latitude: 55.7520,
    longitude: 37.6175,
    reward: 100,
    type: 'BOTH',
  },
  {
    id: 2,
    title: 'Тайны Воробьевых гор',
    description: 'Поднимитесь на смотровую площадку МГУ и найдите секретную лестницу.',
    latitude: 55.7036,
    longitude: 37.5318,
    reward: 150,
    type: 'GPS',
  },
  {
    id: 3,
    title: 'Секретное граффити Хохловки',
    description: 'Найдите граффити с изображением сов на Хохловской площади.',
    latitude: 55.7594,
    longitude: 37.6475,
    reward: 120,
    type: 'PHOTO',
  },
  
  // Санкт-Петербург
  {
    id: 4,
    title: 'Атланты держат небо',
    description: 'Сделайте фото с атлантами Эрмитажа на закате.',
    latitude: 59.9398,
    longitude: 30.3146,
    reward: 200,
    type: 'BOTH',
  },
  {
    id: 5,
    title: 'Тайны Петропавловки',
    description: 'Найдите тайную комнату в Петропавловской крепости с картой города.',
    latitude: 59.9502,
    longitude: 30.3162,
    reward: 180,
    type: 'GPS',
  },
  
  // Казань
  {
    id: 6,
    title: 'Символы Казани',
    description: 'Найдите все 7 символов Казанского кремля и сделайте фото с котом Казанским.',
    latitude: 55.7989,
    longitude: 49.1064,
    reward: 120,
    type: 'BOTH',
  },
  
  // Екатеринбург
  {
    id: 7,
    title: 'Граница Европы и Азии',
    description: 'Сделайте фото одновременно стоя в двух частях света.',
    latitude: 56.8519,
    longitude: 60.6122,
    reward: 150,
    type: 'PHOTO',
  },
  
  // Сочи
  {
    id: 8,
    title: 'Олимпийский секрет',
    description: 'Найдите все 5 олимпийских колец в Олимпийском парке и раскройте загадку.',
    latitude: 43.4036,
    longitude: 39.9553,
    reward: 130,
    type: 'GPS',
  },
  
  // Калининград
  {
    id: 9,
    title: 'Тайна янтарной комнаты',
    description: 'Найдите кусочки янтаря на пляже и составьте из них фигуру.',
    latitude: 54.7065,
    longitude: 20.5109,
    reward: 180,
    type: 'BOTH',
  },
  
  // Владивосток
  {
    id: 10,
    title: 'Восточные ворота России',
    description: 'Доберитесь до маяка на мысе Эгершельд и сделайте фото с видом на Золотой мост.',
    latitude: 43.1198,
    longitude: 131.8869,
    reward: 200,
    type: 'PHOTO',
  },
  
  // Новосибирск
  {
    id: 11,
    title: 'Секреты Академгородка',
    description: 'Найдите загадочные формулы на стенах институтов СО РАН и расшифруйте их.',
    latitude: 54.8433,
    longitude: 83.1893,
    reward: 150,
    type: 'GPS',
  },
  
  // Нижний Новгород
  {
    id: 12,
    title: 'Тайны Кремля',
    description: 'Пройдите по всем башням Нижегородского Кремля и найдите секретный символ.',
    latitude: 56.3286,
    longitude: 44.0020,
    reward: 160,
    type: 'BOTH',
  },
  
  // Севастополь
  {
    id: 13,
    title: 'Морские легенды',
    description: 'Посетите 3 бухты Севастополя и соберите истории от местных рыбаков.',
    latitude: 44.5983,
    longitude: 33.5362,
    reward: 170,
    type: 'GPS',
  },
  
  // Красноярск
  {
    id: 14,
    title: 'Загадка столбов',
    description: 'Поднимитесь на Красноярские столбы и найдите скалу с отпечатком древнего растения.',
    latitude: 55.9692,
    longitude: 92.7964,
    reward: 190,
    type: 'BOTH',
  },
  
  // Ростов-на-Дону
  {
    id: 15,
    title: 'Донские мотивы',
    description: 'Сделайте фото 5 разных скульптур на набережной реки Дон.',
    latitude: 47.2088,
    longitude: 39.6249,
    reward: 140,
    type: 'PHOTO',
  },
  
  // Иркутск
  {
    id: 16,
    title: 'Тайны Байкала',
    description: 'Найдите камень желаний на берегу Байкала и загадайте желание.',
    latitude: 52.2862,
    longitude: 104.3055,
    reward: 220,
    type: 'GPS',
  },
  
  // Саратов
  {
    id: 17,
    title: 'Мелодия Волги',
    description: 'Запишите звуки 3 разных мест на Волжской набережной и создайте мелодию.',
    latitude: 51.5300,
    longitude: 46.0354,
    reward: 130,
    type: 'BOTH',
  },
  
  // Уфа
  {
    id: 18,
    title: 'Башкирские узоры',
    description: 'Сфотографируйте 7 различных башкирских орнаментов на зданиях Уфы.',
    latitude: 54.7355,
    longitude: 55.9910,
    reward: 160,
    type: 'PHOTO',
  },
  
  // Челябинск
  {
    id: 19,
    title: 'Метеоритный путь',
    description: 'Пройдите по траектории падения Челябинского метеорита и найдите осколки.',
    latitude: 55.1604,
    longitude: 61.4007,
    reward: 170,
    type: 'GPS',
  },
  
  // Тюмень
  {
    id: 20,
    title: 'Сибирские мосты',
    description: 'Пройдите по всем мостам через реку Туру и сделайте фото каждого.',
    latitude: 57.1537,
    longitude: 65.5412,
    reward: 150,
    type: 'BOTH',
  }
];

// Мок-данные для лидерборда
export const mockGlobalLeaderboard: LeaderboardEntry[] = [
  {
    userId: 123456789,
    username: 'Алексей98',
    score: 1250,
    completedQuests: 17,
  },
  {
    userId: 987654321,
    username: 'ЕкатеринаМ',
    score: 980,
    completedQuests: 14,
  },
  {
    userId: 456789123,
    username: 'Путешественник',
    score: 850,
    completedQuests: 12,
  },
  {
    userId: 159753486,
    username: 'Искатель',
    score: 730,
    completedQuests: 10,
  },
  {
    userId: 852963741,
    username: 'ГородовИлья',
    score: 620,
    completedQuests: 8,
  },
  {
    userId: 741852963,
    username: 'АннаВолгина',
    score: 580,
    completedQuests: 7,
  },
  {
    userId: 369258147,
    username: 'МаксимБ',
    score: 520,
    completedQuests: 7,
  },
  {
    userId: 258147369,
    username: 'Странник42',
    score: 480,
    completedQuests: 6,
  },
  {
    userId: 147258369,
    username: 'ДарьяЛ',
    score: 420,
    completedQuests: 5,
  },
  {
    userId: 963852741,
    username: 'ГеоФинкер',
    score: 350,
    completedQuests: 4,
  },
];

// Мок-данные для недельного лидерборда
export const mockWeeklyLeaderboard: LeaderboardEntry[] = [
  {
    userId: 456789123,
    username: 'Путешественник',
    score: 320,
    completedQuests: 4,
  },
  {
    userId: 123456789,
    username: 'Алексей98',
    score: 250,
    completedQuests: 3,
  },
  {
    userId: 852963741,
    username: 'ГородовИлья',
    score: 210,
    completedQuests: 3,
  },
  {
    userId: 987654321,
    username: 'ЕкатеринаМ',
    score: 180,
    completedQuests: 2,
  },
  {
    userId: 159753486,
    username: 'Искатель',
    score: 150,
    completedQuests: 2,
  },
  {
    userId: 741852963,
    username: 'АннаВолгина',
    score: 130,
    completedQuests: 2,
  },
  {
    userId: 369258147,
    username: 'МаксимБ',
    score: 110,
    completedQuests: 1,
  },
  {
    userId: 258147369,
    username: 'Странник42',
    score: 90,
    completedQuests: 1,
  },
  {
    userId: 147258369,
    username: 'ДарьяЛ',
    score: 80,
    completedQuests: 1,
  },
  {
    userId: 963852741,
    username: 'ГеоФинкер',
    score: 70,
    completedQuests: 1,
  },
];

// Мок-данные для лидерборда в объединенном формате
export const mockLeaderboardData = {
  global: mockGlobalLeaderboard,
  weekly: mockWeeklyLeaderboard
};

// Мок-данные для квестов в общем формате
export const mockQuestsData = mockQuests; 