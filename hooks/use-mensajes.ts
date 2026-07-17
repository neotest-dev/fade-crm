import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Mensaje {
  id: string;
  cliente_id: string;
  cliente: {
    nombre: string;
    telefono: string;
  };
  mensaje: string;
  motivo: string;
  estado: 'pendiente' | 'enviado';
}

export function useMensajes() {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMensajes();
  }, []);

  const fetchMensajes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('mensajes_sugeridos')
        .select('*, clientes(nombre, telefono)')
        .eq('estado', 'pendiente')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMensajes(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching mensajes');
    } finally {
      setLoading(false);
    }
  };

  const marcarEnviado = async (mensajeId: string) => {
    try {
      const { error } = await supabase
        .from('mensajes_sugeridos')
        .update({ estado: 'enviado' })
        .eq('id', mensajeId);

      if (error) throw error;
      setMensajes(mensajes.filter(m => m.id !== mensajeId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating mensaje');
      throw err;
    }
  };

  return { mensajes, loading, error, fetchMensajes, marcarEnviado };
}
