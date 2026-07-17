import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface Producto {
  id: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  stock: number;
  barberia_id: string | null;
  created_at: string;
}

export function useProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { fetchProductos(); }, []);

  const fetchProductos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('productos').select('*').order('nombre');
      if (error) throw error;
      setProductos(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally {
      setLoading(false);
    }
  };

  const createProducto = async (p: Omit<Producto, 'id' | 'created_at'>) => {
    const { data, error } = await supabase.from('productos').insert([p]).select().single();
    if (error) throw error;
    setProductos([...productos, data]);
    return data;
  };

  const updateProducto = async (id: string, updates: Partial<Producto>) => {
    const { data, error } = await supabase.from('productos').update(updates).eq('id', id).select().single();
    if (error) throw error;
    setProductos(productos.map((p) => (p.id === id ? data : p)));
    return data;
  };

  const deleteProducto = async (id: string) => {
    const { error } = await supabase.from('productos').delete().eq('id', id);
    if (error) throw error;
    setProductos(productos.filter((p) => p.id !== id));
  };

  const venderProducto = async (id: string, cantidad: number = 1) => {
    const producto = productos.find((p) => p.id === id);
    if (!producto || producto.stock < cantidad) throw new Error('Stock insuficiente');
    return updateProducto(id, { stock: producto.stock - cantidad });
  };

  return { productos, loading, error, fetchProductos, createProducto, updateProducto, deleteProducto, venderProducto };
}
