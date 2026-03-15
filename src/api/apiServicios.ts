// Tipos internos del frontend (español)
export interface Servicio {
    id: string;
    nombre: string;
    precio: number;
    duracionMinutos: number;
    descripcion?: string;
}

// Tipo que devuelve el backend (inglés/mix)
interface ServicioBackend {
    id: number;
    nombre: string;
    precio: number;
    duracionMinutos?: number | null;
    descripcion?: string | null;
    esCombo: boolean;
    activo: boolean;
}

const BASE = `${import.meta.env.VITE_API_URL}/services`;

const mapear = (s: ServicioBackend): Servicio => ({
    id: String(s.id),
    nombre: s.nombre,
    precio: s.precio,
    duracionMinutos: s.duracionMinutos ?? 0,
    descripcion: s.descripcion ?? undefined,
});

export async function obtenerServicios(): Promise<Servicio[]> {
    const res = await fetch(BASE);
    if (!res.ok) throw new Error('Error al obtener servicios');
    const datos: ServicioBackend[] = await res.json();
    return datos.map(mapear);
}

export async function crearServicio(datos: Omit<Servicio, 'id'>): Promise<Servicio> {
    const res = await fetch(BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            nombre: datos.nombre,
            precio: datos.precio,
            duracionMinutos: datos.duracionMinutos,
            descripcion: datos.descripcion,
        }),
    });
    if (!res.ok) throw new Error('Error al crear servicio');
    return mapear(await res.json());
}

export async function actualizarServicio(id: string, datos: Omit<Servicio, 'id'>): Promise<Servicio> {
    const res = await fetch(`${BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            nombre: datos.nombre,
            precio: datos.precio,
            duracionMinutos: datos.duracionMinutos,
            descripcion: datos.descripcion,
        }),
    });
    if (!res.ok) throw new Error('Error al actualizar servicio');
    return mapear(await res.json());
}

export async function eliminarServicio(id: string): Promise<void> {
    const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Error al eliminar servicio');
}
