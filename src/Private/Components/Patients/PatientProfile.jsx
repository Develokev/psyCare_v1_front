import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  setCurrentPatient,
  setPatientAppointments,
  setPatientLoading,
  setPatientError,
} from '../../../store/slices/patientSlice';
import { PatientHeader } from './PatientHeader';
import { PatientContactCard } from './PatientContactCard';
import { PatientStats } from './PatientStats';
import { PatientAppointmentList } from './PatientAppointmentList';

/**
 * Componente contenedor (Smart Component) para la ficha del paciente
 * Responsabilidades:
 * - Filtrar datos del paciente desde props (ya cargados)
 * - Manejar el estado de Redux
 * - Distribuir los datos a los componentes presentacionales
 */
export const PatientProfile = ({ userId, allUsers, allAppointments, onBack }) => {
  const dispatch = useDispatch();
  const { currentPatient, patientAppointments, loading, error } = useSelector(
    state => state.patient
  );

  useEffect(() => {
    const loadPatientData = () => {
      if (!userId) {
        dispatch(setPatientError('No se proporcionó un ID de usuario válido'));
        return;
      }

      if (!allUsers || allUsers.length === 0) {
        dispatch(setPatientError('No se han cargado los datos de usuarios'));
        return;
      }

      dispatch(setPatientLoading(true));
      
      try {
        const patient = allUsers.find(user => user.user_id === userId);
        
        if (!patient) {
          throw new Error(`No se encontró el paciente con ID ${userId}`);
        }

        dispatch(setCurrentPatient(patient));

        const patientAppos = allAppointments.filter(appo => appo.email === patient.email);
        dispatch(setPatientAppointments(patientAppos));

      } catch (err) {
        console.error('Error al cargar paciente:', err.message);
        dispatch(setPatientError(err.message));
      }
    };

    loadPatientData();
  }, [userId, allUsers, allAppointments, dispatch]);

  // Estado de carga
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <span className="loading loading-spinner loading-lg"></span>
        <p className="text-gray-600 ml-4">Cargando perfil del paciente...</p>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="alert alert-error">
        <span>Error: {error}</span>
        <button onClick={onBack} className="btn btn-sm">
          Volver
        </button>
      </div>
    );
  }

  // No hay datos del paciente
  if (!currentPatient) {
    return (
      <div className="alert alert-warning">
        <span>No se encontraron datos del paciente</span>
        <button onClick={onBack} className="btn btn-sm">
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con navegación y datos básicos */}
      <PatientHeader patient={currentPatient} onBack={onBack} />

      {/* Grid con información del paciente */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna izquierda: Contacto */}
        <div className="lg:col-span-1">
          <PatientContactCard patient={currentPatient} />
        </div>

        {/* Columna derecha: Estadísticas */}
        <div className="lg:col-span-2">
          <PatientStats 
            patient={currentPatient} 
            appointments={patientAppointments} 
          />
        </div>
      </div>

      {/* Lista de citas del paciente */}
      <PatientAppointmentList 
        appointments={patientAppointments}
        patientName={`${currentPatient.name} ${currentPatient.last_name || ''}`}
      />
    </div>
  );
};

PatientProfile.propTypes = {
  userId: PropTypes.number.isRequired,
  allUsers: PropTypes.array.isRequired,
  allAppointments: PropTypes.array.isRequired,
  onBack: PropTypes.func.isRequired,
};
