'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { TopBar } from '@/components/top-bar';
import { useSidebar } from '@/components/sidebar-context';
import { useServicios } from '@/hooks/use-servicios';
import { Plus, Trash2, Edit2, X, Clock, Scissors } from 'lucide-react';

export default function ServiciosPage() {
  const { collapsed } = useSidebar();
  const { servicios, loading, createServicio, updateServicio, deleteServicio } = useServicios();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ nombre: '', precio: '', duracion_min: '' });

  const mainClass = collapsed ? 'lg:ml-16' : 'lg:ml-64';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        nombre: formData.nombre,
        precio: parseFloat(formData.precio),
        duracion_min: parseInt(formData.duracion_min) || 30,
        barberia_id: null,
      };
      if (editingId) {
        await updateServicio(editingId, payload);
        setEditingId(null);
      } else {
        await createServicio(payload);
      }
      setFormData({ nombre: '', precio: '', duracion_min: '' });
      setShowForm(false);
    } catch (err) { console.error(err); }
  };

  const startEdit = (s: any) => {
    setFormData({ nombre: s.nombre, precio: String(s.precio), duracion_min: String(s.duracion_min) });
    setEditingId(s.id);
    setShowForm(true);
  };

  const cancelForm = () => { setShowForm(false); setEditingId(null); setFormData({ nombre: '', precio: '', duracion_min: '' }); };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />
      <main className={`${mainClass} transition-all duration-300`}>
        <TopBar />
        <div className="pt-[57px]">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 animate-fade-up">
              <div>
                <h2 className="page-title">SERVICIOS</h2>
                <p className="page-subtitle">{servicios.length} servicios disponibles</p>
              </div>
              <button onClick={() => { cancelForm(); setShowForm(true); }} className="btn-gold self-start sm:self-auto">
                <Plus size={16} /> Nuevo Servicio
              </button>
            </div>

            {showForm && (
              <div className="card-solid p-5 mb-6 animate-slide-left">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-[family-name:var(--font-display)] text-lg tracking-wide text-white">
                    {editingId ? 'EDITAR SERVICIO' : 'NUEVO SERVICIO'}
                  </h3>
                  <button onClick={cancelForm} className="text-[#444] hover:text-white"><X size={18} /></button>
                </div>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#555] mb-1.5">Nombre *</label>
                    <input type="text" placeholder="Ej. Corte clásico" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} required className="input-dark" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#555] mb-1.5">Precio (S/) *</label>
                    <input type="number" placeholder="25.00" value={formData.precio} onChange={(e) => setFormData({ ...formData, precio: e.target.value })} step="0.50" min="0" required className="input-dark" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#555] mb-1.5">Duración (min)</label>
                    <input type="number" placeholder="30" value={formData.duracion_min} onChange={(e) => setFormData({ ...formData, duracion_min: e.target.value })} min="5" className="input-dark" />
                  </div>
                  <div className="sm:col-span-3 flex gap-3">
                    <button type="submit" className="btn-gold">{editingId ? 'Guardar' : 'Crear Servicio'}</button>
                    <button type="button" onClick={cancelForm} className="btn-ghost">Cancelar</button>
                  </div>
                </form>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center py-16"><div className="spinner" /></div>
            ) : servicios.length === 0 ? (
              <div className="card-solid p-12 text-center">
                <Scissors size={36} className="mx-auto text-[#222] mb-3" />
                <p className="text-[#444] text-sm uppercase tracking-wider font-bold">Sin servicios</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {servicios.map((s, idx) => (
                  <div key={s.id} className={`card-street p-5 animate-fade-up delay-${Math.min(idx + 1, 6)}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="icon-gold"><Scissors size={18} /></div>
                      <div className="flex gap-2">
                        <button onClick={() => startEdit(s)} className="btn-ghost text-[10px] py-1 px-2"><Edit2 size={11} /></button>
                        <button onClick={() => deleteServicio(s.id)} className="btn-danger text-[10px] py-1 px-2"><Trash2 size={11} /></button>
                      </div>
                    </div>
                    <h3 className="font-[family-name:var(--font-display)] text-xl tracking-wide text-white mb-2">{s.nombre}</h3>
                    <div className="flex items-center justify-between">
                      <span className="font-[family-name:var(--font-display)] text-2xl text-[#c8a55a]">S/ {s.precio}</span>
                      <div className="flex items-center gap-1 text-[#444] text-xs">
                        <Clock size={12} />{s.duracion_min} min
                      </div>
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
