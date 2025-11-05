import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "../../Hooks/useForm";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, setError, setLoading } from "../../store/slices/authSlice";
import { setUserData } from "../../store/slices/userSlice";

export const RegisterForm = () => {
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
      console.info('📝 Iniciando registro de usuario...');
      
      const response = await fetch("https://psycare-db.onrender.com/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMessage = result.msg || result.message || 'Error en el proceso de registro';
        throw new Error(errorMessage);
      }

      // Si el registro es exitoso, procedemos con el login automático
      const loginResponse = await fetch("https://psycare-db.onrender.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password
        }),
      });

      const loginResult = await loginResponse.json();

      if (!loginResponse.ok) {
        throw new Error('Registro exitoso pero hubo un problema con el login automático');
      }

      // Decodificar el JWT para obtener la información del usuario
      const tokenData = JSON.parse(atob(loginResult.token.split('.')[1]));

      // Guardamos en Redux
      dispatch(loginSuccess({
        token: loginResult.token,
        role: tokenData.role
      }));
      
      dispatch(setUserData({
        name: tokenData.name,
        role: tokenData.role
      }));

      console.info('✅ Registro y login exitosos:', tokenData.name);
      
      // Redirigimos según el rol (por defecto será 'patient')
      navigate('/user');
    } catch (error) {
      // Manejo estructurado de errores
      let errorMessage = 'Error en el proceso de registro';
      
      if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Error de conexión con el servidor';
      } else if (error.message.includes('already exists')) {
        errorMessage = 'El email ya está registrado';
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
        <h2 className="text-2xl font-semibold mb-4 text-center">Registro</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="name"
            className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            //value={email}
            onChange={ handleChange }
            required
            name = "name"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Last Name</label>
          <input
            type="last_name"
            className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            //value={email}
            onChange={ handleChange }
            required
            name = "last_name"
          />
        </div>

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
          {loading ? 'Registrando...' : 'Regístrate'}
        </button>
      </form>
    </div>
  );
};