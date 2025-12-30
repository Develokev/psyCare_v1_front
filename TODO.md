# TODO - Pendientes del Proyecto

## Navegación y Layout Global

- [ ] Diseñar y crear NavBar/Header global
  - [ ] Definir estructura: logo, menú de navegación, avatar de usuario, notificaciones, logout
  - [ ] Implementar NavBar para panel de administrador (NavbarAdmin)
  - [ ] Implementar NavBar para panel de usuario (NavbarUser)
  - [ ] Implementar NavBar público (NavbarPublic - ya existe, revisar si necesita mejoras)
  - [ ] Añadir navegación responsive (menú hamburguesa en mobile)
  - [ ] Integrar en AppRouters o layout principal
- [ ] Diseñar y crear Footer global
  - [ ] Definir contenido: links útiles, información de contacto, redes sociales, copyright
  - [ ] Implementar Footer reutilizable
  - [ ] Integrar en todas las páginas (admin, user, public)
- [x] Mejorar espaciado y padding global de botones (DaisyUI customization) ✅

## Formularios y Validación

- [ ] Manejar errores de formularios de Login
- [ ] Manejar errores de formularios de Registro

## Seguridad y Rutas

- [ ] Mejorar la protección de rutas
- [ ] Implementar borrado de token
- [ ] Evaluar implementación de Outlet para rutas protegidas

## Base de Datos y Backend

- [x] **CRÍTICO - Seguridad:** Incluir `id` y `email` en el payload del JWT ✅
- [x] Respuesta del login incluye objeto `user` completo (user_id, name, last_name, email, avatar, role) ✅
- [x] Middleware validateJWT refactorizado para usar `req.user` ✅
- [x] Todas las rutas de appointments protegidas con validateJWT ✅
- [x] Validación de permisos en controladores (pacientes solo ven sus citas) ✅
- [x] Frontend actualizado: todas las peticiones usan header `x-token` ✅
- [x] Fix loop infinito en HomeUser (dependencias useEffect) ✅
- [x] Fix estado loading no se limpiaba (agregado finally en HomeAdmin y HomeUser) ✅
- [ ] Añadir campo `phone` (teléfono) a la tabla de usuarios en BD
- [ ] Hacer campo `phone` editable desde panel de usuario (no requerido en registro)
- [ ] Verificar/añadir campo `created_at` o `registration_date` en respuesta de `/admin/users`
- [ ] Considerar añadir `user_id` en el response de `/admin/appo` para evitar mapeos

## Panel de Administración - Gestión de Citas

- [x] Crear componente ConfirmDialog reutilizable
- [x] Crear componente AppointmentPreview
- [x] Crear componente StatusSelector
- [x] Crear componente AppointmentModal
- [x] Añadir botón "Editar" en tabla de citas
- [x] Implementar cambio de estado de citas
- [x] Implementar eliminación de citas
- [x] Añadir action `deleteAppointment` a Redux
- [x] Implementar edición completa de cita (fecha, hora, tipo)
- [x] Añadir validación de seguridad (no editar citas canceladas/pagadas)
- [x] Fix: Filtro por fechas funcionando correctamente
- [x] Ordenar citas por fecha (Próximas/Historial con toggle)
- [x] Crear componente "Próximas Citas" (widget con las 3 próximas)
- [x] Filtrar automáticamente citas pasadas en vista "Próximas"
- [x] Implementar "Mostrar más" para historial de citas (paginación de 20)
- [x] Reducir tamaño de AppointmentFilters para optimizar espacio en pantalla
- [ ] Implementar notificaciones al usuario cuando cambia estado de cita

## Panel de Administración - Gestión de Pacientes

- [x] Crear estructura de componentes Patient
- [x] Crear PatientProfile (container)
- [x] Crear PatientHeader con avatar
- [x] Crear PatientContactCard
- [x] Crear PatientStats
- [x] Crear PatientAppointmentList
- [x] Integrar navegación en HomeAdmin
- [x] Añadir botón de edición en PatientAppointmentList (reutilizar AppointmentModal)
- [x] Implementar filtros independientes en ficha de paciente
- [ ] Crear vista/componente "Todos los Pacientes" (tabla con lista completa)
- [ ] Implementar filtros y búsqueda en lista de pacientes
- [ ] Implementar edición de datos de paciente (desde ficha o desde lista)
- [ ] Añadir sección de notas clínicas por sesión
- [ ] Implementar historial de pagos
- [ ] Añadir tabs para organizar información (Info General, Citas, Notas, Pagos)

## Panel de Usuario (Pacientes)

### Diseño y Personalización

- [x] Crear tema DaisyUI "userPanel" con paleta retro-playa (#5c98b2, #79c3c0, #98e1d0, #fce1ba, #f98b8b)
- [x] Configurar tema en tailwind.config.js
- [x] Aplicar data-theme="userPanel" en HomeUser
- [x] Configurar fuentes Google (Inter + Poppins) en index.html
- [x] Crear estructura visual con gradientes y colores sólidos
- [x] Implementar bordes dobles (negro exterior + color interior) para cards
- [x] Añadir efectos visuales (blur decorativo, shadows con tinte, gradientes)

### Fase 1: Dashboard Personal (MVP)

- [x] Crear estructura base de HomeUser.jsx
- [x] Diseñar layout responsive (grid 2 columnas desktop, 1 mobile)
- [x] Aplicar tema de colores y tipografía personalizada
- [x] Crear placeholders visuales para todos los componentes
- [x] Implementar carga de citas filtradas por user_id desde API (segura)
- [x] Vista de solo lectura (sin editar ni cancelar)
- [x] Crear componente UserStats (estadísticas personales: total, próximas, completadas, canceladas)
- [x] Integrar UserStats en HomeUser
- [x] Crear UserUpcomingAppointments (widget con próximas 3 citas)
- [x] Integrar UserUpcomingAppointments en HomeUser
- [x] Crear UserAppointmentList (lista completa con toggle "Próximas" | "Historial")
- [x] Implementar paginación "Mostrar más" (20 citas por página)
- [x] Integrar UserAppointmentList en HomeUser
- [ ] Añadir campo `psychologist_message` y `message_read` en appointments (backend - para mensajes)
- [ ] Crear componente RecentMessages (últimos 2-3 mensajes del psicólogo)

### Fase 2: Solicitud de Citas ✅

- [x] Crear RequestAppointmentModal (formulario nueva cita)
- [x] Implementar calendario para seleccionar fecha
- [x] Crear selector de hora (slots disponibles)
- [x] Crear selector de tipo (online/presencial)
- [x] Validación: no fechas pasadas ni horarios ocupados
- [x] Estado inicial de cita: "pending" (requiere confirmación admin)
- [x] Integrar botón "Solicitar cita" en HomeUser
- [x] Crear hook useAvailableSlots para chequeo de disponibilidad en tiempo real
- [x] Implementar límite de 3 citas pendientes simultáneas (anti-spam)
- [x] Mensaje de éxito personalizado (sin alert del navegador)
- [x] Integración completa con Redux (addAppointment)
- [x] Theming dinámico por tipo de cita (online=turquoise, presencial=blue)

### Fase 3: Perfil y Edición de Datos

- [ ] Crear componente UserProfile (ver/editar datos personales)
- [ ] Crear EditProfileForm (formulario de edición)
- [ ] Permitir editar: nombre, teléfono
- [ ] Email no editable (seguridad)
- [ ] Opción cambiar contraseña (futuro)

### Fase 4: Acciones sobre Citas

- [ ] Implementar cancelación de cita (validar estado y fecha)
- [ ] Implementar solicitud de cambio de fecha/hora
- [ ] Ver notas de sesión compartidas por psicólogo

### Fase 5: Notificaciones y Recordatorios

- [ ] Sistema de notificaciones in-app
- [ ] Recordatorios de citas próximas (24h antes)
- [ ] Alertas de cambio de estado
- [ ] Notificaciones de nuevos mensajes del psicólogo

### Acceso a Sesiones Online

- [ ] Añadir campo `meet_link` en tabla de citas (backend)
- [ ] Crear componente MeetingAccessButton
- [ ] Implementar lógica de habilitación (5 min antes de la cita)
- [ ] Implementar reminder/modal automático cuando sea hora de la cita
- [ ] Añadir validación: solo mostrar si appotype === 'online'
- [ ] Considerar Web Notifications API para alertas del navegador

## Refactorización y Limpieza de Código

- [x] Limpiar imports innecesarios en AppointmentList
- [x] Eliminar `import React from 'react'` de componentes (React 17+)
- [x] Limpiar console.logs de debugging en AppointmentModal
- [ ] Eliminar `import React from 'react'` de componentes restantes
- [ ] Limpiar imports de iconos no utilizados en otros componentes
- [ ] Revisar y limpiar console.logs de debugging en otros componentes
- [ ] Sesión de refactorización general del código (imports, código duplicado, optimizaciones)
-

-
