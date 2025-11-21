import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  CalendarDaysIcon,
  ClockIcon,
  VideoCameraIcon,
  UserGroupIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { AppointmentModal } from './AppointmentModal';

/**
 * Componente widget para mostrar las próximas 3 citas
 * Solo muestra citas futuras con estado pending o confirmed
 */
export const UpcomingAppointments = ({ appointments }) => {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filtrar y ordenar para obtener las próximas 3 citas
  const upcomingAppointments = useMemo(() => {
    // Obtener fecha de hoy a medianoche (00:00:00) para comparar solo fechas
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Resetear horas/minutos/segundos/milisegundos

    return appointments
      .filter(app => {
        // Filtro 1: Solo citas pendientes o confirmadas (excluir canceladas y pagadas)
        if (app.status !== 'pending' && app.status !== 'confirmed') {
          return false;
        }

        // Filtro 2: Convertir fecha DD-MM-YYYY a objeto Date
        // Ejemplo: "25-11-2024" → Date(2024, 10, 25)
        const [day, month, year] = app.appodate.split('-');
        const appoDate = new Date(year, month - 1, day); // month-1 porque enero=0
        appoDate.setHours(0, 0, 0, 0); // También a medianoche para comparar solo fechas

        // Filtro 3: Solo citas de hoy en adelante (excluir pasadas)
        return appoDate >= today;
      })
      .sort((a, b) => {
        // Ordenamiento 1: Por fecha (más cercana primero)
        
        // Convertir fecha A a Date object
        const [dayA, monthA, yearA] = a.appodate.split('-');
        const dateA = new Date(yearA, monthA - 1, dayA);
        
        // Convertir fecha B a Date object
        const [dayB, monthB, yearB] = b.appodate.split('-');
        const dateB = new Date(yearB, monthB - 1, dayB);

        // Si las fechas son diferentes, ordenar por fecha ascendente
        if (dateA.getTime() !== dateB.getTime()) {
          return dateA - dateB; // Negativo si A es antes, positivo si B es antes
        }

        // Ordenamiento 2: Si es el mismo día, ordenar por hora
        
        // Convertir hora A a minutos totales (ej: "14:30" → 870 minutos)
        const [hoursA, minutesA] = a.appotime.split(':');
        const timeA = parseInt(hoursA) * 60 + parseInt(minutesA);
        
        // Convertir hora B a minutos totales
        const [hoursB, minutesB] = b.appotime.split(':');
        const timeB = parseInt(hoursB) * 60 + parseInt(minutesB);

        return timeA - timeB; // Hora más temprana primero
      })
      .slice(0, 3); // Solo las 3 primeras citas
  }, [appointments]);

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

  const getTypeBadge = (type) => {
    if (type === 'online') {
      return (
        <div className="flex items-center gap-1 text-green-600">
          <VideoCameraIcon className="w-4 h-4" />
          <span className="text-xs font-medium">Online</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1 text-blue-600">
        <UserGroupIcon className="w-4 h-4" />
        <span className="text-xs font-medium">Presencial</span>
      </div>
    );
  };

  const getStatusBadge = (status) => {
    return status === 'confirmed' ? (
      <span className="badge badge-success badge-xs">Confirmada</span>
    ) : (
      <span className="badge badge-warning badge-xs">Pendiente</span>
    );
  };

  // Formatear fecha para mostrar de forma más legible
  const formatDate = (dateString) => {
    // Convertir DD-MM-YYYY a objeto Date
    const [day, month, year] = dateString.split('-');
    const date = new Date(year, month - 1, day);
    
    // Obtener fecha de hoy (a medianoche)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Calcular fecha de mañana
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1); // Sumar 1 día

    // Comparar timestamps (milisegundos desde 1970)
    // Si es hoy, mostrar "Hoy"
    if (date.getTime() === today.getTime()) {
      return 'Hoy';
    }
    
    // Si es mañana, mostrar "Mañana"
    if (date.getTime() === tomorrow.getTime()) {
      return 'Mañana';
    }

    // Sino, mostrar día de la semana abreviado + fecha
    // Ejemplo: "Lun, 25/11"
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return `${days[date.getDay()]}, ${day}/${month}`;
  };

  if (upcomingAppointments.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Próximas Citas</h2>
          <CalendarDaysIcon className="w-6 h-6 text-gray-400" />
        </div>
        <div className="text-center py-8">
          <CalendarDaysIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No hay citas próximas programadas</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Próximas Citas</h2>
          <div className="badge badge-primary">{upcomingAppointments.length}</div>
        </div>

        <div className="space-y-3">
          {upcomingAppointments.map((appointment) => (
            <button
              key={appointment.appo_id}
              onClick={() => handleAppointmentClick(appointment)}
              className="w-full text-left p-4 rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all group"
            >
              <div className="flex items-start justify-between gap-3">
                {/* Info principal */}
                <div className="flex-1 min-w-0">
                  {/* Paciente */}
                  <h3 className="font-semibold text-gray-800 truncate mb-1">
                    {appointment.name} {appointment.last_name}
                  </h3>
                  
                  {/* Fecha y hora */}
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center gap-1">
                      <CalendarDaysIcon className="w-4 h-4" />
                      <span className="font-medium">{formatDate(appointment.appodate)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ClockIcon className="w-4 h-4" />
                      <span>{appointment.appotime}</span>
                    </div>
                  </div>

                  {/* Tipo y estado */}
                  <div className="flex items-center gap-3">
                    {getTypeBadge(appointment.appotype)}
                    {getStatusBadge(appointment.status)}
                  </div>
                </div>

                {/* Icono de acción */}
                <ChevronRightIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Modal de edición */}
      <AppointmentModal
        isOpen={isModalOpen}
        appointment={selectedAppointment}
        onClose={handleCloseModal}
      />
    </>
  );
};

UpcomingAppointments.propTypes = {
  appointments: PropTypes.arrayOf(
    PropTypes.shape({
      appo_id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      last_name: PropTypes.string.isRequired,
      appodate: PropTypes.string.isRequired,
      appotime: PropTypes.string.isRequired,
      appotype: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
    })
  ).isRequired,
};
