interface Tariff {
    warehouseId: number;
    warehouseName: string;
    coefficient: number;
    boxDeliveryBase: number;
    boxDeliveryLiter: number;
    boxStorageBase: number;
    boxStorageLiter: number;
}

export interface TariffRecord extends Tariff {
    id: number;
    date: string;
    createdAt: Date;
}