import { useState, useCallback } from 'react';
import { 
    API_SERV_OBTENER, 
    API_SERV_CREAR, 
    API_SERV_ACTUALIZAR, 
    API_SERV_ELIMINAR,
    API_SERV_REPORTE
} from '../api/apiServicios';

export interface Servicio {
    id: string;
    nombre: string;
    precio: number;
    duracionMinutos: number;
    descripcion: string;
    tipoVehiculo: string;
    activo: boolean;
}

const mapearServicio = (item: any): Servicio => ({
    id: String(item.id),
    nombre: item.nombre || 'Sin nombre',
    precio: Number(item.precio) || 0,
    duracionMinutos: Number(item.duracionMinutos) || 0,
    descripcion: item.descripcion || '',
    tipoVehiculo: item.tipoVehiculo || '',
    activo: Boolean(item.activo)
});

export const useServicios = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const listar = useCallback(async (): Promise<Servicio[]> => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(API_SERV_OBTENER);
            if (!res.ok) throw new Error('Error al listar servicios');
            const data = await res.json();
            const list = data.details || data.data || data;
            return Array.isArray(list) ? list.map(mapearServicio) : [];
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const registrar = async (servicio: Omit<Servicio, 'id'>): Promise<Servicio> => {
        const res = await fetch(API_SERV_CREAR, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(servicio)
        });
        if (!res.ok) throw new Error('Error al registrar servicio');
        const data = await res.json();
        return mapearServicio(data.details || data.data || data);
    };

    const actualizar = async (id: string, servicio: Partial<Servicio>): Promise<Servicio> => {
        const { id: _, ...datosBody } = servicio as any;
        const res = await fetch(`${API_SERV_ACTUALIZAR}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosBody)
        });
        if (!res.ok) throw new Error('Error al actualizar servicio');
        const data = await res.json();
        return mapearServicio(data.details || data.data || data);
    };

    const eliminar = async (id: string): Promise<void> => {
        const res = await fetch(`${API_SERV_ELIMINAR}/${id}`, {
            method: 'DELETE'
        });
        if (!res.ok) throw new Error('Error al eliminar servicio');
    };

    const exportarReporte = async (): Promise<void> => {
        try {
            const res = await fetch(API_SERV_REPORTE, { method: 'GET' });
            if (!res.ok) throw new Error('Error al generar el reporte');
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            window.open(url, '_blank');
        } catch (err) {
            console.error(err);
            alert("No se pudo descargar el reporte.");
        }
    };

    return { listar, registrar, actualizar, eliminar, exportarReporte, loading, error };
};
