import React from 'react';
import PropTypes from 'prop-types';
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

/**
 * Componente presentacional para mostrar los datos de contacto del paciente
 * Muestra email, teléfono, dirección y fecha de registro
 */
export const PatientContactCard = ({ patient }) => {
  // Formatear fecha de registro
  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">
        Datos de Contacto
      </h3>

      <div className="space-y-4">
        {/* Email */}
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <EnvelopeIcon className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 uppercase font-medium">Email</p>
            <p className="text-sm text-gray-800 break-all">
              {patient.email || 'No disponible'}
            </p>
          </div>
        </div>

        {/* Teléfono */}
        <div className="flex items-start gap-3">
          <div className="p-2 bg-green-50 rounded-lg">
            <PhoneIcon className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 uppercase font-medium">Teléfono</p>
            <p className="text-sm text-gray-800">
              {patient.phone || 'No disponible'}
            </p>
          </div>
        </div>

        {/* Dirección */}
        {patient.address && (
          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <MapPinIcon className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 uppercase font-medium">Dirección</p>
              <p className="text-sm text-gray-800">
                {patient.address}
              </p>
            </div>
          </div>
        )}

        {/* Fecha de registro */}
        <div className="flex items-start gap-3">
          <div className="p-2 bg-orange-50 rounded-lg">
            <CalendarIcon className="w-5 h-5 text-orange-600" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 uppercase font-medium">
              Fecha de Registro
            </p>
            <p className="text-sm text-gray-800">
              {formatDate(patient.created_at || patient.registration_date)}
            </p>
          </div>
        </div>

        {/* Contacto de emergencia (si existe) */}
        {patient.emergency_contact && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              Contacto de Emergencia
            </h4>
            <div className="space-y-2 text-sm">
              <p className="text-gray-800">
                <span className="font-medium">Nombre:</span>{' '}
                {patient.emergency_contact.name || 'No disponible'}
              </p>
              {patient.emergency_contact.phone && (
                <p className="text-gray-800">
                  <span className="font-medium">Teléfono:</span>{' '}
                  {patient.emergency_contact.phone}
                </p>
              )}
              {patient.emergency_contact.relationship && (
                <p className="text-gray-800">
                  <span className="font-medium">Relación:</span>{' '}
                  {patient.emergency_contact.relationship}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

PatientContactCard.propTypes = {
  patient: PropTypes.shape({
    email: PropTypes.string,
    phone: PropTypes.string,
    address: PropTypes.string,
    created_at: PropTypes.string,
    registration_date: PropTypes.string,
    emergency_contact: PropTypes.shape({
      name: PropTypes.string,
      phone: PropTypes.string,
      relationship: PropTypes.string,
    }),
  }).isRequired,
};
