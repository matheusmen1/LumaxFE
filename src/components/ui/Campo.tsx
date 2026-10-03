import type { ReactNode } from 'react';

interface CampoProps {
  rotulo: string;
  obrigatorio?: boolean;
  className?: string;
  children: ReactNode;
}

export const Campo = ({ rotulo, obrigatorio, className = '', children }: CampoProps) => (
  <label className={`flex flex-col gap-1 ${className}`}>
    <span className="text-sm font-medium text-gray-700">
      {rotulo}
      {obrigatorio && <span className="ml-0.5 text-red-500">*</span>}
    </span>
    {children}
  </label>
);
