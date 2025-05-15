# LeafQuest

LeafQuest — гео-ориентированная игра в формате Telegram Web App, где пользователи выполняют квесты в реальном мире.

## Функциональность

- Авторизация через Telegram
- Интерактивная карта с квестами
- Выполнение заданий (GPS, фото)
- Профиль пользователя
- Лидерборд (рейтинги игроков)

## Технический стек

- Frontend: React, TypeScript, Leaflet.js
- Авторизация: Telegram Mini App Auth
- Стилизация: CSS

## Установка и запуск

### Предварительные требования

- Node.js v14 или выше
- npm или yarn

### Установка зависимостей

```bash
npm install
```

### Запуск в режиме разработки

```bash
npm run dev
```

Приложение будет запущено на [http://localhost:3000](http://localhost:3000)

### Сборка для продакшна

```bash
npm run build
```

## Интеграция с Telegram

Для интеграции с Telegram Web App необходимо:

1. Создать бота через [@BotFather](https://t.me/BotFather)
2. Настроить Webhook или использовать Long Polling для получения обновлений
3. Создать Telegram Web App через BotFather (команда /newapp)
4. Настроить URL для Web App, указав на ваш домен

## Особенности Telegram Web App

- Полноэкранное отображение
- Интеграция с Telegram Mini App SDK
- Поддержка тем оформления (темная/светлая)
- Поддержка кнопки "Back" из Telegram

## Структура проекта

```
src/
├── api/ - API-запросы к бэкенду
├── components/ - Переиспользуемые компоненты
├── contexts/ - Контексты React для состояния приложения
├── pages/ - Страницы приложения
├── types/ - TypeScript типы
└── utils/ - Вспомогательные функции
```

## Бэкенд API

Бэкенд API должен предоставлять следующие эндпоинты:

- `POST /api/users` - Создать или получить пользователя
- `PATCH /api/users/settings` - Обновить настройки пользователя
- `GET /api/quests` - Получить список квестов
- `GET /api/quests/:id` - Получить квест по ID
- `POST /api/quests/:id/complete` - Выполнить квест
- `GET /api/leaderboard/global` - Получить общий лидерборд
- `GET /api/leaderboard/weekly` - Получить еженедельный лидерборд
