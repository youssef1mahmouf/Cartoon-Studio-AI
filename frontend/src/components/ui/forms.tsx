import { cn } from '@/lib/utils';

export default function Card({ className, children, title }: { className?: string; children: React.ReactNode; title?: string }) {
  return (
    <div className={`bg-[--card] rounded-xl border border-[--border] p-6 ${className}`}>
      {title && <h3 className="text-sm font-medium text-muted-600 mb-4">{title}</h3>}
      {children}
    </div>
  );
}

export function Button({ className, children, variant = 'primary', onClick }: {
  className?: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  onClick: () => void;
}) {
  const variants = {
    primary: 'bg-[--primary] text-white hover:bg-[--primary]/90',
    secondary: 'bg-[--secondary] text-white hover:bg-[--secondary]/90',
    ghost: 'hover:bg-[--muted]/20 text-[--foreground]',
  };

  return (
    <button 
      className={cn(
        'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
        variants[variant]
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function TextInput({ className, placeholder, value, onChange, disabled }: {
  className?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className={cn('relative', className)}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full px-3 py-2 rounded-lg bg-[--input] text-white placeholder-[--muted] focus:outline-none focus:ring-2 focus:ring-[--primary] focus:border-[--primary]"
      />
    </div>
  );
}

export function Textarea({ className, placeholder, value, onChange, disabled, rows = 3 }: {
  className?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  rows?: number;
}) {
  return (
    <div className={cn('relative', className)}>
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        rows={rows}
        className="w-full px-3 py-2 rounded-lg bg-[--input] text-white placeholder-[--muted] focus:outline-none focus:ring-2 focus:ring-[--primary] focus:border-[--primary] resize-none"
      />
    </div>
  );
}

export function Select({ className, options, value, onChange, disabled }: {
  className?: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className={cn('relative', className)}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full px-3 py-2 rounded-lg bg-[--input] text-white placeholder-[--muted] focus:outline-none focus:ring-2 focus:ring-[--primary] focus:border-[--primary]"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}