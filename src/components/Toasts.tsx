import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

export type ToastVariant = 'default' | 'reward' | 'success';

interface Toast {
  id: number;
  text: ReactNode;
  variant: ToastVariant;
  icon?: ReactNode;
}

const ToastContext = createContext<(text: ReactNode, variant?: ToastVariant, icon?: ReactNode) => void>(() => {});

let nextId = 1;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const show = useCallback((text: ReactNode, variant: ToastVariant = 'default', icon?: ReactNode) => {
    const id = nextId++;
    setToasts((list) => [...list.slice(-2), { id, text, variant, icon }]);
    setTimeout(() => setToasts((list) => list.filter((x) => x.id !== id)), 3800);
  }, []);
  const value = useMemo(() => show, [show]);
  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-region" role="status" aria-live="polite">
        {toasts.map((x) => (
          <div key={x.id} className={`toast${x.variant !== 'default' ? ` toast--${x.variant}` : ''}`}>
            {x.icon}
            <span>{x.text}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
