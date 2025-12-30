/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        display: ["Poppins", "Inter", "sans-serif"],
      },
      boxShadow: {
        "soft-primary": "0 4px 20px -2px rgba(92, 152, 178, 0.15)",
        "soft-secondary": "0 4px 20px -2px rgba(121, 195, 192, 0.15)",
        "soft-accent": "0 4px 20px -2px rgba(152, 225, 208, 0.15)",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      "light",
      "dark",
      {
        userPanel: {
          primary: "#5c98b2", // Azul océano - botones principales, links
          secondary: "#79c3c0", // Turquesa suave - botones secundarios
          accent: "#98e1d0", // Verde menta - highlights, hover
          neutral: "#4a5568", // Gris neutro para textos
          "base-100": "#ffffff", // Fondo principal blanco
          "base-200": "#fce1ba", // Beige/crema - cards, fondos secundarios
          "base-300": "#f5d9a6", // Beige más oscuro - bordes
          info: "#5c98b2", // Info = primary
          success: "#79c3c0", // Success = secondary
          warning: "#f98b8b", // Coral/rosa salmón - alertas
          error: "#f87171", // Rojo suave para errores
        },
      },
    ],
    darkTheme: "dark",
    base: true,
    styled: true,
    utils: true,
    prefix: "",
    logs: true,
  },
  // Customizaciones globales de componentes DaisyUI
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        display: ["Poppins", "Inter", "sans-serif"],
      },
      boxShadow: {
        "soft-primary": "0 4px 20px -2px rgba(92, 152, 178, 0.15)",
        "soft-secondary": "0 4px 20px -2px rgba(121, 195, 192, 0.15)",
        "soft-accent": "0 4px 20px -2px rgba(152, 225, 208, 0.15)",
      },
    },
  },
};
