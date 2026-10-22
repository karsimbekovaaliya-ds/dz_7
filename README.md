# Доска объявлений (React + TypeScript)

Бэкенд: https://inai-col1.fishrungames.com/ads

## Локально
```
npm install
npm run dev
```

## Деплой
1. Создай репозиторий на GitHub, запушь проект в ветку `main`.
2. Settings → Pages → Source: **GitHub Actions**.
3. Push в `main` запускает `.github/workflows/deploy.yml`.
4. Сайт: `https://<логин>.github.io/<репозиторий>/` — открой и проверь после деплоя.

Если поля API отличаются, поправь `normalize()` в `src/api.ts`.
