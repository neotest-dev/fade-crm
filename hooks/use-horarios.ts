import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface Horario {
  id: string;
  barberia_id: string | null;
  dia_semana: number;
  hora_inicio: string;
  hora_fin: string;
  activo: boolean;
}

const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export function useHorarios() {
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchHorarios(); }, []);

  const fetchHorarios = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('horarios').select('*').order('dia_semana');
      if (error) throw error;
      setHorarios(data || []);
    } finally {
      setLoading(false);
    }
  };

  const updateHorario = async (id: string, updates: Partial<Horario>) => {
    const { data, error } = await supabase.from('horarios').update(updates).eq('id', id).select().single();
    if (error) throw error;
    setHorarios(horarios.map((h) => (h.id === id ? data : h)));
    return data;
  };

  return { horarios, loading, fetchHorarios, updateHorario, DIAS };
}
