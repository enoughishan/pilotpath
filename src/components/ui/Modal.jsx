import { useEffect } from 'react';
import { Icon } from '../Icons.jsx';

export function Modal({ open, title, onClose, children, footer, wide }) {
  useEffect(() => {
    const onEsc = (e) => { if (e.key === 'Escape' && open) onClose?.(); };
    if (open) document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [open, onClose]);

  return (
    <>
      <div className={`overlay ${open ? 'open' : ''}`} onClick={onClose} />
      <div className={`modal ${wide ? 'modal-lg' : ''} ${open ? 'open' : ''}`} role="dialog" aria-modal="true">
        <div className="drawer-head">
          <h2 className="h2">{title}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close"><Icon name="x" /></button>
        </div>
        <div className="drawer-body">{children}</div>
        {footer && <div className="drawer-foot">{footer}</div>}
      </div>
    </>
  );
}