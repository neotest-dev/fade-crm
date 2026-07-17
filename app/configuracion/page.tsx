'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { TopBar } from '@/components/top-bar';
import { useSidebar } from '@/components/sidebar-context';
import { useUsuarios } from '@/hooks/use-usuarios';
import { useHorarios } from '@/hooks/use-horarios';
import { supabase } from '@/lib/supabase';
import { Save, Plus, Trash2, Edit2, X, Users, Clock, Store } from 'lucide-react';

export default function ConfiguracionPage() {
  const { collapsed } = useSidebar();
  const { usuarios, loading: loadingUsuarios, createUsuario, updateUsuario, deleteUsuario } = useUsuarios();
  const { horarios, loading: loadingHorarios, updateHorario, DIAS } = useHorarios();

  const [barberia, setBarberia] = useState({ nombre: 'FADE Barber Shop', direccion: '' });
  const [savingBarberia, setSavingBarberia] = useState(false);

  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [userForm, setUserForm] = useState({ nombre: '', email: '', rol: 'barbero' });

  const mainClass = collapsed ? 'lg:ml-16' : 'lg:ml-64';

  const handleSaveBarberia = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingBarberia(true);
    try {
      await supabase.from('barberias').update({ nombre: barberia.nombre, direccion: barberia.direccion }).eq('id', '00000000-0000-0000-0000-000000000001');
    } catch (err) { console.error(err); }
    finally { setSavingBarberia(false); }
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...userForm, barberia_id: '00000000-0000-0000-0000-000000000001' };
      if (editingUserId) {
        await updateUsuario(editingUserId, payload);
        setEditingUserId(null);
      } else {
        await createUsuario(payload);
      }
      setUserForm({ nombre: '', email: '', rol: 'barbero' });
      setShowUserForm(false);
    } catch (err) { console.error(err); }
  };

  const startEditUser = (u: any) => {
    setUserForm({ nombre: u.nombre, email: u.email, rol: u.rol });
    setEditingUserId(u.id);
    setShowUserForm(true);
  };

  const cancelUserForm = () => { setShowUserForm(false); setEditingUserId(null); setUserForm({ nombre: '', email: '', rol: 'barbero' }); };

  const handleHorarioChange = async (id: string, field: string, value: any) => {
    try { await updateHorario(id, { [field]: value }); } catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />
      <main className={`${mainClass} transition-all duration-300`}>
        <TopBar />
        <div className="pt-[57px]">
          <div className="p-4 sm:p-6 lg:p-8">

            <div className="mb-6 animate-fade-up">
              <h2 className="page-title">CONFIGURACIÓN</h2>
              <p className="page-subtitle">Ajusta tu barbería</p>
            </div>

            {/* Barbería */}
            <section className="card-solid p-5 mb-6 animate-fade-up delay-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="icon-gold"><Store size={18} /></div>
                <h3 className="font-[family-name:var(--font-display)] text-lg tracking-wide text-white">BARBERÍA</h3>
              </div>
              <form onSubmit={handleSaveBarberia} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#555] mb-1.5">Nombre</label>
                  <input type="text" value={barberia.nombre} onChange={(e) => setBarberia({ ...barberia, nombre: e.target.value })} className="input-dark" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#555] mb-1.5">Dirección</label>
                  <input type="text" placeholder="Jr. Principal 123..." value={barberia.direccion} onChange={(e) => setBarberia({ ...barberia, direccion: e.target.value })} className="input-dark" />
                </div>
                <div>
                  <button type="submit" disabled={savingBarberia} className="btn-gold">
                    <Save size={15} />{savingBarberia ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </form>
            </section>

            {/* Barberos (Usuarios) */}
            <section className="card-solid p-5 mb-6 animate-fade-up delay-2">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="icon-gold"><Users size={18} /></div>
                  <h3 className="font-[family-name:var(--font-display)] text-lg tracking-wide text-white">BARBEROS</h3>
                </div>
                <button onClick={() => { cancelUserForm(); setShowUserForm(true); }} className="btn-gold text-[11px] py-1.5 px-3">
                  <Plus size={14} /> Agregar
                </button>
              </div>

              {showUserForm && (
                <div className="bg-[#0d0d0d] border border-[#222] rounded-sm p-4 mb-4 animate-slide-left">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-[family-name:var(--font-display)] text-sm tracking-wide text-white">
                      {editingUserId ? 'EDITAR BARBERO' : 'NUEVO BARBERO'}
                    </p>
                    <button onClick={cancelUserForm} className="text-[#444] hover:text-white"><X size={15} /></button>
                  </div>
                  <form onSubmit={handleUserSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-widest text-[#555] mb-1">Nombre *</label>
                      <input type="text" placeholder="Carlos..." value={userForm.nombre} onChange={(e) => setUserForm({ ...userForm, nombre: e.target.value })} required className="input-dark text-sm py-2" />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-widest text-[#555] mb-1">Email</label>
                      <input type="email" placeholder="barbero@fade.com" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} className="input-dark text-sm py-2" />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase tracking-widest text-[#555] mb-1">Rol</label>
                      <select value={userForm.rol} onChange={(e) => setUserForm({ ...userForm, rol: e.target.value })} className="input-dark text-sm py-2">
                        <option value="barbero">Barbero</option>
                        <option value="admin">Admin</option>
                        <option value="dueño">Dueño</option>
                      </select>
                    </div>
                    <div className="sm:col-span-3 flex gap-2">
                      <button type="submit" className="btn-gold text-[11px] py-1.5 px-3">{editingUserId ? 'Guardar' : 'Crear'}</button>
                      <button type="button" onClick={cancelUserForm} className="btn-ghost text-[11px] py-1.5 px-3">Cancelar</button>
                    </div>
                  </form>
                </div>
              )}

              {loadingUsuarios ? (
                <div className="flex justify-center py-8"><div className="spinner" /></div>
              ) : usuarios.length === 0 ? (
                <p className="text-[#444] text-sm text-center py-6 uppercase tracking-wider font-bold">Sin barberos registrados</p>
              ) : (
                <div className="space-y-2">
                  {usuarios.map((u) => (
                    <div key={u.id} className="flex items-center gap-4 p-3 bg-[#0d0d0d] border border-[#1a1a1a] rounded-sm">
                      <div className="w-8 h-8 rounded-sm bg-gradient-to-br from-[#c8a55a]/20 to-[#c8a55a]/5 border border-[#c8a55a]/20 flex items-center justify-center text-[10px] font-bold text-[#c8a55a]">
                        {u.nombre.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white">{u.nombre}</p>
                        <p className="text-[11px] text-[#444]">{u.email} · <span className="text-[#c8a55a] uppercase text-[10px] font-bold">{u.rol}</span></p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => startEditUser(u)} className="btn-ghost text-[10px] py-1 px-2"><Edit2 size={11} /></button>
                        <button onClick={() => deleteUsuario(u.id)} className="btn-danger text-[10px] py-1 px-2"><Trash2 size={11} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Horarios */}
            <section className="card-solid p-5 animate-fade-up delay-3">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="icon-neon"><Clock size={18} /></div>
                <h3 className="font-[family-name:var(--font-display)] text-lg tracking-wide text-white">HORARIOS</h3>
              </div>

              {loadingHorarios ? (
                <div className="flex justify-center py-8"><div className="spinner" /></div>
              ) : horarios.length === 0 ? (
                <p className="text-[#444] text-sm text-center py-6 uppercase tracking-wider font-bold">Sin horarios configurados</p>
              ) : (
                <div className="space-y-2">
                  {horarios.map((h) => (
                    <div key={h.id} className={`flex flex-col sm:flex-row sm:items-center gap-3 p-3 border rounded-sm transition-all ${h.activo ? 'border-[#1e1e1e] bg-[#0d0d0d]' : 'border-[#151515] bg-[#0a0a0a] opacity-60'}`}>
                      <div className="flex items-center gap-3 min-w-[120px]">
                        <button
                          onClick={() => handleHorarioChange(h.id, 'activo', !h.activo)}
                          className={`w-9 h-5 rounded-sm relative transition-all border ${h.activo ? 'bg-[#c8a55a] border-[#c8a55a]' : 'bg-[#1a1a1a] border-[#222]'}`}
                        >
                          <span className={`absolute top-0.5 w-3.5 h-4 rounded-sm bg-white transition-all ${h.activo ? 'left-4' : 'left-0.5'}`} />
                        </button>
                        <span className="text-sm font-bold text-white uppercase tracking-wider font-[family-name:var(--font-body)]">
                          {DIAS[h.dia_semana]}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="time"
                          value={h.hora_inicio}
                          onChange={(e) => handleHorarioChange(h.id, 'hora_inicio', e.target.value)}
                          disabled={!h.activo}
                          className="input-dark py-1.5 text-sm w-28"
                        />
                        <span className="text-[#444] text-sm font-bold">→</span>
                        <input
                          type="time"
                          value={h.hora_fin}
                          onChange={(e) => handleHorarioChange(h.id, 'hora_fin', e.target.value)}
                          disabled={!h.activo}
                          className="input-dark py-1.5 text-sm w-28"
                        />
                        {!h.activo && <span className="text-[10px] text-[#444] uppercase tracking-widest font-bold">Cerrado</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
