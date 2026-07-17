'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, CalendarDays, MessageSquare,
  Package, Scissors, ShoppingCart, BarChart3, Settings,
  ChevronLeft, ChevronRight, X,
} from 'lucide-react';
import { useSidebar } from './sidebar-context';

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/clientes', label: 'Clientes', icon: Users },
  { href: '/citas', label: 'Citas', icon: CalendarDays },
  { href: '/mensajes', label: 'Mensajes', icon: MessageSquare, badge: 12 },
  { href: '/productos', label: 'Productos', icon: Package },
  { href: '/servicios', label: 'Servicios', icon: Scissors },
  { href: '/ventas', label: 'Ventas', icon: ShoppingCart },
  { href: '/reportes', label: 'Reportes', icon: BarChart3 },
];

export function Navbar() {
  const pathname = usePathname();
  const { collapsed, mobileOpen, toggleCollapse, closeMobile } = useSidebar();

  const sidebarWidth = collapsed ? 'w-16' : 'w-64';

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center border-b border-[#1a1a1a] ${collapsed ? 'justify-center p-4' : 'px-5 py-4 gap-3'}`}>
        <div className="w-9 h-9 rounded-sm bg-gradient-to-br from-[#c8a55a] to-[#a88a3e] flex items-center justify-center shrink-0 shadow-lg">
          <Scissors size={18} className="text-[#0a0a0a]" />
        </div>
        {!collapsed && (
          <div>
            <h1 className="text-xl leading-none text-[#c8a55a] font-[family-name:var(--font-display)] tracking-wider">
              FADE
            </h1>
            <p className="text-[9px] uppercase tracking-[0.25em] text-[#888] font-[family-name:var(--font-body)] font-700 mt-0.5">
              Barber CRM
            </p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className={`flex-1 py-3 space-y-0.5 overflow-y-auto ${collapsed ? 'px-2 sidebar-collapsed' : 'px-2'}`}>
        {links.map(({ href, label, icon: Icon, badge }) => {
          const isActive = pathname === href || (href === '/dashboard' && pathname === '/');
          return (
            <Link
              key={href}
              href={href}
              onClick={closeMobile}
              className={`sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
              title={collapsed ? label : undefined}
            >
              <Icon size={17} className="shrink-0" />
              {!collapsed && <span className="flex-1">{label}</span>}
              {!collapsed && badge && (
                <span className="link-badge min-w-[18px] h-[18px] px-1 rounded-sm bg-[#c8a55a] text-[#0a0a0a] text-[10px] font-bold flex items-center justify-center">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className={`pb-2 ${collapsed ? 'px-2 sidebar-collapsed' : 'px-2'}`}>
        <Link href="/configuracion" onClick={closeMobile} className={`sidebar-link ${pathname === '/configuracion' ? 'sidebar-link-active' : ''}`}>
          <Settings size={17} className="shrink-0" />
          {!collapsed && <span>Configuración</span>}
        </Link>
      </div>

      {/* Collapse toggle — desktop only */}
      {!mobileOpen && (
        <button
          onClick={toggleCollapse}
          className="hidden lg:flex items-center justify-center h-9 border-t border-[#1a1a1a] text-[#444] hover:text-[#c8a55a] transition-colors"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      )}

      {/* Footer image — only expanded */}
      {!collapsed && (
        <div className="relative h-32 mx-2 mb-2 rounded-sm overflow-hidden">
          <Image
            src="/barber-sidebar.png"
            alt="Barbershop"
            fill
            className="object-cover"
            sizes="220px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
          <p className="absolute bottom-3 left-3 right-3 text-[#c8a55a] text-sm leading-tight font-[family-name:var(--font-display)] tracking-wide">
            UN BUEN CORTE<br />CAMBIA TU DÍA
          </p>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* ── Desktop Sidebar ────────────────────────────── */}
      <aside
        className={`hidden lg:flex fixed left-0 top-0 h-screen ${sidebarWidth} bg-[#080808] border-r border-[#1a1a1a] flex-col z-40 transition-all duration-300`}
      >
        <SidebarContent />
      </aside>

      {/* ── Mobile Backdrop ────────────────────────────── */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={closeMobile}
        />
      )}

      {/* ── Mobile Sidebar ─────────────────────────────── */}
      <aside
        className={`lg:hidden fixed left-0 top-0 h-screen w-64 bg-[#080808] border-r border-[#1a1a1a] flex flex-col z-50 transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Close button */}
        <button
          onClick={closeMobile}
          className="absolute top-4 right-3 text-[#444] hover:text-white transition-colors z-10"
        >
          <X size={20} />
        </button>
        <SidebarContent />
      </aside>
    </>
  );
}
