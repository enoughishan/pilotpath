import { createContext, useContext, useState, useCallback } from 'react';
import { Icon } from '../Icons.jsx';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const show = useCallback((type, title, body) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, type, title, body }]);
    setTimeout(() => setToasts((t) => t.filter(x => x.id !== id)), 3600);
  }, []);

  const api = {
    success: (t, b) => show('success', t, b),
    error: (t, b) => show('error', t, b),
    warning: (t, b) => show('warning', t, b),
    info: (t, b) => show('info', t, b)
  };

  const icons = { success: 'checkCircle', error: 'alert', warning: 'alertTriangle', info: 'info' };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="toasts">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}`}>
            <Icon name={icons[t.type]} />
            <div className="toast-body">
              <b>{t.title}</b>
              {t.body && <p>{t.body}</p>}
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
};