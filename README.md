# Rental Car

Веб-додаток для оренди автомобілів на Next.js 14 з TypeScript.

## Опис

Сайт для перегляду та бронювання автомобілів. Можна фільтрувати автомобілі за брендом, ціною та пробігом, додавати в обране та бронювати оренду.

## Технології

- Next.js 14
- TypeScript
- Zustand
- Axios
- CSS Modules

## Встановлення

```bash
npm install
npm run dev
```

Відкрийте [http://localhost:3000](http://localhost:3000) у браузері.

## Структура проєкту

- `app/` - сторінки
- `components/` - React компоненти
- `lib/` - API та сервіси
- `store/` - Zustand store
- `types/` - TypeScript типи

## API

Використовується API: `https://car-rental-api.goit.global`

## Маршрути

- `/` - Головна сторінка
- `/catalog` - Каталог автомобілів
- `/catalog/:id` - Деталі автомобіля

## Деплой

Проект готовий до деплою на Vercel або Netlify.

## Автор

Проект розроблено як тестове завдання.
