import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  CalendarIcon,
  ClockIcon,
  VideoCameraIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

/**
 * Formulario para editar los datos de una cita
 * Permite modificar fecha, hora y tipo de cita
 */
export const AppointmentEditForm = ({ appointment, onSave, onCancel, isLoading }) => {
  // Opciones de hora disponibles
  const timeOptions = ['10:00', '14:00', '17:00', '19:00'];

  // Verificar si la cita se puede editar
  const isEditable = appointment.status !== 'cancelled' && appointment.status !== 'paid';

  // Estado local del formulario
  const [formData, setFormData] = useState({
    appodate: appointment.appodate || '',
    appotime: appointment.appotime || '',
    appotype: appointment.appotype || 'online',
  });

  const [errors, setErrors] = useState({});

  // Handler de cambios en inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Validación del formulario
  const validateForm = () => {
    const newErrors = {};

    if (!formData.appodate) {
      newErrors.appodate = 'La fecha es requerida';
    }

    if (!formData.appotime) {
      newErrors.appotime = 'La hora es requerida';
    }

    if (!formData.appotype) {
      newErrors.appotype = 'El tipo de cita es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handler del submit
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
    }
  };

  // Verificar si hubo cambios
  const hasChanges = 
    formData.appodate !== appointment.appodate ||
    formData.appotime !== appointment.appotime ||
    formData.appotype !== appointment.appotype;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h4 className="text-sm font-semibold text-gray-700 mb-3">
        Editar datos de la cita
      </h4>

      {/* Mensaje de advertencia si no es editable */}
      {!isEditable && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h5 className="text-sm font-semibold text-amber-800 mb-1">
                No se pueden editar los datos de esta cita
              </h5>
              <p className="text-xs text-amber-700">
                Las citas con estado <strong className="uppercase">{appointment.status === 'cancelled' ? 'Cancelada' : 'Pagada'}</strong> no pueden ser modificadas por razones de seguridad y registro.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Fecha - Input tipo date */}
      <div>
        <label htmlFor="appodate" className="label">
          <span className="label-text font-medium flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            Fecha
          </span>
        </label>
        <input
          type="date"
          id="appodate"
          name="appodate"
          value={formData.appodate.split('-').reverse().join('-')} // Convertir DD-MM-YYYY a YYYY-MM-DD
          onChange={(e) => {
            // Convertir YYYY-MM-DD a DD-MM-YYYY
            const [year, month, day] = e.target.value.split('-');
            handleChange({
              target: {
                name: 'appodate',
                value: `${day}-${month}-${year}`
              }
            });
          }}
          className={`input input-bordered w-full ${errors.appodate ? 'input-error' : ''}`}
          disabled={isLoading || !isEditable}
        />
        {errors.appodate && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.appodate}</span>
          </label>
        )}
      </div>

      {/* Hora - Botones de selección */}
      <div>
        <label className="label">
          <span className="label-text font-medium flex items-center gap-2">
            <ClockIcon className="w-4 h-4" />
            Hora
          </span>
        </label>
        <div className="grid grid-cols-4 gap-2">
          {timeOptions.map((time) => (
            <button
              key={time}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, appotime: time }))}
              disabled={isLoading || !isEditable}
              className={`
                px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all
                ${formData.appotime === time
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-50'
                }
                ${isLoading || !isEditable ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {time}
            </button>
          ))}
        </div>
        {errors.appotime && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.appotime}</span>
          </label>
        )}
      </div>

      {/* Tipo de cita */}
      <div>
        <label className="label">
          <span className="label-text font-medium">Tipo de cita</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          {/* Online */}
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, appotype: 'online' }))}
            disabled={isLoading || !isEditable}
            className={`
              flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all
              ${formData.appotype === 'online'
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-gray-200 bg-white hover:border-gray-300'
              }
              ${isLoading || !isEditable ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <VideoCameraIcon className={`w-5 h-5 ${formData.appotype === 'online' ? 'text-green-600' : 'text-gray-400'}`} />
            <span className="font-medium">Online</span>
          </button>

          {/* Presencial */}
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, appotype: 'face-to-face' }))}
            disabled={isLoading || !isEditable}
            className={`
              flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all
              ${formData.appotype === 'face-to-face'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-white hover:border-gray-300'
              }
              ${isLoading || !isEditable ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <UserGroupIcon className={`w-5 h-5 ${formData.appotype === 'face-to-face' ? 'text-blue-600' : 'text-gray-400'}`} />
            <span className="font-medium">Presencial</span>
          </button>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-outline hover:btn-error transition-all shadow-md hover:shadow-lg"
          disabled={isLoading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn btn-primary hover:btn-accent transition-all shadow-md hover:shadow-lg"
          disabled={isLoading || !hasChanges || !isEditable}
        >
          {isLoading ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>

      {/* Mensaje informativo */}
      {!hasChanges && isEditable && (
        <p className="text-xs text-gray-500 text-center">
          No hay cambios para guardar
        </p>
      )}
    </form>
  );
};

AppointmentEditForm.propTypes = {
  appointment: PropTypes.shape({
    appodate: PropTypes.string.isRequired,
    appotime: PropTypes.string.isRequired,
    appotype: PropTypes.string.isRequired,
  }).isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};
