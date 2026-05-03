import React, { useState, useEffect } from "react";
import { Modal } from "../../components/UI/Modal";
import { useClientes } from "../../hooks/useClientes";
import type { Cliente, ClienteDTO } from "../../models/cliente";

export const ClientesPage = () => {
    const { listar, registrar, actualizar, desactivar, reactivar, exportarReporte } = useClientes();

    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);
    const [view, setView] = useState<'activos' | 'eliminados'>('activos');
    const [busqueda, setBusqueda] = useState("");
    const [errorFormulario, setErrorFormulario] = useState<string | null>(null);

    const [formulario, setFormulario] = useState<ClienteDTO>({
        cedula: "",
        nombre: "",
        telefono: "",
        email: "",
        esAfiliado: false
    });

    const columnas: { llave: keyof Cliente; etiqueta: string }[] = [
        { llave: "cedula", etiqueta: "Cédula / RIF" },
        { llave: "nombre", etiqueta: "Nombre Completo" },
        { llave: "telefono", etiqueta: "Teléfono" },
        { llave: "email", etiqueta: "Email" },
        { llave: "esAfiliado", etiqueta: "Afiliado" },
    ];

    const cargarClientes = async () => {
        try {
            setCargando(true);
            setError(null);
            const datos = await listar();
            setClientes(datos.sort((a, b) => (a.activo === b.activo ? 0 : a.activo ? -1 : 1)));
        } catch (err) {
            setError("No se pudo conectar con el servidor. Verifique que el backend esté activo.");
            console.error(err);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarClientes();
    }, []);

    const manejarEnvio = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorFormulario(null);

        if (!formulario.cedula.trim()) {
            setErrorFormulario("Por favor ingresa la cédula o RIF del cliente.");
            return;
        }
        if (!formulario.nombre.trim()) {
            setErrorFormulario("El nombre es obligatorio.");
            return;
        }
        if (!formulario.telefono.trim()) {
            setErrorFormulario("El teléfono es obligatorio.");
            return;
        }

        try {
            const dataToSave: ClienteDTO = {
                cedula: formulario.cedula.trim(),
                nombre: formulario.nombre.trim(),
                telefono: formulario.telefono.trim(),
                email: formulario.email?.trim() || null,
                esAfiliado: formulario.esAfiliado
            };

            if (clienteEditando) {
                await actualizar(clienteEditando.id, dataToSave);
            } else {
                await registrar(dataToSave);
            }

            setModalAbierto(false);
            await cargarClientes();
        } catch (err: any) {
            console.error(err);
            if (err?.response?.data?.message?.includes("ya está registrada") || err?.response?.data?.message?.includes("ya existe")) {
                setErrorFormulario("La cédula ingresada ya se encuentra registrada en el sistema.");
            } else {
                setErrorFormulario("Error al guardar el cliente. Intente de nuevo.");
            }
        }
    };

    const abrirModalCrear = () => {
        setErrorFormulario(null);
        setClienteEditando(null);
        setFormulario({ cedula: "", nombre: "", telefono: "", email: "", esAfiliado: false });
        setModalAbierto(true);
    };

    const abrirModalEditar = (cliente: Cliente) => {
        setErrorFormulario(null);
        setClienteEditando(cliente);
        setFormulario({
            cedula: cliente.cedula,
            nombre: cliente.nombre,
            telefono: cliente.telefono,
            email: cliente.email || "",
            esAfiliado: cliente.esAfiliado
        });
        setModalAbierto(true);
    };

    const cambiarActivo = async (cliente: Cliente, esActivo: boolean) => {
        try {
            if (esActivo) {
                await reactivar(cliente.id);
            } else {
                await desactivar(cliente.id);
            }
            await cargarClientes();
        } catch (err) {
            console.error(err);
            alert("Error al cambiar el estado del cliente.");
        }
    };

    const clientesFiltrados = clientes.filter(c => {
        const coincideEstado = view === 'activos' ? c.activo : !c.activo;
        if (!coincideEstado) return false;
        if (busqueda.trim() === "") return true;
        const searchLow = busqueda.toLowerCase();

        return (
            (c.cedula?.toLowerCase() || "").includes(searchLow) ||
            (c.nombre?.toLowerCase() || "").includes(searchLow) ||
            (c.telefono?.toLowerCase() || "").includes(searchLow) ||
            (c.email?.toLowerCase() || "").includes(searchLow)
        );
    });

    if (cargando) return <div className="p-8 text-center text-slate-400">Cargando datos...</div>;
    if (error) return <div className="p-8 text-center text-red-400">{error}</div>;

    return (
        <div className="animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-white text-3xl font-black uppercase tracking-tighter">
                        Directorio de <span className="text-cyan-400">Clientes</span>
                    </h2>
                    <div className="flex gap-4 mt-2">
                        <button onClick={() => setView('activos')} className={`text-xs font-bold uppercase transition-all ${view === 'activos' ? "text-cyan-400 border-b-2 border-cyan-400" : "text-slate-500 hover:text-slate-300"}`}>Activos</button>
                        <button onClick={() => setView('eliminados')} className={`text-xs font-bold uppercase transition-all ${view === 'eliminados' ? "text-red-500 border-b-2 border-red-500" : "text-slate-500 hover:text-slate-300"}`}>Papelera</button>
                    </div>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Buscar por cédula, nombre..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="bg-slate-900 border border-slate-800 text-white px-4 py-2 rounded-xl focus:ring-1 focus:ring-cyan-500 outline-none flex-1 md:w-64"
                    />
                    <button
                        onClick={exportarReporte}
                        className="bg-slate-700 text-cyan-400 px-6 py-2 rounded-xl font-bold hover:bg-slate-600 transition-all border border-cyan-500/30 whitespace-nowrap"
                    >
                        REPORTE PDF
                    </button>
                    <button
                        onClick={abrirModalCrear}
                        className="bg-cyan-500 text-slate-900 px-6 py-2 rounded-xl font-bold hover:bg-cyan-400 transition-all whitespace-nowrap"
                    >
                        NUEVO CLIENTE
                    </button>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-800/50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                            <tr>
                                {columnas.map((columna) => (
                                    <th key={columna.llave} className="px-6 py-4">
                                        {columna.etiqueta}
                                    </th>
                                ))}
                                <th className="px-6 py-4 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {clientesFiltrados.length === 0 ? (
                                <tr>
                                    <td colSpan={columnas.length + 1} className="px-6 py-8 text-center text-slate-500">
                                        No hay clientes para mostrar
                                    </td>
                                </tr>
                            ) : (
                                clientesFiltrados.map((cliente) => (
                                    <tr key={cliente.id} className="hover:bg-slate-800/30 transition-colors group">
                                        {columnas.map((columna) => (
                                            <td key={columna.llave} className={`px-6 py-4 ${columna.llave === "cedula" ? "font-mono text-cyan-400 font-bold tracking-widest" : "text-slate-200"}`}>
                                                {(() => {
                                                    const valor = cliente[columna.llave];
                                                    if (columna.llave === "esAfiliado") {
                                                        return valor ? (
                                                            <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-[10px] font-bold tracking-widest uppercase">
                                                                Afiliado VIP
                                                            </span>
                                                        ) : (
                                                            <span className="bg-slate-800 text-slate-400 px-2 py-1 rounded text-[10px] font-bold tracking-widest uppercase">
                                                                Estándar
                                                            </span>
                                                        );
                                                    }
                                                    return String(valor || "-");
                                                })()}
                                            </td>
                                        ))}
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center gap-2">
                                                {view === 'activos' ? (
                                                    <>
                                                        <button onClick={() => abrirModalEditar(cliente)} title="Editar" className="p-2 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-400 rounded-lg transition-all text-lg">📝</button>
                                                        <button onClick={() => cambiarActivo(cliente, false)} title="Mover a papelera" className="p-2 hover:bg-red-500/20 text-slate-400 hover:text-red-500 rounded-lg transition-all text-lg">🗑️</button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button onClick={() => cambiarActivo(cliente, true)} title="Restaurar" className="p-2 hover:bg-green-500/20 text-slate-400 hover:text-green-400 rounded-lg transition-all text-lg">♻️</button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de Cliente */}
            <Modal
                abierto={modalAbierto}
                alCerrar={() => setModalAbierto(false)}
                titulo={clienteEditando ? "Editar Cliente" : "Nuevo Cliente"}
            >
                {errorFormulario && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-md text-red-400 text-sm">
                        {errorFormulario}
                    </div>
                )}
                <form onSubmit={manejarEnvio} className="flex flex-col gap-4" noValidate>
                    <div>
                        <label className="block text-sm font-bold text-slate-300 mb-1.5 uppercase tracking-wide text-[10px]">Cédula o RIF</label>
                        <input
                            required
                            type="text"
                            placeholder="Ej: V-12345678"
                            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all font-mono shadow-inner"
                            value={formulario.cedula}
                            onChange={(e) => setFormulario({ ...formulario, cedula: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-300 mb-1.5 uppercase tracking-wide text-[10px]">Nombre Completo</label>
                        <input
                            required
                            type="text"
                            placeholder="Nombre y Apellido"
                            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all shadow-inner"
                            value={formulario.nombre}
                            onChange={(e) => setFormulario({ ...formulario, nombre: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-300 mb-1.5 uppercase tracking-wide text-[10px]">Teléfono</label>
                            <input
                                required
                                type="text"
                                placeholder="Ej: 0414-1234567"
                                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all shadow-inner"
                                value={formulario.telefono}
                                onChange={(e) => setFormulario({ ...formulario, telefono: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-300 mb-1.5 uppercase tracking-wide text-[10px]">Correo Electrónico</label>
                            <input
                                type="email"
                                placeholder="correo@ejemplo.com (Opcional)"
                                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all shadow-inner"
                                value={formulario.email || ""}
                                onChange={(e) => setFormulario({ ...formulario, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 mt-2 bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                        <input
                            type="checkbox"
                            id="esAfiliado"
                            className="w-5 h-5 accent-cyan-500 rounded bg-slate-900 border-slate-700"
                            checked={formulario.esAfiliado}
                            onChange={(e) => setFormulario({ ...formulario, esAfiliado: e.target.checked })}
                        />
                        <div>
                            <label htmlFor="esAfiliado" className="text-white font-bold cursor-pointer">Cliente VIP / Afiliado</label>
                            <p className="text-slate-400 text-xs">Marcar si el cliente tiene suscripción o beneficios especiales.</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4 pt-4 border-t border-slate-700/50">
                        <button
                            type="button"
                            onClick={() => setModalAbierto(false)}
                            className="px-6 py-2 border border-slate-600 rounded-lg text-slate-300 hover:bg-slate-800 font-bold transition-colors text-sm"
                        >
                            CANCELAR
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 font-bold transition-all shadow-[0_0_10px_rgba(6,182,212,0.3)] text-sm"
                        >
                            GUARDAR CLIENTE
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

export default ClientesPage;