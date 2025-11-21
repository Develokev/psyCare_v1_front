import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  CalendarIcon,
  ClockIcon,
  VideoCameraIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  XCircleIcon,
  CurrencyDollarIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';
import { AppointmentModal } from '../Appointments/AppointmentModal';

/**
 * Componente presentacional para mostrar la lista de citas de un paciente específico
 * Similar a AppointmentList pero enfocado en un solo paciente
 */
export const PatientAppointmentList = ({ appointments, patientName }) => {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState('upcoming'); // 'upcoming' | 'recent'
  const [visibleCount, setVisibleCount] = useState(20);

  // Obtener fecha actual para comparaciones
  const today = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  }, []);

  const handleEditClick = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      confirmed: {
        class: 'badge-success',
        icon: CheckCircleIcon,
        text: 'Confirmada',
      },
      pending: {
        class: 'badge-warning',
        icon: ExclamationCircleIcon,
        text: 'Pendiente',
      },
      cancelled: {
        class: 'badge-error',
        icon: XCircleIcon,
        text: 'Cancelada',
      },
      paid: {
        class: 'badge-info',
        icon: CurrencyDollarIcon,
        text: 'Pagada',
      },
    };

    const config = statusConfig[status] || {
      class: 'badge-ghost',
      icon: ExclamationCircleIcon,
      text: status,
    };
    const Icon = config.icon;

    return (
      <div className={`badge ${config.class} badge-sm gap-1`}>
        <Icon style={{ width: '15px', height: '15px' }} />
        <span className="text-xs">{config.text}</span>
      </div>
    );
  };

  const getTypeBadge = (type) => {
    if (type === 'online') {
      return (
        <div className="badge badge-primary badge-sm gap-1">
          <VideoCameraIcon style={{ width: '15px', height: '15px' }} />
          <span className="text-xs">Online</span>
        </div>
      );
    }
    return (
      <div className="badge badge-secondary badge-sm gap-1">
        <UserGroupIcon style={{ width: '15px', height: '15px' }} />
        <span className="text-xs">Presencial</span>
      </div>
    );
  };

  // Ordenar y filtrar citas según el orden seleccionado
  const sortedAppointments = useMemo(() => {
    let filtered = [...appointments];

    // Si es modo "Próximas", filtrar solo citas futuras
    if (sortOrder === 'upcoming') {
      filtered = filtered.filter(appo => {
        const [day, month, year] = appo.appodate.split('-');
        const appoDate = new Date(year, month - 1, day);
        appoDate.setHours(0, 0, 0, 0);
        return appoDate >= today;
      });
    }

    // Ordenar las citas
    const sorted = filtered.sort((a, b) => {
      // Convertir fecha A a Date object
      const [dayA, monthA, yearA] = a.appodate.split('-');
      const dateA = new Date(yearA, monthA - 1, dayA);
      
      // Convertir fecha B a Date object
      const [dayB, monthB, yearB] = b.appodate.split('-');
      const dateB = new Date(yearB, monthB - 1, dayB);

      // Si las fechas son diferentes
      if (dateA.getTime() !== dateB.getTime()) {
        // Próximas: ascendente (más cercana primero)
        // Historial: descendente (más reciente primero)
        return sortOrder === 'upcoming' ? dateA - dateB : dateB - dateA;
      }

      // Si es el mismo día, ordenar por hora
      const [hoursA, minutesA] = a.appotime.split(':');
      const timeA = parseInt(hoursA) * 60 + parseInt(minutesA);
      
      const [hoursB, minutesB] = b.appotime.split(':');
      const timeB = parseInt(hoursB) * 60 + parseInt(minutesB);

      return sortOrder === 'upcoming' ? timeA - timeB : timeB - timeA;
    });

    return sorted;
  }, [appointments, sortOrder, today]);

  // Limitar citas visibles (solo en modo Historial)
  const displayedAppointments = useMemo(() => {
    if (sortOrder === 'upcoming') {
      return sortedAppointments; // Mostrar todas las próximas
    }
    return sortedAppointments.slice(0, visibleCount);
  }, [sortedAppointments, sortOrder, visibleCount]);

  const hasMoreToShow = sortOrder === 'recent' && sortedAppointments.length > visibleCount;
  const remainingCount = sortedAppointments.length - visibleCount;

  return (
    <>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            Citas de {patientName}
          </h2>
          
          <div className="flex items-center gap-4">
            {/* Botones de ordenamiento */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 font-medium">Ver:</span>
              <button
                onClick={() => {
                  setSortOrder('upcoming');
                  setVisibleCount(20);
                }}
                className={`btn btn-sm gap-1 ${
                  sortOrder === 'upcoming' ? 'btn-primary' : 'btn-ghost'
                }`}
              >
                📅 Próximas
              </button>
              <button
                onClick={() => {
                  setSortOrder('recent');
                  setVisibleCount(20);
                }}
                className={`btn btn-sm gap-1 ${
                  sortOrder === 'recent' ? 'btn-primary' : 'btn-ghost'
                }`}
              >
                📋 Historial
              </button>
            </div>

            {/* Badge de total */}
            <div className="badge badge-neutral badge-lg">
              {sortOrder === 'upcoming' 
                ? `${sortedAppointments.length} próximas`
                : `${displayedAppointments.length} de ${sortedAppointments.length} citas`
              }
            </div>
          </div>
        </div>

        {appointments.length === 0 ? (
          <div className="text-center py-12">
            <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              No hay citas registradas para este paciente
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra table-sm">
              <thead>
                <tr>
                  <th className="w-16">ID</th>
                  <th className="w-32">Fecha</th>
                  <th className="w-24">Hora</th>
                  <th className="w-32">Tipo</th>
                  <th className="w-32">Estado</th>
                  <th className="w-48">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {displayedAppointments.map((appointment) => (
                  <tr key={appointment.appo_id} className="hover">
                    <td className="font-mono text-xs">{appointment.appo_id}</td>
                    <td>
                      <div className="flex items-center gap-1">
                        <CalendarIcon
                          style={{ width: '14px', height: '14px' }}
                          className="text-gray-400"
                        />
                        <span className="text-sm font-medium">
                          {appointment.appodate}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <ClockIcon
                          style={{ width: '14px', height: '14px' }}
                          className="text-gray-400"
                        />
                        <span className="text-sm">{appointment.appotime}</span>
                      </div>
                    </td>
                    <td>{getTypeBadge(appointment.appotype)}</td>
                    <td>{getStatusBadge(appointment.status)}</td>
                    <td>
                      <button
                        onClick={() => handleEditClick(appointment)}
                        className="btn btn-ghost btn-sm gap-2"
                        aria-label="Editar cita"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Botón Mostrar más */}
        {hasMoreToShow && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setVisibleCount(prev => prev + 20)}
              className="btn btn-outline btn-primary gap-2"
            >
              Mostrar más
              <span className="badge badge-sm">{remainingCount} restantes</span>
            </button>
          </div>
        )}
      </div>

      {/* Modal de edición - Reutiliza el mismo que AppointmentList */}
      <AppointmentModal
        isOpen={isModalOpen}
        appointment={selectedAppointment}
        onClose={handleCloseModal}
      />
    </>
  );
};

PatientAppointmentList.propTypes = {
  appointments: PropTypes.arrayOf(
    PropTypes.shape({
      appo_id: PropTypes.number.isRequired,
      appodate: PropTypes.string.isRequired,
      appotime: PropTypes.string.isRequired,
      appotype: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      session_notes: PropTypes.string,
    })
  ).isRequired,
  patientName: PropTypes.string.isRequired,
};
