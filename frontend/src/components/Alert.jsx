import { Info } from 'lucide-react';

const styles = {
  error: 'border-red-200 bg-red-50 text-red-700',
  success: 'border-green-200 bg-green-50 text-green-700',
  info: 'border-sky-200 bg-sky-50 text-sky-800',
  warning: 'border-amber-200 bg-amber-50 text-amber-800',
};

export default function Alert({ type = 'info', children }) {
  return (
    <div className={`flex items-start gap-2 rounded-lg border px-4 py-3 text-sm ${styles[type]}`}>
      <Info size={16} className="mt-0.5 shrink-0" />
      <div>{children}</div>
    </div>
  );
}