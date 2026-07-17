import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface Cita {
  id: string;
  cliente_id: string;
  barbero_id: string | null;
  servicio_id: string | null;
  fecha: string;
  hora: string;
  estado: 'pendiente' | 'confirmada' | 'cancelada';
  created_at: string;
  clientes?: { nombre: string; telefono: string };
  servicios?: { nombre: string; precio: number };
  usuarios?: { nombre: string };
}

export function useCitas() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { fetchCitas(); }, []);

  const fetchCitas = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('citas')
        .select('*, clientes(nombre, telefono), servicios(nombre, precio), usuarios(nombre)')
        .order('fecha', { ascending: true })
        .order('hora', { ascending: true });
      if (error) throw error;
      setCitas(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally {
      setLoading(false);
    }
  };

  const createCita = async (cita: Omit<Cita, 'id' | 'created_at' | 'clientes' | 'servicios' | 'usuarios'>) => {
    const { data, error } = await supabase.from('citas').insert([cita]).select('*, clientes(nombre, telefono), servicios(nombre, precio), usuarios(nombre)').single();
    if (error) throw error;
    setCitas([...citas, data]);
    return data;
  };

  const updateCita = async (id: string, updates: Partial<Cita>) => {
    const { data, error } = await supabase.from('citas').update(updates).eq('id', id).select('*, clientes(nombre, telefono), servicios(nombre, precio), usuarios(nombre)').single();
    if (error) throw error;
    setCitas(citas.map((c) => (c.id === id ? data : c)));
    return data;
  };

  const deleteCita = async (id: string) => {
    const { error } = await supabase.from('citas').delete().eq('id', id);
    if (error) throw error;
    setCitas(citas.filter((c) => c.id !== id));
  };

  const updateEstado = async (id: string, estado: Cita['estado']) => {
    return updateCita(id, { estado });
  };

  return { citas, loading, error, fetchCitas, createCita, updateCita, deleteCita, updateEstado };
}
