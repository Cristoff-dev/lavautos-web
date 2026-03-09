// Tipos internos del frontend (español)
export interface Proveedor {
    id: string;
    nombre: string;
    contacto: string;
    telefono: string;
    email: string;
    direccion: string;
    estado: 'Activo' | 'Inactivo';
}

// Tipo que devuelve el backend (inglés)
interface ProveedorBackend {
    id: string;
    name: string;
    contactName?: string | null;
    phone?: string | null;
    email?: string | null;
    address?: string | null;
    isActive: boolean;
}

const BASE = `${import.meta.env.VITE_API_URL}/providers`;

const mapear = (p: ProveedorBackend): Proveedor => ({
    id: p.id,
    nombre: p.name,
    contacto: p.contactName ?? '',
    telefono: p.phone ?? '',
    email: p.email ?? '',
    direccion: p.address ?? '',
    estado: p.isActive ? 'Activo' : 'Inactivo',
});

const desMapear = (p: Omit<Proveedor, 'id'>) => ({
    name: p.nombre,
    contactName: p.contacto || null,
    phone: p.telefono || null,
    email: p.email || null,
    address: p.direccion || null,
    isActive: p.estado === 'Activo',
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
        body: JSON.stringify(desMapear(datos)),
    });
    if (!res.ok) throw new Error('Error al crear proveedor');
    return mapear(await res.json());
}

export async function actualizarProveedor(id: string, datos: Omit<Proveedor, 'id'>): Promise<Proveedor> {
    const res = await fetch(`${BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(desMapear(datos)),
    });
    if (!res.ok) throw new Error('Error al actualizar proveedor');
    return mapear(await res.json());
}

export async function eliminarProveedor(id: string): Promise<void> {
    const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Error al eliminar proveedor');
}
