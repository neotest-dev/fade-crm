'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ShoppingBag, Package, AlertCircle, Check } from 'lucide-react';
import { WhatsAppIcon } from '@/components/whatsapp-icon';

interface Producto {
  id: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  stock: number;
}

const WHATSAPP_NUMBER = ''; // Fill with the business phone number

export default function ProductosPortalPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [reservando, setReservando] = useState<string | null>(null);
  const [reservados, setReservados] = useState<Set<string>>(new Set());
  const [error, setError] = useState('');

  useEffect(() => {
    supabase
      .from('productos')
      .select('*')
      .gt('stock', 0)
      .order('nombre')
      .then(({ data }) => {
        setProductos(data || []);
        setLoading(false);
      });
  }, []);

  const handleReservar = async (producto: Producto) => {
    setError('');
    setReservando(producto.id);

    try {
      setReservados((prev) => new Set([...prev, producto.id]));

      const msg = encodeURIComponent(
        `Hola! Quisiera reservar el producto: *${producto.nombre}* (S/ ${producto.precio}). ¿Cómo coordino el pago y la entrega?`
      );
      const waUrl = WHATSAPP_NUMBER
        ? `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`
        : `https://wa.me/?text=${msg}`;

      window.open(waUrl, '_blank');
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error al reservar.');
    } finally {
      setReservando(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c8a55a] mb-2">Tienda</p>
        <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl text-white">Productos</h1>
        <p className="text-[#555] mt-3 text-sm">Al reservar, el producto se aparta y coordinamos por WhatsApp.</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-[#ff2d2d]/10 border border-[#ff2d2d]/30 text-[#ff2d2d] text-sm px-4 py-3 rounded-sm mb-6 max-w-xl mx-auto">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><div className="spinner" /></div>
      ) : productos.length === 0 ? (
        <div className="text-center py-20">
          <Package size={40} className="text-[#222] mx-auto mb-4" />
          <p className="text-[#444] font-bold uppercase tracking-widest text-sm">Sin stock disponible</p>
          <p className="text-[#333] text-xs mt-1">Vuelve pronto.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {productos.map((p) => {
            const isReservado = reservados.has(p.id);
            const isReservando = reservando === p.id;

            return (
              <div key={p.id} className="card-street p-6 flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-sm bg-[#151515] border border-[#222] flex items-center justify-center text-[#c8a55a]">
                    <ShoppingBag size={18} />
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#0f1a0f] border border-[#1a2e1a] px-2 py-1 rounded-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#39ff14]" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#39ff14]">
                      {p.stock} {p.stock === 1 ? 'unidad' : 'unidades'}
                    </span>
                  </div>
                </div>

                <div className="flex-1">
                  <h2 className="font-[family-name:var(--font-display)] text-xl text-white mb-1">{p.nombre}</h2>
                  {p.descripcion && (
                    <p className="text-[#555] text-xs leading-relaxed">{p.descripcion}</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-[family-name:var(--font-display)] text-2xl text-[#c8a55a]">S/ {p.precio}</span>
                  <button
                    onClick={() => handleReservar(p)}
                    disabled={isReservando || isReservado}
                    className={`flex items-center gap-2 font-bold text-[11px] uppercase tracking-widest px-4 py-2 rounded-sm transition-all ${
                      isReservado
                        ? 'bg-[#25d366]/10 border border-[#25d366]/30 text-[#25d366] cursor-default'
                        : 'bg-[#25d366] text-[#0a0a0a] hover:bg-[#20ba5a]'
                    }`}
                  >
                    {isReservado ? (
                      <><Check size={13} /> Reservado</>
                    ) : isReservando ? (
                      'Procesando...'
                    ) : (
                      <><WhatsAppIcon size={13} /> Reservar</>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
