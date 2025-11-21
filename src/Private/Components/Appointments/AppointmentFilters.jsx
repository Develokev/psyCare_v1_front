import { useDispatch, useSelector } from 'react-redux';
import { filterAppointments } from '../../../store/slices/appointmentSlice';
import PropTypes from 'prop-types';

export const AppointmentFilters = ({ onFilterChange }) => {
  const dispatch = useDispatch();
  const { filters } = useSelector(state => state.appointments);

  // Handler para cambios en los filtros
  const handleFilterChange = (filterType, value) => {
    const newFilters = {
      ...filters,
      [filterType]: value
    };
    
    dispatch(filterAppointments(newFilters));
    if (onFilterChange) onFilterChange(newFilters);
  };

  return (
    <div className="bg-base-100 shadow-lg rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Filtros de Búsqueda</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Filtro de Estado */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Estado de la Cita</span>
          </label>
          <select 
            className="select select-bordered w-full"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="all">Todos los estados</option>
            <option value="pending">Pendiente</option>
            <option value="confirmed">Confirmada</option>
            <option value="cancelled">Cancelada</option>
            <option value="paid">Pagada</option>
          </select>
        </div>

        {/* Filtro de Tipo */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Tipo de Cita</span>
          </label>
          <select 
            className="select select-bordered w-full"
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
          >
            <option value="all">Todos los tipos</option>
            <option value="face-to-face">Presencial</option>
            <option value="online">Online</option>
          </select>
        </div>

        {/* Filtro de Fecha */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Fecha</span>
          </label>
          <input 
            type="date" 
            className="input input-bordered w-full"
            value={filters.date || ''}
            onChange={(e) => handleFilterChange('date', e.target.value)}
          />
          {filters.date && (
            <button 
              className="btn btn-xs btn-ghost mt-2"
              onClick={() => handleFilterChange('date', null)}
            >
              Limpiar fecha
            </button>
          )}
        </div>
      </div>

      {/* Badges de filtros activos */}
      <div className="flex flex-wrap gap-2 mt-4">
        {filters.status !== 'all' && (
          <span className="badge badge-primary gap-2">
            Estado: {filters.status === 'confirmed' ? 'Confirmada' :
                    filters.status === 'pending' ? 'Pendiente' :
                    filters.status === 'cancelled' ? 'Cancelada' :
                    filters.status === 'paid' ? 'Pagada' : filters.status}
            <button 
              className="btn btn-xs btn-ghost btn-circle"
              onClick={() => handleFilterChange('status', 'all')}
            >
              ×
            </button>
          </span>
        )}
        {filters.type !== 'all' && (
          <span className="badge badge-primary gap-2">
            Tipo: {filters.type === 'face-to-face' ? 'Presencial' : 'Online'}
            <button 
              className="btn btn-xs btn-ghost btn-circle"
              onClick={() => handleFilterChange('type', 'all')}
            >
              ×
            </button>
          </span>
        )}
        {filters.date && (
          <span className="badge badge-primary gap-2">
            Fecha: {filters.date}
            <button 
              className="btn btn-xs btn-ghost btn-circle"
              onClick={() => handleFilterChange('date', null)}
            >
              ×
            </button>
          </span>
        )}
      </div>

      {/* Botón para limpiar todos los filtros */}
      {(filters.status !== 'all' || filters.type !== 'all' || filters.date) && (
        <button 
          className="btn btn-ghost btn-sm mt-4"
          onClick={() => {
            dispatch(filterAppointments({
              status: 'all',
              type: 'all',
              date: null
            }));
          }}
        >
          Limpiar todos los filtros
        </button>
      )}
    </div>
  );
};

AppointmentFilters.propTypes = {
  onFilterChange: PropTypes.func
};