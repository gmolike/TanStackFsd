export { ActionsCell } from './ActionsCell';
export { CompactDeleteButton, TableDeleteButton, TableEditButton } from './ActionsCell';
export { BooleanCell } from './BooleanCell';
export { DateCell } from './DateCell';
export { EmailCell } from './EmailCell';
export { PhoneCell } from './PhoneCell';
export { TextCell } from './TextCell';

// Re-export cell template types
export type CellProps<TValue = unknown, TRow = unknown> = {
  value: TValue;
  row?: TRow;
};

// Cell Template Namen für Type Safety
export const cellTemplates = {
  text: 'TextCell',
  email: 'EmailCell',
  phone: 'PhoneCell',
  date: 'DateCell',
  boolean: 'BooleanCell',
  actions: 'ActionsCell',
} as const;

export type CellTemplateName = keyof typeof cellTemplates;
