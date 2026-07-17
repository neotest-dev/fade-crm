-- ============================================================
-- FADE CRM — Migration 001: Create productos & horarios tables
-- ============================================================

-- Productos
CREATE TABLE IF NOT EXISTS productos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  precio NUMERIC NOT NULL DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0,
  barberia_id UUID REFERENCES barberias(id),
  created_at TIMESTAMP DEFAULT now()
);

-- Horarios de atención
CREATE TABLE IF NOT EXISTS horarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  barberia_id UUID REFERENCES barberias(id),
  dia_semana INTEGER NOT NULL CHECK (dia_semana BETWEEN 0 AND 6), -- 0=Dom,1=Lun...6=Sáb
  hora_inicio TIME NOT NULL DEFAULT '09:00',
  hora_fin TIME NOT NULL DEFAULT '20:00',
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now()
);
