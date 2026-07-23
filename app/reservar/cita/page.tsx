'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Check, ChevronRight, Clock, Scissors, User, Calendar, AlertCircle } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Servicio { id: string; nombre: string; precio: number; duracion_min: number; }
interface Barbero { id: string; nombre: string; }
interface ClienteExistente { id: string; nombre: string; telefono: string; }

const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateSlots(horaInicio: string, horaFin: string, duracionMin: number): string[] {
  const slots: string[] = [];
  const [startH, startM] = horaInicio.split(':').map(Number);
  const [endH, endM] = horaFin.split(':').map(Number);
  let current = startH * 60 + startM;
  const end = endH * 60 + endM;
  while (current + duracionMin <= end) {
    const h = Math.floor(current / 60).toString().padStart(2, '0');
    const m = (current % 60).toString().padStart(2, '0');
    slots.push(`${h}:${m}`);
    current += duracionMin;
  }
  return slots;
}

function getNextDays(count: number): Date[] {
  const days: Date[] = [];
  const today = new Date();
  for (let i = 1; i <= count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }
  return days;
}

// ─── Step Indicator ───────────────────────────────────────────────────────────

function StepIndicator({ current, total }: { current: number; total: number }) {
  const steps = ['Tus datos', 'Servicio', 'Fecha y hora'];
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {steps.map((label, idx) => {
        const step = idx + 1;
        const done = step < current;
        const active = step === current;
        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-8 h-8 rounded-sm flex items-center justify-center text-xs font-bold transition-all ${
                done ? 'bg-[#c8a55a] text-[#0a0a0a]' : active ? 'bg-[#c8a55a]/20 border border-[#c8a55a] text-[#c8a55a]' : 'bg-[#151515] border border-[#222] text-[#444]'
              }`}>
                {done ? <Check size={14} /> : step}
              </div>
              <span className={`text-[9px] font-bold uppercase tracking-wider hidden sm:block ${active ? 'text-[#c8a55a]' : done ? 'text-[#888]' : 'text-[#333]'}`}>{label}</span>
            </div>
            {idx < steps.length - 1 && (
              <div className={`w-12 sm:w-20 h-[1px] mx-1 ${done ? 'bg-[#c8a55a]' : 'bg-[#1e1e1e]'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

function CitaForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Step 1 — Datos cliente
  const [clienteId, setClienteId] = useState<string | null>(null);
  const [telefono, setTelefono] = useState('');
  const [nombreCliente, setNombreCliente] = useState('');

  // Step 2 — Servicio y barbero
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [barberos, setBarberos] = useState<Barbero[]>([]);
  const [selectedServicio, setSelectedServicio] = useState<Servicio | null>(null);
  const [selectedBarbero, setSelectedBarbero] = useState<Barbero | null>(null);

  // Step 3 — Fecha y hora
  const [availableDays, setAvailableDays] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [slots, setSlots] = useState<string[]>([]);
  const [occupiedSlots, setOccupiedSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [horarioActivo, setHorarioActivo] = useState<{ hora_inicio: string; hora_fin: string } | null>(null);

  // ── Init ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const preservicioId = searchParams.get('servicio');

    // Load services and barberos in parallel
    Promise.all([
      supabase.from('servicios').select('*').order('nombre'),
      supabase.from('usuarios').select('id, nombre').order('nombre'),
    ]).then(([s, u]) => {
      setServicios(s.data || []);
      setBarberos(u.data || []);
      if (preservicioId && s.data) {
        const pre = s.data.find((x) => x.id === preservicioId);
        if (pre) setSelectedServicio(pre);
      }
    });
  }, [searchParams]);

  // ── Step 1: Check / Create cliente ────────────────────────────────────────
  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (!telefono || telefono.length < 9) throw new Error('Ingresa un teléfono válido.');
      if (!nombreCliente.trim()) throw new Error('Ingresa tu nombre.');

      let targetId = clienteId;

      if (targetId) {
        await supabase.from('clientes').update({ nombre: nombreCliente, telefono }).eq('id', targetId);
      } else {
        const { data: byPhone } = await supabase.from('clientes').select('*').eq('telefono', telefono).maybeSingle();
        if (byPhone) {
          await supabase.from('clientes').update({ nombre: nombreCliente }).eq('id', byPhone.id);
          targetId = byPhone.id;
        } else {
          const { data: created, error: err } = await supabase
            .from('clientes')
            .insert([{ nombre: nombreCliente, telefono }])
            .select()
            .single();
          if (err) throw err;
          targetId = created.id;
        }
        setClienteId(targetId);
      }

      if (targetId) {
        const { data: activeCitas } = await supabase
          .from('citas')
          .select('id')
          .eq('cliente_id', targetId)
          .in('estado', ['pendiente', 'confirmada']);
        if ((activeCitas?.length || 0) >= 1) {
          throw new Error('Ya tienes una cita activa con este teléfono. Espera a que se complete o cancela la actual.');
        }
      }

      setStep(2);
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error.');
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Select service & barber ───────────────────────────────────────
  const handleStep2 = () => {
    if (!selectedServicio) { setError('Selecciona un servicio.'); return; }
    setError('');
    setStep(3);
    // Build available days based on horarios
    loadAvailableDays();
  };

  const loadAvailableDays = async () => {
    const { data: horarios } = await supabase.from('horarios').select('*');
    const activeDiasSet = new Set((horarios || []).filter((h) => h.activo).map((h) => h.dia_semana));
    const days = getNextDays(21).filter((d) => activeDiasSet.has(d.getDay())).slice(0, 14);
    setAvailableDays(days);
  };

  // ── Step 3: Select date → load slots ──────────────────────────────────────
  const handleDateSelect = async (date: Date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setSlots([]);
    if (!selectedServicio) return;

    const diaSemana = date.getDay();
    const { data: horario } = await supabase
      .from('horarios')
      .select('hora_inicio, hora_fin')
      .eq('dia_semana', diaSemana)
      .eq('activo', true)
      .maybeSingle();

    if (!horario) return;
    setHorarioActivo(horario);

    const allSlots = generateSlots(horario.hora_inicio, horario.hora_fin, selectedServicio.duracion_min);
    const dateStr = date.toISOString().split('T')[0];

    // Fetch occupied slots for that date/barber
    let query = supabase.from('citas').select('hora').eq('fecha', dateStr).in('estado', ['pendiente', 'confirmada']);
    if (selectedBarbero) query = query.eq('barbero_id', selectedBarbero.id);
    const { data: citasOcupadas } = await query;
    const occupied = (citasOcupadas || []).map((c) => c.hora.slice(0, 5));

    setOccupiedSlots(occupied);
    setSlots(allSlots);
  };

  // ── Confirm booking ────────────────────────────────────────────────────────
  const handleConfirm = async () => {
    if (!selectedSlot || !selectedDate || !clienteId || !selectedServicio) return;
    setLoading(true);
    setError('');
    try {
      const fechaStr = selectedDate.toISOString().split('T')[0];
      await supabase.from('citas').insert([{
        cliente_id: clienteId,
        barbero_id: selectedBarbero?.id || null,
        servicio_id: selectedServicio.id,
        fecha: fechaStr,
        hora: selectedSlot + ':00',
        estado: 'pendiente',
      }]);
      router.push(`/reservar/confirmacion?servicio=${encodeURIComponent(selectedServicio.nombre)}&barbero=${encodeURIComponent(selectedBarbero?.nombre || 'Cualquier barbero')}&fecha=${fechaStr}&hora=${selectedSlot}`);
    } catch (err: any) {
      setError(err.message || 'Error al reservar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c8a55a] mb-2">Reserva tu cita</p>
        <h1 className="font-[family-name:var(--font-display)] text-4xl text-white">Agenda tu visita</h1>
      </div>

      <StepIndicator current={step} total={3} />

      {error && (
        <div className="flex items-center gap-2 bg-[#ff2d2d]/10 border border-[#ff2d2d]/30 text-[#ff2d2d] text-sm px-4 py-3 rounded-sm mb-6">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* ─ STEP 1: Datos cliente ─ */}
      {step === 1 && (
        <div className="card-solid p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="icon-gold"><User size={16} /></div>
            <h2 className="font-[family-name:var(--font-display)] text-xl text-white">Tus datos</h2>
          </div>
          <form onSubmit={handleStep1} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#555] mb-1.5">Nombre</label>
              <input
                type="text"
                value={nombreCliente}
                onChange={(e) => setNombreCliente(e.target.value)}
                className="input-dark"
                required
                placeholder="Tu nombre"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#555] mb-1.5">Teléfono *</label>
              <input
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="input-dark"
                required
                placeholder="987 654 321"
              />
              <p className="text-[10px] text-[#444] mt-1.5">Te contactaremos por WhatsApp para confirmar.</p>
            </div>
            <button type="submit" disabled={loading} className="btn-gold w-full justify-center">
              {loading ? 'Verificando...' : 'Continuar'} <ChevronRight size={15} />
            </button>
          </form>
        </div>
      )}

      {/* ─ STEP 2: Servicio y barbero ─ */}
      {step === 2 && (
        <div className="space-y-5">
          <div className="card-solid p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="icon-gold"><Scissors size={16} /></div>
              <h2 className="font-[family-name:var(--font-display)] text-xl text-white">Elige el servicio</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {servicios.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedServicio(s)}
                  className={`text-left p-4 border rounded-sm transition-all ${
                    selectedServicio?.id === s.id
                      ? 'border-[#c8a55a] bg-[#c8a55a]/5'
                      : 'border-[#1e1e1e] hover:border-[#333]'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <p className="font-bold text-white text-sm">{s.nombre}</p>
                    <span className="font-[family-name:var(--font-display)] text-lg text-[#c8a55a]">S/ {s.precio}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#444] text-xs mt-1">
                    <Clock size={11} />{s.duracion_min} min
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="card-solid p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="icon-gold"><User size={16} /></div>
              <h2 className="font-[family-name:var(--font-display)] text-xl text-white">Elige el barbero</h2>
              <span className="text-[10px] text-[#444] uppercase tracking-wider ml-auto">(Opcional)</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                onClick={() => setSelectedBarbero(null)}
                className={`p-4 border rounded-sm text-center transition-all ${
                  !selectedBarbero ? 'border-[#c8a55a] bg-[#c8a55a]/5' : 'border-[#1e1e1e] hover:border-[#333]'
                }`}
              >
                <p className="font-bold text-white text-sm">Cualquiera</p>
                <p className="text-[#444] text-[10px] mt-0.5">Sin preferencia</p>
              </button>
              {barberos.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setSelectedBarbero(b)}
                  className={`p-4 border rounded-sm text-center transition-all ${
                    selectedBarbero?.id === b.id ? 'border-[#c8a55a] bg-[#c8a55a]/5' : 'border-[#1e1e1e] hover:border-[#333]'
                  }`}
                >
                  <div className="w-8 h-8 rounded-sm bg-gradient-to-br from-[#c8a55a]/20 to-[#c8a55a]/5 border border-[#c8a55a]/20 flex items-center justify-center text-[10px] font-bold text-[#c8a55a] mx-auto mb-1">
                    {b.nombre.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                  </div>
                  <p className="font-bold text-white text-sm">{b.nombre.split(' ')[0]}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="btn-ghost flex-1 justify-center">Atrás</button>
            <button onClick={handleStep2} className="btn-gold flex-1 justify-center">
              Continuar <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* ─ STEP 3: Fecha y hora ─ */}
      {step === 3 && (
        <div className="space-y-5">
          <div className="card-solid p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="icon-gold"><Calendar size={16} /></div>
              <h2 className="font-[family-name:var(--font-display)] text-xl text-white">Elige el día</h2>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {availableDays.map((day) => {
                const isSelected = selectedDate?.toDateString() === day.toDateString();
                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => handleDateSelect(day)}
                    className={`p-3 border rounded-sm text-center transition-all ${
                      isSelected ? 'border-[#c8a55a] bg-[#c8a55a]/5' : 'border-[#1e1e1e] hover:border-[#333]'
                    }`}
                  >
                    <p className="text-[9px] font-bold uppercase tracking-wider text-[#555]">{DIAS[day.getDay()].slice(0, 3)}</p>
                    <p className="font-[family-name:var(--font-display)] text-lg text-white">{day.getDate()}</p>
                    <p className="text-[9px] text-[#444]">{day.toLocaleDateString('es-PE', { month: 'short' })}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedDate && slots.length > 0 && (
            <div className="card-solid p-5">
              <h3 className="font-[family-name:var(--font-display)] text-lg text-white mb-4">Horarios disponibles</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {slots.map((slot) => {
                  const occupied = occupiedSlots.includes(slot);
                  const isSelected = selectedSlot === slot;
                  return (
                    <button
                      key={slot}
                      disabled={occupied}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-2.5 border rounded-sm text-sm font-bold transition-all ${
                        occupied
                          ? 'border-[#1a1a1a] text-[#2a2a2a] cursor-not-allowed line-through'
                          : isSelected
                          ? 'border-[#c8a55a] bg-[#c8a55a]/5 text-[#c8a55a]'
                          : 'border-[#1e1e1e] text-[#888] hover:border-[#c8a55a]/50 hover:text-white'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Summary */}
          {selectedDate && selectedSlot && (
            <div className="card-solid p-4 border-l-4 border-l-[#c8a55a]">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#555] mb-2">Resumen de tu cita</p>
              <div className="space-y-1 text-sm">
                <p className="text-white"><span className="text-[#555]">Servicio:</span> {selectedServicio?.nombre} — S/ {selectedServicio?.precio}</p>
                <p className="text-white"><span className="text-[#555]">Barbero:</span> {selectedBarbero?.nombre || 'Cualquier barbero'}</p>
                <p className="text-white"><span className="text-[#555]">Fecha:</span> {selectedDate.toLocaleDateString('es-PE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p className="text-white"><span className="text-[#555]">Hora:</span> {selectedSlot}</p>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="btn-ghost flex-1 justify-center">Atrás</button>
            <button
              onClick={handleConfirm}
              disabled={!selectedSlot || loading}
              className={`flex-1 justify-center ${(!selectedSlot || loading) ? 'btn-ghost opacity-50 cursor-not-allowed' : 'btn-gold'}`}
            >
              {loading ? 'Reservando...' : 'Confirmar Cita'} <Check size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page wrapper with Suspense for useSearchParams ───────────────────────────

export default function CitaPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-24"><div className="spinner" /></div>}>
      <CitaForm />
    </Suspense>
  );
}
