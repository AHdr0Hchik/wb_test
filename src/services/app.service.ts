// src/services/app.service.ts
import { WbApiService } from './wb-api.service.js';
import { DbService } from './db.service.js';
import { GoogleSheetsService } from './google-sheets.service.js';
import { schedule } from 'node-cron';
import { Logger } from 'log4js';

export class AppService {
    constructor(
        private readonly wbApi: WbApiService,
        private readonly db: DbService,
        private readonly googleSheets: GoogleSheetsService,
        private readonly logger: Logger,
        private readonly spreadsheetIds: string[]
    ) {}

    async start(): Promise<void> {
        // Запуск сбора данных каждый час
        schedule('0 * * * *', () => this.collectData());
        
        // Запуск выгрузки в Google Sheets каждый день в 00:05
        schedule('5 0 * * *', () => this.exportToGoogleSheets());
    }



    private async collectData(): Promise<void> {
        try {
            const tariffs = await this.wbApi.getTariffs(new Date().toISOString().split('T')[0]);
            const today = new Date();
            await this.db.upsertTariffs(tariffs, today);
            this.logger.info(`Data collected successfully at ${today}`);
        } catch (error) {
            this.logger.error('Error collecting data:', error);
        }
    }

    private async exportToGoogleSheets(): Promise<void> {
        try {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            const tariffs = await this.db.getTariffsByDate(yesterday);
            for (const spreadsheetId of this.spreadsheetIds) {
                await this.googleSheets.updateSheet(spreadsheetId, tariffs);
                this.logger.info(`Data exported to spreadsheet ${spreadsheetId}`);
            }
        } catch (error) {
            this.logger.error('Error exporting to Google Sheets:', error);
        }
    }
}