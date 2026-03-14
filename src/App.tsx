import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./pages/Login/LoginPage";
import PaginaInicioP from "./pages/Inicio/PaginaInicioP";
import PaginaInicioPRIV from "./pages/Inicio/PaginaInicioPRIV";
import VehiculoPage from "./pages/Vehiculo/VehiculoPage";
import InventarioPage from "./pages/Inventario/InventarioPage";
import FacturacionPage from "./pages/factura/FacturacionPage";
import ModuloContable from "./pages/Contable/ModuloContable";
import RecepcionPage from "./pages/recepciones/RecepcionPage";
import { Servicios } from "./pages/Servicios/Servicios";
import { Proveedores } from "./pages/Proveedores/Proveedores";

import { DashboardLayout } from "./components/Layout/DashboardLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/paginainicio" element={<PaginaInicioP />} />

        <Route element={<DashboardLayout />}>
          <Route path="/inicioprivado" element={<PaginaInicioPRIV />} />
          <Route path="/vehiculos" element={<VehiculoPage />} />
          <Route path="/inventario" element={<InventarioPage />} />
          <Route path="/recepcion" element={<RecepcionPage />} />
          <Route path="/factura" element={<FacturacionPage />} />
          <Route path="/contable" element={<ModuloContable />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/proveedores" element={<Proveedores />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;