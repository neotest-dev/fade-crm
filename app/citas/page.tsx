'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { TopBar } from '@/components/top-bar';
import { useSidebar } from '@/components/sidebar-context';
import { useCitas } from '@/hooks/use-citas';
import { useClientes } from '@/hooks/use-clientes';
import { useServicios } from '@/hooks/use-servicios';
import { useUsuarios } from '@/hooks/use-usuarios';
import { Plus, Trash2, CheckCircle, XCircle, Clock, X, CalendarDays } from 'lucide-react';

type EstadoFilter = 'todas' | 'pendiente' | 'confirmada' | 'cancelada';

export default function CitasPage() {
  const { collapsed } = useSidebar();
  const { citas, loading, createCita, updateEstado, deleteCita } = useCitas();
  const { clientes } = useClientes();
  const { servicios } = useServicios();
  const { usuarios } = useUsuarios();

  const [showForm, setShowForm] = useState(false);
  const [filtro, setFiltro] = useState<EstadoFilter>('todas');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    cliente_id: '',
    servicio_id: '',
    barbero_id: '',
    fecha: new Date().toISOString().split('T')[0],
    hora: '10:00',
    estado: 'pendiente' as const,
  });

  const mainClass = collapsed ? 'lg:ml-16' : 'lg:ml-64';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCita({
        ...formData,
        barbero_id: formData.barbero_id || null,
        servicio_id: formData.servicio_id || null,
      });
      setShowForm(false);
      setFormData({ cliente_id: '', servicio_id: '', barbero_id: '', fecha: new Date().toISOString().split('T')[0], hora: '10:00', estado: 'pendiente' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try { await deleteCita(id); } catch (err) { console.error(err); }
    finally { setDeletingId(null); }
  };

  const citasFiltradas = filtro === 'todas' ? citas : citas.filter((c) => c.estado === filtro);

  const counts = {
    todas: citas.length,
    pendiente: citas.filter((c) => c.estado === 'pendiente').length,
    confirmada: citas.filter((c) => c.estado === 'confirmada').length,
    cancelada: citas.filter((c) => c.estado === 'cancelada').length,
  };

  const getInitials = (name: string = '') =>
    name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

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
                <h2 className="page-title">CITAS</h2>
                <p className="page-subtitle">{citas.length} citas registradas</p>
              </div>
              <button onClick={() => setShowForm(!showForm)} className="btn-gold self-start sm:self-auto">
                <Plus size={16} /> Nueva Cita
              </button>
            </div>

            {/* Form */}
            {showForm && (
              <div className="card-solid p-5 mb-6 animate-slide-left">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-[family-name:var(--font-display)] text-lg tracking-wide text-white">
                    NUEVA CITA
                  </h3>
                  <button onClick={() => setShowForm(false)} className="text-[#444] hover:text-white transition-colors">
                    <X size={18} />
                  </button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-[#555] mb-1.5">Cliente *</label>
                      <select value={formData.cliente_id} onChange={(e) => setFormData({ ...formData, cliente_id: e.target.value })} required className="input-dark">
                        <option value="">Seleccionar...</option>
                        {clientes.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-[#555] mb-1.5">Servicio</label>
                      <select value={formData.servicio_id} onChange={(e) => setFormData({ ...formData, servicio_id: e.target.value })} className="input-dark">
                        <option value="">Seleccionar...</option>
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
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-[#555] mb-1.5">Fecha *</label>
                      <input type="date" value={formData.fecha} onChange={(e) => setFormData({ ...formData, fecha: e.target.value })} required className="input-dark" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-[#555] mb-1.5">Hora *</label>
                      <input type="time" value={formData.hora} onChange={(e) => setFormData({ ...formData, hora: e.target.value })} required className="input-dark" />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" className="btn-gold">Confirmar Cita</button>
                    <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Cancelar</button>
                  </div>
                </form>
              </div>
            )}

            {/* Filters */}
            <div className="flex gap-2 mb-5 flex-wrap animate-fade-up delay-2">
              {(['todas', 'pendiente', 'confirmada', 'cancelada'] as EstadoFilter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFiltro(f)}
                  className={`px-3 py-1.5 rounded-sm text-[10px] font-bold uppercase tracking-widest border transition-all ${
                    filtro === f
                      ? 'bg-[#c8a55a] text-[#0a0a0a] border-[#c8a55a]'
                      : 'bg-transparent text-[#555] border-[#222] hover:border-[#444] hover:text-white'
                  }`}
                >
                  {f} ({counts[f]})
                </button>
              ))}
            </div>

            {/* Citas List */}
            {loading ? (
              <div className="flex justify-center py-16"><div className="spinner" /></div>
            ) : citasFiltradas.length === 0 ? (
              <div className="card-solid p-12 text-center">
                <CalendarDays size={36} className="mx-auto text-[#222] mb-3" />
                <p className="text-[#444] text-sm uppercase tracking-wider font-bold">Sin citas {filtro !== 'todas' ? `(${filtro})` : ''}</p>
              </div>
            ) : (
              <div className="space-y-2">
                {citasFiltradas.map((cita, idx) => (
                  <div key={cita.id} className={`card-street p-4 flex flex-col sm:flex-row sm:items-center gap-4 animate-fade-up delay-${Math.min(idx + 1, 6)}`}>
                    <div className="w-10 h-10 rounded-sm bg-[#151515] border border-[#222] flex items-center justify-center text-[11px] font-bold text-[#888] shrink-0">
                      {getInitials(cita.clientes?.nombre)}
                    </div>

                    <div className="flex-1 min-w-0 grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <p className="text-[9px] text-[#444] uppercase tracking-widest font-bold">Cliente</p>
                        <p className="text-sm font-bold text-white truncate">{cita.clientes?.nombre || '—'}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-[#444] uppercase tracking-widest font-bold">Servicio</p>
                        <p className="text-sm font-bold text-white">{cita.servicios?.nombre || '—'}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-[#444] uppercase tracking-widest font-bold">Fecha / Hora</p>
                        <p className="text-sm font-bold text-white">{cita.fecha} · {cita.hora?.slice(0,5)}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-[#444] uppercase tracking-widest font-bold">Precio</p>
                        <p className="text-sm font-bold text-[#c8a55a]">
                          {cita.servicios?.precio ? `S/ ${cita.servicios.precio}` : '—'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {cita.estado === 'pendiente' && (
                        <span className="badge-pending">Pendiente</span>
                      )}
                      {cita.estado === 'confirmada' && (
                        <span className="badge-confirmed">Confirmada</span>
                      )}
                      {cita.estado === 'cancelada' && (
                        <span className="badge-cancelled">Cancelada</span>
                      )}

                      {cita.estado !== 'confirmada' && (
                        <button onClick={() => updateEstado(cita.id, 'confirmada')} className="btn-neon text-[10px] py-1 px-2.5">
                          <CheckCircle size={12} /> OK
                        </button>
                      )}
                      {cita.estado !== 'cancelada' && (
                        <button onClick={() => updateEstado(cita.id, 'cancelada')} className="btn-ghost text-[10px] py-1 px-2.5 text-[#ff2d2d] border-[#ff2d2d]/30 hover:bg-[#ff2d2d]/10">
                          <XCircle size={12} /> Cancelar
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(cita.id)}
                        disabled={deletingId === cita.id}
                        className="btn-danger text-[10px] py-1 px-2.5"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
