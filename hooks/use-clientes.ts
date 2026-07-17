import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface Cliente {
  id: string;
  nombre: string;
  telefono: string;
  fecha_ultimo_corte: string | null;
  total_cortes: number;
  barberia_id: string | null;
  created_at: string;
}

export function useClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { fetchClientes(); }, []);

  const fetchClientes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('clientes').select('*').order('nombre');
      if (error) throw error;
      setClientes(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally {
      setLoading(false);
    }
  };

  const createCliente = async (cliente: Omit<Cliente, 'id' | 'created_at'>) => {
    const { data, error } = await supabase.from('clientes').insert([cliente]).select().single();
    if (error) throw error;
    setClientes([...clientes, data]);
    return data;
  };

  const updateCliente = async (id: string, updates: Partial<Cliente>) => {
    const { data, error } = await supabase.from('clientes').update(updates).eq('id', id).select().single();
    if (error) throw error;
    setClientes(clientes.map((c) => (c.id === id ? data : c)));
    return data;
  };

  const deleteCliente = async (id: string) => {
    const { error } = await supabase.from('clientes').delete().eq('id', id);
    if (error) throw error;
    setClientes(clientes.filter((c) => c.id !== id));
  };

  return { clientes, loading, error, fetchClientes, createCliente, updateCliente, deleteCliente };
}
