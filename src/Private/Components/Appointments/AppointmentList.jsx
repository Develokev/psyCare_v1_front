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
  PencilSquareIcon
} from '@heroicons/react/24/outline';
import { AppointmentModal } from './AppointmentModal';

/**
 * Componente presentacional para mostrar la lista de citas
 * Recibe los datos y estados como props del contenedor
 */
export const AppointmentList = ({ appointments, loading, error, onPatientClick }) => {
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

  const handleEditClick = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };
  if (loading) return (
    <div className="flex justify-center items-center p-8">
      <span className="loading loading-spinner loading-lg"></span>
      <p className="text-gray-600 ml-4">Cargando citas...</p>
    </div>
  );

  if (error) return (
    <div className="alert alert-error">
      <XCircleIcon className="h-6 w-6" />
      <span>Error: {error}</span>
    </div>
  );

  const getStatusBadge = (status) => {
    const statusConfig = {
      confirmed: { 
        class: 'badge-success', 
        icon: CheckCircleIcon, 
        text: 'Confirmada' 
      },
      pending: { 
        class: 'badge-warning', 
        icon: ExclamationCircleIcon, 
        text: 'Pendiente' 
      },
      cancelled: { 
        class: 'badge-error', 
        icon: XCircleIcon, 
        text: 'Cancelada' 
      },
      paid: { 
        class: 'badge-info', 
        icon: CurrencyDollarIcon, 
        text: 'Pagada' 
      }
    };

    const config = statusConfig[status] || { 
      class: 'badge-ghost', 
      icon: ExclamationCircleIcon, 
      text: status 
    };
    const Icon = config.icon;

    return (
      <div className={`badge ${config.class} badge-sm gap-1`}>
        <Icon style={{ width: '15px', height: '15px' }} />
        <span className="text-xs">{config.text}</span>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Todas las Citas</h2>
        
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
      
      <div className="overflow-x-auto">
        <table className="table table-zebra table-sm">
          <thead>
            <tr>
              <th className="w-16">ID</th>
              <th className="w-32">Fecha</th>
              <th className="w-24">Hora</th>
              <th className="w-32">Tipo</th>
              <th className="w-48">Paciente</th>
              <th className="w-56">Contacto</th>
              <th className="w-32">Estado</th>
              <th className="w-24">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {displayedAppointments.map(appointment => (
              <tr key={appointment.appo_id} className="hover">
                <td className="font-mono text-xs">{appointment.appo_id}</td>
                <td>
                  <div className="flex items-center gap-1">
                    <CalendarIcon style={{ width: '14px', height: '14px' }} className="text-gray-400" />
                    <span className="text-sm font-medium">{appointment.appodate}</span>
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-1">
                    <ClockIcon style={{ width: '14px', height: '14px' }} className="text-gray-400" />
                    <span className="text-sm text-gray-500">{appointment.appotime}</span>
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-1.5">
                    {appointment.appotype === 'face-to-face' ? (
                      <>
                        <UserGroupIcon style={{ width: '16px', height: '16px' }} className="text-blue-500" />
                        <span className="text-sm">Presencial</span>
                      </>
                    ) : (
                      <>
                        <VideoCameraIcon style={{ width: '16px', height: '16px' }} className="text-green-500" />
                        <span className="text-sm">Online</span>
                      </>
                    )}
                  </div>
                </td>
                <td>
                  <button 
                    className="btn btn-sm btn-primary btn-outline normal-case px-4 py-2"
                    onClick={() => onPatientClick && onPatientClick(appointment)}
                  >
                    {`${appointment.name || ''} ${appointment.last_name || ''}`}
                  </button>
                </td>
                <td className="text-sm text-gray-600">
                  {appointment.email || 'N/A'}
                </td>
                <td>
                  {getStatusBadge(appointment.status)}
                </td>
                <td>
                  <button
                    onClick={() => handleEditClick(appointment)}
                    className="btn btn-ghost btn-xs gap-1 hover:bg-blue-50 hover:text-blue-600"
                    title="Editar cita"
                  >
                    <PencilSquareIcon className="w-4 h-4" />
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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

      {appointments.length === 0 && (
        <div className="text-center py-8">
          <ExclamationCircleIcon className="h-12 w-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No se encontraron citas</p>
        </div>
      )}

      {/* Modal de edición */}
      <AppointmentModal
        isOpen={isModalOpen}
        appointment={selectedAppointment}
        onClose={handleCloseModal}
      />
    </div>
  );
};

AppointmentList.propTypes = {
  appointments: PropTypes.arrayOf(
    PropTypes.shape({
      appo_id: PropTypes.number.isRequired,
      appodate: PropTypes.string.isRequired,
      appotime: PropTypes.string.isRequired,
      appotype: PropTypes.string.isRequired,
      name: PropTypes.string,
      last_name: PropTypes.string,
      email: PropTypes.string,
      status: PropTypes.string.isRequired,
    })
  ).isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  onPatientClick: PropTypes.func,
};