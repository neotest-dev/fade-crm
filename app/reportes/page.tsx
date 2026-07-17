'use client';

import { useEffect, useState } from 'react';
import { Navbar } from '@/components/navbar';
import { TopBar } from '@/components/top-bar';
import { useSidebar } from '@/components/sidebar-context';
import { supabase } from '@/lib/supabase';
import { BarChart3, TrendingUp, Users, Calendar } from 'lucide-react';

const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

type Periodo = 'semana' | 'mes';

interface ReporteData {
  ventasPorDia: { label: string; value: number }[];
  serviciosTop: { nombre: string; count: number }[];
  clientesTop: { nombre: string; total_cortes: number }[];
  totalVentas: number;
  totalCitas: number;
  citasConfirmadas: number;
  citasCanceladas: number;
}

export default function ReportesPage() {
  const { collapsed } = useSidebar();
  const [periodo, setPeriodo] = useState<Periodo>('semana');
  const [loading, setLoading] = useState(true);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [data, setData] = useState<ReporteData>({
    ventasPorDia: [],
    serviciosTop: [],
    clientesTop: [],
    totalVentas: 0,
    totalCitas: 0,
    citasConfirmadas: 0,
    citasCanceladas: 0,
  });

  const mainClass = collapsed ? 'lg:ml-16' : 'lg:ml-64';

  useEffect(() => { fetchReportes(); }, [periodo]);

  const fetchReportes = async () => {
    setLoading(true);
    try {
      const now = new Date();
      let startDate: Date;

      if (periodo === 'semana') {
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 6);
      } else {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      }

      const startStr = startDate.toISOString().split('T')[0];

      const [
        { data: ventasData },
        { data: clientesData },
        { data: citasData },
      ] = await Promise.all([
        supabase.from('ventas').select('precio, fecha, servicio_id, servicios(nombre)').gte('fecha', startStr),
        supabase.from('clientes').select('nombre, total_cortes').order('total_cortes', { ascending: false }).limit(8),
        supabase.from('citas').select('estado, fecha').gte('fecha', startStr),
      ]);

      // Ventas por periodo
      let ventasPorDia: { label: string; value: number }[] = [];
      if (periodo === 'semana') {
        ventasPorDia = DIAS.map((_, idx) => {
          const d = new Date(now);
          d.setDate(now.getDate() - (6 - idx));
          const dateStr = d.toISOString().split('T')[0];
          const value = ventasData?.filter((v) => v.fecha.startsWith(dateStr)).reduce((s, v) => s + (v.precio || 0), 0) || 0;
          return { label: DIAS[d.getDay()], value };
        });
      } else {
        // Group by week of month
        const weeks: { [k: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0 };
        ventasData?.forEach((v) => {
          const day = new Date(v.fecha).getDate();
          const week = Math.ceil(day / 7);
          weeks[Math.min(week, 4)] += v.precio || 0;
        });
        ventasPorDia = Object.entries(weeks).map(([w, v]) => ({ label: `Sem ${w}`, value: v }));
      }

      // Servicios top
      const servicioCount: Record<string, number> = {};
      ventasData?.forEach((v: any) => {
        const nombre = v.servicios?.nombre || 'Sin servicio';
        servicioCount[nombre] = (servicioCount[nombre] || 0) + 1;
      });
      const serviciosTop = Object.entries(servicioCount).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([nombre, count]) => ({ nombre, count }));

      const totalVentas = ventasData?.reduce((s, v) => s + (v.precio || 0), 0) || 0;
      const totalCitas = citasData?.length || 0;
      const citasConfirmadas = citasData?.filter((c) => c.estado === 'confirmada').length || 0;
      const citasCanceladas = citasData?.filter((c) => c.estado === 'cancelada').length || 0;

      setData({ ventasPorDia, serviciosTop, clientesTop: clientesData || [], totalVentas, totalCitas, citasConfirmadas, citasCanceladas });
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const maxBar = Math.max(...data.ventasPorDia.map((d) => d.value), 1);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />
      <main className={`${mainClass} transition-all duration-300`}>
        <TopBar />
        <div className="pt-[57px]">
          <div className="p-4 sm:p-6 lg:p-8">

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 animate-fade-up">
              <div>
                <h2 className="page-title">REPORTES</h2>
                <p className="page-subtitle">Análisis con datos reales</p>
              </div>
              <div className="flex gap-2">
                {(['semana', 'mes'] as Periodo[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriodo(p)}
                    className={`px-4 py-1.5 rounded-sm text-[10px] font-bold uppercase tracking-widest border transition-all ${
                      periodo === p ? 'bg-[#c8a55a] text-[#0a0a0a] border-[#c8a55a]' : 'bg-transparent text-[#555] border-[#222] hover:text-white'
                    }`}
                  >
                    {p === 'semana' ? 'Esta semana' : 'Este mes'}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-16"><div className="spinner" /></div>
            ) : (
              <>
                {/* Summary Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                  {[
                    { label: 'Ingresos', value: `S/ ${data.totalVentas.toFixed(2)}`, icon: <TrendingUp size={18} />, cls: 'icon-gold' },
                    { label: 'Total citas', value: String(data.totalCitas), icon: <Calendar size={18} />, cls: 'icon-gold' },
                    { label: 'Confirmadas', value: String(data.citasConfirmadas), icon: <Calendar size={18} />, cls: 'icon-neon' },
                    { label: 'Canceladas', value: String(data.citasCanceladas), icon: <Calendar size={18} />, cls: 'icon-gold' },
                  ].map((s, idx) => (
                    <div key={idx} className={`stat-card animate-fade-up delay-${idx + 1}`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-[#555] text-[10px] font-bold uppercase tracking-widest">{s.label}</p>
                          <p className="text-2xl font-[family-name:var(--font-display)] text-white mt-1">{s.value}</p>
                        </div>
                        <div className={s.cls}>{s.icon}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">
                  {/* Bar Chart */}
                  <div className="lg:col-span-7 card-solid p-5 animate-fade-up delay-2">
                    <h3 className="font-[family-name:var(--font-display)] text-lg tracking-wide text-white mb-5">
                      INGRESOS — {periodo === 'semana' ? 'POR DÍA' : 'POR SEMANA'}
                    </h3>
                    <div className="flex items-end gap-3 h-44">
                      {data.ventasPorDia.map((item, idx) => {
                        const h = (item.value / maxBar) * 100;
                        const isHov = hoveredBar === idx;
                        return (
                          <div
                            key={idx}
                            className="flex-1 flex flex-col items-center gap-2 relative"
                            onMouseEnter={() => setHoveredBar(idx)}
                            onMouseLeave={() => setHoveredBar(null)}
                          >
                            {isHov && item.value > 0 && (
                              <div className="absolute -top-9 bg-[#1a1a1a] border border-[#333] rounded px-2 py-0.5 text-[10px] text-[#c8a55a] font-bold whitespace-nowrap z-10">
                                S/ {item.value.toLocaleString()}
                              </div>
                            )}
                            <div className="bar-chart-bar w-full min-h-[4px]" style={{ height: `${Math.max(h, 4)}%` }} />
                            <span className="text-[10px] text-[#444] font-bold uppercase">{item.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Servicios Top */}
                  <div className="lg:col-span-5 card-solid p-5 animate-fade-up delay-3">
                    <h3 className="font-[family-name:var(--font-display)] text-lg tracking-wide text-white mb-5">SERVICIOS TOP</h3>
                    {data.serviciosTop.length === 0 ? (
                      <p className="text-[#444] text-sm text-center py-8">Sin datos</p>
                    ) : (
                      <div className="space-y-4">
                        {data.serviciosTop.map((s, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <span className="font-[family-name:var(--font-display)] text-base text-[#c8a55a] w-5">{idx + 1}</span>
                            <div className="flex-1">
                              <div className="flex justify-between mb-1.5">
                                <span className="text-sm font-bold text-white">{s.nombre}</span>
                                <span className="text-xs text-[#555] font-bold">{s.count}x</span>
                              </div>
                              <div className="progress-bar">
                                <div className="progress-bar-fill" style={{ width: `${(s.count / (data.serviciosTop[0]?.count || 1)) * 100}%` }} />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Clientes Top */}
                <div className="card-solid p-5 animate-fade-up delay-4">
                  <h3 className="font-[family-name:var(--font-display)] text-lg tracking-wide text-white mb-5">CLIENTES FRECUENTES</h3>
                  {data.clientesTop.length === 0 ? (
                    <p className="text-[#444] text-sm text-center py-4">Sin datos</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {data.clientesTop.map((c, idx) => (
                        <div key={idx} className="card-street p-4 flex items-center gap-3">
                          <span className="font-[family-name:var(--font-display)] text-2xl text-[#c8a55a]">#{idx + 1}</span>
                          <div>
                            <p className="text-sm font-bold text-white">{c.nombre}</p>
                            <p className="text-[10px] text-[#444] uppercase tracking-wider font-bold">{c.total_cortes} visitas</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
