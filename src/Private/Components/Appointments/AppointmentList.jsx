import React from 'react';
import PropTypes from 'prop-types';

/**
 * Componente presentacional para mostrar la lista de citas
 * Recibe los datos y estados como props del contenedor
 */
export const AppointmentList = ({ appointments, loading, error }) => {
  if (loading) return (
    <div className="flex justify-center items-center p-8">
      <p className="text-gray-600">Cargando citas...</p>
    </div>
  );

  if (error) return (
    <div className="p-4 bg-red-100 text-red-700 rounded">
      Error: {error}
    </div>
  );

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Lista de Citas</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">ID Cita</th>
              <th className="px-4 py-2 text-left">Fecha</th>
              <th className="px-4 py-2 text-left">Hora</th>
              <th className="px-4 py-2 text-left">Tipo</th>
              <th className="px-4 py-2 text-left">Paciente</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Estado</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(appointment => (
              <tr 
                key={appointment.appo_id}
                className="border-t hover:bg-gray-50"
              >
                <td className="px-4 py-2">{appointment.appo_id}</td>
                <td className="px-4 py-2">{appointment.appodate}</td>
                <td className="px-4 py-2">{appointment.appotime}</td>
                <td className="px-4 py-2">
                  {appointment.appotype === 'face-to-face' ? 'Presencial' : 'Online'}
                </td>
                <td className="px-4 py-2 font-medium">
                  {`${appointment.name || ''} ${appointment.last_name || ''}`}
                </td>
                <td className="px-4 py-2">
                  {appointment.email || 'N/A'}
                </td>
                <td className="px-4 py-2">
                  <span 
                    className={`px-2 py-1 rounded text-sm ${
                      appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      appointment.status === 'paid' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {appointment.status === 'confirmed' ? 'Confirmada' :
                     appointment.status === 'pending' ? 'Pendiente' :
                     appointment.status === 'cancelled' ? 'Cancelada' :
                     appointment.status === 'paid' ? 'Pagada' :
                     appointment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {appointments.length === 0 && (
        <p className="text-center text-gray-500 mt-4">
          No se encontraron citas
        </p>
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
};