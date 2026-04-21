import api from './api';
import type { TipoVehiculo, TipoVehiculoDTO } from '../models/tipoVehiculo';

export const TipoVehiculoService = {
  // Traer todos
  getAll: async () => {
    const response = await api.get<{ details: TipoVehiculo[] }>('/type-vehicles');
    return response.data.details;
  },

  // Crear nuevo
  create: async (data: TipoVehiculoDTO) => {
    const response = await api.post('/type-vehicles', data);
    return response.data.details;
  },

  // Editar
  update: async (id: number, data: Partial<TipoVehiculoDTO>) => {
    const response = await api.put(`/type-vehicles/${id}`, data);
    return response.data.details;
  },

  // Desactivar (Mover a inactivos)
  desactivate: async (id: number) => {
    const response = await api.patch(`/type-vehicles/desactivar/${id}`, {});
    return response.data.details;
  },

  // Reactivar
  reactivate: async (id: number) => {
    const response = await api.patch(`/type-vehicles/reactivar/${id}`, {});
    return response.data.details;
  },

  // Descargar PDF
  downloadPdf: async () => {
    const response = await api.get('/type-vehicles/reportes/pdf', { responseType: 'blob' });
    return response.data;
  }
  
};