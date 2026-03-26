export interface Proveedor {
    id: string;
    rif: string;
    nombre: string;
    telefono: string;
    email: string;
    activo: boolean;
}

interface ProveedorBackend {
    id: number;
    rif: string;
    nombre: string;
    telefono: string;
    email: string;
    activo: boolean;
}

const BASE = `${import.meta.env.VITE_API_URL}/providers`;

const mapear = (p: ProveedorBackend): Proveedor => ({
    id: String(p.id),
    rif: p.rif,
    nombre: p.nombre,
    telefono: p.telefono ?? '',
    email: p.email ?? '',
    activo: p.activo,
});

export async function obtenerProveedores(): Promise<Proveedor[]> {
    const res = await fetch(BASE);
    if (!res.ok) throw new Error('Error al obtener proveedores');
    const datos: ProveedorBackend[] = await res.json();
    return datos.map(mapear);
}

export async function crearProveedor(datos: Omit<Proveedor, 'id'>): Promise<Proveedor> {
    const res = await fetch(BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            rif: datos.rif,
            nombre: datos.nombre,
            telefono: datos.telefono,
            email: datos.email,
        }),
    });
    if (!res.ok) throw new Error('Error al crear proveedor');
    return mapear(await res.json());
}

export async function actualizarProveedor(id: string, datos: Omit<Proveedor, 'id'>): Promise<Proveedor> {
    const res = await fetch(`${BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            nombre: datos.nombre,
            telefono: datos.telefono,
            email: datos.email,
        }),
    });
    if (!res.ok) throw new Error('Error al actualizar proveedor');
    return mapear(await res.json());
}

export async function eliminarProveedor(id: string): Promise<void> {
    const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Error al eliminar proveedor');
}
