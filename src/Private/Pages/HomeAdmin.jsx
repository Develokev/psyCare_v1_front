import React from 'react';
import { useSelector } from 'react-redux';

export const HomeAdmin = () => {
  const { userData } = useSelector(state => state.user);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Bienvenidx, {userData?.name}</h2>
        <p className="text-gray-600">
          Desde aquí podrás gestionar citas, usuarios y configuraciones
        </p>
      </div>
    </div>
  );
};
