import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface Servicio {
  id: string;
  nombre: string;
  precio: number;
  duracion_min: number;
  barberia_id: string | null;
  created_at: string;
}

export function useServicios() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { fetchServicios(); }, []);

  const fetchServicios = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('servicios').select('*').order('nombre');
      if (error) throw error;
      setServicios(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally {
      setLoading(false);
    }
  };

  const createServicio = async (s: Omit<Servicio, 'id' | 'created_at'>) => {
    const { data, error } = await supabase.from('servicios').insert([s]).select().single();
    if (error) throw error;
    setServicios([...servicios, data]);
    return data;
  };

  const updateServicio = async (id: string, updates: Partial<Servicio>) => {
    const { data, error } = await supabase.from('servicios').update(updates).eq('id', id).select().single();
    if (error) throw error;
    setServicios(servicios.map((s) => (s.id === id ? data : s)));
    return data;
  };

  const deleteServicio = async (id: string) => {
    const { error } = await supabase.from('servicios').delete().eq('id', id);
    if (error) throw error;
    setServicios(servicios.filter((s) => s.id !== id));
  };

  return { servicios, loading, error, fetchServicios, createServicio, updateServicio, deleteServicio };
}
