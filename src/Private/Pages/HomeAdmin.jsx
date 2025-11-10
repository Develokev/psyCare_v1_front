import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppointmentList } from '../Components/Appointments/AppointmentList';
import { 
  setAppointments, 
  setLoading, 
  setError,
  filterAppointments 
} from '../../store/slices/appointmentSlice';

export const HomeAdmin = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector(state => state.user);
  const { 
    appointments, 
    filteredAppointments,
    loading, 
    error,
    filters 
  } = useSelector(state => state.appointments);
  const { token } = useSelector(state => state.auth);

  useEffect(() => {
    const fetchAppointments = async () => {
      dispatch(setLoading(true));
      try {
        console.log('🔍 Iniciando fetch de citas...');
        
        const response = await fetch('https://psycare-db.onrender.com/admin/appo', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Error al cargar las citas');
        }

        const appointments = data.data || [];
        dispatch(setAppointments(appointments));
        
        // Aplicar filtros iniciales si existen
        if (filters.status !== 'all' || filters.date || filters.type !== 'all') {
          dispatch(filterAppointments(filters));
        }

      } catch (err) {
        console.error('❌ Error:', err.message);
        dispatch(setError(err.message));
      }
    };

    fetchAppointments();
  }, [dispatch, token, filters]);

  // Determinar qué lista de citas mostrar
  const appointmentsToShow = filteredAppointments.length > 0 
    ? filteredAppointments 
    : appointments;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Bienvenidx, {userData?.name}</h2>
          <p className="text-gray-600">
            Desde aquí podrás gestionar citas, usuarios y configuraciones
          </p>
        </div>
      </div>

      {/* Sección de Citas */}
      <div className="bg-white rounded-lg shadow">
        <AppointmentList 
          appointments={appointmentsToShow}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
};
