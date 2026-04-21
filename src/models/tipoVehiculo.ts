    export interface TipoVehiculo {
        id: number;
        placa: string;
        marca: string;
        modelo: string;
        color: string;
        clase: 'MOTO' | 'CARRO' | 'CAMION';
        activo: boolean;
        clienteId: number;
  // cliente?: { id: number, nombre: string } // Si tu backend manda el cliente anidado
}

export type TipoVehiculoDTO = Omit<TipoVehiculo, 'id' | 'activo'>; // Para crear