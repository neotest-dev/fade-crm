'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Scissors, Clock, ArrowRight } from 'lucide-react';

interface Servicio {
  id: string;
  nombre: string;
  precio: number;
  duracion_min: number;
}

export default function ServiciosPortalPage() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('servicios').select('*').order('nombre').then(({ data }) => {
      setServicios(data || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c8a55a] mb-2">Nuestros servicios</p>
        <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl text-white">Elige tu servicio</h1>
        <p className="text-[#555] mt-3">Todos los precios incluyen lavado y estilizado.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="spinner" /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {servicios.map((s) => (
            <div key={s.id} className="card-street p-6 flex flex-col gap-4 group">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-sm bg-[#151515] border border-[#222] flex items-center justify-center text-[#c8a55a] group-hover:border-[#c8a55a]/30 transition-colors">
                  <Scissors size={20} />
                </div>
                <div className="flex items-center gap-1.5 text-[#444] text-xs">
                  <Clock size={12} />
                  {s.duracion_min} min
                </div>
              </div>

              <div className="flex-1">
                <h2 className="font-[family-name:var(--font-display)] text-xl text-white mb-1">{s.nombre}</h2>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-[family-name:var(--font-display)] text-2xl text-[#c8a55a]">S/ {s.precio}</span>
                <Link
                  href={`/reservar/cita?servicio=${s.id}`}
                  className="flex items-center gap-1.5 bg-[#c8a55a] text-[#0a0a0a] font-bold text-[11px] uppercase tracking-widest px-4 py-2 rounded-sm hover:bg-[#dfc07f] transition-all"
                >
                  Reservar <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
