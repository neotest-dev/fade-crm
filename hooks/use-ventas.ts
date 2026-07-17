import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface Venta {
  id: string;
  cliente_id: string;
  barbero_id: string | null;
  servicio_id: string | null;
  precio: number;
  fecha: string;
  clientes?: { nombre: string };
  servicios?: { nombre: string };
  usuarios?: { nombre: string };
}

export function useVentas() {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { fetchVentas(); }, []);

  const fetchVentas = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ventas')
        .select('*, clientes(nombre), servicios(nombre), usuarios(nombre)')
        .order('fecha', { ascending: false });
      if (error) throw error;
      setVentas(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally {
      setLoading(false);
    }
  };

  const createVenta = async (venta: Pick<Venta, 'cliente_id' | 'precio' | 'servicio_id' | 'barbero_id'>) => {
    const { data, error } = await supabase
      .from('ventas')
      .insert([{ ...venta, fecha: new Date().toISOString() }])
      .select('*, clientes(nombre), servicios(nombre), usuarios(nombre)')
      .single();
    if (error) throw error;

    // Update cliente's total_cortes
    await supabase
      .from('clientes')
      .update({ fecha_ultimo_corte: new Date().toISOString().split('T')[0] })
      .eq('id', venta.cliente_id);

    setVentas([data, ...ventas]);
    return data;
  };

  const deleteVenta = async (id: string) => {
    const { error } = await supabase.from('ventas').delete().eq('id', id);
    if (error) throw error;
    setVentas(ventas.filter((v) => v.id !== id));
  };

  return { ventas, loading, error, fetchVentas, createVenta, deleteVenta };
}
