'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { TopBar } from '@/components/top-bar';
import { useSidebar } from '@/components/sidebar-context';
import { useVentas } from '@/hooks/use-ventas';
import { useClientes } from '@/hooks/use-clientes';
import { useServicios } from '@/hooks/use-servicios';
import { useUsuarios } from '@/hooks/use-usuarios';
import { Plus, Trash2, X, DollarSign, TrendingUp } from 'lucide-react';

export default function VentasPage() {
  const { collapsed } = useSidebar();
  const { ventas, loading, createVenta, deleteVenta } = useVentas();
  const { clientes } = useClientes();
  const { servicios } = useServicios();
  const { usuarios } = useUsuarios();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    cliente_id: '',
    servicio_id: '',
    barbero_id: '',
    precio: '',
  });

  const mainClass = collapsed ? 'lg:ml-16' : 'lg:ml-64';

  const handleServicioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    const servicio = servicios.find((s) => s.id === id);
    setFormData({ ...formData, servicio_id: id, precio: servicio ? String(servicio.precio) : formData.precio });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createVenta({
        cliente_id: formData.cliente_id,
        servicio_id: formData.servicio_id || null,
        barbero_id: formData.barbero_id || null,
        precio: parseFloat(formData.precio),
      });
      setFormData({ cliente_id: '', servicio_id: '', barbero_id: '', precio: '' });
      setShowForm(false);
    } catch (err) { console.error(err); }
  };

  const today = new Date().toISOString().split('T')[0];
  const totalHoy = ventas.filter((v) => v.fecha.startsWith(today)).reduce((sum, v) => sum + (v.precio || 0), 0);
  const totalGeneral = ventas.reduce((sum, v) => sum + (v.precio || 0), 0);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />
      <main className={`${mainClass} transition-all duration-300`}>
        <TopBar />
        <div className="pt-[57px]">
          <div className="p-4 sm:p-6 lg:p-8">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 animate-fade-up">
              <div>
                <h2 className="page-title">VENTAS</h2>
                <p className="page-subtitle">{ventas.length} registros</p>
              </div>
              <button onClick={() => setShowForm(!showForm)} className="btn-gold self-start sm:self-auto">
                <Plus size={16} /> Nueva Venta
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="stat-card animate-fade-up delay-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[#555] text-[10px] font-bold uppercase tracking-widest">Total hoy</p>
                    <p className="text-2xl font-[family-name:var(--font-display)] text-white mt-1">
                      S/ {totalHoy.toFixed(2)}
                    </p>
                  </div>
                  <div className="icon-gold"><DollarSign size={18} /></div>
                </div>
              </div>
              <div className="stat-card animate-fade-up delay-2">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[#555] text-[10px] font-bold uppercase tracking-widest">Total acumulado</p>
                    <p className="text-2xl font-[family-name:var(--font-display)] text-white mt-1">
                      S/ {totalGeneral.toFixed(2)}
                    </p>
                  </div>
                  <div className="icon-neon"><TrendingUp size={18} /></div>
                </div>
              </div>
            </div>

            {/* Form */}
            {showForm && (
              <div className="card-solid p-5 mb-6 animate-slide-left">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-[family-name:var(--font-display)] text-lg tracking-wide text-white">NUEVA VENTA</h3>
                  <button onClick={() => setShowForm(false)} className="text-[#444] hover:text-white"><X size={18} /></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-[#555] mb-1.5">Cliente *</label>
                      <select value={formData.cliente_id} onChange={(e) => setFormData({ ...formData, cliente_id: e.target.value })} required className="input-dark">
                        <option value="">Seleccionar...</option>
                        {clientes.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-[#555] mb-1.5">Servicio</label>
                      <select value={formData.servicio_id} onChange={handleServicioChange} className="input-dark">
                        <option value="">Sin servicio</option>
                        {servicios.map((s) => <option key={s.id} value={s.id}>{s.nombre} — S/ {s.precio}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-[#555] mb-1.5">Barbero</label>
                      <select value={formData.barbero_id} onChange={(e) => setFormData({ ...formData, barbero_id: e.target.value })} className="input-dark">
                        <option value="">Sin asignar</option>
                        {usuarios.map((u) => <option key={u.id} value={u.id}>{u.nombre}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-[#555] mb-1.5">Monto (S/) *</label>
                      <input type="number" placeholder="35.00" value={formData.precio} onChange={(e) => setFormData({ ...formData, precio: e.target.value })} step="0.01" min="0" required className="input-dark" />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" className="btn-gold">Registrar Venta</button>
                    <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Cancelar</button>
                  </div>
                </form>
              </div>
            )}

            {/* Table */}
            {loading ? (
              <div className="flex justify-center py-16"><div className="spinner" /></div>
            ) : (
              <div className="card-solid overflow-hidden animate-fade-up delay-3">
                <div className="overflow-x-auto">
                  <table className="w-full table-dark">
                    <thead>
                      <tr className="bg-[#0d0d0d]">
                        <th>Cliente</th>
                        <th>Servicio</th>
                        <th>Barbero</th>
                        <th>Monto</th>
                        <th>Fecha</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {ventas.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-[#444] text-sm uppercase tracking-wider font-bold">
                            Sin ventas registradas
                          </td>
                        </tr>
                      ) : ventas.map((v) => (
                        <tr key={v.id}>
                          <td className="text-white font-bold">{v.clientes?.nombre || '—'}</td>
                          <td className="text-[#888]">{v.servicios?.nombre || '—'}</td>
                          <td className="text-[#888]">{v.usuarios?.nombre || '—'}</td>
                          <td><span className="text-[#c8a55a] font-bold font-[family-name:var(--font-display)] text-base">S/ {v.precio}</span></td>
                          <td className="text-[#555] text-xs">
                            {new Date(v.fecha).toLocaleDateString('es-PE')} {new Date(v.fecha).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td>
                            <button onClick={() => deleteVenta(v.id)} className="btn-danger text-[10px] py-1 px-2">
                              <Trash2 size={11} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
