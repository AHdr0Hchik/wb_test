// src/index.ts
import { config } from 'dotenv';
import { setupLogger } from './config/logger.js';
import { db } from './config/database.js';
import { WbApiService } from './services/wb-api.service.js';
import { DbService } from './services/db.service.js';
import { GoogleSheetsService } from './services/google-sheets.service.js';
import { AppService } from './services/app.service.js';

// Загрузка переменных окружения
config();

// Инициализация логгера
const logger = setupLogger();

// Инициализация сервисов
const wbApi = new WbApiService(process.env.WB_API_TOKEN!);
const dbService = new DbService(db);
const googleSheets = new GoogleSheetsService(JSON.parse(process.env.GOOGLE_CREDENTIALS!));

// Список ID Google таблиц
const spreadsheetIds = process.env.SPREADSHEET_IDS!.split(',');

// Запуск приложения
// Проверка подключения к базе данных
dbService.testConnection()
    .then(isConnected => {
        if (isConnected) {
            logger.info('Успешное подключение к базе данных');
        } else {
            logger.warn('Не удалось подключиться к базе данных. Приложение может работать некорректно.');
        }
        
        // Запуск приложения в любом случае
        const app = new AppService(wbApi, dbService, googleSheets, logger, spreadsheetIds);
        return app.start();
    })
    .then(() => {
        logger.info('Приложение успешно запущено');
    })
    .catch(error => {
        logger.error('Ошибка запуска приложения:', error);
    });