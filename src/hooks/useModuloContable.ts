import { useState, useCallback } from 'react';
import { ModuloContableService } from '../services/apiModuloContable';
import type { TransaccionContable, TransaccionDTO, ResumenFinanciero } from '../models/modulocontable';

export const useModuloContable = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const listar = useCallback(async (): Promise<TransaccionContable[]> => {
        setLoading(true);
        setError(null);
        try {
            const res = await ModuloContableService.getHistory();
            return res;
        } catch (err: any) {
            console.error("Error al listar transacciones", err);
            setError(err.message || "Error al cargar el historial");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const obtenerResumen = useCallback(async (): Promise<ResumenFinanciero> => {
        try {
            const res = await ModuloContableService.getResumen();
            return res;
        } catch (err: any) {
            console.error("Error al obtener resumen", err);
            throw err;
        }
    }, []);

    const registrar = async (data: TransaccionDTO): Promise<TransaccionContable> => {
        try {
            const res = await ModuloContableService.create(data);
            return res;
        } catch (err: any) {
            console.error("Error al registrar transacción", err);
            throw err;
        }
    };

    const actualizar = async (id: number, data: Partial<TransaccionDTO>): Promise<TransaccionContable> => {
        try {
            const res = await ModuloContableService.update(id, data);
            return res;
        } catch (err: any) {
            console.error("Error al actualizar transacción", err);
            throw err;
        }
    };

    const eliminar = async (id: number): Promise<void> => {
        try {
            await ModuloContableService.delete(id);
        } catch (err: any) {
            console.error("Error al eliminar transacción", err);
            throw err;
        }
    };

    return { listar, obtenerResumen, registrar, actualizar, eliminar, loading, error };
};
