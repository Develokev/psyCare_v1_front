import React from 'react';
import PropTypes from 'prop-types';
import {
  CalendarDaysIcon,
  ClockIcon,
  CheckCircleIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

/**
 * Componente presentacional para mostrar estadísticas del paciente
 * Muestra total de citas, última cita, citas confirmadas, etc.
 */
export const PatientStats = ({ patient, appointments }) => {
  // Calcular estadísticas
  const totalAppointments = appointments.length;
  
  const confirmedAppointments = appointments.filter(
    (appo) => appo.status === 'confirmed'
  ).length;
  
  const paidAppointments = appointments.filter(
    (appo) => appo.status === 'paid'
  ).length;
  
  // Encontrar la última cita
  const getLastAppointment = () => {
    if (appointments.length === 0) return null;
    
    // Ordenar por fecha descendente
    const sortedAppointments = [...appointments].sort((a, b) => {
      const dateA = new Date(a.appodate);
      const dateB = new Date(b.appodate);
      return dateB - dateA;
    });
    
    return sortedAppointments[0];
  };

  const lastAppointment = getLastAppointment();

  // Formatear fecha desde formato DD-MM-YYYY
  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    
    // Si el formato es DD-MM-YYYY, convertirlo
    const parts = dateString.split('-');
    if (parts.length === 3) {
      // Crear fecha desde DD-MM-YYYY
      const day = parts[0];
      const month = parts[1];
      const year = parts[2];
      const date = new Date(`${year}-${month}-${day}`);
      
      // Verificar si la fecha es válida
      if (isNaN(date.getTime())) {
        return 'Fecha inválida';
      }
      
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    }
    
    return 'Formato no válido';
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">
        Estadísticas
      </h3>

      {/* Grid de estadísticas */}
      <div className="grid grid-cols-2 gap-4">
        {/* Total de citas */}
        <div className="stat bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="stat-title text-xs text-gray-600">Total Citas</div>
              <div className="stat-value text-3xl text-blue-600">
                {totalAppointments}
              </div>
            </div>
            <CalendarDaysIcon className="w-10 h-10 text-blue-400" />
          </div>
        </div>

        {/* Citas confirmadas */}
        <div className="stat bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="stat-title text-xs text-gray-600">Confirmadas</div>
              <div className="stat-value text-3xl text-green-600">
                {confirmedAppointments}
              </div>
            </div>
            <CheckCircleIcon className="w-10 h-10 text-green-400" />
          </div>
        </div>

        {/* Citas pagadas */}
        <div className="stat bg-purple-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="stat-title text-xs text-gray-600">Pagadas</div>
              <div className="stat-value text-3xl text-purple-600">
                {paidAppointments}
              </div>
            </div>
            <ChartBarIcon className="w-10 h-10 text-purple-400" />
          </div>
        </div>

        {/* Última cita */}
        <div className="stat bg-orange-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="stat-title text-xs text-gray-600">Última Cita</div>
              <div className="stat-value text-sm text-orange-600">
                {lastAppointment ? formatDate(lastAppointment.appodate) : 'N/A'}
              </div>
              {lastAppointment && (
                <div className="stat-desc text-xs mt-1">
                  {lastAppointment.appotime}
                </div>
              )}
            </div>
            <ClockIcon className="w-10 h-10 text-orange-400" />
          </div>
        </div>
      </div>

      {/* Información adicional */}
      {totalAppointments === 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-sm text-gray-600">
            Este paciente aún no tiene citas registradas
          </p>
        </div>
      )}
    </div>
  );
};

PatientStats.propTypes = {
  patient: PropTypes.object.isRequired,
  appointments: PropTypes.arrayOf(
    PropTypes.shape({
      appo_id: PropTypes.number,
      appodate: PropTypes.string,
      appotime: PropTypes.string,
      status: PropTypes.string,
    })
  ).isRequired,
};
