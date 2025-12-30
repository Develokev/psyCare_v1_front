import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "../../Hooks/useForm";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, setError, setLoading } from "../../store/slices/authSlice";
import { setUserData } from "../../store/slices/userSlice";

export const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.auth);
  
  const {
    form,
    handleChange
  } = useForm({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      // Desarrollo: Indica que se está intentando el login
      console.info('🔒 Iniciando Login..');
      
      const response = await fetch("https://psycare-db.onrender.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await response.json();
      
      if (!response.ok) {
        // Manejo específico de errores del backend
        const errorMessage = result.msg || result.message || 'Error en Login process';
        throw new Error(errorMessage);
      }

      // ✅ El backend ahora devuelve los datos completos del usuario
      const { token, user } = result;

      // Guardamos en Redux (token y role)
      dispatch(loginSuccess({
        token,
        role: user.role
      }));

      // Guardamos todos los datos del usuario (vienen del backend)
      dispatch(setUserData({
        user_id: user.user_id,
        name: user.name,
        last_name: user.last_name,
        email: user.email,
        avatar: user.avatar,
        role: user.role
      }));
      
      // Desarrollo: Confirma login exitoso
      console.info('✅ Login exitoso:', user.name);
      
      // Redirigimos según el rol
      navigate(user.role === 'admin' ? '/admin' : '/user');
    } catch (error) {
      // Manejo estructurado de errores
      let errorMessage = 'Error en Login process';
      
      if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Error de conexión con el servidor';
      } else if (error.message.includes('Credenciales incorrectas')) {
        errorMessage = 'Email o contraseña incorrectos';
      } else if (error.message) {
        errorMessage = error.message;
      }

      dispatch(setError(errorMessage));
      console.error('❌ Error:', errorMessage);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            //value={email}
            onChange={ handleChange }
            required
            name = "email"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            //value={password}
            onChange={handleChange}
            required
            name= "password"
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm mb-4">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition disabled:bg-blue-400"
        >
          {loading ? 'Cargando...' : 'Iniciar Sesión'}
        </button>
      </form>
    </div>
  );
};