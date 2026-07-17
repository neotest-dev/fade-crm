'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { TopBar } from '@/components/top-bar';
import { useSidebar } from '@/components/sidebar-context';
import { useProductos } from '@/hooks/use-productos';
import { Plus, Trash2, Edit2, X, Package, AlertTriangle, MinusCircle } from 'lucide-react';

export default function ProductosPage() {
  const { collapsed } = useSidebar();
  const { productos, loading, createProducto, updateProducto, deleteProducto, venderProducto } = useProductos();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ nombre: '', descripcion: '', precio: '', stock: '' });

  const mainClass = collapsed ? 'lg:ml-16' : 'lg:ml-64';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        nombre: formData.nombre,
        descripcion: formData.descripcion || null,
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock) || 0,
        barberia_id: null,
      };
      if (editingId) {
        await updateProducto(editingId, payload);
        setEditingId(null);
      } else {
        await createProducto(payload);
      }
      setFormData({ nombre: '', descripcion: '', precio: '', stock: '' });
      setShowForm(false);
    } catch (err) { console.error(err); }
  };

  const startEdit = (p: any) => {
    setFormData({ nombre: p.nombre, descripcion: p.descripcion || '', precio: String(p.precio), stock: String(p.stock) });
    setEditingId(p.id);
    setShowForm(true);
  };

  const cancelForm = () => { setShowForm(false); setEditingId(null); setFormData({ nombre: '', descripcion: '', precio: '', stock: '' }); };

  const handleVender = async (id: string) => {
    try { await venderProducto(id, 1); } catch (err: any) { alert(err.message); }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />
      <main className={`${mainClass} transition-all duration-300`}>
        <TopBar />
        <div className="pt-[57px]">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 animate-fade-up">
              <div>
                <h2 className="page-title">PRODUCTOS</h2>
                <p className="page-subtitle">{productos.length} productos en inventario</p>
              </div>
              <button onClick={() => { cancelForm(); setShowForm(true); }} className="btn-gold self-start sm:self-auto">
                <Plus size={16} /> Nuevo Producto
              </button>
            </div>

            {showForm && (
              <div className="card-solid p-5 mb-6 animate-slide-left">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-[family-name:var(--font-display)] text-lg tracking-wide text-white">
                    {editingId ? 'EDITAR PRODUCTO' : 'NUEVO PRODUCTO'}
                  </h3>
                  <button onClick={cancelForm} className="text-[#444] hover:text-white"><X size={18} /></button>
                </div>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#555] mb-1.5">Nombre *</label>
                    <input type="text" placeholder="Ej. Cera mate" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} required className="input-dark" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#555] mb-1.5">Descripción</label>
                    <input type="text" placeholder="Descripción breve..." value={formData.descripcion} onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })} className="input-dark" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#555] mb-1.5">Precio (S/) *</label>
                    <input type="number" placeholder="25.00" value={formData.precio} onChange={(e) => setFormData({ ...formData, precio: e.target.value })} step="0.50" min="0" required className="input-dark" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#555] mb-1.5">Stock *</label>
                    <input type="number" placeholder="10" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} min="0" required className="input-dark" />
                  </div>
                  <div className="sm:col-span-2 flex gap-3">
                    <button type="submit" className="btn-gold">{editingId ? 'Guardar' : 'Crear Producto'}</button>
                    <button type="button" onClick={cancelForm} className="btn-ghost">Cancelar</button>
                  </div>
                </form>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center py-16"><div className="spinner" /></div>
            ) : productos.length === 0 ? (
              <div className="card-solid p-12 text-center">
                <Package size={36} className="mx-auto text-[#222] mb-3" />
                <p className="text-[#444] text-sm uppercase tracking-wider font-bold">Sin productos</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {productos.map((p, idx) => {
                  const bajoStock = p.stock <= 3;
                  return (
                    <div key={p.id} className={`card-street p-5 animate-fade-up delay-${Math.min(idx + 1, 6)}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className={bajoStock ? 'icon-neon animate-pulse-glow' : 'icon-gold'}>
                          <Package size={18} />
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => startEdit(p)} className="btn-ghost text-[10px] py-1 px-2"><Edit2 size={11} /></button>
                          <button onClick={() => deleteProducto(p.id)} className="btn-danger text-[10px] py-1 px-2"><Trash2 size={11} /></button>
                        </div>
                      </div>

                      <h3 className="font-[family-name:var(--font-display)] text-xl tracking-wide text-white mb-1">{p.nombre}</h3>
                      {p.descripcion && <p className="text-[11px] text-[#444] mb-3">{p.descripcion}</p>}

                      <div className="flex items-center justify-between mb-3">
                        <span className="font-[family-name:var(--font-display)] text-2xl text-[#c8a55a]">S/ {p.precio}</span>
                        <div className={`flex items-center gap-1.5 text-xs font-bold ${bajoStock ? 'text-[#ff2d2d]' : 'text-[#444]'}`}>
                          {bajoStock && <AlertTriangle size={12} />}
                          Stock: {p.stock}
                        </div>
                      </div>

                      {/* Stock bar */}
                      <div className="progress-bar mb-3">
                        <div
                          className={bajoStock ? 'progress-bar-fill-neon' : 'progress-bar-fill'}
                          style={{ width: `${Math.min((p.stock / 20) * 100, 100)}%` }}
                        />
                      </div>

                      <button
                        onClick={() => handleVender(p.id)}
                        disabled={p.stock === 0}
                        className={`w-full ${p.stock === 0 ? 'btn-ghost opacity-50 cursor-not-allowed' : 'btn-neon'} text-[11px] justify-center`}
                      >
                        <MinusCircle size={13} /> Vender 1 unidad
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
