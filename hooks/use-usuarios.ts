import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  barberia_id: string | null;
  created_at: string;
}

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { fetchUsuarios(); }, []);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('usuarios').select('*').order('nombre');
      if (error) throw error;
      setUsuarios(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally {
      setLoading(false);
    }
  };

  const createUsuario = async (u: Omit<Usuario, 'id' | 'created_at'>) => {
    const { data, error } = await supabase.from('usuarios').insert([u]).select().single();
    if (error) throw error;
    setUsuarios([...usuarios, data]);
    return data;
  };

  const updateUsuario = async (id: string, updates: Partial<Usuario>) => {
    const { data, error } = await supabase.from('usuarios').update(updates).eq('id', id).select().single();
    if (error) throw error;
    setUsuarios(usuarios.map((u) => (u.id === id ? data : u)));
    return data;
  };

  const deleteUsuario = async (id: string) => {
    const { error } = await supabase.from('usuarios').delete().eq('id', id);
    if (error) throw error;
    setUsuarios(usuarios.filter((u) => u.id !== id));
  };

  return { usuarios, loading, error, fetchUsuarios, createUsuario, updateUsuario, deleteUsuario };
}
