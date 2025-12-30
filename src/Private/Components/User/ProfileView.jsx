import PropTypes from 'prop-types';
import { UserCircleIcon, EnvelopeIcon, PhoneIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

/**
 * ProfileView - Visualización read-only del perfil del usuario
 * Muestra avatar, datos personales y rol
 */
export const ProfileView = ({ user, onEdit }) => {
  return (
    <div className="space-y-6">
      {/* Card principal con avatar */}
      <div className="card bg-gradient-to-br from-primary/10 via-white to-secondary/10 shadow-lg border-l-4 border-primary">
        <div className="card-body items-center text-center">
          {/* Avatar */}
          <div className="avatar mb-4">
            <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              {user.avatar ? (
                <img src={user.avatar} alt={`Avatar de ${user.name}`} />
              ) : (
                <div className="bg-primary/20 flex items-center justify-center">
                  <UserCircleIcon className="w-20 h-20 text-primary" />
                </div>
              )}
            </div>
          </div>

          {/* Nombre completo */}
          <h2 className="text-3xl font-display font-bold text-primary">
            {user.name} {user.last_name}
          </h2>

          {/* Rol badge */}
          <div className="badge badge-secondary badge-lg gap-2 mt-2">
            <ShieldCheckIcon className="w-4 h-4" />
            {user.role === 'admin' ? 'Administrador' : 'Paciente'}
          </div>

          {/* Botón editar */}
          <button
            onClick={onEdit}
            className="btn btn-primary btn-wide mt-4"
          >
            ✏️ Editar Perfil
          </button>
        </div>
      </div>

      {/* Card de información de contacto */}
      <div className="card bg-white shadow-lg border-t-4 border-secondary">
        <div className="card-body">
          <h3 className="card-title text-secondary mb-4">
            Información de Contacto
          </h3>

          <div className="space-y-4">
            {/* Email */}
            <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
              <EnvelopeIcon className="w-6 h-6 text-primary flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-gray-500 font-medium">Email</p>
                <p className="text-sm font-semibold text-gray-700">{user.email}</p>
                <p className="text-xs text-gray-400 italic mt-0.5">
                  No modificable por seguridad
                </p>
              </div>
            </div>

            {/* Teléfono */}
            <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
              <PhoneIcon className="w-6 h-6 text-secondary flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-gray-500 font-medium">Teléfono</p>
                <p className="text-sm font-semibold text-gray-700">
                  {user.phone || (
                    <span className="text-gray-400 italic">No registrado</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ProfileView.propTypes = {
  user: PropTypes.shape({
    user_id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    last_name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string,
    avatar: PropTypes.string,
    role: PropTypes.string.isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
};
