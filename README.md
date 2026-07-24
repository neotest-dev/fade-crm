# ✂️ Fade CRM - Plataforma de Gestión y Reservas para Barberías y Centros de Estética

**Fade CRM** es una solución integral multi-tenant orientada a barberías, peluquerías y centros de estética. Combina un dashboard de gestión en tiempo real (Next.js 16), gestión de citas, base de datos de clientes, servicios, productos, ventas, mensajes para WhatsApp y un portal público de reservas.

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

## 🤖 Configuración e Instalación de Agentes de IA (Zero-Setup)

Este repositorio viene con la **configuración pre-instalada y lista en Git** para que cualquier asistente o desarrollador tenga las herramientas de IA disponibles:

- **Habilidades de Diseño:** [.agents/skills/impeccable](file:///c:/Users/neotestdev/antigravity/fade-crm/.agents/skills/impeccable)
- **Configuración de Servidor MCP:** [.mcp.json](file:///c:/Users/neotestdev/antigravity/fade-crm/.mcp.json)
- **Hooks de Calidad:** [.codex/hooks.json](file:///c:/Users/neotestdev/antigravity/fade-crm/.codex/hooks.json)
- **Reglas del Proyecto:** [.agents/AGENTS.md](file:///c:/Users/neotestdev/antigravity/fade-crm/.agents/AGENTS.md)

### 📌 Instalación en un Equipo Nuevo / Clon del Repositorio

1. **Clonar el proyecto:**
   ```bash
   git clone https://github.com/neotest-dev/fade-crm.git
   cd fade-crm
   pnpm install
   ```

2. **Instalar el ejecutable de Codebase Memory MCP (Solo 1 vez en PowerShell):**
   ```powershell
   iwr -useb https://raw.githubusercontent.com/DeusData/codebase-memory-mcp/main/install.ps1 | iex
   ```

3. **¡Listo!** No necesitas volver a configurar ni `impeccable` ni `codebase-memory`. El archivo `.mcp.json` y las habilidades de `.agents/` se cargan de forma automática.

---

## 📁 Estructura del Proyecto

```text
fade-crm/
├── .agents/              # Reglas y habilidades para Agentes AI
│   ├── skills/           # Habilidades instaladas (impeccable, etc.)
│   └── AGENTS.md         # Reglas de arquitectura del proyecto
├── .codex/               # Configuración de hooks de diseño
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
│   └── ventas/           # Histórico y registro de transacciones (/ventas)
├── components/           # Componentes UI de la aplicación
├── docs/                 # Documentación técnica del proyecto (SRS, Roadmap)
├── hooks/                # Custom React Hooks para Supabase
├── lib/                  # Helpers e integraciones (Supabase, WhatsApp)
├── supabase/             # Esquemas de base de datos y migraciones RLS
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

### 1. Modo Desarrollo
```bash
pnpm dev
```
Accede a `http://localhost:3000` (o `http://localhost:8080`).

### 2. Validación de Compilación
```bash
pnpm build
```

---

## 📚 Documentación Técnica

- 🤖 [Reglas del Agente AI (.agents/AGENTS.md)](file:///c:/Users/neotestdev/antigravity/fade-crm/.agents/AGENTS.md)
- 🗺️ [Hoja de Ruta (docs/roadmap.md)](file:///c:/Users/neotestdev/antigravity/fade-crm/docs/roadmap.md)
- 📋 [Requerimientos del Sistema (docs/srs_requirements.md)](file:///c:/Users/neotestdev/antigravity/fade-crm/docs/srs_requirements.md)
