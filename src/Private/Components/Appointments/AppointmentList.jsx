import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  setAppointments, 
  setLoading, 
  setError,
  filterAppointments 
} from '../../../store/slices/appointmentSlice';

/**
 * Componente para listar citas en el panel de administrador
 * Incluye funcionalidad de filtrado y visualización de estado
 */
export const AppointmentList = () => {
  const dispatch = useDispatch();
  // Obtener estado del store
  const { 
    appointments, 
    filteredAppointments,
    loading, 
    error,
    filters 
  } = useSelector(state => state.appointments);
  const { token } = useSelector(state => state.auth);

  /**
   * Efecto para cargar las citas al montar el componente
   */
  useEffect(() => {
    const fetchAppointments = async () => {
      dispatch(setLoading(true));
      try {
        console.log('🔍 Iniciando fetch de citas...');
        console.log('Token:', token); // Verificar que el token existe
        
        // Rutas disponibles para appointments:
        // GET /admin/appo - Obtener todas las citas
        // GET /admin/appo/:userId - Obtener citas por ID de usuario
        // GET /admin/appo/status - Obtener citas por status
        // GET /admin/appo/status/:userId - Obtener citas por status y usuario
        
        const response = await fetch('https://psycare-db.onrender.com/admin/appo', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('📡 Response status:', response.status);
        const data = await response.json();
        console.log('📦 Response data:', data);

        if (!response.ok) {
          throw new Error(data.message || 'Error al cargar las citas');
        }

        // Las citas están en data.data
        const appointments = data.data || [];
        
        console.log('🎯 Citas procesadas:', appointments);
        
        if (appointments.length === 0) {
          console.log('ℹ️ No se encontraron citas en la respuesta');
        }
        dispatch(setAppointments(appointments));
        
        // Aplicar filtros iniciales si existen
        if (filters.status !== 'all' || filters.date || filters.type !== 'all') {
          dispatch(filterAppointments(filters));
        }

      } catch (err) {
        console.error('❌ Error detallado:', {
          message: err.message,
          token: token ? 'Token exists' : 'No token',
          stack: err.stack
        });
        dispatch(setError(err.message));
      }
    };

    fetchAppointments();
  }, [dispatch, token, filters]);

  // Renderizado condicional para estados de carga y error
  if (loading) return (
    <div className="flex justify-center items-center p-8">
      <p className="text-gray-600">Cargando citas...</p>
    </div>
  );

  if (error) return (
    <div className="p-4 bg-red-100 text-red-700 rounded">
      Error: {error}
    </div>
  );

  // Lista de citas a mostrar (filtradas o todas)
  const appointmentsToShow = filteredAppointments.length > 0 
    ? filteredAppointments 
    : appointments;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Lista de Citas</h2>
      
      {/* Tabla de citas */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">ID Cita</th>
              <th className="px-4 py-2 text-left">Fecha</th>
              <th className="px-4 py-2 text-left">Hora</th>
              <th className="px-4 py-2 text-left">Tipo</th>
              <th className="px-4 py-2 text-left">Paciente</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Estado</th>
            </tr>
          </thead>
          <tbody>
            {appointmentsToShow.map(appointment => {
              console.log('Renderizando cita:', appointment);
              return (
                <tr 
                  key={appointment.appo_id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="px-4 py-2">{appointment.appo_id}</td>
                  <td className="px-4 py-2">{appointment.appodate}</td>
                  <td className="px-4 py-2">{appointment.appotime}</td>
                  <td className="px-4 py-2">
                    {appointment.appotype === 'face-to-face' ? 'Presencial' : 'Online'}
                  </td>
                  <td className="px-4 py-2 font-medium">
                    {`${appointment.name || ''} ${appointment.last_name || ''}`}
                  </td>
                  <td className="px-4 py-2">
                    {appointment.email || 'N/A'}
                  </td>
                  <td className="px-4 py-2">
                    <span 
                      className={`px-2 py-1 rounded text-sm ${
                        appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        appointment.status === 'paid' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {appointment.status === 'confirmed' ? 'Confirmada' :
                       appointment.status === 'pending' ? 'Pendiente' :
                       appointment.status === 'cancelled' ? 'Cancelada' :
                       appointment.status === 'paid' ? 'Pagada' :
                       appointment.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mensaje cuando no hay citas */}
      {appointmentsToShow.length === 0 && (
        <p className="text-center text-gray-500 mt-4">
          No se encontraron citas
        </p>
      )}
    </div>
  );
};