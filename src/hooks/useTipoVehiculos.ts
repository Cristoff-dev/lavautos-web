import { TipoVehiculoService } from '../services/apiTipoVehiculo';
import type { TipoVehiculo, TipoVehiculoDTO } from '../models/tipoVehiculo';

export const useTipoVehiculos = () => {
    const listar = async (): Promise<TipoVehiculo[]> => {
        try {
            const res = await TipoVehiculoService.getAll();
            return res;
        } catch (error) {
            console.error("Error al listar tipos de vehículos", error);
            throw error;
        }
    };

    const registrar = async (data: TipoVehiculoDTO): Promise<TipoVehiculo> => {
        try {
            const res = await TipoVehiculoService.create(data);
            return res;
        } catch (error) {
            console.error("Error al registrar tipo de vehículo", error);
            throw error;
        }
    };

    const actualizar = async (id: number, data: Partial<TipoVehiculoDTO>): Promise<TipoVehiculo> => {
        try {
            const res = await TipoVehiculoService.update(id, data);
            return res;
        } catch (error) {
            console.error("Error al actualizar tipo de vehículo", error);
            throw error;
        }
    };

    const desactivar = async (id: number): Promise<void> => {
        try {
            await TipoVehiculoService.desactivate(id);
        } catch (error) {
            console.error("Error al desactivar tipo de vehículo", error);
            throw error;
        }
    };

    const reactivar = async (id: number): Promise<void> => {
        try {
            await TipoVehiculoService.reactivate(id);
        } catch (error) {
            console.error("Error al reactivar tipo de vehículo", error);
            throw error;
        }
    };

    const exportarReporte = async (): Promise<void> => {
        try {
            const blob = await TipoVehiculoService.downloadPdf();
            const url = window.URL.createObjectURL(blob);
            window.open(url, '_blank');
        } catch (error) {
            console.error("Error al exportar reporte", error);
            alert("No se pudo descargar el reporte.");
        }
    };

    return { listar, registrar, actualizar, desactivar, reactivar, exportarReporte };
};