'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Calendar, User, Scissors, Clock, ArrowRight } from 'lucide-react';
import { WhatsAppIcon } from '@/components/whatsapp-icon';

const WHATSAPP_NUMBER = ''; // Fill with the business phone number

function ConfirmacionContent() {
  const sp = useSearchParams();
  const servicio = sp.get('servicio') || '';
  const barbero = sp.get('barbero') || '';
  const fecha = sp.get('fecha') || '';
  const hora = sp.get('hora') || '';

  const fechaDisplay = fecha
    ? new Date(fecha + 'T12:00:00').toLocaleDateString('es-PE', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  const waMsg = encodeURIComponent(
    `Hola! Acabo de reservar una cita en FADE Barber Shop:\n• Servicio: ${servicio}\n• Barbero: ${barbero}\n• Fecha: ${fechaDisplay}\n• Hora: ${hora}\n\n¿Todo está confirmado?`
  );
  const waUrl = WHATSAPP_NUMBER
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${waMsg}`
    : `https://wa.me/?text=${waMsg}`;

  return (
    <div className="max-w-lg mx-auto px-4 py-16">
      {/* Success icon */}
      <div className="text-center mb-10">
        <div className="inline-flex w-16 h-16 rounded-sm bg-[#c8a55a]/10 border border-[#c8a55a]/30 items-center justify-center mb-4 shadow-[0_0_30px_rgba(200,165,90,0.15)]">
          <CheckCircle size={32} className="text-[#c8a55a]" />
        </div>
        <h1 className="font-[family-name:var(--font-display)] text-4xl text-white mb-2">¡Cita Reservada!</h1>
        <p className="text-[#555] text-sm">Tu cita fue registrada como <span className="font-bold text-[#c8a55a] uppercase tracking-wider">pendiente</span>. Te contactaremos para confirmarla.</p>
      </div>

      {/* Summary card */}
      <div className="card-solid p-6 mb-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#555] mb-4">Detalles de tu cita</p>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="icon-gold w-8 h-8"><Scissors size={15} /></div>
            <div>
              <p className="text-[10px] text-[#444] uppercase tracking-wider mb-0.5">Servicio</p>
              <p className="text-white font-bold text-sm">{servicio}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="icon-gold w-8 h-8"><User size={15} /></div>
            <div>
              <p className="text-[10px] text-[#444] uppercase tracking-wider mb-0.5">Barbero</p>
              <p className="text-white font-bold text-sm">{barbero}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="icon-gold w-8 h-8"><Calendar size={15} /></div>
            <div>
              <p className="text-[10px] text-[#444] uppercase tracking-wider mb-0.5">Fecha</p>
              <p className="text-white font-bold text-sm capitalize">{fechaDisplay}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="icon-gold w-8 h-8"><Clock size={15} /></div>
            <div>
              <p className="text-[10px] text-[#444] uppercase tracking-wider mb-0.5">Hora</p>
              <p className="text-white font-bold text-sm">{hora}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-[#25d366] text-[#0a0a0a] font-bold text-sm uppercase tracking-widest py-3.5 rounded-sm hover:bg-[#20ba5a] transition-all"
        >
          <WhatsAppIcon size={16} />
          Confirmar por WhatsApp
        </a>
        <Link
          href="/reservar"
          className="flex items-center justify-center gap-2 border border-[#222] text-[#666] hover:text-white hover:border-[#444] font-bold text-sm uppercase tracking-widest py-3.5 rounded-sm transition-all"
        >
          Volver al inicio <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}

export default function ConfirmacionPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-24"><div className="spinner" /></div>}>
      <ConfirmacionContent />
    </Suspense>
  );
}
