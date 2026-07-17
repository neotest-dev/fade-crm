'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { TopBar } from '@/components/top-bar';
import { useSidebar } from '@/components/sidebar-context';
import { useClientes } from '@/hooks/use-clientes';
import { generateWhatsAppLink } from '@/lib/whatsapp';
import { Plus, Phone, Scissors, Trash2, Edit2, X, MessageCircle, Users } from 'lucide-react';
import { WhatsAppIcon } from '@/components/whatsapp-icon';

export default function ClientesPage() {
  const { collapsed } = useSidebar();
  const { clientes, loading, createCliente, updateCliente, deleteCliente } = useClientes();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQ, setSearchQ] = useState('');
  const [formData, setFormData] = useState({ nombre: '', telefono: '' });

  const mainClass = collapsed ? 'lg:ml-16' : 'lg:ml-64';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateCliente(editingId, { nombre: formData.nombre, telefono: formData.telefono });
        setEditingId(null);
      } else {
        await createCliente({ nombre: formData.nombre, telefono: formData.telefono, total_cortes: 0, fecha_ultimo_corte: null, barberia_id: null });
      }
      setFormData({ nombre: '', telefono: '' });
      setShowForm(false);
    } catch (err) { console.error(err); }
  };

  const startEdit = (c: any) => {
    setFormData({ nombre: c.nombre, telefono: c.telefono });
    setEditingId(c.id);
    setShowForm(true);
  };

  const cancelForm = () => { setShowForm(false); setEditingId(null); setFormData({ nombre: '', telefono: '' }); };

  const getInitials = (name: string) =>
    name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

  const filtered = clientes.filter((c) =>
    c.nombre.toLowerCase().includes(searchQ.toLowerCase()) ||
    c.telefono.includes(searchQ)
  );

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
                <h2 className="page-title">CLIENTES</h2>
                <p className="page-subtitle">{clientes.length} registrados</p>
              </div>
              <button onClick={() => { cancelForm(); setShowForm(true); }} className="btn-gold self-start sm:self-auto">
                <Plus size={16} /> Nuevo Cliente
              </button>
            </div>

            {/* Search */}
            <div className="mb-5 animate-fade-up delay-1">
              <input
                type="text"
                placeholder="Buscar por nombre o teléfono..."
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                className="input-dark max-w-sm"
              />
            </div>

            {/* Form */}
            {showForm && (
              <div className="card-solid p-5 mb-5 animate-slide-left">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-[family-name:var(--font-display)] text-lg tracking-wide text-white">
                    {editingId ? 'EDITAR CLIENTE' : 'NUEVO CLIENTE'}
                  </h3>
                  <button onClick={cancelForm} className="text-[#444] hover:text-white transition-colors"><X size={18} /></button>
                </div>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#555] mb-1.5">Nombre *</label>
                    <input type="text" placeholder="Ej. Carlos Mendoza" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} required className="input-dark" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#555] mb-1.5">Teléfono (WhatsApp) *</label>
                    <input type="tel" placeholder="+51 987 654 321" value={formData.telefono} onChange={(e) => setFormData({ ...formData, telefono: e.target.value })} required className="input-dark" />
                  </div>
                  <div className="sm:col-span-2 flex gap-3">
                    <button type="submit" className="btn-gold">{editingId ? 'Guardar Cambios' : 'Crear Cliente'}</button>
                    <button type="button" onClick={cancelForm} className="btn-ghost">Cancelar</button>
                  </div>
                </form>
              </div>
            )}

            {/* List */}
            {loading ? (
              <div className="flex justify-center py-16"><div className="spinner" /></div>
            ) : filtered.length === 0 ? (
              <div className="card-solid p-12 text-center">
                <Users size={36} className="mx-auto text-[#222] mb-3" />
                <p className="text-[#444] text-sm uppercase tracking-wider font-bold">
                  {searchQ ? 'Sin resultados' : 'Sin clientes registrados'}
                </p>
              </div>
            ) : (
              <div className="grid gap-2">
                {filtered.map((cliente, idx) => (
                  <div key={cliente.id} className={`card-street p-4 flex flex-col sm:flex-row sm:items-center gap-4 animate-fade-up delay-${Math.min(idx + 1, 6)}`}>
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-sm bg-gradient-to-br from-[#c8a55a]/20 to-[#c8a55a]/5 border border-[#c8a55a]/20 flex items-center justify-center text-sm font-bold text-[#c8a55a] shrink-0">
                      {getInitials(cliente.nombre)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div>
                        <p className="text-[9px] text-[#444] uppercase tracking-widest font-bold">Nombre</p>
                        <p className="text-sm font-bold text-white">{cliente.nombre}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-[#444] uppercase tracking-widest font-bold">Teléfono</p>
                        <p className="text-sm font-bold text-white flex items-center gap-1">
                          <Phone size={11} className="text-[#c8a55a]" /> {cliente.telefono}
                        </p>
                      </div>
                      <div>
                        <p className="text-[9px] text-[#444] uppercase tracking-widest font-bold">Cortes / Último</p>
                        <p className="text-sm font-bold text-white flex items-center gap-1">
                          <Scissors size={11} className="text-[#c8a55a]" />
                          {cliente.total_cortes} cortes
                          {cliente.fecha_ultimo_corte && (
                            <span className="text-[#444] font-normal">· {new Date(cliente.fecha_ultimo_corte).toLocaleDateString('es-PE')}</span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <a
                        href={generateWhatsAppLink(cliente.telefono, `¡Hola ${cliente.nombre.split(' ')[0]}! Te habla FADE Barber Shop.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border border-[#25d366]/40 text-[#25d366] hover:bg-[#25d366]/10 hover:border-[#25d366] text-[10px] py-2 px-2.5 rounded-[2px] transition-all duration-200"
                        title="WhatsApp"
                      >
                        <WhatsAppIcon size={12} />
                      </a>
                      <button onClick={() => startEdit(cliente)} className="btn-ghost text-[10px] py-1.5 px-2.5">
                        <Edit2 size={12} />
                      </button>
                      <button onClick={() => deleteCliente(cliente.id)} className="btn-danger text-[10px] py-1.5 px-2.5">
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
