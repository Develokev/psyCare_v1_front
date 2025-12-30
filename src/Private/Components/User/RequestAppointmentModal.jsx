import { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { XMarkIcon, VideoCameraIcon, UserGroupIcon, ClockIcon } from '@heroicons/react/24/outline';
import { CalendarDaysIcon } from '@heroicons/react/24/solid';
import { useAvailableSlots } from '../../../Hooks/useAvailableSlots';
import { addAppointment } from '../../../store/slices/appointmentSlice';

/**
 * RequestAppointmentModal - Modal para solicitar nueva cita
 * Tema: userPanel (retro-playa)
 */
export const RequestAppointmentModal = ({ isOpen, onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const { userData } = useSelector(state => state.user);
  const { token } = useSelector(state => state.auth);
  
  // Estado del formulario
  const [appointmentType, setAppointmentType] = useState('online'); // 'online' | 'presential'
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Hook para obtener slots disponibles
  const { slots, loading: loadingSlots } = useAvailableSlots(selectedDate);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validar campos completos
    if (!selectedDate || !selectedTime) {
      setError('Por favor, selecciona fecha y hora para la cita');
      return;
    }

    setSubmitting(true);

    try {
      // Formatear fecha a DD-MM-YYYY
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const year = selectedDate.getFullYear();
      const formattedDate = `${day}-${month}-${year}`;

      // Payload para crear la cita
      const appointmentData = {
        user_id: userData.user_id,
        appoDate: formattedDate, // Backend espera camelCase
        appoTime: selectedTime,  // Backend espera camelCase
        appoType: appointmentType === 'presential' ? 'face-to-face' : 'online', // Backend espera "face-to-face" o "online"
        status: 'pending' // Estado inicial: pendiente de confirmación
      };

      const response = await fetch('https://psycare-db.onrender.com/admin/appo', {
        method: 'POST',
        headers: {
          'x-token': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(appointmentData)
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('❌ Respuesta del servidor:', data);
        throw new Error(data.message || data.msg || 'Error al crear la cita');
      }

      // Agregar la nueva cita a Redux
      dispatch(addAppointment(data.data));

      // Limpiar formulario
      setAppointmentType('online');
      setSelectedDate(null);
      setSelectedTime(null);

      // Cerrar modal
      onClose();

      // Mostrar mensaje de éxito
      onSuccess();

    } catch (err) {
      console.error('❌ Error al crear cita:', err.message);
      setError(err.message || 'Error al solicitar la cita. Intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  // Fecha mínima: mañana (no permitir hoy ni pasado)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  if (!isOpen) return null;

  return (
    <div className="modal modal-open" data-theme="userPanel">
      <div className="modal-box max-w-2xl bg-white border-4 border-primary/20 relative">
        {/* Header con decoración */}
        <div className="absolute -top-2 -left-2 w-20 h-20 bg-primary/10 rounded-full blur-xl"></div>
        <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-accent/10 rounded-full blur-xl"></div>
        
        {/* Header */}
        <div className="relative flex items-center justify-between mb-6 pb-4 border-b-2 border-primary/20">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-primary to-secondary rounded-xl shadow-md">
              <CalendarDaysIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-display font-bold text-primary">
                Solicitar Nueva Cita
              </h3>
              <p className="text-sm text-gray-500">
                Selecciona fecha, hora y tipo de sesión
              </p>
            </div>
          </div>
          
          {/* Botón cerrar */}
          <button
            onClick={onClose}
            className="btn btn-sm btn-ghost btn-circle hover:bg-error/10 hover:text-error transition-all"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Body - Formulario */}
        <form onSubmit={handleSubmit} className="relative">
          <div className="space-y-6">
            
            {/* Selector de Tipo de Cita */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Tipo de Sesión
              </label>
              <div className="grid grid-cols-2 gap-4">
                {/* Opción Online */}
                <button
                  type="button"
                  onClick={() => setAppointmentType('online')}
                  className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                    appointmentType === 'online'
                      ? 'border-secondary bg-secondary/10 shadow-md scale-105'
                      : 'border-gray-200 bg-white hover:border-secondary/50 hover:shadow-sm'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className={`p-3 rounded-full transition-colors ${
                      appointmentType === 'online'
                        ? 'bg-secondary text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      <VideoCameraIcon className="w-6 h-6" />
                    </div>
                    <span className={`font-semibold transition-colors ${
                      appointmentType === 'online'
                        ? 'text-secondary'
                        : 'text-gray-600'
                    }`}>
                      Online
                    </span>
                    <span className="text-xs text-gray-500">
                      Videollamada
                    </span>
                  </div>
                  {/* Checkmark cuando está seleccionado */}
                  {appointmentType === 'online' && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </button>

                {/* Opción Presencial */}
                <button
                  type="button"
                  onClick={() => setAppointmentType('presential')}
                  className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                    appointmentType === 'presential'
                      ? 'border-primary bg-primary/10 shadow-md scale-105'
                      : 'border-gray-200 bg-white hover:border-primary/50 hover:shadow-sm'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className={`p-3 rounded-full transition-colors ${
                      appointmentType === 'presential'
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      <UserGroupIcon className="w-6 h-6" />
                    </div>
                    <span className={`font-semibold transition-colors ${
                      appointmentType === 'presential'
                        ? 'text-primary'
                        : 'text-gray-600'
                    }`}>
                      Presencial
                    </span>
                    <span className="text-xs text-gray-500">
                      En consultorio
                    </span>
                  </div>
                  {/* Checkmark cuando está seleccionado */}
                  {appointmentType === 'presential' && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Selector de Fecha */}
            <div className="flex flex-col items-center">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Fecha de la Cita
              </label>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    minDate={tomorrow}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Selecciona una fecha"
                    className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all w-64"
                    calendarClassName="custom-datepicker"
                    inline={false}
                    showPopperArrow={false}
                  />
                </div>
                <CalendarDaysIcon className="w-6 h-6 text-primary" />
              </div>
              {selectedDate && (
                <p className={`text-sm mt-2 flex items-center gap-1 ${
                  appointmentType === 'online' ? 'text-secondary' : 'text-primary'
                }`}>
                  <span>✓</span>
                  Fecha seleccionada: {selectedDate.toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </p>
              )}
            </div>

            {/* Selector de Hora */}
            {selectedDate && (
              <div className="flex flex-col items-center">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Hora de la Cita
                </label>
                
                {loadingSlots ? (
                  <div className="flex items-center gap-2 text-gray-500">
                    <span className="loading loading-spinner loading-sm"></span>
                    <span>Cargando horarios disponibles...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-5 gap-3">
                    {slots.map((slot) => (
                      <button
                        key={slot.time}
                        type="button"
                        onClick={() => slot.available && setSelectedTime(slot.time)}
                        disabled={!slot.available}
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 ${
                          selectedTime === slot.time
                            ? appointmentType === 'online'
                              ? 'border-secondary bg-secondary/10 shadow-md scale-105'
                              : 'border-primary bg-primary/10 shadow-md scale-105'
                            : slot.available
                            ? 'border-gray-200 bg-white hover:border-gray-400 hover:shadow-sm'
                            : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-50'
                        }`}
                      >
                        <ClockIcon className={`w-5 h-5 ${
                          selectedTime === slot.time
                            ? appointmentType === 'online' ? 'text-secondary' : 'text-primary'
                            : slot.available
                            ? 'text-gray-600'
                            : 'text-gray-300'
                        }`} />
                        <span className={`text-sm font-semibold ${
                          selectedTime === slot.time
                            ? appointmentType === 'online' ? 'text-secondary' : 'text-primary'
                            : slot.available
                            ? 'text-gray-700'
                            : 'text-gray-400'
                        }`}>
                          {slot.time}
                        </span>
                        {!slot.available && (
                          <span className="text-xs text-gray-400">Ocupado</span>
                        )}
                        {selectedTime === slot.time && (
                          <span className={`text-xs ${
                            appointmentType === 'online' ? 'text-secondary' : 'text-primary'
                          }`}>✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Mensaje si no hay fecha seleccionada */}
            {!selectedDate && (
              <div className="bg-base-200/50 rounded-xl p-8 text-center border-2 border-dashed border-primary/30">
                <p className="text-gray-500 text-sm">
                  ⏰ Selecciona una fecha para ver horarios disponibles
                </p>
              </div>
            )}
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="alert alert-error shadow-lg">
              <span>⚠️ {error}</span>
            </div>
          )}

          {/* Footer - Botones */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t-2 border-primary/20">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="btn btn-ghost text-gray-600 hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting || !selectedDate || !selectedTime}
              className="btn btn-primary gap-2 shadow-md hover:shadow-lg transition-all disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Enviando...
                </>
              ) : (
                <>
                  <CalendarDaysIcon className="w-5 h-5" />
                  Solicitar Cita
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Backdrop */}
      <div className="modal-backdrop bg-black/50" onClick={onClose}></div>
    </div>
  );
};

RequestAppointmentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};
