import React from 'react';
import PropTypes from 'prop-types';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  XCircleIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

/**
 * Componente selector de estado para citas
 * Permite cambiar el status de la cita con un dropdown visual
 */
export const StatusSelector = ({ currentStatus, onStatusChange, disabled = false }) => {
  const statusOptions = [
    {
      value: 'pending',
      label: 'Pendiente',
      icon: ExclamationCircleIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      hoverColor: 'hover:bg-yellow-100',
    },
    {
      value: 'confirmed',
      label: 'Confirmada',
      icon: CheckCircleIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      hoverColor: 'hover:bg-green-100',
    },
    {
      value: 'cancelled',
      label: 'Cancelada',
      icon: XCircleIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      hoverColor: 'hover:bg-red-100',
    },
    {
      value: 'paid',
      label: 'Pagada',
      icon: CurrencyDollarIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      hoverColor: 'hover:bg-blue-100',
    },
  ];

  const currentStatusData = statusOptions.find(opt => opt.value === currentStatus);

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-700">
        Cambiar estado de la cita
      </label>

      {/* Estado actual */}
      {currentStatusData && (
        <div className={`flex items-center gap-2 p-3 rounded-lg border-2 ${currentStatusData.bgColor} ${currentStatusData.borderColor}`}>
          <currentStatusData.icon className={`w-5 h-5 ${currentStatusData.color}`} />
          <div>
            <p className="text-xs text-gray-600">Estado actual</p>
            <p className={`font-semibold ${currentStatusData.color}`}>
              {currentStatusData.label}
            </p>
          </div>
        </div>
      )}

      {/* Grid de opciones */}
      <div className="grid grid-cols-2 gap-2">
        {statusOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = option.value === currentStatus;
          
          return (
            <button
              key={option.value}
              onClick={() => onStatusChange(option.value)}
              disabled={disabled || isSelected}
              className={`
                flex items-center gap-2 p-3 rounded-lg border-2 transition-all
                ${isSelected 
                  ? `${option.bgColor} ${option.borderColor} cursor-not-allowed opacity-75` 
                  : `bg-white border-gray-200 ${option.hoverColor} hover:border-gray-300`
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <Icon className={`w-5 h-5 ${isSelected ? option.color : 'text-gray-400'}`} />
              <span className={`text-sm font-medium ${isSelected ? option.color : 'text-gray-700'}`}>
                {option.label}
              </span>
              {isSelected && (
                <span className="ml-auto text-xs bg-white rounded-full px-2 py-0.5">
                  Actual
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Mensaje informativo */}
      <p className="text-xs text-gray-500 mt-2">
        💡 Se solicitará confirmación antes de cambiar el estado
      </p>
    </div>
  );
};

StatusSelector.propTypes = {
  currentStatus: PropTypes.oneOf(['pending', 'confirmed', 'cancelled', 'paid']).isRequired,
  onStatusChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
