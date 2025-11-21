import { useState } from 'react';
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

  // Ordenar citas por fecha (más reciente primero)
  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateA = new Date(a.appodate);
    const dateB = new Date(b.appodate);
    return dateB - dateA;
  });

  return (
    <>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            Citas de {patientName}
          </h2>
          <div className="badge badge-neutral badge-lg">
            {appointments.length} {appointments.length === 1 ? 'cita' : 'citas'}
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
                {sortedAppointments.map((appointment) => (
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
