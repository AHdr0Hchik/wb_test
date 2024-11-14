// src/services/db.service.ts
import { Knex } from 'knex';
import { TariffRecord, Tariff } from '../types/tariff.js';

export class DbService {
    constructor(private readonly knex: Knex) {}
    
    async testConnection(): Promise<boolean> {
        try {
            
            return true;
        } catch (error) {
            return false;
        }
    }

    async upsertTariffs(tariffs: Tariff[], date: Date): Promise<void> {
        await this.knex.transaction(async (trx) => {
            for (const tariff of tariffs) {
                await trx('tariffs')
                    .insert({
                        date,
                        warehouse_id: tariff.warehouseId,
                        warehouse_name: tariff.warehouseName,
                        coefficient: tariff.coefficient,
                        box_delivery_base: tariff.boxDeliveryBase,
                        box_delivery_liter: tariff.boxDeliveryLiter,  
                        box_storage_base: tariff.boxStorageBase,      
                        box_storage_liter: tariff.boxStorageLiter      
                    })
                    .onConflict(['date', 'warehouse_id'])
                    .merge();
            }
        });
    }

    async getTariffsByDate(date: Date): Promise<TariffRecord[]> {
        const results = await this.knex('tariffs')
            .where('date', date)
            .orderBy('coefficient', 'asc');
    
        return results.map(record => ({
            id: record.id,
            date: record.date.toLocaleString('ru-RU', { timeZone: 'Europe/Moscow', year: 'numeric', month: '2-digit', day: '2-digit' }),
            warehouseId: record.warehouse_id,
            warehouseName: record.warehouse_name,
            coefficient: record.coefficient,
            boxDeliveryBase: record.box_delivery_base,
            boxDeliveryLiter: record.box_delivery_liter,
            boxStorageBase: record.box_storage_base,
            boxStorageLiter: record.box_storage_liter,
            createdAt: record.created_at
        }));
    }

    // Дополнительные вспомогательные методы
    async deleteTariffsByDate(date: Date): Promise<void> {
        await this.knex('tariffs')
            .where('date', date)
            .delete();
    }

    async getTariffsByDateRange(startDate: Date, endDate: Date): Promise<TariffRecord[]> {
        const results = await this.knex('tariffs')
            .whereBetween('date', [startDate, endDate])
            .orderBy(['date', 'coefficient']);

        return results.map(record => ({
            id: record.id,
            date: record.date,
            warehouseId: record.warehouse_id,
            warehouseName: record.warehouse_name,
            coefficient: record.coefficient,
            boxDeliveryBase: record.box_delivery_base,
            boxDeliveryLiter: record.box_delivery_liter,
            boxStorageBase: record.box_storage_base,
            boxStorageLiter: record.box_storage_liter,
            createdAt: record.created_at
        }));
    }
}