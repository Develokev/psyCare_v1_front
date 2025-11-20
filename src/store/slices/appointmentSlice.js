import { createSlice } from "@reduxjs/toolkit";

/**
 * Estado inicial para el manejo de citas
 * @typedef {Object} AppointmentState
 * @property {Array} appointments - Lista principal de todas las citas
 * @property {Array} filteredAppointments - Lista de citas después de aplicar filtros
 * @property {Object|null} selectedAppointment - Cita seleccionada para ver detalles/editar
 * @property {boolean} loading - Indicador de estado de carga
 * @property {string|null} error - Mensaje de error si existe
 * @property {Object} filters - Filtros activos
 */
const initialState = {
  appointments: [], // Almacena todas las citas
  filteredAppointments: [], // Citas que cumplen con los filtros aplicados
  selectedAppointment: null, // Cita actual seleccionada
  loading: false, // Estado de carga para operaciones asíncronas
  error: null, // Almacena mensajes de error
  filters: {
    status: "all", // pending, confirmed, cancelled, paid
    date: null, // Fecha para filtrar citas
    type: "all", // online, face-to-face
  },
};

export const appointmentSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    /**
     * Actualiza el estado con la lista completa de citas
     * @param {Object} state - Estado actual
     * @param {Object} action - Action con la lista de citas
     */
    setAppointments: (state, action) => {
      state.appointments = action.payload;
      state.loading = false;
      state.error = null; // Limpia errores previos
    },

    /**
     * Guarda una cita seleccionada para ver detalles o editar
     * @param {Object} state - Estado actual
     * @param {Object} action - Action con la cita seleccionada
     */
    setSelectedAppointment: (state, action) => {
      state.selectedAppointment = action.payload;
    },

    /**
     * Actualiza el estado de una cita específica
     * @param {Object} state - Estado actual
     * @param {Object} action - Action con { appoId, status }
     */
    updateAppointmentStatus: (state, action) => {
      const { appoId, status } = action.payload;
      const appointment = state.appointments.find(
        (app) => app.appo_id === appoId
      );
      if (appointment) {
        appointment.status = status;
        // Actualizar también en filteredAppointments si existe
        const filteredAppointment = state.filteredAppointments.find(
          (app) => app.appo_id === appoId
        );
        if (filteredAppointment) {
          filteredAppointment.status = status;
        }
      }
    },

    /**
     * Añade una nueva cita al estado
     * @param {Object} state - Estado actual
     * @param {Object} action - Action con la nueva cita
     */
    addAppointment: (state, action) => {
      state.appointments.push(action.payload);
      // Actualizar filteredAppointments si cumple con los filtros actuales
      if (state.filteredAppointments.length > 0) {
        const { status, date, type } = state.filters;
        const newAppointment = action.payload;
        let shouldAdd = true;

        if (status !== "all" && newAppointment.status !== status)
          shouldAdd = false;
        if (date && newAppointment.appodate !== date) shouldAdd = false;
        if (type !== "all" && newAppointment.appotype !== type)
          shouldAdd = false;

        if (shouldAdd) state.filteredAppointments.push(newAppointment);
      }
    },

    /**
     * Elimina una cita del estado
     * @param {Object} state - Estado actual
     * @param {Object} action - Action con el appoId a eliminar
     */
    deleteAppointment: (state, action) => {
      const appoId = action.payload;

      // Eliminar de appointments
      state.appointments = state.appointments.filter(
        (app) => app.appo_id !== appoId
      );

      // Eliminar de filteredAppointments si existe
      state.filteredAppointments = state.filteredAppointments.filter(
        (app) => app.appo_id !== appoId
      );

      // Limpiar selectedAppointment si es la cita eliminada
      if (state.selectedAppointment?.appo_id === appoId) {
        state.selectedAppointment = null;
      }
    },

    /**
     * Aplica filtros a la lista de citas
     * @param {Object} state - Estado actual
     * @param {Object} action - Action con { status, date, type }
     */
    filterAppointments: (state, action) => {
      const { status, date, type } = action.payload;
      state.filters = { ...state.filters, ...action.payload };

      let filtered = [...state.appointments];

      if (status && status !== "all") {
        filtered = filtered.filter((app) => app.status === status);
      }
      if (date) {
        filtered = filtered.filter((app) => app.appodate === date);
      }
      if (type && type !== "all") {
        filtered = filtered.filter((app) => app.appotype === type);
      }

      state.filteredAppointments = filtered;
    },

    /**
     * Actualiza el estado de carga
     */
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    /**
     * Establece un mensaje de error
     */
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    /**
     * Limpia los errores del estado
     */
    clearError: (state) => {
      state.error = null;
    },
  },
});

// Exportar las acciones para usar en los componentes
export const {
  setAppointments,
  setSelectedAppointment,
  updateAppointmentStatus,
  addAppointment,
  deleteAppointment,
  filterAppointments,
  setLoading,
  setError,
  clearError,
} = appointmentSlice.actions;

export default appointmentSlice.reducer;
