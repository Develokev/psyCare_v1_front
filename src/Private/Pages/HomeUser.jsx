import { useSelector } from 'react-redux';

export const HomeUser = () => {
  const { userData } = useSelector(state => state.user);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Bienvenido, {userData?.name}</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Panel de Usuario</h2>
        <p className="text-gray-600">
          Aquí podrás gestionar tus citas y ver tu historial
        </p>
      </div>
    </div>
  );
};
