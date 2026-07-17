'use client';

import { useEffect, useState } from 'react';
import { Navbar } from '@/components/navbar';
import { TopBar } from '@/components/top-bar';
import { useSidebar } from '@/components/sidebar-context';
import { supabase } from '@/lib/supabase';
import {
  DollarSign, CalendarDays, UserPlus, Star,
  TrendingUp, Plus, Settings as SettingsIcon, ArrowUpRight,
  Megaphone, CheckCircle2, XCircle, Users, BarChart3,
} from 'lucide-react';

interface DashboardData {
  ventasHoy: number;
  ventasSemana: { day: string; value: number }[];
  citasHoy: { nombre: string; hora: string; servicio: string; estado: string }[];
  clientesFrecuentes: { nombre: string; total_cortes: number }[];
  serviciosTop: { nombre: string; count: number }[];
  totalClientes: number;
  clientesNuevosHoy: number;
  citasHoyCount: number;
}

const DIAS_SHORT = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export default function DashboardPage() {
  const { collapsed } = useSidebar();
  const [data, setData] = useState<DashboardData>({
    ventasHoy: 0,
    ventasSemana: DIAS_SHORT.map((d) => ({ day: d, value: 0 })),
    citasHoy: [],
    clientesFrecuentes: [],
    serviciosTop: [],
    totalClientes: 0,
    clientesNuevosHoy: 0,
    citasHoyCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  const mainClass = collapsed ? 'lg:ml-16' : 'lg:ml-64';

  useEffect(() => { fetchDashboard(); }, []);

  const fetchDashboard = async () => {
    try {
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];

      // Start of current week (Monday)
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      const weekStart = startOfWeek.toISOString().split('T')[0];

      const [
        { data: ventasData },
        { data: clientesData },
        { data: clientesNuevosData },
        { data: citasData },
        { data: citasTopData },
      ] = await Promise.all([
        supabase.from('ventas').select('precio, fecha').gte('fecha', weekStart),
        supabase.from('clientes').select('id, nombre, total_cortes').order('total_cortes', { ascending: false }).limit(5),
        supabase.from('clientes').select('id').gte('created_at', todayStr),
        supabase.from('citas').select('*, clientes(nombre), servicios(nombre)').eq('fecha', todayStr).order('hora'),
        supabase.from('ventas').select('servicio_id, servicios(nombre)').gte('fecha', weekStart),
      ]);

      // Ventas por día de la semana
      const ventasPorDia = DIAS_SHORT.map((day, idx) => {
        const total = ventasData
          ?.filter((v) => new Date(v.fecha).getDay() === idx)
          .reduce((sum, v) => sum + (v.precio || 0), 0) || 0;
        return { day, value: total };
      });

      // Ventas de hoy
      const ventasHoy = ventasData
        ?.filter((v) => v.fecha.startsWith(todayStr))
        .reduce((sum, v) => sum + (v.precio || 0), 0) || 0;

      // Servicios más vendidos
      const servicioCount: Record<string, number> = {};
      citasTopData?.forEach((v: any) => {
        const nombre = v.servicios?.nombre || 'Sin servicio';
        servicioCount[nombre] = (servicioCount[nombre] || 0) + 1;
      });
      const serviciosTop = Object.entries(servicioCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .map(([nombre, count]) => ({ nombre, count }));

      setData({
        ventasHoy,
        ventasSemana: ventasPorDia,
        citasHoy: (citasData || []).map((c: any) => ({
          nombre: c.clientes?.nombre || 'Cliente',
          hora: c.hora?.slice(0, 5) || '',
          servicio: c.servicios?.nombre || 'Servicio',
          estado: c.estado || 'pendiente',
        })),
        clientesFrecuentes: clientesData || [],
        serviciosTop,
        totalClientes: clientesData?.length || 0,
        clientesNuevosHoy: clientesNuevosData?.length || 0,
        citasHoyCount: citasData?.length || 0,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const maxBar = Math.max(...data.ventasSemana.map((d) => d.value), 1);

  const estadoBadge = (estado: string) => {
    if (estado === 'confirmada') return <span className="badge-confirmed">Confirmada</span>;
    if (estado === 'cancelada') return <span className="badge-cancelled">Cancelada</span>;
    return <span className="badge-pending">Pendiente</span>;
  };

  const getInitials = (name: string) =>
    name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />
      <main className={`${mainClass} transition-all duration-300`}>
        <TopBar />
        <div className="pt-[57px]">
          <div className="p-4 sm:p-6 lg:p-8">

            {/* Header */}
            <div className="mb-6 animate-fade-up">
              <h2 className="page-title">DASHBOARD</h2>
              <p className="page-subtitle">Resumen de tu barbería hoy</p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="spinner" />
              </div>
            ) : (
              <>
                {/* Stat Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                  <div className="stat-card animate-fade-up delay-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[#555] text-[10px] font-bold uppercase tracking-widest">Ingresos hoy</p>
                        <p className="text-2xl font-[family-name:var(--font-display)] text-white mt-1">
                          S/ {data.ventasHoy.toFixed(2)}
                        </p>
                        <p className="text-[11px] text-[#39ff14] mt-1 flex items-center gap-1">
                          <TrendingUp size={11} /> En tiempo real
                        </p>
                      </div>
                      <div className="icon-gold"><DollarSign size={18} /></div>
                    </div>
                  </div>

                  <div className="stat-card animate-fade-up delay-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[#555] text-[10px] font-bold uppercase tracking-widest">Citas hoy</p>
                        <p className="text-2xl font-[family-name:var(--font-display)] text-white mt-1">
                          {data.citasHoyCount}
                        </p>
                        <p className="text-[11px] text-[#555] mt-1">Programadas</p>
                      </div>
                      <div className="icon-gold"><CalendarDays size={18} /></div>
                    </div>
                  </div>

                  <div className="stat-card animate-fade-up delay-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[#555] text-[10px] font-bold uppercase tracking-widest">Clientes nuevos</p>
                        <p className="text-2xl font-[family-name:var(--font-display)] text-white mt-1">
                          {data.clientesNuevosHoy}
                        </p>
                        <p className="text-[11px] text-[#555] mt-1">Hoy</p>
                      </div>
                      <div className="icon-neon"><UserPlus size={18} /></div>
                    </div>
                  </div>

                  <div className="stat-card animate-fade-up delay-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[#555] text-[10px] font-bold uppercase tracking-widest">Total clientes</p>
                        <p className="text-2xl font-[family-name:var(--font-display)] text-white mt-1">
                          {data.totalClientes}
                        </p>
                        <p className="text-[11px] text-[#555] mt-1">Registrados</p>
                      </div>
                      <div className="icon-gold"><Star size={18} /></div>
                    </div>
                  </div>
                </div>

                {/* Middle Row */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">
                  {/* Bar Chart */}
                  <div className="lg:col-span-5 card-solid p-5 animate-fade-up delay-2">
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="font-[family-name:var(--font-display)] text-lg tracking-wide text-white">
                        INGRESOS SEMANA
                      </h3>
                    </div>
                    <div className="flex items-end gap-2 h-40">
                      {data.ventasSemana.map((item, idx) => {
                        const h = (item.value / maxBar) * 100;
                        const isHov = hoveredBar === idx;
                        return (
                          <div
                            key={item.day}
                            className="flex-1 flex flex-col items-center gap-1.5 relative"
                            onMouseEnter={() => setHoveredBar(idx)}
                            onMouseLeave={() => setHoveredBar(null)}
                          >
                            {isHov && item.value > 0 && (
                              <div className="absolute -top-8 bg-[#1a1a1a] border border-[#333] rounded px-2 py-0.5 text-[10px] text-[#c8a55a] font-bold whitespace-nowrap z-10">
                                S/ {item.value.toLocaleString()}
                              </div>
                            )}
                            <div
                              className="bar-chart-bar w-full min-h-[4px]"
                              style={{ height: `${Math.max(h, 4)}%` }}
                            />
                            <span className="text-[10px] text-[#444] font-bold uppercase">{item.day}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Próximas Citas */}
                  <div className="lg:col-span-4 card-solid p-5 animate-fade-up delay-3">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-[family-name:var(--font-display)] text-lg tracking-wide text-white">
                        CITAS HOY
                      </h3>
                      <a href="/citas" className="text-[10px] text-[#c8a55a] uppercase tracking-wider hover:text-[#dfc07f] transition-colors font-bold">
                        Ver todas →
                      </a>
                    </div>
                    {data.citasHoy.length === 0 ? (
                      <p className="text-[#444] text-sm text-center py-8">Sin citas programadas</p>
                    ) : (
                      <div className="space-y-2.5">
                        {data.citasHoy.slice(0, 5).map((c, idx) => (
                          <div key={idx} className="flex items-center gap-3 py-1.5 border-b border-[#151515] last:border-0">
                            <div className="w-8 h-8 rounded-sm bg-[#1a1a1a] border border-[#222] flex items-center justify-center text-[10px] font-bold text-[#888] shrink-0">
                              {getInitials(c.nombre)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-white truncate leading-tight">{c.nombre}</p>
                              <p className="text-[11px] text-[#444]">{c.hora} · {c.servicio}</p>
                            </div>
                            {estadoBadge(c.estado)}
                          </div>
                        ))}
                      </div>
                    )}
                    <a href="/citas" className="btn-gold w-full justify-center mt-4 text-xs">
                      <Plus size={14} /> Nueva cita
                    </a>
                  </div>

                  {/* Clientes Frecuentes */}
                  <div className="lg:col-span-3 card-solid p-5 animate-fade-up delay-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-[family-name:var(--font-display)] text-lg tracking-wide text-white">TOP</h3>
                      <a href="/clientes" className="text-[10px] text-[#c8a55a] uppercase tracking-wider hover:text-[#dfc07f] transition-colors font-bold">
                        Ver →
                      </a>
                    </div>
                    {data.clientesFrecuentes.length === 0 ? (
                      <p className="text-[#444] text-sm text-center py-8">Sin datos</p>
                    ) : (
                      <div className="space-y-2.5">
                        {data.clientesFrecuentes.map((c, idx) => (
                          <div key={idx} className="flex items-center gap-2.5">
                            <span className="text-[10px] font-bold text-[#444] w-4">{idx + 1}</span>
                            <div className="w-7 h-7 rounded-sm bg-[#1a1a1a] border border-[#222] flex items-center justify-center text-[9px] font-bold text-[#888] shrink-0">
                              {getInitials(c.nombre)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-white truncate">{c.nombre}</p>
                            </div>
                            <span className="text-[10px] text-[#555] font-bold">{c.total_cortes}</span>
                            <SettingsIcon size={12} className="text-[#333] hover:text-[#c8a55a] cursor-pointer transition-colors" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Row */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  {/* Servicios Top */}
                  <div className="lg:col-span-5 card-solid p-5 animate-fade-up delay-4">
                    <h3 className="font-[family-name:var(--font-display)] text-lg tracking-wide text-white mb-5">
                      SERVICIOS TOP
                    </h3>
                    {data.serviciosTop.length === 0 ? (
                      <p className="text-[#444] text-sm text-center py-8">Sin datos de ventas</p>
                    ) : (
                      <div className="space-y-4">
                        {data.serviciosTop.map((s, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <span className="text-sm font-[family-name:var(--font-display)] text-[#c8a55a] w-5">{idx + 1}</span>
                            <div className="flex-1">
                              <div className="flex justify-between mb-1.5">
                                <span className="text-sm font-bold text-white">{s.nombre}</span>
                                <span className="text-xs text-[#555] font-bold">{s.count}x</span>
                              </div>
                              <div className="progress-bar">
                                <div
                                  className="progress-bar-fill"
                                  style={{ width: `${(s.count / (data.serviciosTop[0]?.count || 1)) * 100}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Quick Links */}
                  <div className="lg:col-span-7 grid grid-cols-2 gap-3 animate-fade-up delay-5">
                    {[
                      { href: '/clientes', label: 'Clientes', icon: Users, desc: 'Gestiona tu cartera' },
                      { href: '/citas', label: 'Citas', icon: CalendarDays, desc: 'Agenda y confirmaciones' },
                      { href: '/ventas', label: 'Ventas', icon: DollarSign, desc: 'Registro de ingresos' },
                      { href: '/reportes', label: 'Reportes', icon: BarChart3, desc: 'Análisis y métricas' },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <a
                          key={item.href}
                          href={item.href}
                          className="card-street p-4 flex flex-col gap-2 group justify-between"
                        >
                          <div className="flex items-start justify-between">
                            <div className="w-8 h-8 rounded-sm bg-[#151515] border border-[#222] flex items-center justify-center text-[#c8a55a]">
                              <Icon size={18} />
                            </div>
                            <ArrowUpRight size={14} className="text-[#333] group-hover:text-[#c8a55a] transition-colors" />
                          </div>
                          <div>
                            <p className="font-[family-name:var(--font-display)] text-base tracking-wide text-white">
                              {item.label}
                            </p>
                            <p className="text-[11px] text-[#444] uppercase tracking-wider">{item.desc}</p>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
