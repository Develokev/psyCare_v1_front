import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';
import { AppointmentPreview } from './AppointmentPreview';
import { StatusSelector } from './StatusSelector';
import { ConfirmDialog } from './ConfirmDialog';
import { updateAppointmentStatus, deleteAppointment } from '../../../store/slices/appointmentSlice';

/**
 * Modal principal para editar citas
 * Combina los componentes: Preview, StatusSelector y ConfirmDialog
 * Maneja la lógica de cambio de estado y eliminación de citas
 */
export const AppointmentModal = ({ isOpen, appointment, onClose }) => {
  const dispatch = useDispatch();
  const { token } = useSelector(state => state.auth);
  
  // Estados locales
  const [newStatus, setNewStatus] = useState(null);
  const [showStatusConfirm, setShowStatusConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen || !appointment) return null;

  // Mapeo de nombres de estados en español
  const statusLabels = {
    pending: 'Pendiente',
    confirmed: 'Confirmada',
    cancelled: 'Cancelada',
    paid: 'Pagada',
  };

  // Handler cuando se selecciona un nuevo estado
  const handleStatusChange = (status) => {
    setNewStatus(status);
    setShowStatusConfirm(true);
  };

  // Confirmar cambio de estado
  const handleConfirmStatusChange = async () => {
    setIsLoading(true);
    try {
      // Llamada a la API para actualizar el estado
      const response = await fetch(
        'https://psycare-db.onrender.com/admin/appo/status',
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            appo_id: appointment.appo_id,
            status: newStatus 
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al actualizar el estado');
      }

      // Actualizar Redux
      dispatch(updateAppointmentStatus({ 
        appoId: appointment.appo_id, 
        status: newStatus 
      }));

      // TODO: Aquí se enviará la notificación al usuario (futuro)
      console.log('📧 TODO: Enviar notificación de cambio de estado al usuario');

      // Cerrar diálogos y modal
      setShowStatusConfirm(false);
      onClose();
      
    } catch (error) {
      console.error('Error al cambiar estado:', error.message);
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Confirmar eliminación de cita
  const handleConfirmDelete = async () => {
    setIsLoading(true);
    try {
      // Llamada a la API para eliminar la cita
      const response = await fetch(
        `https://psycare-db.onrender.com/admin/appo/${appointment.appo_id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        // Intentar parsear el error si hay contenido
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          throw new Error(data.message || 'Error al eliminar la cita');
        } else {
          throw new Error('Error al eliminar la cita');
        }
      }

      // Actualizar Redux (no intentamos parsear JSON si fue exitoso)
      dispatch(deleteAppointment(appointment.appo_id));

      // Cerrar diálogos y modal
      setShowDeleteConfirm(false);
      onClose();
      
    } catch (error) {
      console.error('Error al eliminar cita:', error.message);
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Overlay de fondo */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal Principal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-t-lg flex items-center justify-between sticky top-0">
            <h2 className="text-xl font-bold">Editar Cita</h2>
            <button
              onClick={onClose}
              className="btn btn-ghost btn-sm btn-circle text-white hover:bg-white/20"
              disabled={isLoading}
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {/* Vista previa de la cita */}
            <AppointmentPreview appointment={appointment} />

            {/* Divisor */}
            <div className="border-t border-gray-200"></div>

            {/* Selector de estado */}
            <StatusSelector
              currentStatus={appointment.status}
              onStatusChange={handleStatusChange}
              disabled={isLoading}
            />

            {/* Divisor */}
            <div className="border-t border-gray-200"></div>

            {/* Botón eliminar cita */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-red-800 mb-2">
                ATENCIÓN
              </h4>
              <p className="text-xs text-red-600 mb-3">
                Eliminar esta cita es una acción permanente y no se puede deshacer.
              </p>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isLoading}
                className="btn btn-error btn-sm gap-2"
              >
                <TrashIcon className="w-4 h-4" />
                Eliminar cita
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Diálogo de confirmación de cambio de estado */}
      <ConfirmDialog
        isOpen={showStatusConfirm}
        onClose={() => setShowStatusConfirm(false)}
        onConfirm={handleConfirmStatusChange}
        title="Confirmar cambio de estado"
        message={`¿Confirmar el cambio de estado de "${statusLabels[appointment.status]}" a "${statusLabels[newStatus]}"?`}
        confirmText={isLoading ? 'Actualizando...' : 'Confirmar'}
        type="warning"
      >
        <div className="bg-gray-50 rounded p-3 text-sm">
          <p className="font-medium text-gray-700">
            Paciente: {appointment.name} {appointment.last_name}
          </p>
          <p className="text-gray-600">
            Fecha: {appointment.appodate} - {appointment.appotime}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            📧 Se enviará una notificación al paciente
          </p>
        </div>
      </ConfirmDialog>

      {/* Diálogo de confirmación de eliminación */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Eliminar cita"
        message="¿Estás seguro de que deseas eliminar esta cita?"
        confirmText={isLoading ? 'Eliminando...' : 'Eliminar'}
        cancelText="Cancelar"
        type="danger"
      >
        <div className="bg-red-50 border border-red-200 rounded p-3 text-sm">
          <p className="font-medium text-red-800">
            Paciente: {appointment.name} {appointment.last_name}
          </p>
          <p className="text-red-700">
            Fecha: {appointment.appodate} - {appointment.appotime}
          </p>
          <p className="text-xs text-red-600 mt-2 font-semibold">
            ⚠️ Esta acción no se puede deshacer
          </p>
        </div>
      </ConfirmDialog>
    </>
  );
};

AppointmentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  appointment: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};
