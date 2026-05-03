import { useState, useCallback } from 'react';
import { ClienteService } from '../services/apiClientes';
import type { Cliente, ClienteDTO } from '../models/cliente';

export const useClientes = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const listar = useCallback(async (): Promise<Cliente[]> => {
        setLoading(true);
        setError(null);
        try {
            const res = await ClienteService.getAll();
            return res;
        } catch (err: any) {
            console.error("Error al listar clientes", err);
            setError(err.message || "Error al cargar la lista de clientes");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const buscarPorCedula = async (cedula: string): Promise<Cliente> => {
        try {
            const res = await ClienteService.getByCedula(cedula);
            return res;
        } catch (err: any) {
            console.error("Error al buscar cliente por cédula", err);
            throw err;
        }
    };

    const registrar = async (data: ClienteDTO): Promise<Cliente> => {
        try {
            const res = await ClienteService.create(data);
            return res;
        } catch (err: any) {
            console.error("Error al registrar cliente", err);
            throw err;
        }
    };

    const actualizar = async (id: number, data: Partial<ClienteDTO>): Promise<Cliente> => {
        try {
            const res = await ClienteService.update(id, data);
            return res;
        } catch (err: any) {
            console.error("Error al actualizar cliente", err);
            throw err;
        }
    };

    const desactivar = async (id: number): Promise<void> => {
        try {
            await ClienteService.desactivate(id);
        } catch (err: any) {
            console.error("Error al desactivar cliente", err);
            throw err;
        }
    };

    const reactivar = async (id: number): Promise<void> => {
        try {
            await ClienteService.reactivate(id);
        } catch (err: any) {
            console.error("Error al reactivar cliente", err);
            throw err;
        }
    };

    const exportarReporte = async () => {
        try {
            const blob = await ClienteService.exportReport();
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'reporte_clientes.pdf');
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
        } catch (err) {
            console.error("Error descargando reporte", err);
            alert("No se pudo descargar el reporte.");
        }
    };

    return { listar, buscarPorCedula, registrar, actualizar, desactivar, reactivar, exportarReporte, loading, error };
};
