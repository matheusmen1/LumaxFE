import type { ReactNode } from 'react';

export const CaixaGrafico = ({ titulo, children, className = '' }: { titulo: string; children: ReactNode; className?: string }) => (
  <div className={`rounded-xl border border-gray-200 bg-white p-5 shadow-sm ${className}`}>
    <h3 className="mb-4 text-sm font-semibold text-lumax-blue">{titulo}</h3>
    {children}
  </div>
);
