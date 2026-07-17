'use client';

import { Navbar } from '@/components/navbar';
import { TopBar } from '@/components/top-bar';
import { useSidebar } from '@/components/sidebar-context';
import { useMensajes } from '@/hooks/use-mensajes';
import { generateWhatsAppLink } from '@/lib/whatsapp';
import { Send, CheckCircle, MessageCircle, Phone } from 'lucide-react';
import { WhatsAppIcon } from '@/components/whatsapp-icon';

export default function MensajesPage() {
  const { collapsed } = useSidebar();
  const { mensajes, loading, marcarEnviado } = useMensajes();

  const mainClass = collapsed ? 'lg:ml-16' : 'lg:ml-64';

  const handleSend = (m: any) => {
    const link = generateWhatsAppLink(m.clientes?.telefono || m.cliente?.telefono || '', m.mensaje);
    window.open(link, '_blank');
    marcarEnviado(m.id);
  };

  const getBorderColor = (motivo: string) => {
    if (motivo === 'cliente_frecuente') return 'border-l-[#c8a55a]';
    if (motivo === 'recordatorio') return 'border-l-[#ff2d2d]';
    return 'border-l-[#00f0ff]';
  };

  const getMotivoLabel = (motivo: string) => {
    if (motivo === 'cliente_frecuente') return { label: 'Cliente frecuente', cls: 'badge-pending' };
    if (motivo === 'recordatorio') return { label: 'Recordatorio', cls: 'badge-cancelled' };
    return { label: 'Sugerido', cls: 'badge-confirmed' };
  };

  const getInitials = (name: string = '') =>
    name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() || '??';

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />
      <main className={`${mainClass} transition-all duration-300`}>
        <TopBar />
        <div className="pt-[57px]">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-6 animate-fade-up">
              <h2 className="page-title">MENSAJES</h2>
              <p className="page-subtitle">WhatsApp sugeridos para tus clientes</p>
            </div>

            {loading ? (
              <div className="flex justify-center py-16"><div className="spinner" /></div>
            ) : mensajes.length === 0 ? (
              <div className="card-solid p-12 text-center">
                <MessageCircle size={36} className="mx-auto text-[#222] mb-3" />
                <p className="text-white text-sm font-bold uppercase tracking-wider">Bandeja vacía</p>
                <p className="text-[#444] text-xs mt-1.5 uppercase tracking-wider">Todos los clientes están al día</p>
              </div>
            ) : (
              <div className="space-y-3">
                {mensajes.map((m: any, idx: number) => {
                  const { label, cls } = getMotivoLabel(m.motivo);
                  const nombre = m.clientes?.nombre || m.cliente?.nombre || 'Cliente';
                  const telefono = m.clientes?.telefono || m.cliente?.telefono || '';
                  return (
                    <div
                      key={m.id}
                      className={`card-solid border-l-4 ${getBorderColor(m.motivo)} p-5 animate-fade-up delay-${Math.min(idx + 1, 6)}`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                        <div className="w-10 h-10 rounded-sm bg-[#151515] border border-[#222] flex items-center justify-center text-[11px] font-bold text-[#888] shrink-0">
                          {getInitials(nombre)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2.5 mb-2 flex-wrap">
                            <h3 className="font-[family-name:var(--font-display)] text-lg tracking-wide text-white">{nombre}</h3>
                            <span className={cls}>{label}</span>
                            {m.estado === 'enviado' && (
                              <span className="flex items-center gap-1 text-[#00f0ff] text-[10px] font-bold uppercase tracking-wider">
                                <CheckCircle size={12} /> Enviado
                              </span>
                            )}
                          </div>
                          <div className="bg-[#0d0d0d] rounded-sm p-3 mb-3 border border-[#1a1a1a]">
                            <p className="text-[#888] text-sm leading-relaxed">{m.mensaje}</p>
                          </div>
                          <p className="text-[#333] text-xs uppercase tracking-wider font-bold flex items-center gap-1">
                            <Phone size={11} className="text-[#c8a55a]" /> {telefono}
                          </p>
                        </div>
                        <button
                          onClick={() => handleSend(m)}
                          disabled={m.estado === 'enviado'}
                          className={`shrink-0 flex items-center gap-1.5 transition-all duration-200 ${
                            m.estado === 'enviado'
                              ? 'btn-ghost opacity-50 cursor-not-allowed'
                              : 'bg-[#25D366] text-[#0a0a0a] hover:bg-[#20ba5a] font-bold text-[11px] py-2 px-3 rounded-[2px] tracking-wider uppercase hover:shadow-[0_0_12px_rgba(37,211,102,0.4)]'
                          }`}
                        >
                          <WhatsAppIcon size={13} />
                          {m.estado === 'enviado' ? 'Enviado' : 'Enviar'}
                        </button>
                      </div>
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
