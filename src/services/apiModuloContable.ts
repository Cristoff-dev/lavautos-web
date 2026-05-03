import api from './api';
import type { TransaccionContable, TransaccionDTO, ResumenFinanciero } from '../models/modulocontable';

export const ModuloContableService = {
    // Obtener historial
    getHistory: async () => {
        const response = await api.get<{ details: TransaccionContable[] }>('/finance/history');
        return response.data.details;
    },

    // Obtener resumen
    getResumen: async () => {
        const response = await api.get<{ details: ResumenFinanciero }>('/finance/balance');
        return response.data.details;
    },

    // Crear nuevo asiento
    create: async (data: TransaccionDTO) => {
        const response = await api.post('/finance/transactions', data);
        return response.data.details;
    },

    // Editar asiento
    update: async (id: number, data: Partial<TransaccionDTO>) => {
        const response = await api.put(`/finance/${id}`, data);
        return response.data.details;
    },

    // Eliminar asiento
    delete: async (id: number) => {
        const response = await api.delete(`/finance/${id}`);
        return response.data;
    }
};
// pene jijiji