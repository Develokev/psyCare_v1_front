import { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  CalendarDaysIcon,
  ClockIcon,
  VideoCameraIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

/**
 * UserUpcomingAppointments - Widget de próximas 3 citas para paciente
 * Versión de solo lectura con diseño tema userPanel
 */
export const UserUpcomingAppointments = ({ appointments }) => {
  // Filtrar y ordenar para obtener las próximas 3 citas
  const upcomingAppointments = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const filtered = appointments.filter(app => {
      // Excluir SOLO citas canceladas (mostrar pending, confirmed, paid)
      if (app.status === 'cancelled') {
        return false;
      }

      // Convertir fecha DD-MM-YYYY a Date
      const [day, month, year] = app.appodate.split('-');
      const appoDate = new Date(year, month - 1, day);
      appoDate.setHours(0, 0, 0, 0);

      // Solo citas de hoy en adelante
      return appoDate >= today;
    });
    
    const sorted = filtered.sort((a, b) => {
        // Ordenar por fecha
        const [dayA, monthA, yearA] = a.appodate.split('-');
        const dateA = new Date(yearA, monthA - 1, dayA);
        
        const [dayB, monthB, yearB] = b.appodate.split('-');
        const dateB = new Date(yearB, monthB - 1, dayB);

        if (dateA.getTime() !== dateB.getTime()) {
          return dateA - dateB;
        }

        // Si mismo día, ordenar por hora
        const [hoursA, minutesA] = a.appotime.split(':');
        const timeA = parseInt(hoursA) * 60 + parseInt(minutesA);
        
        const [hoursB, minutesB] = b.appotime.split(':');
        const timeB = parseInt(hoursB) * 60 + parseInt(minutesB);

        return timeA - timeB;
      });

    return sorted.slice(0, 3); // Solo las 3 primeras
  }, [appointments]);

  // Formatear fecha legible
  const formatDate = (dateString) => {
    const [day, month, year] = dateString.split('-');
    const date = new Date(year, month - 1, day);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.getTime() === today.getTime()) {
      return 'Hoy';
    }
    
    if (date.getTime() === tomorrow.getTime()) {
      return 'Mañana';
    }

    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return `${days[date.getDay()]}, ${day}/${month}`;
  };

  const getTypeBadge = (type) => {
    if (type === 'online') {
      return (
        <div className="flex items-center gap-1.5 bg-green-100 text-green-700 px-2 py-1 rounded-lg">
          <VideoCameraIcon className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">Online</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1.5 bg-blue-100 text-blue-700 px-2 py-1 rounded-lg">
        <UserGroupIcon className="w-3.5 h-3.5" />
        <span className="text-xs font-medium">Presencial</span>
      </div>
    );
  };

  const getStatusBadge = (status) => {
    if (status === 'confirmed') {
      return (
        <span className="px-2 py-1 rounded-lg bg-secondary/20 text-secondary text-xs font-medium">
          Confirmada
        </span>
      );
    }
    if (status === 'paid') {
      return (
        <span className="px-2 py-1 rounded-lg bg-accent/30 text-accent text-xs font-medium">
          Pagada
        </span>
      );
    }
    return (
      <span className="px-2 py-1 rounded-lg bg-warning/20 text-warning text-xs font-medium">
        Pendiente
      </span>
    );
  };

  // Estado vacío
  if (upcomingAppointments.length === 0) {
    return (
      <div className="bg-white/90 backdrop-blur rounded-lg p-6 text-center">
        <CalendarDaysIcon className="w-16 h-16 text-primary/40 mx-auto mb-3" />
        <p className="text-gray-800 font-semibold mb-1">No hay citas próximas</p>
        <p className="text-gray-600 text-sm">Tus próximas sesiones aparecerán aquí</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {upcomingAppointments.map((appointment, index) => (
        <div
          key={appointment.appo_id}
          className="bg-white/90 backdrop-blur rounded-xl p-4 border-2 border-white/40 hover:border-white hover:scale-[1.02] transition-all duration-200 shadow-sm"
        >
          {/* Número de cita */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg shadow-md">
              {index + 1}
            </div>

            {/* Contenido principal */}
            <div className="flex-1 min-w-0">
              {/* Fecha y hora - destacadas */}
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-1.5 text-primary font-semibold">
                  <CalendarDaysIcon className="w-4 h-4" />
                  <span className="text-sm">{formatDate(appointment.appodate)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-secondary font-semibold">
                  <ClockIcon className="w-4 h-4" />
                  <span className="text-sm">{appointment.appotime}</span>
                </div>
              </div>

              {/* Tipo y estado */}
              <div className="flex items-center gap-2 flex-wrap">
                {getTypeBadge(appointment.appotype)}
                {getStatusBadge(appointment.status)}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

UserUpcomingAppointments.propTypes = {
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
