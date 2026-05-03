export interface TransaccionContable {
    id: number;
    fecha: string;
    categoria: string;
    monto: number;
    descripcion: string;
    vehiculoId?: number | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface TransaccionDTO {
    categoria: string;
    monto: number;
    descripcion: string;
    vehiculoId?: number | null;
}

export interface ResumenFinanciero {
    totalIngresos: number;
    totalEgresos: number;
    balance: number;
}
