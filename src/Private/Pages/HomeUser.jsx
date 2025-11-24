import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setAppointments, setLoading, setError } from '../../store/slices/appointmentSlice';
import { UserStats } from '../Components/User/UserStats';

/**
 * HomeUser - Panel principal del paciente
 * Aplicamos tema "userPanel" con paleta retro-playa
 */
export const HomeUser = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector(state => state.user);
  const { appointments, loading, error } = useSelector(state => state.appointments);
  const { token } = useSelector(state => state.auth);

  // Las citas ya están filtradas por user_id desde la API
  const userAppointments = appointments;

  // Cargar SOLO las citas del usuario logueado
  useEffect(() => {
    const fetchUserAppointments = async () => {
      // Solo cargar si tenemos user_id y no hay citas cargadas
      if (userData?.user_id && appointments.length === 0) {
        dispatch(setLoading(true));
        try {
          const response = await fetch(`https://psycare-db.onrender.com/admin/appo/${userData.user_id}`, {
            method: 'GET',
            headers: {
              'x-token': token,
              'Content-Type': 'application/json'
            }
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Error al cargar tus citas');
          }

          // El endpoint devuelve un array de citas del usuario
          dispatch(setAppointments(data.data || []));
        } catch (err) {
          console.error('Error al cargar citas:', err.message);
          dispatch(setError(err.message));
        } finally {
          dispatch(setLoading(false));
        }
      }
    };

    fetchUserAppointments();
  }, [dispatch, token, userData?.user_id, appointments.length]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen" data-theme="userPanel">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="text-gray-600 ml-4">Cargando tu información...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error m-8" data-theme="userPanel">
        <span>Error: {error}</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-white to-accent/10" data-theme="userPanel">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Bienvenida con estilo mejorado */}
        <div className="mb-8 relative">
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-secondary/10 rounded-full blur-3xl"></div>
          <div className="relative">
            <h1 className="text-5xl font-display font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-2">
              ¡Hola, {userData?.name}! 👋
            </h1>
            <p className="text-lg text-gray-600 font-light">
              Bienvenido a tu espacio personal
            </p>
          </div>
        </div>

        {/* Grid principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda: Próximas citas */}
          <div className="lg:col-span-2 space-y-6">
            {/* Widget Próximas Citas con gradiente turquesa */}
            <div className="card bg-gradient-to-br from-[#5c98b2] via-[#79c3c0] to-[#98e1d0] shadow-soft-primary border-l-4 border-primary" style={{ boxShadow: '-5px 0 0 0 black, 0 4px 20px -2px rgba(92, 152, 178, 0.15)' }}>
              <div className="card-body">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur">
                    <span className="text-3xl">📅</span>
                  </div>
                  <div>
                    <h2 className="card-title text-white text-xl font-display">Próximas Citas</h2>
                    <p className="text-sm text-white/80">Tus siguientes sesiones programadas</p>
                  </div>
                </div>
                {/* Placeholder */}
                <div className="bg-white/90 backdrop-blur rounded-lg p-6 text-center text-gray-500">
                  Componente UpcomingAppointments próximamente
                </div>
              </div>
            </div>

            {/* Lista completa de citas con borde de color */}
            <div className="card bg-white shadow-soft-primary border-t-4 border-accent" style={{ boxShadow: '0 -5px 0 0 black, 0 4px 20px -2px rgba(92, 152, 178, 0.15)' }}>
              <div className="card-body">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <span className="text-3xl">📋</span>
                  </div>
                  <div>
                    <h2 className="card-title text-primary text-xl font-display">Mis Citas</h2>
                    <p className="text-sm text-gray-500">
                      Total: <span className="font-semibold text-primary">{userAppointments.length}</span> citas
                    </p>
                  </div>
                </div>
                {/* Placeholder */}
                <div className="bg-base-200/50 rounded-lg p-6 text-center text-gray-400">
                  Componente UserAppointmentList próximamente
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha: Stats y Mensajes */}
          <div className="space-y-6">
            {/* Estadísticas */}
            <UserStats appointments={userAppointments} />

            {/* Mensajes recientes con degradado */}
            <div className="card bg-gradient-to-br from-accent/20 via-accent/10 to-white shadow-soft-accent border-t-4 border-accent" style={{ boxShadow: '0 -5px 0 0 black, 0 4px 20px -2px rgba(152, 225, 208, 0.15)' }}>
              <div className="card-body">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <span className="text-2xl">💬</span>
                  </div>
                  <h2 className="card-title text-accent font-display">Mensajes</h2>
                </div>
                {/* Placeholder */}
                <div className="bg-white rounded-lg p-6 text-center text-gray-400">
                  Componente RecentMessages próximamente
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
