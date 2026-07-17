-- Otorgar permisos explícitos a anon y authenticated para las nuevas tablas
GRANT SELECT, INSERT, UPDATE, DELETE ON public.horarios TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.productos TO anon, authenticated;

-- Por seguridad y consistencia, refrescar permisos en todas las tablas del esquema public
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
