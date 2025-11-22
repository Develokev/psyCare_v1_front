import { createSlice } from "@reduxjs/toolkit";

/**
 * Estado inicial para el manejo de pacientes
 * @typedef {Object} PatientState
 * @property {Object|null} currentPatient - Datos completos del paciente seleccionado
 * @property {Array} patientAppointments - Citas del paciente seleccionado
 * @property {boolean} loading - Indicador de estado de carga
 * @property {string|null} error - Mensaje de error si existe
 */
const initialState = {
  currentPatient: null, // Información completa del paciente seleccionado
  patientAppointments: [], // Lista de citas del paciente
  loading: false, // Estado de carga
  error: null, // Mensajes de error
};

export const patientSlice = createSlice({
  name: "patient",
  initialState,
  reducers: {
    /**
     * Actualiza el estado con los datos completos del paciente
     * @param {Object} state - Estado actual
     * @param {Object} action - Action con los datos del paciente
     */
    setCurrentPatient: (state, action) => {
      state.currentPatient = action.payload;
      state.loading = false;
      state.error = null;
    },

    /**
     * Actualiza la lista de citas del paciente seleccionado
     * @param {Object} state - Estado actual
     * @param {Object} action - Action con el array de citas
     */
    setPatientAppointments: (state, action) => {
      state.patientAppointments = action.payload;
      state.loading = false;
      state.error = null;
    },

    /**
     * Establece el estado de carga
     * @param {Object} state - Estado actual
     * @param {Object} action - Action con booleano de loading
     */
    setPatientLoading: (state, action) => {
      state.loading = action.payload;
    },

    /**
     * Establece un mensaje de error
     * @param {Object} state - Estado actual
     * @param {Object} action - Action con el mensaje de error
     */
    setPatientError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    /**
     * Limpia los datos del paciente actual (al volver a la lista)
     * @param {Object} state - Estado actual
     */
    clearCurrentPatient: (state) => {
      state.currentPatient = null;
      state.patientAppointments = [];
      state.error = null;
    },
  },
});

export const {
  setCurrentPatient,
  setPatientAppointments,
  setPatientLoading,
  setPatientError,
  clearCurrentPatient,
} = patientSlice.actions;

export default patientSlice.reducer;
