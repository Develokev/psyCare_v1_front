import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppointmentList } from '../Components/Appointments/AppointmentList';
import { AppointmentFilters } from '../Components/Appointments/AppointmentFilters';
import { UpcomingAppointments } from '../Components/Appointments/UpcomingAppointments';
import { PatientProfile } from '../Components/Patients/PatientProfile';
import { clearCurrentPatient } from '../../store/slices/patientSlice';
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

  // Estado para controlar la vista actual
  const [currentView, setCurrentView] = useState('appointments'); // 'appointments' | 'patient-profile'
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [usersMap, setUsersMap] = useState({}); // Mapeo de email -> user_id
  const [allUsers, setAllUsers] = useState([]); // Array completo de usuarios

  // Efecto para cargar las citas y usuarios una sola vez al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      dispatch(setLoading(true));
      try {
        // 1. Cargar todas las citas
        const appointmentsResponse = await fetch('https://psycare-db.onrender.com/admin/appo', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const appointmentsData = await appointmentsResponse.json();

        if (!appointmentsResponse.ok) {
          throw new Error(appointmentsData.message || 'Error al cargar las citas');
        }

        const appointments = appointmentsData.data || [];
        dispatch(setAppointments(appointments));

        // 2. Cargar todos los usuarios para crear el mapeo email -> user_id
        const usersResponse = await fetch('https://psycare-db.onrender.com/admin/users', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const usersData = await usersResponse.json();

        if (!usersResponse.ok) {
          throw new Error(usersData.message || 'Error al cargar usuarios');
        }

        // Crear mapeo de email a user_id
        const users = usersData.data || [];
        const emailToUserId = {};
        users.forEach(user => {
          if (user.email && user.user_id) {
            emailToUserId[user.email] = user.user_id;
          }
        });
        
        setUsersMap(emailToUserId);
        setAllUsers(users); // Guardar todos los usuarios

      } catch (err) {
        console.error('❌ Error:', err.message);
        dispatch(setError(err.message));
      }
    };

    fetchData();
  }, [dispatch, token]); // Solo se ejecuta una vez al montar o cuando cambia el token

  // Determinar qué lista de citas mostrar
  // Si hay filtros activos, mostrar filteredAppointments, sino appointments
  const hasActiveFilters = filters.status !== 'all' || filters.type !== 'all' || filters.date;
  const appointmentsToShow = hasActiveFilters ? filteredAppointments : appointments;

  // Handler para cuando se hace click en un paciente
  const handlePatientClick = (appointment) => {
    if (!appointment.email) {
      console.error('Error: No se encontró email en el appointment');
      return;
    }
    
    const userId = usersMap[appointment.email];
    
    if (!userId) {
      console.error('Error: No se encontró user_id para el email:', appointment.email);
      return;
    }
    
    setSelectedUserId(userId);
    setCurrentView('patient-profile');
  };

  // Handler para volver a la lista de citas
  const handleBackToAppointments = () => {
    setCurrentView('appointments');
    setSelectedUserId(null);
    dispatch(clearCurrentPatient()); // Limpiar datos del paciente en Redux
  };

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

      {/* Renderizado condicional según la vista actual */}
      {currentView === 'appointments' ? (
        /* Sección de Citas */
        <div className="space-y-6">
          {/* Widget de próximas citas */}
          <UpcomingAppointments appointments={appointments} />

          {/* Filtros */}
          <AppointmentFilters />
          
          {/* Tabla principal de citas */}
          <div className="bg-white rounded-lg shadow">
            <AppointmentList 
              appointments={appointmentsToShow}
              loading={loading}
              error={error}
              onPatientClick={handlePatientClick}
            />
          </div>
        </div>
      ) : (
        /* Ficha del Paciente */
        <PatientProfile 
          userId={selectedUserId}
          allUsers={allUsers}
          allAppointments={appointments}
          onBack={handleBackToAppointments}
        />
      )}
    </div>
  );
};
