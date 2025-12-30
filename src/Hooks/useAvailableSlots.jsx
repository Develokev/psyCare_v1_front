import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';

/**
 * Hook para obtener slots disponibles de un día específico
 * Slots fijos: 9:00, 11:00, 13:00, 15:00, 17:00
 */
export const useAvailableSlots = (selectedDate) => {
  const [dayAppointments, setDayAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useSelector(state => state.auth);

  // Slots fijos del día
  const fixedSlots = ['09:00', '11:00', '13:00', '15:00', '17:00'];

  // Fetch de citas del día seleccionado
  useEffect(() => {
    const fetchDayAppointments = async () => {
      // Solo hacer fetch si hay fecha seleccionada
      if (!selectedDate) {
        setDayAppointments([]);
        return;
      }

      setLoading(true);
      try {
        // Formatear fecha a DD-MM-YYYY
        const day = String(selectedDate.getDate()).padStart(2, '0');
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const year = selectedDate.getFullYear();
        const formattedDate = `${day}-${month}-${year}`;

        // Obtener todas las citas (podríamos optimizar con un endpoint específico por fecha)
        const response = await fetch('https://psycare-db.onrender.com/admin/appo', {
          method: 'GET',
          headers: {
            'x-token': token,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Error al cargar citas');
        }

        // Filtrar solo las citas del día seleccionado (excluir canceladas)
        const appointmentsOfDay = (data.data || []).filter(
          app => app.appodate === formattedDate && app.status !== 'cancelled'
        );

        setDayAppointments(appointmentsOfDay);
      } catch (err) {
        console.error('Error al cargar slots disponibles:', err.message);
        setDayAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDayAppointments();
  }, [selectedDate, token]);

  // Calcular slots disponibles
  const availableSlots = useMemo(() => {
    return fixedSlots.map(slot => {
      // Verificar si el slot está ocupado
      const isOccupied = dayAppointments.some(app => app.appotime === slot);
      
      return {
        time: slot,
        available: !isOccupied
      };
    });
  }, [dayAppointments]);

  return {
    slots: availableSlots,
    loading
  };
};
