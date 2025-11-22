# TODO - Pendientes del Proyecto

## Formularios y Validación

- [ ] Manejar errores de formularios de Login
- [ ] Manejar errores de formularios de Registro

## Seguridad y Rutas

- [ ] Mejorar la protección de rutas
- [ ] Implementar borrado de token
- [ ] Evaluar implementación de Outlet para rutas protegidas

## Base de Datos y Backend

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
- [x] Implementar filtrado básico: usuario ve solo SUS citas (por email)
- [ ] Crear componente UserWelcome (bienvenida personalizada)
- [ ] Adaptar UpcomingAppointments para usuario (solo sus citas)
- [ ] Crear UserAppointmentList (lista completa de sus citas)
- [ ] Crear UserStats (estadísticas personales: total, próximas, completadas)
- [ ] Implementar filtrado: usuario ve solo SUS citas (por email/user_id)
- [ ] Vista de solo lectura (sin editar ni cancelar por ahora)
- [ ] Añadir campo `psychologist_message` y `message_read` en appointments (backend - para mensajes)
- [ ] Crear componente RecentMessages (últimos 2-3 mensajes del psicólogo)
- [ ] Integrar todos los componentes en HomeUser

### Fase 2: Solicitud de Citas

- [ ] Crear RequestAppointmentModal (formulario nueva cita)
- [ ] Implementar calendario para seleccionar fecha
- [ ] Crear selector de hora (slots disponibles)
- [ ] Crear selector de tipo (online/presencial)
- [ ] Validación: no fechas pasadas ni horarios ocupados
- [ ] Estado inicial de cita: "pending" (requiere confirmación admin)
- [ ] Integrar botón "Solicitar cita" en HomeUser

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
