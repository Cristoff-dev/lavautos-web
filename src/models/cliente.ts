export interface Cliente {
    id: number;
    cedula: string;
    nombre: string;
    telefono: string;
    email?: string | null;
    activo: boolean;
    esAfiliado: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface ClienteDTO {
    cedula: string;
    nombre: string;
    telefono: string;
    email?: string | null;
    esAfiliado: boolean;
}
