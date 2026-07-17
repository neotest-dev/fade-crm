-- Agregar clerk_id a la tabla clientes para vincular con autenticacion de Clerk
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS clerk_id TEXT UNIQUE;
CREATE INDEX IF NOT EXISTS idx_clientes_clerk_id ON clientes(clerk_id);

-- Asegurarse que anon puede leer usuarios para el selector de barberos en el portal
GRANT SELECT ON public.usuarios TO anon, authenticated;
