import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { HomePage } from '../Public/Pages/HomePage';
import { HomeAdmin } from '../Private/Pages/HomeAdmin';
import { HomeUser } from '../Private/Pages/HomeUser';

// Componente de ruta protegida
const PrivateRoute = ({ children, allowedRole }) => {
  const { isAuthenticated, userRole } = useSelector(state => state.auth);
  
  if (!isAuthenticated) {
    // Si no está autenticado, redirige al home
    return <Navigate to="/" />;
  }
  
  if (allowedRole && userRole !== allowedRole) {

    console.log('Redirigiendo por rol:', userRole);
    // Si el rol no coincide, redirige a la página correspondiente a su rol
    return <Navigate to={userRole === 'admin' ? '/admin' : '/user'} />;
  }
  
  return children;
};

export const AppRouters = () => {
  const { isAuthenticated, userRole } = useSelector(state => state.auth);

  return (
    <Routes>
      {/* Ruta pública */}
      <Route 
        path="/" 
        element={
          isAuthenticated ? 
            <Navigate to={userRole === 'admin' ? '/admin' : '/user'} /> : 
            <HomePage />
        } 
      />
      
      {/* Ruta protegida para admin */}
      <Route 
        path="/admin" 
        element={
          <PrivateRoute allowedRole="admin">
            <HomeAdmin />
          </PrivateRoute>
        } 
      />
      
      {/* Ruta protegida para usuarios */}
      <Route 
        path="/user" 
        element={
          <PrivateRoute allowedRole="patient">
            <HomeUser />
          </PrivateRoute>
        } 
      />
      
      {/* Ruta por defecto - redirige al home */}
      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  );
}
