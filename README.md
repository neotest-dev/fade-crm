# ✂️ Fade CRM - Plataforma de Gestión y Reservas para Barberías y Centros de Estética

**Fade CRM** es una plataforma moderna para la gestión integral de barberías, peluquerías y centros de estética. Permite administrar agendamiento de citas, base de datos de clientes, catálogo de servicios e inventario de productos, registro de ventas, mensajes sugeridos para WhatsApp y un portal público de reservas.

---

## 🚀 Arquitectura y Tecnologías Reales del Proyecto

- **Framework Web:** Next.js 16 (React 19, App Router, TypeScript)
- **Estilos & UI:** Tailwind CSS v4 (`@tailwindcss/postcss`), `@base-ui/react`, `tw-animate-css`, `clsx`, `tailwind-merge`
- **Iconografía:** Lucide React (`lucide-react`)
- **Base de Datos & Backend Serverless:** Supabase (`@supabase/supabase-js`, PostgreSQL + Row Level Security - RLS)
- **Herramientas de IA & Agentes:** Impeccable UI (`.agents/skills/impeccable`) + Codebase Memory MCP (`.mcp.json`)
- **Analíticas:** `@vercel/analytics`
- **Gestor de Paquetes:** `pnpm` (`pnpm@11.10.0`)

---

## 🤖 Integración Preconfigurada para Agentes IA (Impeccable & Codebase Memory)

Este repositorio incluye **configuración Zero-Setup para asistentes de IA**:

1. **Impeccable UI (`.agents/skills/impeccable`):**
   - Habilidades de diseño de UI/UX, componentes accesibles y estándares visuales guardadas directamente en el repositorio.
2. **Codebase Memory MCP (`.mcp.json`):**
   - Configuración MCP registrada en la raíz para indexación y análisis estructural del código con grafo 3D.
3. **Reglas del Agente (`.agents/AGENTS.md`):**
   - Directivas y perfil del equipo de arquitectura guardados en la carpeta `.agents/`.

### 📌 ¿Cómo funciona en otro equipo o clon del repositorio?
- Todas las habilidades (`.agents/skills/impeccable`), reglas (`.agents/AGENTS.md`) y la configuración MCP (`.mcp.json`) están en el control de versiones (Git).
- Únicamente debes asegurarte de tener instalado el binario ejecutable de `codebase-memory-mcp` en tu equipo una sola vez:
  ```powershell
  iwr -useb https://raw.githubusercontent.com/DeusData/codebase-memory-mcp/main/install.ps1 | iex
  ```

---

## 📁 Estructura del Proyecto

```text
fade-crm/
├── .agents/              # Configuración y reglas para Agentes AI
│   ├── skills/           # Habilidades instaladas (impeccable, etc.)
│   └── AGENTS.md         # Reglas de arquitectura y estándares del agente
├── app/                  # Rutas de Next.js 16 App Router
│   ├── citas/            # Gestión y agenda de citas (/citas)
│   ├── clientes/         # Directorio y CRM de clientes (/clientes)
│   ├── configuracion/    # Configuración de barbería y barberos (/configuracion)
│   ├── dashboard/        # Panel principal con resumen de métricas (/dashboard)
│   ├── mensajes/         # Centro de mensajes sugeridos para WhatsApp (/mensajes)
│   ├── productos/        # Gestión de inventario de productos (/productos)
│   ├── reportes/         # Reportes financieros y de ingresos (/reportes)
│   ├── reservar/         # Portal público de reservas para clientes (/reservar)
│   ├── servicios/        # Catálogo de servicios de cortes y barba (/servicios)
│   ├── ventas/           # Histórico y registro de transacciones (/ventas)
│   ├── globals.css       # Estilos globales con Tailwind CSS v4
│   └── layout.tsx        # Layout principal de la aplicación
├── components/           # Componentes UI de la aplicación
│   ├── admin-guard.tsx   # Protección de rutas administrativas
│   ├── navbar.tsx        # Navegación principal
│   ├── top-bar.tsx       # Barra superior de usuario y accesos
│   └── ui/               # Componentes atómicos de UI (button, etc.)
├── docs/                 # Documentación técnica del proyecto
│   ├── roadmap.md        # Hoja de ruta y progreso de características
│   └── srs_requirements.md # Especificación de requerimientos de software (SRS)
├── hooks/                # Custom React Hooks para Supabase
│   ├── use-citas.ts      # CRUD de citas
│   ├── use-clientes.ts   # CRUD de clientes
│   ├── use-horarios.ts   # Horarios de atención de barberías
│   ├── use-mensajes.ts   # Mensajes sugeridos de seguimiento
│   ├── use-productos.ts  # CRUD de productos
│   ├── use-servicios.ts  # CRUD de servicios
│   ├── use-usuarios.ts   # Gestión de barberos/personal
│   └── use-ventas.ts     # Registro de ventas
├── lib/                  # Helpers e integraciones
│   ├── supabase.ts       # Inicialización del cliente de Supabase
│   ├── utils.ts          # Utilidades de clases y formato
│   └── whatsapp.ts       # Generador de enlaces para WhatsApp (wa.me)
├── supabase/             # Esquemas de base de datos y migraciones
│   └── migrations/       # Scripts SQL (001_create_tables, 002_fix_rls, etc.)
├── .mcp.json             # Configuración del servidor MCP Codebase Memory
└── package.json          # Configuración del proyecto y dependencias
```

---

## ⚙️ Configuración de Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

---

## 🛠️ Instalación y Ejecución Local

### 1. Instalación de dependencias
```bash
pnpm install
```

### 2. Modo Desarrollo
```bash
pnpm dev
```
Accede a `http://localhost:3000` (o `http://localhost:8080`).

### 3. Validación de Compilación
```bash
pnpm build
```

---

## 📚 Documentación Técnica

- 🤖 [Reglas del Agente AI (.agents/AGENTS.md)](file:///c:/Users/neotestdev/antigravity/fade-crm/.agents/AGENTS.md)
- 🗺️ [Hoja de Ruta (docs/roadmap.md)](file:///c:/Users/neotestdev/antigravity/fade-crm/docs/roadmap.md)
- 📋 [Requerimientos del Sistema (docs/srs_requirements.md)](file:///c:/Users/neotestdev/antigravity/fade-crm/docs/srs_requirements.md)
