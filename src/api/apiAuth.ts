export interface UsuarioAuth {
    id: number;
    nombre: string;
    email: string;
    rol: string;
}

export interface RespuestaLogin {
    token: string;
    user: UsuarioAuth;
}

const BASE = `${import.meta.env.VITE_API_URL}/auth`;

export async function login(email: string, password: string): Promise<RespuestaLogin> {
    const res = await fetch(`${BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    if (res.status === 401 || res.status === 404) {
        throw new Error('Credenciales inválidas');
    }
    if (!res.ok) {
        throw new Error('Error en el servidor. Intente de nuevo.');
    }

    const data = await res.json();
    return data.data ?? data;
}
