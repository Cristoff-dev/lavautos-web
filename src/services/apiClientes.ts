import api from './api';
import type { Cliente, ClienteDTO } from '../models/cliente';

export const ClienteService = {
    // Traer todos los clientes
    getAll: async () => {
        const response = await api.get<{ details: Cliente[] }>('/clients');
        return response.data.details;
    },

    // Buscar por cédula
    getByCedula: async (cedula: string) => {
        const response = await api.get<{ details: Cliente }>(`/clients/search/${cedula}`);
        return response.data.details;
    },

    // Crear nuevo cliente
    create: async (data: ClienteDTO) => {
        const response = await api.post('/clients', data);
        return response.data.details;
    },

    // Editar cliente
    update: async (id: number, data: Partial<ClienteDTO>) => {
        const response = await api.patch(`/clients/${id}`, data);
        return response.data.details;
    },

    // Desactivar cliente (Eliminación lógica)
    desactivate: async (id: number) => {
        const response = await api.delete(`/clients/${id}`);
        return response.data.details;
    },

    // Reactivar cliente
    reactivate: async (id: number) => {
        const response = await api.patch(`/clients/restore/${id}`, {});
        return response.data.details;
    },

    // Generar reporte
    exportReport: async () => {
        const response = await api.get('/clients/reportes/pdf', {
            responseType: 'blob'
        });
        return response.data;
    }
};
