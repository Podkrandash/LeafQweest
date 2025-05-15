import { useState, useEffect } from 'react';

/**
 * Хук для работы с состоянием, которое кэшируется в памяти между рендерами
 * @param initialState Начальное значение состояния
 * @param cacheKey Ключ для кэширования (должен быть уникальным)
 * @returns Массив [состояние, функция установки состояния] (аналогично useState)
 */
export function useCachedState<T>(initialState: T, cacheKey: string): [T, React.Dispatch<React.SetStateAction<T>>] {
  // Кэш для хранения состояний между рендерами компонентов
  const cacheMap: Record<string, any> = (window as any).__STATE_CACHE || {};
  if (!(window as any).__STATE_CACHE) {
    (window as any).__STATE_CACHE = cacheMap;
  }

  // Инициализируем состояние из кэша или начальным значением
  const [state, setState] = useState<T>(() => {
    if (cacheKey in cacheMap) {
      return cacheMap[cacheKey];
    }
    return initialState;
  });

  // Обновляем кэш при изменении состояния
  useEffect(() => {
    cacheMap[cacheKey] = state;
  }, [state, cacheKey]);

  // Возвращаем состояние и функцию установки, как в обычном useState
  return [state, setState];
}