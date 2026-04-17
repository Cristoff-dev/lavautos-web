import { useState, useCallback } from 'react';
import { 
    API_PROV_OBTENER, 
    API_PROV_CREAR, 
    API_PROV_ACTUALIZAR, 
    API_PROV_ELIMINAR,
    API_PROV_REPORTE
} from '../api/apiProveedores';

export interface Proveedor {
    id: string;
    rif: string;
    nombre: string;
    telefono: string;
    email: string;
    activo: boolean;
}

const mapearProveedor = (item: any): Proveedor => ({
    id: String(item.id),
    rif: item.rif || '',
    nombre: item.nombre || 'Sin nombre',
    telefono: item.telefono || '',
    email: item.email || '',
    activo: Boolean(item.activo)
});

export const useProveedores = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const listar = useCallback(async (): Promise<Proveedor[]> => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(API_PROV_OBTENER);
            if (!res.ok) throw new Error('Error al listar proveedores');
            const data = await res.json();
            const list = data.details || data.data || data;
            return Array.isArray(list) ? list.map(mapearProveedor) : [];
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const registrar = async (proveedor: Omit<Proveedor, 'id'>): Promise<Proveedor> => {
        const res = await fetch(API_PROV_CREAR, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(proveedor)
        });
        if (!res.ok) throw new Error('Error al registrar proveedor');
        const data = await res.json();
        return mapearProveedor(data.details || data.data || data);
    };

    const actualizar = async (id: string, proveedor: Partial<Proveedor>): Promise<Proveedor> => {
        const { id: _, ...datosBody } = proveedor as any;
        const res = await fetch(`${API_PROV_ACTUALIZAR}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosBody)
        });
        if (!res.ok) throw new Error('Error al actualizar proveedor');
        const data = await res.json();
        return mapearProveedor(data.details || data.data || data);
    };

    const eliminar = async (id: string): Promise<void> => {
        const res = await fetch(`${API_PROV_ELIMINAR}/${id}`, {
            method: 'DELETE'
        });
        if (!res.ok) throw new Error('Error al eliminar proveedor');
    };

    const exportarReporte = async (): Promise<void> => {
        try {
            const res = await fetch(API_PROV_REPORTE, { method: 'GET' });
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
