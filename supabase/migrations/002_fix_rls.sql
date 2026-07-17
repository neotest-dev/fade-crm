-- ============================================================
-- FADE CRM — Migration 002: Fix all RLS policies
-- ============================================================

-- ── citas ────────────────────────────────────────────────────
ALTER TABLE citas ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='citas' AND policyname='lectura_citas') THEN
    CREATE POLICY lectura_citas ON citas FOR SELECT TO public USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='citas' AND policyname='insercion_citas') THEN
    CREATE POLICY insercion_citas ON citas FOR INSERT TO public WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='citas' AND policyname='actualizacion_citas') THEN
    CREATE POLICY actualizacion_citas ON citas FOR UPDATE TO public USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='citas' AND policyname='eliminacion_citas') THEN
    CREATE POLICY eliminacion_citas ON citas FOR DELETE TO public USING (true);
  END IF;
END $$;

-- ── servicios ────────────────────────────────────────────────
ALTER TABLE servicios ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='servicios' AND policyname='lectura_servicios') THEN
    CREATE POLICY lectura_servicios ON servicios FOR SELECT TO public USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='servicios' AND policyname='insercion_servicios') THEN
    CREATE POLICY insercion_servicios ON servicios FOR INSERT TO public WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='servicios' AND policyname='actualizacion_servicios') THEN
    CREATE POLICY actualizacion_servicios ON servicios FOR UPDATE TO public USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='servicios' AND policyname='eliminacion_servicios') THEN
    CREATE POLICY eliminacion_servicios ON servicios FOR DELETE TO public USING (true);
  END IF;
END $$;

-- ── usuarios ────────────────────────────────────────────────
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='usuarios' AND policyname='lectura_usuarios') THEN
    CREATE POLICY lectura_usuarios ON usuarios FOR SELECT TO public USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='usuarios' AND policyname='insercion_usuarios') THEN
    CREATE POLICY insercion_usuarios ON usuarios FOR INSERT TO public WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='usuarios' AND policyname='actualizacion_usuarios') THEN
    CREATE POLICY actualizacion_usuarios ON usuarios FOR UPDATE TO public USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='usuarios' AND policyname='eliminacion_usuarios') THEN
    CREATE POLICY eliminacion_usuarios ON usuarios FOR DELETE TO public USING (true);
  END IF;
END $$;

-- ── mensajes_sugeridos UPDATE (fix) ─────────────────────────
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='mensajes_sugeridos' AND policyname='actualizacion_mensajes_sugeridos') THEN
    CREATE POLICY actualizacion_mensajes_sugeridos ON mensajes_sugeridos FOR UPDATE TO public USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='mensajes_sugeridos' AND policyname='eliminacion_mensajes_sugeridos') THEN
    CREATE POLICY eliminacion_mensajes_sugeridos ON mensajes_sugeridos FOR DELETE TO public USING (true);
  END IF;
END $$;

-- ── ventas DELETE ────────────────────────────────────────────
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='ventas' AND policyname='actualizacion_ventas') THEN
    CREATE POLICY actualizacion_ventas ON ventas FOR UPDATE TO public USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='ventas' AND policyname='eliminacion_ventas') THEN
    CREATE POLICY eliminacion_ventas ON ventas FOR DELETE TO public USING (true);
  END IF;
END $$;

-- ── clientes DELETE ──────────────────────────────────────────
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='clientes' AND policyname='eliminacion_clientes') THEN
    CREATE POLICY eliminacion_clientes ON clientes FOR DELETE TO public USING (true);
  END IF;
END $$;

-- ── productos ────────────────────────────────────────────────
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='productos' AND policyname='lectura_productos') THEN
    CREATE POLICY lectura_productos ON productos FOR SELECT TO public USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='productos' AND policyname='insercion_productos') THEN
    CREATE POLICY insercion_productos ON productos FOR INSERT TO public WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='productos' AND policyname='actualizacion_productos') THEN
    CREATE POLICY actualizacion_productos ON productos FOR UPDATE TO public USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='productos' AND policyname='eliminacion_productos') THEN
    CREATE POLICY eliminacion_productos ON productos FOR DELETE TO public USING (true);
  END IF;
END $$;

-- ── horarios ─────────────────────────────────────────────────
ALTER TABLE horarios ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='horarios' AND policyname='lectura_horarios') THEN
    CREATE POLICY lectura_horarios ON horarios FOR SELECT TO public USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='horarios' AND policyname='insercion_horarios') THEN
    CREATE POLICY insercion_horarios ON horarios FOR INSERT TO public WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='horarios' AND policyname='actualizacion_horarios') THEN
    CREATE POLICY actualizacion_horarios ON horarios FOR UPDATE TO public USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='horarios' AND policyname='eliminacion_horarios') THEN
    CREATE POLICY eliminacion_horarios ON horarios FOR DELETE TO public USING (true);
  END IF;
END $$;

-- ── barberias UPDATE/DELETE ───────────────────────────────────
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='barberias' AND policyname='actualizacion_barberias') THEN
    CREATE POLICY actualizacion_barberias ON barberias FOR UPDATE TO public USING (true);
  END IF;
END $$;
