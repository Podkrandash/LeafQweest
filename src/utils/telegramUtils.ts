import WebApp from '@twa-dev/sdk';

// Проверяет, запущено ли приложение внутри Telegram
export const isTelegramWebApp = (): boolean => {
  return Boolean(WebApp.initData);
};

// Показывает уведомление внутри Telegram
export const showNotification = (message: string): void => {
  if (isTelegramWebApp()) {
    WebApp.showPopup({
      title: 'Уведомление',
      message,
      buttons: [{ type: 'close' }]
    });
  } else {
    alert(message);
  }
};

// Управление кнопкой "Назад" в Telegram
export const backButtonUtils = {
  show: (): void => {
    if (isTelegramWebApp()) {
      WebApp.BackButton.show();
    }
  },
  
  hide: (): void => {
    if (isTelegramWebApp()) {
      WebApp.BackButton.hide();
    }
  },
  
  setCallback: (callback: () => void): void => {
    if (isTelegramWebApp()) {
      WebApp.BackButton.onClick(callback);
    }
  },
};

// Управление темой оформления
export const themeUtils = {
  isDarkTheme: (): boolean => {
    return WebApp.colorScheme === 'dark';
  },
  
  getThemeClass: (): string => {
    return WebApp.colorScheme === 'dark' ? 'dark' : 'light';
  },
};

// Отправка данных в бота Telegram
export const sendDataToBot = (data: any): void => {
  if (isTelegramWebApp()) {
    WebApp.sendData(JSON.stringify(data));
  }
};

// Закрытие приложения
export const closeApp = (): void => {
  if (isTelegramWebApp()) {
    WebApp.close();
  }
}; 