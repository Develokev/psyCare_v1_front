import { useMemo } from 'react';
import PropTypes from 'prop-types';

/**
 * UserStats - Estadísticas personales del usuario
 * Muestra: total de citas, próximas, completadas y canceladas
 */
export const UserStats = ({ appointments }) => {
  // Obtener fecha actual para comparaciones
  const today = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  }, []);

  // Calcular estadísticas
  const stats = useMemo(() => {
    const total = appointments.length;

    // Próximas: pending o confirmed con fecha >= hoy
    const upcoming = appointments.filter(appo => {
      const [day, month, year] = appo.appodate.split('-');
      const appoDate = new Date(year, month - 1, day);
      appoDate.setHours(0, 0, 0, 0);
      
      return (
        (appo.status === 'pending' || appo.status === 'confirmed') &&
        appoDate >= today
      );
    }).length;

    // Completadas: paid o confirmed con fecha pasada
    const completed = appointments.filter(appo => {
      const [day, month, year] = appo.appodate.split('-');
      const appoDate = new Date(year, month - 1, day);
      appoDate.setHours(0, 0, 0, 0);
      
      return (
        appo.status === 'paid' ||
        (appo.status === 'confirmed' && appoDate < today)
      );
    }).length;

    // Canceladas
    const cancelled = appointments.filter(
      appo => appo.status === 'cancelled'
    ).length;

    return { total, upcoming, completed, cancelled };
  }, [appointments, today]);

  return (
    <div className="card bg-white shadow-soft-secondary border-l-4 border-secondary" style={{ boxShadow: '-5px 0 0 0 black, 0 4px 20px -2px rgba(121, 195, 192, 0.15)' }}>
      <div className="card-body p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 bg-secondary/10 rounded-lg">
            <span className="text-xl">📊</span>
          </div>
          <h2 className="card-title text-secondary font-display text-lg">Resumen</h2>
        </div>

        {/* Grid 2x2 compacto */}
        <div className="grid grid-cols-2 gap-3">
          {/* Total de citas */}
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-3 border-l-4 border-primary hover:scale-105 transition-transform cursor-default">
            <div className="text-xs text-gray-600 font-medium mb-0.5">Total</div>
            <div className="text-2xl font-bold text-primary">
              {stats.total}
            </div>
          </div>

          {/* Próximas citas */}
          <div className="bg-gradient-to-br from-accent/20 to-accent/5 rounded-lg p-3 border-l-4 border-accent hover:scale-105 transition-transform cursor-default">
            <div className="text-xs text-gray-600 font-medium mb-0.5">Próximas</div>
            <div className="text-2xl font-bold text-accent">
              {stats.upcoming}
            </div>
          </div>

          {/* Completadas */}
          <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-lg p-3 border-l-4 border-secondary hover:scale-105 transition-transform cursor-default">
            <div className="text-xs text-gray-600 font-medium mb-0.5">Completadas</div>
            <div className="text-2xl font-bold text-secondary">
              {stats.completed}
            </div>
          </div>

          {/* Canceladas (siempre mostrar, incluso si es 0) */}
          <div className="bg-gradient-to-br from-warning/10 to-warning/5 rounded-lg p-3 border-l-4 border-warning hover:scale-105 transition-transform cursor-default">
            <div className="text-xs text-gray-600 font-medium mb-0.5">Canceladas</div>
            <div className="text-2xl font-bold text-warning">
              {stats.cancelled}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

UserStats.propTypes = {
  appointments: PropTypes.arrayOf(
    PropTypes.shape({
      appo_id: PropTypes.number.isRequired,
      appodate: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
    })
  ).isRequired,
};
