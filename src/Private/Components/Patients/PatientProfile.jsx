import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
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

  const [filters, setFilters] = useState({
    status: '',
    type: '',
    date: '', // Cambiado de dateFrom a date para búsqueda exacta
  });

  // Buscar datos del paciente
  const patient = useMemo(() => {
    return allUsers.find(user => user.user_id === userId);
  }, [allUsers, userId]);

  // Filtrar citas del paciente
  const patientAppointmentsFiltered = useMemo(() => {
    if (!patient?.email) return [];
    return allAppointments.filter(app => app.email === patient.email);
  }, [allAppointments, patient]);

  // Aplicar filtros a las citas del paciente
  const filteredAppointments = useMemo(() => {
    let filtered = [...patientAppointmentsFiltered];

    // Filtro por estado
    if (filters.status) {
      filtered = filtered.filter(app => app.status === filters.status);
    }

    // Filtro por tipo
    if (filters.type) {
      filtered = filtered.filter(app => app.appotype === filters.type);
    }

    // Filtro por fecha exacta
    if (filters.date) {
      // Convertir fecha del input (YYYY-MM-DD) a formato de la BD (DD-MM-YYYY)
      const [year, month, day] = filters.date.split('-');
      const formattedDate = `${day}-${month}-${year}`;
      filtered = filtered.filter(app => app.appodate === formattedDate);
    }

    return filtered;
  }, [patientAppointmentsFiltered, filters]);

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
      {/* Botón de volver */}
      <button
        onClick={onBack}
        className="btn btn-ghost gap-2"
      >
        <ArrowLeftIcon className="w-5 h-5" />
        Volver a todas las citas
      </button>

      {/* Header con avatar y nombre */}
      <PatientHeader patient={patient} onBack={onBack} />

      {/* Grid con información y estadísticas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PatientContactCard patient={patient} />
        <PatientStats patient={patient} appointments={patientAppointmentsFiltered} />
      </div>

      {/* Filtros de citas - Controles independientes */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-sm font-semibold mb-3">Filtrar citas</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Filtro de Estado */}
          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text text-xs">Estado de la Cita</span>
            </label>
            <select 
              className="select select-bordered select-sm w-full text-xs"
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            >
              <option value="">Todos los estados</option>
              <option value="pending">Pendiente</option>
              <option value="confirmed">Confirmada</option>
              <option value="cancelled">Cancelada</option>
              <option value="paid">Pagada</option>
            </select>
          </div>

          {/* Filtro de Tipo */}
          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text text-xs">Tipo de Cita</span>
            </label>
            <select 
              className="select select-bordered select-sm w-full text-xs"
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
            >
              <option value="">Todos los tipos</option>
              <option value="online">Online</option>
              <option value="face-to-face">Presencial</option>
            </select>
          </div>

          {/* Filtro de Fecha */}
          <div className="form-control w-full">
            <label className="label py-1">
              <span className="label-text text-xs">Fecha</span>
            </label>
            <input
              type="date"
              className="input input-bordered input-sm w-full text-xs"
              value={filters.date}
              onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
            />
          </div>
        </div>
        
        {/* Indicador de resultados */}
        <div className="mt-3 flex items-center justify-between">
          <div className="text-xs text-gray-600">
            Mostrando {filteredAppointments.length} de {patientAppointmentsFiltered.length} citas
          </div>
          {(filters.status || filters.type || filters.date) && (
            <button
              onClick={() => setFilters({ status: '', type: '', date: '' })}
              className="btn btn-xs btn-ghost text-xs"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Lista de citas del paciente - ahora con filtros aplicados */}
      <PatientAppointmentList 
        appointments={filteredAppointments}
        patientName={`${patient.name} ${patient.last_name}`}
      />
    </div>
  );
};

PatientProfile.propTypes = {
  userId: PropTypes.number,
  allUsers: PropTypes.array.isRequired,
  allAppointments: PropTypes.array.isRequired,
  onBack: PropTypes.func.isRequired,
};
