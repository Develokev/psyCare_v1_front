# 📚 Documentación del Proyecto - PsyCare

Esta carpeta contiene documentación técnica y decisiones de arquitectura del proyecto.

---

## 📑 Índice de Documentos

### Implementación y Cambios Técnicos

- **[BACKEND_CHANGES.md](./BACKEND_CHANGES.md)** - Cambios críticos implementados en el backend

  - Mejoras en JWT (payload completo con user_id, email)
  - Refactorización de middleware validateJWT
  - Protección de rutas con autenticación
  - Validación de permisos por rol

- **[FRONTEND_UPDATES.md](./FRONTEND_UPDATES.md)** - Integración frontend-backend
  - Simplificación del LoginForm (eliminación de workarounds)
  - Actualización de headers de autenticación (x-token)
  - Guía de testing y verificación
  - Beneficios obtenidos

---

## 🗂️ Organización del Proyecto

```
psyCare_v1_front/
├── docs/               # Documentación técnica (esta carpeta)
├── TODO.md            # Lista de tareas y roadmap (raíz)
├── src/
│   ├── Public/        # Componentes públicos (login, registro)
│   ├── Private/       # Componentes protegidos (admin, user)
│   └── store/         # Redux (auth, user, appointments)
└── ...
```

---

## 🔐 Autenticación y Seguridad

### Flujo de Login (actual)

1. Usuario envía credenciales → `POST /auth/login`
2. Backend valida y devuelve:
   - `token` (JWT con user_id, email, name, role)
   - `user` (objeto completo con todos los datos)
3. Frontend guarda en Redux:
   - `auth.token` → para peticiones
   - `user.userData` → para UI
4. Peticiones protegidas envían header: `x-token: <token>`

### Endpoints Protegidos

Todos los endpoints de `/admin/appo/*` requieren:

- Header `x-token` con JWT válido
- Validación de permisos por rol (pacientes solo ven sus citas)

---

## 🎨 Temas y Diseño

### Panel de Admin

- Tema DaisyUI por defecto
- Colores neutros y profesionales

### Panel de Usuario

- Tema custom: `userPanel`
- Paleta retro-playa: `#5c98b2`, `#79c3c0`, `#98e1d0`, `#fce1ba`, `#f98b8b`
- Fuentes: Poppins (display) + Inter (body)

---

## 📝 Convenciones del Proyecto

### Commits

- Descriptivos y en español
- Formato: `feat: descripción` / `fix: descripción` / `docs: descripción`

### Componentes

- Funcionales con hooks
- PropTypes para validación

### Instalaciones

- Usar `yarn` siempre (no npm)

---

_Última actualización: Noviembre 2025_
