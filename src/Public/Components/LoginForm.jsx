// LoginForm.jsx
import React, { useState } from "react";
import { useForm } from "../../Hooks/useForm";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {
    form,
    handleChange
  } = useForm({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Aquí puedes conectar con tu backend
    // const data = {
    //   email,
    //   password,
    // };

    console.log("Enviando login:", form);

    //Ejemplo para llamar al backend
    const response = await fetch("https://psycare-db.onrender.com/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const result = await response.json();
    console.log(result);
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

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
        >
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
};