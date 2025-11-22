import React from 'react';
import PropTypes from 'prop-types';
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';

/**
 * Componente reutilizable para mostrar diálogos de confirmación
 * Usado para confirmar acciones críticas o irreversibles
 */
export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'warning', // 'warning' | 'danger' | 'info'
  children,
}) => {
  if (!isOpen) return null;

  const typeStyles = {
    warning: {
      icon: 'text-yellow-600',
      button: 'btn-warning',
      bg: 'bg-yellow-50',
    },
    danger: {
      icon: 'text-red-600',
      button: 'btn-error',
      bg: 'bg-red-50',
    },
    info: {
      icon: 'text-blue-600',
      button: 'btn-primary',
      bg: 'bg-blue-50',
    },
  };

  const styles = typeStyles[type] || typeStyles.warning;

  return (
    <>
      {/* Overlay de fondo */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full animate-fade-in">
          {/* Header */}
          <div className={`${styles.bg} px-6 py-4 rounded-t-lg flex items-center justify-between`}>
            <div className="flex items-center gap-3">
              <ExclamationTriangleIcon className={`w-6 h-6 ${styles.icon}`} />
              <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            </div>
            <button
              onClick={onClose}
              className="btn btn-ghost btn-sm btn-circle"
              aria-label="Cerrar"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-6">
            <p className="text-gray-700 mb-4">{message}</p>
            {children && <div className="mt-4">{children}</div>}
          </div>

          {/* Footer con botones */}
          <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end gap-3">
            <button
              onClick={onClose}
              className="btn btn-ghost"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`btn ${styles.button}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

ConfirmDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  type: PropTypes.oneOf(['warning', 'danger', 'info']),
  children: PropTypes.node,
};
