import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ProfileView } from './ProfileView';
import { EditProfileForm } from './EditProfileForm';
import { setUserData } from '../../../store/slices/userSlice';

/**
 * UserProfile - Container que maneja vista y edición de perfil
 * Coordina ProfileView y EditProfileForm
 */
export const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userData } = useSelector(state => state.user);
  const { token } = useSelector(state => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handler para activar modo edición
  const handleEdit = () => {
    setIsEditing(true);
    setError(null);
  };

  // Handler para cancelar edición
  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
  };

  // Handler para guardar cambios
  const handleSave = async (updatedData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://psycare-db.onrender.com/admin/users/${userData.user_id}`, {
        method: 'PUT',
        headers: {
          'x-token': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('❌ Error del servidor:', data);
        
        const errorMsg = data.msg || data.message || data.errors?.[0]?.msg || 'Error al actualizar perfil';
        throw new Error(errorMsg);
      }

      // Actualizar Redux con los nuevos datos
      dispatch(setUserData({
        ...userData,
        ...updatedData,
      }));

      // Redirigir a /user con estado de éxito
      navigate('/user', { state: { profileUpdated: true } });

    } catch (err) {
      console.error('❌ Error al actualizar perfil:', err.message);
      setError(err.message || 'Error al actualizar el perfil. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-white to-accent/10 py-8" data-theme="userPanel">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Mi Perfil
          </h1>
          <p className="text-gray-600 mt-2">
            {isEditing ? 'Edita tu información personal' : 'Visualiza y gestiona tu información'}
          </p>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="alert alert-error mb-6 shadow-lg">
            <div>
              <span className="text-lg">❌</span>
              <div>
                <h3 className="font-bold">Error</h3>
                <div className="text-sm">{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Renderizado condicional */}
        {isEditing ? (
          <EditProfileForm
            user={userData}
            onSave={handleSave}
            onCancel={handleCancel}
            loading={loading}
          />
        ) : (
          <ProfileView
            user={userData}
            onEdit={handleEdit}
          />
        )}
      </div>
    </div>
  );
};
