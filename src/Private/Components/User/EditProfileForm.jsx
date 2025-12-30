import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { UserCircleIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { useForm } from '../../../Hooks/useForm';

// Configuración Cloudinary
const CLOUDINARY_CLOUD_NAME = 'ddhna6uy3';
const CLOUDINARY_UPLOAD_PRESET = 'psycare_avatars';
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

/**
 * EditProfileForm - Formulario de edición de perfil con upload de avatar
 */
export const EditProfileForm = ({ user, onSave, onCancel, loading }) => {
  const { form, handleChange, setForm } = useForm({
    name: user.name,
    last_name: user.last_name,
    phone: user.phone || '',
  });

  const [avatarPreview, setAvatarPreview] = useState(user.avatar);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user.avatar);
  const fileInputRef = useRef(null);

  // Handler para selección de archivo
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida');
      return;
    }

    // Validar tamaño (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen debe ser menor a 5MB');
      return;
    }

    // Preview local
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload a Cloudinary
    uploadToCloudinary(file);
  };

  // Upload a Cloudinary
  const uploadToCloudinary = async (file) => {
    setUploadingAvatar(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', 'psycare/avatars');

    try {
      const response = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.secure_url) {
        setAvatarUrl(data.secure_url);
      } else {
        throw new Error('No se recibió URL de Cloudinary');
      }
    } catch (error) {
      console.error('❌ Error al subir avatar:', error);
      alert('Error al subir la imagen. Intenta de nuevo.');
      setAvatarPreview(user.avatar); // Revertir preview
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Handler de submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones
    if (!form.name.trim() || !form.last_name.trim()) {
      alert('El nombre y apellido son obligatorios');
      return;
    }

    if (form.phone && form.phone.trim().length < 9) {
      alert('El teléfono debe tener al menos 9 dígitos');
      return;
    }

    // Enviar datos incluyendo nueva URL de avatar
    onSave({
      name: form.name.trim(),
      last_name: form.last_name.trim(),
      phone: form.phone.trim() || null,
      avatar: avatarUrl, // URL de Cloudinary
      role: user.role, // Incluir role para que el backend genere el token
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Card de Avatar */}
      <div className="card bg-gradient-to-br from-primary/10 via-white to-secondary/10 shadow-lg border-l-4 border-primary">
        <div className="card-body items-center text-center">
          {/* Avatar preview */}
          <div className="avatar mb-4 relative">
            <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Preview avatar" />
              ) : (
                <div className="bg-primary/20 flex items-center justify-center">
                  <UserCircleIcon className="w-20 h-20 text-primary" />
                </div>
              )}
            </div>

            {/* Loading spinner durante upload */}
            {uploadingAvatar && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                <span className="loading loading-spinner loading-lg text-white"></span>
              </div>
            )}
          </div>

          {/* Botón cambiar foto */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingAvatar}
            className="btn btn-secondary btn-sm gap-2"
          >
            <PhotoIcon className="w-5 h-5" />
            {uploadingAvatar ? 'Subiendo...' : 'Cambiar Foto'}
          </button>
          <p className="text-xs text-gray-500 mt-2">
            JPG, PNG o WEBP (máx 5MB)
          </p>
        </div>
      </div>

      {/* Card de formulario */}
      <div className="card bg-white shadow-lg border-t-4 border-secondary">
        <div className="card-body">
          <h3 className="card-title text-secondary mb-6">
            Información Personal
          </h3>

          <div className="space-y-6">
            {/* Nombre */}
            <div className="form-control">
              <label className="label mb-2 pb-0 block">
                <span className="label-text font-semibold">Nombre *</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Tu nombre"
                className="input input-bordered input-primary bg-gray-50 hover:bg-gray-100 focus:bg-white focus:ring-2 focus:ring-primary/50 transition-colors"
                required
              />
            </div>

            {/* Apellido */}
            <div className="form-control">
              <label className="label mb-2 pb-0 block">
                <span className="label-text font-semibold">Apellido *</span>
              </label>
              <input
                type="text"
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                placeholder="Tu apellido"
                className="input input-bordered input-primary bg-gray-50 hover:bg-gray-100 focus:bg-white focus:ring-2 focus:ring-primary/50 transition-colors"
                required
              />
            </div>

            {/* Teléfono */}
            <div className="form-control">
              <label className="label mb-2 pb-0 block">
                <span className="label-text font-semibold">Teléfono</span>
                <span className="label-text-alt text-gray-400">Opcional</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+34 600 000 000"
                className="input input-bordered input-secondary bg-gray-50 hover:bg-gray-100 focus:bg-white focus:ring-2 focus:ring-secondary/50 transition-colors"
              />
            </div>

            {/* Email (read-only) */}
            <div className="form-control">
              <label className="label mb-2 pb-0 block">
                <span className="label-text font-semibold">Email</span>
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="input input-bordered bg-gray-200 cursor-not-allowed text-gray-600"
              />
              <label className="label mt-2">
                <span className="label-text-alt text-gray-400">
                  No modificable por seguridad
                </span>
              </label>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="card-actions justify-end mt-8 gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading || uploadingAvatar}
              className="btn btn-outline"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || uploadingAvatar}
              className="btn btn-primary"
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Guardando...
                </>
              ) : (
                '💾 Guardar Cambios'
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

EditProfileForm.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    last_name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string,
    avatar: PropTypes.string,
  }).isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

EditProfileForm.defaultProps = {
  loading: false,
};
