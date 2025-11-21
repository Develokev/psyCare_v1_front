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

## Funcionalidades Futuras - Ficha de Paciente

- [x] Crear estructura de componentes Patient
- [x] Crear PatientProfile (container)
- [x] Crear PatientHeader con avatar
- [x] Crear PatientContactCard
- [x] Crear PatientStats
- [x] Crear PatientAppointmentList
- [x] Integrar navegación en HomeAdmin
- [x] Añadir botón de edición en PatientAppointmentList (reutilizar AppointmentModal)
- [x] Implementar filtros independientes en ficha de paciente
- [ ] Implementar edición de datos de paciente desde panel admin
- [ ] Añadir sección de notas clínicas por sesión
- [ ] Implementar historial de pagos
- [ ] Añadir tabs para organizar información (Info General, Citas, Notas, Pagos)

## Refactorización y Limpieza de Código

- [x] Limpiar imports innecesarios en AppointmentList
- [x] Eliminar `import React from 'react'` de componentes (React 17+)
- [x] Limpiar console.logs de debugging en AppointmentModal
- [ ] Eliminar `import React from 'react'` de componentes restantes
- [ ] Limpiar imports de iconos no utilizados en otros componentes
- [ ] Revisar y limpiar console.logs de debugging en otros componentes
- [ ] Sesión de refactorización general del código (imports, código duplicado, optimizaciones)
-
