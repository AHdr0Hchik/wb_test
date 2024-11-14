# WB Tariffs Collector

Сервис для сбора и экспорта тарифов Wildberries

## Требования

- Docker
- Docker Compose

## Установка и запуск

1. Клонировать репозиторий
2. Внести в файл env-example.txt следующие переменные:
WB_API_TOKEN=Ваш API-ключ
GOOGLE_CREDENTIALS={"your":"credentials"}
SPREADSHEET_IDS= Айди таблиц через запятую
3. Переименовать env-example.txt в .env


3. Запустить приложение:
docker-compose up -d