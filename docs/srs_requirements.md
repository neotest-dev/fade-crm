# 📋 Especificación de Requerimientos de Software (SRS) - Fade CRM

Este documento establece la especificación técnica de requerimientos para la plataforma **Fade CRM** (Sistema de Gestión, CRM y Reservas para Barberías y Centros de Estética).

---

## 1. Arquitectura y Stack Tecnológico

* **Frontend & Server Components:** Next.js 16 (React 19, TypeScript, App Router).
* **Estilos & UI:** Tailwind CSS v4, `@base-ui/react`, Lucide Icons.
* **Capa de Datos & Autenticación:** Supabase (PostgreSQL + Row Level Security - RLS).
* **Conexión & Estado Client-Side:** Custom React Hooks con `@supabase/supabase-js`.
* **Analíticas:** `@vercel/analytics`.
* **Seguridad de Credenciales:** Todas las claves de API y conectores se administran mediante variables de entorno (`.env.local`):
  * `NEXT_PUBLIC_SUPABASE_URL`
  * `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 2. Requerimientos Funcionales del Frontend (`app/`)

### REQ-F-01: Gestión de Citas y Agenda (`/citas`)
* Visualización en tiempo real de la agenda de citas por fecha y horario.
* Filtrado por estado: `pendiente`, `confirmada`, `cancelada`.
* Asignación de cliente, servicio y barbero responsable (`barbero_id`).
* Cambio de estado rápido y creación de citas directamente desde la interfaz.

### REQ-F-02: CRM de Clientes y Personal (`/clientes` y `/configuracion`)
* Registro de clientes con datos de contacto (nombre, teléfono, correo, historial).
* Gestión de personal/barberos (`usuarios`) y horarios de atención por día de la semana (`horarios`: 0=Dom ... 6=Sáb).
* Búsqueda y filtrado dinámico de clientes.

### REQ-F-03: Catálogo de Servicios y Productos (`/servicios` y `/productos`)
* Configuración del catálogo de cortes, barba y tratamientos con su respectiva duración y precio en S/ (`servicios`).
* Inventario de productos físicos con control de stock en tiempo real (`productos`).

### REQ-F-04: Registro de Ventas y Reportes (`/ventas` y `/reportes`)
* Módulo transaccional para cobro de citas y venta de productos.
* Registro del método de pago, monto total y fecha de transacción (`ventas`).
* Dashboard de métricas financieras con resumen de ventas acumuladas e indicadores clave (`/dashboard` y `/reportes`).

### REQ-F-05: Mensajería Rápida y WhatsApp (`/mensajes`)
* Lista de mensajes sugeridos en estado `pendiente` generados por el sistema (`mensajes_sugeridos`).
* Integración con WhatsApp Web/App mediante generador de enlaces (`wa.me/${phone}?text=${msg}`).
* Marcado automático de mensajes como `enviado` al disparar el contacto.

### REQ-F-06: Portal Público de Reservas (`/reservar`)
* Portal autoservicio responsivo para clientes finales.
* Selección interactiva de fecha, hora, barbero y servicio (`/reservar/cita`).
* Agregado opcional de productos al proceso de reserva (`/reservar/productos`).

---

## 3. Requerimientos de Base de Datos y Seguridad (Supabase PostgreSQL)

### REQ-D-01: Esquema Relacional de Tablas
La base de datos se estructura en las siguientes tablas principales:
* `barberias`: Información de la sede o negocio.
* `usuarios`: Barberos y personal administrativo.
* `clientes`: Registro de clientes del CRM.
* `servicios`: Catálogo de servicios con precio y duración.
* `productos`: Inventario de productos con stock y precio.
* `horarios`: Horarios de apertura/cierre por día de la semana.
* `citas`: Reservas vinculadas a cliente, servicio, barbero y horario.
* `ventas`: Registro de ingresos transaccionales.
* `mensajes_sugeridos`: Cola de mensajes sugeridos para contacto de WhatsApp.

### REQ-D-02: Políticas de Seguridad a Nivel de Fila (RLS)
* Todas las tablas de la base de datos cuentan con políticas de Row Level Security (RLS) habilitadas (`ENABLE ROW LEVEL SECURITY`).
* Políticas explícitas para SELECT, INSERT, UPDATE y DELETE (`lectura_*`, `insercion_*`, `actualizacion_*`, `eliminacion_*`) para proteger la integridad de los datos.

### REQ-D-03: Integridad Referencial e Índices
* Llaves primarias UUID autogeneradas (`gen_random_uuid()`).
* Llaves foráneas explícitas (`REFERENCES barberias(id)`, `REFERENCES clientes(id)`, `REFERENCES servicios(id)`).
* Restricciones de validación `CHECK` para campos numéricos y estados enumerados.
