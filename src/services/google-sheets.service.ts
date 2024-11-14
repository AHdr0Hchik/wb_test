// src/services/google-sheets.service.ts
import { google } from 'googleapis';
import { TariffRecord } from '../types/tariff.js';

export class GoogleSheetsService {
    private readonly auth;
    
    constructor(credentials: any) {
        this.auth = new google.auth.GoogleAuth({
            credentials,
            scopes: ['https://www.googleapis.com/auth/spreadsheets']
        });
    }

    async updateSheet(spreadsheetId: string, tariffs: TariffRecord[]): Promise<void> {
        const sheets = google.sheets({ version: 'v4', auth: this.auth });
        // Проверяем существование листа и создаем его при необходимости
        try {
            await this.ensureSheetExists(sheets, spreadsheetId, `${process.env.SHEET_NAME}-${tariffs[0].date}`);
        } catch (error) {
            console.error('Error ensuring sheet exists:', error);
            throw error;
        }

        // Сортировка данных по коэффициенту
        const sortedTariffs = tariffs.sort((a, b) => a.coefficient - b.coefficient);
        // Подготовка данных для записи
        const values = sortedTariffs.map(tariff => [
            tariff.date,
            tariff.warehouseId,
            tariff.warehouseName,
            tariff.coefficient
        ]);

        // Добавляем заголовки
        const headers = [['Дата', 'ID склада', 'Название склада', 'Коэффициент']];
        const allValues = [...headers, ...values];
        try {
            await sheets.spreadsheets.values.update({
                spreadsheetId,
                range: `'${process.env.SHEET_NAME}-${tariffs[0].date}'!A1`, // Изменили диапазон и добавили кавычки
                valueInputOption: 'RAW',
                requestBody: { values: allValues }
            });
        } catch (error) {
            console.error('Error updating sheet:', error);
            throw error;
        }
    }

    private async ensureSheetExists(sheets: any, spreadsheetId: string, sheetTitle: string): Promise<void> {
        try {
            // Получаем информацию о таблице
            const spreadsheet = await sheets.spreadsheets.get({
                spreadsheetId
            });

            // Проверяем, существует ли лист
            const sheetExists = spreadsheet.data.sheets.some(
                (sheet: any) => sheet.properties.title === sheetTitle
            );

            // Если лист не существует, создаем его
            if (!sheetExists) {
                await sheets.spreadsheets.batchUpdate({
                    spreadsheetId,
                    requestBody: {
                        requests: [{
                            addSheet: {
                                properties: {
                                    title: sheetTitle
                                }
                            }
                        }]
                    }
                });
            }
        } catch (error) {
            console.error('Error in ensureSheetExists:', error);
            throw error;
        }
    }
}