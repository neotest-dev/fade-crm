'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Scissors, Clock, ArrowRight, Star, ChevronRight } from 'lucide-react';
import { WhatsAppIcon } from '@/components/whatsapp-icon';

interface Servicio {
  id: string;
  nombre: string;
  precio: number;
  duracion_min: number;
}

interface Horario {
  dia_semana: number;
  hora_inicio: string;
  hora_fin: string;
  activo: boolean;
}

const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export default function ReservarLandingPage() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [horarios, setHorarios] = useState<Horario[]>([]);

  useEffect(() => {
    Promise.all([
      supabase.from('servicios').select('id, nombre, precio, duracion_min').order('precio', { ascending: false }).limit(4),
      supabase.from('horarios').select('dia_semana, hora_inicio, hora_fin, activo').order('dia_semana'),
    ]).then(([s, h]) => {
      setServicios(s.data || []);
      setHorarios(h.data || []);
    });
  }, []);

  return (
    <div className="min-h-[calc(100vh-57px)]">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 sm:py-32 px-4">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#c8a55a]/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 border border-[#c8a55a]/30 bg-[#c8a55a]/5 px-4 py-1.5 rounded-sm mb-6">
            <Star size={11} className="text-[#c8a55a] fill-[#c8a55a]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c8a55a]">Premium Barber Shop</span>
          </div>

          <h1 className="font-[family-name:var(--font-display)] text-5xl sm:text-7xl text-white leading-tight mb-4">
            Tu corte,<br />
            <span className="text-[#c8a55a]">tu estilo.</span>
          </h1>

          <p className="text-[#666] text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Reserva tu cita en minutos. Servicios premium de barbería con los mejores profesionales.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/reservar/cita"
              className="group flex items-center gap-2 bg-[#c8a55a] text-[#0a0a0a] font-bold text-sm uppercase tracking-widest px-8 py-3.5 rounded-sm hover:bg-[#dfc07f] transition-all shadow-[0_0_20px_rgba(200,165,90,0.3)] hover:shadow-[0_0_30px_rgba(200,165,90,0.5)]"
            >
              Reservar Cita
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/reservar/servicios"
              className="flex items-center gap-2 border border-[#333] text-[#888] hover:text-white hover:border-[#555] font-bold text-sm uppercase tracking-widest px-8 py-3.5 rounded-sm transition-all"
            >
              Ver Servicios
            </Link>
          </div>
        </div>
      </section>

      {/* Servicios destacados */}
      {servicios.length > 0 && (
        <section className="py-12 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-end justify-between mb-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c8a55a] mb-1">Nuestros servicios</p>
                <h2 className="font-[family-name:var(--font-display)] text-3xl text-white">Lo que ofrecemos</h2>
              </div>
              <Link href="/reservar/servicios" className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-[#555] hover:text-[#c8a55a] transition-colors">
                Ver todos <ChevronRight size={13} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {servicios.map((s, idx) => (
                <Link
                  key={s.id}
                  href={`/reservar/cita?servicio=${s.id}`}
                  className="card-street p-5 group flex flex-col gap-3"
                >
                  <div className="w-9 h-9 rounded-sm bg-[#151515] border border-[#222] flex items-center justify-center text-[#c8a55a] group-hover:border-[#c8a55a]/30 transition-colors">
                    <Scissors size={17} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white text-sm mb-1">{s.nombre}</h3>
                    <div className="flex items-center gap-1.5 text-[#555] text-[11px]">
                      <Clock size={11} />
                      {s.duracion_min} min
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-[family-name:var(--font-display)] text-xl text-[#c8a55a]">S/ {s.precio}</span>
                    <ArrowRight size={13} className="text-[#333] group-hover:text-[#c8a55a] transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Horarios */}
      {horarios.length > 0 && (
        <section className="py-12 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c8a55a] mb-1">Atención</p>
              <h2 className="font-[family-name:var(--font-display)] text-3xl text-white">Horarios</h2>
            </div>
            <div className="card-solid p-6">
              <div className="space-y-2">
                {horarios.map((h) => (
                  <div key={h.dia_semana} className={`flex items-center justify-between py-2 border-b border-[#151515] last:border-0 ${!h.activo ? 'opacity-40' : ''}`}>
                    <span className="text-sm font-bold text-white uppercase tracking-wide">{DIAS[h.dia_semana]}</span>
                    {h.activo ? (
                      <span className="text-[#c8a55a] text-sm font-bold">{h.hora_inicio.slice(0, 5)} — {h.hora_fin.slice(0, 5)}</span>
                    ) : (
                      <span className="text-[#444] text-xs font-bold uppercase tracking-widest">Cerrado</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA final */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-[family-name:var(--font-display)] text-4xl text-white mb-3">¿Listo para el cambio?</h2>
          <p className="text-[#555] mb-8">Reserva ahora y te confirmamos en minutos.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/reservar/cita"
              className="flex items-center gap-2 bg-[#c8a55a] text-[#0a0a0a] font-bold text-sm uppercase tracking-widest px-8 py-3.5 rounded-sm hover:bg-[#dfc07f] transition-all"
            >
              Reservar Cita <ArrowRight size={15} />
            </Link>
            <a
              href="https://wa.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#25d366] text-[#0a0a0a] font-bold text-sm uppercase tracking-widest px-8 py-3.5 rounded-sm hover:bg-[#20ba5a] transition-all"
            >
              <WhatsAppIcon size={15} />
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
