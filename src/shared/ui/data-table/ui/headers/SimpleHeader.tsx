import type { HeaderProps } from './index';

export const SimpleHeader = ({ label }: HeaderProps) => (
  <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
);
