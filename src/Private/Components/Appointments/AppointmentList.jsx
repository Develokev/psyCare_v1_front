import React from 'react';
import PropTypes from 'prop-types';
import { 
  CalendarIcon, 
  ClockIcon, 
  VideoCameraIcon,
  UserGroupIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  XCircleIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

/**
 * Componente presentacional para mostrar la lista de citas
 * Recibe los datos y estados como props del contenedor
 */
export const AppointmentList = ({ appointments, loading, error, onPatientClick }) => {
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
        <h2 className="text-2xl font-bold">Lista de Citas</h2>
        <div className="badge badge-neutral badge-lg">{appointments.length} citas</div>
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
            </tr>
          </thead>
          <tbody>
            {appointments.map(appointment => (
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {appointments.length === 0 && (
        <div className="text-center py-8">
          <ExclamationCircleIcon className="h-12 w-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No se encontraron citas</p>
        </div>
      )}
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