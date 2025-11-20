import React from 'react';
import PropTypes from 'prop-types';
import { ArrowLeftIcon, UserCircleIcon } from '@heroicons/react/24/outline';

/**
 * Componente presentacional para el encabezado de la ficha del paciente
 * Muestra avatar, nombre completo y breadcrumb de navegación
 */
export const PatientHeader = ({ patient, onBack }) => {
  const fullName = `${patient.name} ${patient.last_name || ''}`.trim();
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Breadcrumb y botón volver */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
        <button
          onClick={onBack}
          className="btn btn-sm btn-ghost gap-2 hover:bg-gray-100"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Volver a todas las citas
        </button>
        <span className="text-gray-400">/</span>
        <span className="font-medium">Ficha de paciente</span>
      </div>

      {/* Header principal con avatar y nombre */}
      <div className="flex items-center gap-6">
        {/* Avatar */}
        <div className="avatar">
          <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
            {patient.avatar ? (
              <img 
                src={patient.avatar} 
                alt={fullName}
                onError={(e) => {
                  // Fallback si la imagen no carga
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div 
              className="flex items-center justify-center bg-primary text-primary-content w-full h-full"
              style={{ display: patient.avatar ? 'none' : 'flex' }}
            >
              <UserCircleIcon className="w-16 h-16" />
            </div>
          </div>
        </div>

        {/* Información del paciente */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {fullName}
          </h1>
          {patient.role && (
            <div className="badge badge-ghost badge-lg">
              {patient.role}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

PatientHeader.propTypes = {
  patient: PropTypes.shape({
    user_id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    last_name: PropTypes.string,
    avatar: PropTypes.string,
    role: PropTypes.string,
  }).isRequired,
  onBack: PropTypes.func.isRequired,
};
