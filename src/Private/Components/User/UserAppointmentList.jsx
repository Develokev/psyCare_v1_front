import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { 
  CalendarIcon, 
  ClockIcon, 
  VideoCameraIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

/**
 * UserAppointmentList - Lista completa de citas del paciente
 * Con toggle "Próximas" | "Historial" y paginación
 * Solo lectura (sin edición)
 */
export const UserAppointmentList = ({ appointments }) => {
  const [sortOrder, setSortOrder] = useState('upcoming'); // 'upcoming' | 'recent'
  const [visibleCount, setVisibleCount] = useState(20);

  // Fecha actual para comparaciones
  const today = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  }, []);

  // Ordenar y filtrar citas según el toggle
  const sortedAppointments = useMemo(() => {
    let filtered = [...appointments];

    // Si es modo "Próximas", filtrar solo citas futuras (excluir canceladas)
    if (sortOrder === 'upcoming') {
      filtered = filtered.filter(appo => {
        if (appo.status === 'cancelled') {
          return false;
        }
        
        const [day, month, year] = appo.appodate.split('-');
        const appoDate = new Date(year, month - 1, day);
        appoDate.setHours(0, 0, 0, 0);
        
        return appoDate >= today;
      });
    }

    // Ordenar las citas
    const sorted = filtered.sort((a, b) => {
      const [dayA, monthA, yearA] = a.appodate.split('-');
      const dateA = new Date(yearA, monthA - 1, dayA);
      
      const [dayB, monthB, yearB] = b.appodate.split('-');
      const dateB = new Date(yearB, monthB - 1, dayB);

      if (dateA.getTime() !== dateB.getTime()) {
        return sortOrder === 'upcoming' ? dateA - dateB : dateB - dateA;
      }

      const [hoursA, minutesA] = a.appotime.split(':');
      const timeA = parseInt(hoursA) * 60 + parseInt(minutesA);
      
      const [hoursB, minutesB] = b.appotime.split(':');
      const timeB = parseInt(hoursB) * 60 + parseInt(minutesB);

      return sortOrder === 'upcoming' ? timeA - timeB : timeB - timeA;
    });

    return sorted;
  }, [appointments, sortOrder, today]);

  // Limitar citas visibles (solo en Historial)
  const displayedAppointments = useMemo(() => {
    if (sortOrder === 'upcoming') {
      return sortedAppointments;
    }
    return sortedAppointments.slice(0, visibleCount);
  }, [sortedAppointments, sortOrder, visibleCount]);

  const hasMoreToShow = sortOrder === 'recent' && sortedAppointments.length > visibleCount;
  const remainingCount = sortedAppointments.length - visibleCount;

  // Formatear fecha
  const formatDate = (dateString) => {
    const [day, month, year] = dateString.split('-');
    const date = new Date(year, month - 1, day);
    
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    
    return `${days[date.getDay()]}, ${day} ${months[date.getMonth()]} ${year}`;
  };

  // Iconos y colores por tipo
  const getTypeDisplay = (type) => {
    if (type === 'online') {
      return {
        icon: <VideoCameraIcon className="w-4 h-4" />,
        text: 'Online',
        colorClass: 'bg-green-100 text-green-700'
      };
    }
    return {
      icon: <UserGroupIcon className="w-4 h-4" />,
      text: 'Presencial',
      colorClass: 'bg-blue-100 text-blue-700'
    };
  };

  // Iconos y colores por estado
  const getStatusDisplay = (status) => {
    const displays = {
      pending: {
        icon: <ExclamationCircleIcon className="w-4 h-4" />,
        text: 'Pendiente',
        colorClass: 'bg-warning/20 text-warning'
      },
      confirmed: {
        icon: <CheckCircleIcon className="w-4 h-4" />,
        text: 'Confirmada',
        colorClass: 'bg-secondary/20 text-secondary'
      },
      paid: {
        icon: <CurrencyDollarIcon className="w-4 h-4" />,
        text: 'Pagada',
        colorClass: 'bg-accent/30 text-accent'
      },
      cancelled: {
        icon: <ExclamationCircleIcon className="w-4 h-4" />,
        text: 'Cancelada',
        colorClass: 'bg-gray-200 text-gray-600'
      }
    };
    return displays[status] || displays.pending;
  };

  // Estado vacío
  if (displayedAppointments.length === 0) {
    return (
      <div className="text-center py-8">
        <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-3" />
        {sortOrder === 'upcoming' ? (
          <>
            <p className="text-gray-500 mb-2">No tienes citas próximas programadas</p>
            {appointments.length > 0 && (
              <button
                onClick={() => setSortOrder('recent')}
                className="text-primary hover:text-primary-focus font-medium underline"
              >
                Ver historial de citas →
              </button>
            )}
          </>
        ) : (
          <p className="text-gray-500">No hay historial de citas</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toggle Próximas / Historial */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => {
            setSortOrder('upcoming');
            setVisibleCount(20);
          }}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            sortOrder === 'upcoming'
              ? 'bg-primary text-white shadow-md'
              : 'bg-base-200 text-gray-600 hover:bg-base-300'
          }`}
        >
          Próximas
        </button>
        <button
          onClick={() => {
            setSortOrder('recent');
            setVisibleCount(20);
          }}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            sortOrder === 'recent'
              ? 'bg-primary text-white shadow-md'
              : 'bg-base-200 text-gray-600 hover:bg-base-300'
          }`}
        >
          Historial
        </button>
        <div className="ml-auto text-sm text-gray-500">
          {displayedAppointments.length} {displayedAppointments.length === 1 ? 'cita' : 'citas'}
        </div>
      </div>

      {/* Lista de citas */}
      <div className="space-y-3">
        {displayedAppointments.map((appointment) => {
          const typeDisplay = getTypeDisplay(appointment.appotype);
          const statusDisplay = getStatusDisplay(appointment.status);

          return (
            <div
              key={appointment.appo_id}
              className="bg-base-100 border-2 border-base-200 rounded-xl p-4 hover:border-primary/30 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                {/* Info principal */}
                <div className="flex-1 min-w-0">
                  {/* Fecha y hora */}
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-2 text-gray-700">
                      <CalendarIcon className="w-5 h-5 text-primary" />
                      <span className="font-semibold">{formatDate(appointment.appodate)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <ClockIcon className="w-5 h-5 text-secondary" />
                      <span className="font-medium">{appointment.appotime}</span>
                    </div>
                  </div>

                  {/* Badges de tipo y estado */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-medium ${typeDisplay.colorClass}`}>
                      {typeDisplay.icon}
                      <span>{typeDisplay.text}</span>
                    </div>
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-medium ${statusDisplay.colorClass}`}>
                      {statusDisplay.icon}
                      <span>{statusDisplay.text}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Botón "Mostrar más" (solo en Historial) */}
      {hasMoreToShow && (
        <div className="text-center pt-4">
          <button
            onClick={() => setVisibleCount(prev => prev + 20)}
            className="btn btn-outline btn-primary"
          >
            Mostrar más ({remainingCount} {remainingCount === 1 ? 'cita' : 'citas'} restantes)
          </button>
        </div>
      )}
    </div>
  );
};

UserAppointmentList.propTypes = {
  appointments: PropTypes.arrayOf(
    PropTypes.shape({
      appo_id: PropTypes.number.isRequired,
      appodate: PropTypes.string.isRequired,
      appotime: PropTypes.string.isRequired,
      appotype: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
    })
  ).isRequired,
};
