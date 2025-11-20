import React from 'react';
import PropTypes from 'prop-types';
import {
  CalendarIcon,
  ClockIcon,
  VideoCameraIcon,
  UserGroupIcon,
  UserIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';

/**
 * Componente presentacional para mostrar vista previa de una cita
 * Usado dentro del modal de edición para mostrar los datos de la cita seleccionada
 */
export const AppointmentPreview = ({ appointment }) => {
  const fullName = `${appointment.name || ''} ${appointment.last_name || ''}`.trim();

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <CalendarIcon className="w-4 h-4 text-blue-600" />
        Información de la cita
      </h4>

      <div className="grid grid-cols-2 gap-3 text-sm">
        {/* Paciente */}
        <div className="col-span-2 flex items-center gap-2 bg-white rounded p-2">
          <UserIcon className="w-4 h-4 text-gray-500" />
          <div>
            <p className="text-xs text-gray-500">Paciente</p>
            <p className="font-semibold text-gray-800">{fullName || 'Sin nombre'}</p>
          </div>
        </div>

        {/* Fecha */}
        <div className="flex items-center gap-2 bg-white rounded p-2">
          <CalendarIcon className="w-4 h-4 text-gray-500" />
          <div>
            <p className="text-xs text-gray-500">Fecha</p>
            <p className="font-medium text-gray-800">{appointment.appodate}</p>
          </div>
        </div>

        {/* Hora */}
        <div className="flex items-center gap-2 bg-white rounded p-2">
          <ClockIcon className="w-4 h-4 text-gray-500" />
          <div>
            <p className="text-xs text-gray-500">Hora</p>
            <p className="font-medium text-gray-800">{appointment.appotime}</p>
          </div>
        </div>

        {/* Tipo */}
        <div className="col-span-2 flex items-center gap-2 bg-white rounded p-2">
          {appointment.appotype === 'online' ? (
            <VideoCameraIcon className="w-4 h-4 text-green-600" />
          ) : (
            <UserGroupIcon className="w-4 h-4 text-blue-600" />
          )}
          <div>
            <p className="text-xs text-gray-500">Tipo de cita</p>
            <p className="font-medium text-gray-800">
              {appointment.appotype === 'online' ? 'Online' : 'Presencial'}
            </p>
          </div>
        </div>

        {/* Email */}
        {appointment.email && (
          <div className="col-span-2 flex items-center gap-2 bg-white rounded p-2">
            <EnvelopeIcon className="w-4 h-4 text-gray-500" />
            <div className="overflow-hidden">
              <p className="text-xs text-gray-500">Email</p>
              <p className="font-medium text-gray-800 truncate">{appointment.email}</p>
            </div>
          </div>
        )}
      </div>

      {/* ID de la cita (pequeño) */}
      <div className="mt-2 text-xs text-gray-500 text-right">
        ID: {appointment.appo_id}
      </div>
    </div>
  );
};

AppointmentPreview.propTypes = {
  appointment: PropTypes.shape({
    appo_id: PropTypes.number.isRequired,
    appodate: PropTypes.string.isRequired,
    appotime: PropTypes.string.isRequired,
    appotype: PropTypes.string.isRequired,
    name: PropTypes.string,
    last_name: PropTypes.string,
    email: PropTypes.string,
    status: PropTypes.string.isRequired,
  }).isRequired,
};
