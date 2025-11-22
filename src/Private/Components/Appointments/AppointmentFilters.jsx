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
    <div className="bg-base-100 shadow rounded-lg p-4 mb-4">
      <h3 className="text-sm font-semibold mb-3">Filtros de Búsqueda</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Filtro de Estado */}
        <div className="form-control w-full">
          <label className="label py-1">
            <span className="label-text text-xs">Estado de la Cita</span>
          </label>
          <select 
            className="select select-bordered select-sm w-full text-xs"
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
          <label className="label py-1">
            <span className="label-text text-xs">Tipo de Cita</span>
          </label>
          <select 
            className="select select-bordered select-sm w-full text-xs"
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
          <label className="label py-1">
            <span className="label-text text-xs">Fecha</span>
          </label>
          <input 
            type="date" 
            className="input input-bordered input-sm w-full text-xs"
            value={filters.date || ''}
            onChange={(e) => handleFilterChange('date', e.target.value)}
          />
          {filters.date && (
            <button 
              className="btn btn-xs btn-ghost mt-1 text-xs"
              onClick={() => handleFilterChange('date', null)}
            >
              Limpiar fecha
            </button>
          )}
        </div>
      </div>

      {/* Badges de filtros activos */}
      <div className="flex flex-wrap gap-1.5 mt-3">
        {filters.status !== 'all' && (
          <span className="badge badge-primary badge-sm gap-1 text-xs">
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
          <span className="badge badge-primary badge-sm gap-1 text-xs">
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
          <span className="badge badge-primary badge-sm gap-1 text-xs">
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
          className="btn btn-ghost btn-xs mt-3 text-xs"
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