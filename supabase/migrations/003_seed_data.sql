-- ============================================================
-- FADE CRM — Migration 003: Seed data inicial
-- ============================================================

-- Insertar barbería por defecto si no existe
INSERT INTO barberias (id, nombre, direccion)
VALUES ('00000000-0000-0000-0000-000000000001', 'FADE Barber Shop', 'Jr. Principal 123')
ON CONFLICT (id) DO NOTHING;

-- Insertar servicios iniciales si no existen
INSERT INTO servicios (nombre, precio, duracion_min, barberia_id)
SELECT * FROM (VALUES
  ('Corte clásico', 25, 30, '00000000-0000-0000-0000-000000000001'::uuid),
  ('Degradado', 30, 35, '00000000-0000-0000-0000-000000000001'::uuid),
  ('Barba', 15, 20, '00000000-0000-0000-0000-000000000001'::uuid),
  ('Corte + Barba', 40, 50, '00000000-0000-0000-0000-000000000001'::uuid),
  ('Diseño de cejas', 10, 15, '00000000-0000-0000-0000-000000000001'::uuid)
) AS v(nombre, precio, duracion_min, barberia_id)
WHERE NOT EXISTS (SELECT 1 FROM servicios LIMIT 1);

-- Insertar productos iniciales si no existen
INSERT INTO productos (nombre, descripcion, precio, stock, barberia_id)
SELECT * FROM (VALUES
  ('Cera mate para cabello', 'Fijación fuerte, acabado mate', 25, 15, '00000000-0000-0000-0000-000000000001'::uuid),
  ('Aceite de barba premium', 'Hidratación y suavidad para barba', 35, 8, '00000000-0000-0000-0000-000000000001'::uuid),
  ('Shampoo anticaspa', '300ml, fórmula profesional', 20, 20, '00000000-0000-0000-0000-000000000001'::uuid),
  ('Pomada brillante', 'Fijación media, acabado glossy', 22, 12, '00000000-0000-0000-0000-000000000001'::uuid)
) AS v(nombre, descripcion, precio, stock, barberia_id)
WHERE NOT EXISTS (SELECT 1 FROM productos LIMIT 1);

-- Insertar horarios por defecto (Lun-Sáb) si no existen
INSERT INTO horarios (barberia_id, dia_semana, hora_inicio, hora_fin, activo)
SELECT * FROM (VALUES
  ('00000000-0000-0000-0000-000000000001'::uuid, 0, '09:00'::time, '18:00'::time, false), -- Domingo
  ('00000000-0000-0000-0000-000000000001'::uuid, 1, '09:00'::time, '20:00'::time, true),  -- Lunes
  ('00000000-0000-0000-0000-000000000001'::uuid, 2, '09:00'::time, '20:00'::time, true),  -- Martes
  ('00000000-0000-0000-0000-000000000001'::uuid, 3, '09:00'::time, '20:00'::time, true),  -- Miércoles
  ('00000000-0000-0000-0000-000000000001'::uuid, 4, '09:00'::time, '20:00'::time, true),  -- Jueves
  ('00000000-0000-0000-0000-000000000001'::uuid, 5, '09:00'::time, '20:00'::time, true),  -- Viernes
  ('00000000-0000-0000-0000-000000000001'::uuid, 6, '09:00'::time, '18:00'::time, true)   -- Sábado
) AS v(barberia_id, dia_semana, hora_inicio, hora_fin, activo)
WHERE NOT EXISTS (SELECT 1 FROM horarios LIMIT 1);
