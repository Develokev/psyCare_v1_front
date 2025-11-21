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
- [ ] Implementar notificaciones al usuario cuando cambia estado de cita
- [ ] Implementar edición completa de cita (fecha, hora, tipo)

## Funcionalidades Futuras - Ficha de Paciente

- [x] Crear estructura de componentes Patient
- [x] Crear PatientProfile (container)
- [x] Crear PatientHeader con avatar
- [x] Crear PatientContactCard
- [x] Crear PatientStats
- [x] Crear PatientAppointmentList
- [x] Integrar navegación en HomeAdmin
- [ ] Implementar edición de datos de paciente desde panel admin
- [ ] Añadir sección de notas clínicas por sesión
- [ ] Implementar historial de pagos
- [ ] Añadir tabs para organizar información (Info General, Citas, Notas, Pagos)

## Refactorización y Limpieza de Código

- [x] Limpiar imports innecesarios en AppointmentList
- [ ] Eliminar `import React from 'react'` de todos los componentes (React 17+)
- [ ] Limpiar imports de iconos no utilizados en otros componentes
- [ ] Revisar y limpiar console.logs de debugging
- [ ] Sesión de refactorización general del código (imports, código duplicado, optimizaciones)
-
