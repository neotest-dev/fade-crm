# 🗺️ Hoja de Ruta (Roadmap) - Fade CRM

Este documento detalla las fases y el estado actual de desarrollo de **Fade CRM** (Plataforma CRM y Sistema de Reservas para Barberías y Centros de Estética).

---

## 🗺️ Fases de Desarrollo y Lista de Tareas

### 🏗️ Fase 1: Configuración Base del Proyecto y Supabase
* [x] **F1-T1:** Inicialización del proyecto Next.js 16 (App Router) con TypeScript, Tailwind CSS v4 y `pnpm`.
* [x] **F1-T2:** Configuración del cliente Supabase (`lib/supabase.ts`) utilizando variables de entorno (`NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
* [x] **F1-T3:** Definición del esquema inicial de base de datos PostgreSQL (`supabase/migrations/001_create_tables.sql`): `barberias`, `usuarios`, `servicios`, `productos`, `horarios`, `citas`, `clientes`, `ventas`, `mensajes_sugeridos`.
* [x] **F1-T4:** Configuración de políticas de Row Level Security (RLS) en Supabase (`supabase/migrations/002_fix_rls.sql`).

### 🎨 Fase 2: Layout, Navegación y UI Base
* [x] **F2-T1:** Creación del Layout principal con `Navbar`, `TopBar` y contexto de navegación (`components/navbar.tsx`, `components/top-bar.tsx`).
* [x] **F2-T2:** Implementación de tema visual oscuro/moderno con Tailwind CSS v4 y Lucide Icons (`app/globals.css`).
* [x] **F2-T3:** Componentes atómicos de UI (`components/ui/button.tsx`) utilizando `@base-ui/react` y `clsx` / `tailwind-merge`.
* [x] **F2-T4:** Protección de rutas administrativas con `AdminGuard` (`components/admin-guard.tsx`).

### 📅 Fase 3: Módulo de Citas y Agendamiento (REQ-F-01)
* [x] **F3-T1:** Custom hook `hooks/use-citas.ts` para operaciones CRUD sobre la tabla `citas` con relaciones a `clientes`, `servicios` y `usuarios` (barberos).
* [x] **F3-T2:** Vista principal de agenda de citas (`app/citas/page.tsx`) con filtros por estado (`pendiente`, `confirmada`, `cancelada`).
* [x] **F3-T3:** Funcionalidad para actualizar estados de citas en tiempo real.

### 👥 Fase 4: CRM de Clientes, Servicios y Productos (REQ-F-02)
* [x] **F4-T1:** Custom hook y módulo de gestión de clientes (`hooks/use-clientes.ts` y `app/clientes/page.tsx`).
* [x] **F4-T2:** Custom hook y catálogo de servicios de corte/barba (`hooks/use-servicios.ts` y `app/servicios/page.tsx`).
* [x] **F4-T3:** Custom hook y control de inventario de productos (`hooks/use-productos.ts` y `app/productos/page.tsx`).
* [x] **F4-T4:** Configuración de horarios de atención por barbería (`hooks/use-horarios.ts` y `app/configuracion/page.tsx`).

### 💵 Fase 5: Registro de Ventas y Reportes Financieros (REQ-F-03)
* [x] **F5-T1:** Custom hook de ventas (`hooks/use-ventas.ts`) para registrar cobros de servicios y productos.
* [x] **F5-T2:** Pantalla de historial de transacciones y ventas (`app/ventas/page.tsx`).
* [x] **F5-T3:** Dashboard de métricas principales e ingresos (`app/dashboard/page.tsx` y `app/reportes/page.tsx`).

### 💬 Fase 6: Mensajes Sugeridos y WhatsApp Integration (REQ-F-04)
* [x] **F6-T1:** Mapeo de la tabla `mensajes_sugeridos` para recordatorios y seguimiento de clientes (`hooks/use-mensajes.ts`).
* [x] **F6-T2:** Generador de enlaces directos a WhatsApp (`lib/whatsapp.ts` `wa.me/${phone}?text=${msg}`).
* [x] **F6-T3:** Centro de mensajería rápida (`app/mensajes/page.tsx`) para envío con un clic.

### 🌐 Fase 7: Portal Público de Reservas del Cliente (REQ-F-05)
* [x] **F7-T1:** Portal autoservicio público para clientes finales (`app/reservar/page.tsx`).
* [x] **F7-T2:** Flujo de selección de cita, servicio y barbero (`app/reservar/cita/page.tsx`).
* [x] **F7-T3:** Compra y reserva de productos complementarios (`app/reservar/productos/page.tsx`).

---

## 📈 Progreso General del Proyecto
* **Fase 1 (Configuración & DB Supabase):** 100%
* **Fase 2 (UI & Navegación Base):** 100%
* **Fase 3 (Módulo de Citas):** 100%
* **Fase 4 (CRM, Servicios & Productos):** 100%
* **Fase 5 (Ventas & Reportes):** 100%
* **Fase 6 (WhatsApp & Mensajes Sugeridos):** 100%
* **Fase 7 (Portal Público /reservar):** 100%
