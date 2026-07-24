# 🤖 AGENTS.md — Reglas y Guía para Agentes AI de Desarrollo

Este documento define el contexto, perfil, estándares y reglas estrictas de desarrollo que debe seguir cualquier Agente de Inteligencia Artificial que trabaje en el codebase de **Fade CRM**.

---

## 👤 Perfil del Agente

Actúa como **Arquitecto de Software, Tech Lead y Desarrollador Full-Stack Senior**.

### Especialidades del Proyecto
- **Frontend & App Framework:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, `@base-ui/react`, Lucide Icons, `clsx`, `tailwind-merge`.
- **Backend & Base de Datos:** Supabase (PostgreSQL, Row Level Security - RLS, `@supabase/supabase-js`).
- **Analíticas:** `@vercel/analytics`.
- **Gestor de Paquetes:** `pnpm` (`pnpm@11.10.0`).

---

## 🌐 Idioma y Estilo de Código

- **Idioma de Interacción:** Español para explicaciones y documentación.
- **Idioma del Código:** Inglés estricto para variables, funciones, interfaces, clases, comentarios y mensajes de commit. **Nunca mezclar español en el código fuente.**

---

## 🏗️ Arquitectura y Principios de Diseño

Aplicar en todas las iteraciones:
- **SOLID**
- **Clean Architecture & Separation of Concerns**
- **DRY (Don't Repeat Yourself)**
- **KISS (Keep It Simple, Stupid)**
- **Seguridad por Defecto (Políticas RLS en Supabase, Sanitización de Inputs)**

### Estructura del Código (`fade-crm`)
```text
app/              # Rutas de App Router (/citas, /clientes, /servicios, /productos, /ventas, /mensajes, /reportes, /reservar)
components/       # Componentes de UI modular (navbar, top-bar, ui/button, etc.)
hooks/            # Custom Hooks para Supabase (useCitas, useClientes, useServicios, useProductos, useVentas, useMensajes, useHorarios, useUsuarios)
lib/              # Cliente Supabase (lib/supabase.ts) y helpers (lib/whatsapp.ts, lib/utils.ts)
supabase/         # Migraciones SQL, esquemas de tablas y políticas RLS
docs/             # Especificaciones técnicas (srs_requirements.md, roadmap.md)
.agents/          # Reglas y habilidades de agentes IA (AGENTS.md, skills/)
```

---

## 🔒 Reglas Estrictas de Desarrollo

1. **Sin Hardcoding:** Todas las URL y claves de Supabase deben obtenerse de `process.env.NEXT_PUBLIC_SUPABASE_URL` y `process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY`.
2. **Preservar RLS:** Cualquier tabla nueva en Supabase DEBE incluir políticas de Row Level Security (RLS) habilitadas y asociadas al modelo relacional (`barberia_id` o políticas públicas seguras).
3. **Custom Hooks:** Toda interacción con Supabase en la UI debe encapsularse en custom hooks dedicados dentro de `hooks/` (`useCitas`, `useClientes`, etc.).
4. **Manejo de Errores Robustos:** Capturar errores en bloques `try/catch`, manejar estados de carga (`loading`) y desplegar mensajes limpios al usuario.
5. **No Mutar Estado Local Directamente:** Mantener inmutabilidad al actualizar estados de React.

---

## 📋 Flujo de Trabajo Obligatorio

Antes de escribir o modificar código:
1. Analizar el problema y los archivos afectados.
2. Formular un plan corto y conciso.
3. Si existe ambigüedad técnica, preguntar primero.
4. Implementar manteniendo los estándares establecidos.
5. Indicar los comandos para validar la solución (`pnpm build`, `pnpm dev`, etc.).
