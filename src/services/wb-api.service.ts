import axios from 'axios';
import { Tariff } from '../types/tariff.js';
import { ApiResponse } from '../types/apiresponse.js';

export class WbApiService {
    private readonly token: string;
    private readonly baseUrl = 'https://common-api.wildberries.ru/api/v1';

    constructor(token: string) {
        this.token = token;
    }

    async getTariffs(date: string): Promise<Tariff[]> {
        const response = await axios.get<ApiResponse>(`${this.baseUrl}/tariffs/box`, {
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Accept': 'application/json'
            },
            params: {
                date
            }
        });
    
        return response.data.response.data.warehouseList.map((warehouse, index) => ({
            warehouseId: index + 1,
            warehouseName: warehouse.warehouseName,
            coefficient: parseFloat(warehouse.boxDeliveryAndStorageExpr),
            boxDeliveryBase: parseFloat(warehouse.boxDeliveryBase.replace(',', '.')),
            boxDeliveryLiter: parseFloat(warehouse.boxDeliveryLiter.replace(',', '.')),
            boxStorageBase: warehouse.boxStorageBase === '-' ? 0 : parseFloat(warehouse.boxStorageBase.replace(',', '.')),
            boxStorageLiter: warehouse.boxStorageLiter === '-' ? 0 : parseFloat(warehouse.boxStorageLiter.replace(',', '.'))
        }));
    }
}