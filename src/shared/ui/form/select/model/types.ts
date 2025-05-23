import type { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form';

import type { BaseFieldProps } from '../../input/model/types';

/**
 * Option für Select-Dropdown
 * @param value - Wert der Option
 * @param label - Anzeigetext der Option
 * @param disabled - Ob die Option deaktiviert ist
 */
export type Option = {
  value: string;
  label: string;
  disabled?: boolean;
};

/**
 * Props für die Select-Komponente
 * @template TFieldValues - Der Typ der Formularwerte
 * @param options - Array von Optionen für das Dropdown
 * @param emptyOption - Text für leere Option
 */
export type Props<TFieldValues extends FieldValues = FieldValues> = BaseFieldProps<TFieldValues> & {
  options: Array<Option>;
  emptyOption?: string;
};

/**
 * Props für den Select-Controller
 * @template TFieldValues - Der Typ der Formularwerte
 * @param name - Feldname im Formular
 * @param disabled - Ob das Select deaktiviert ist
 * @param required - Ob das Select erforderlich ist
 * @param options - Array von Optionen für das Dropdown
 * @param emptyOption - Text für leere Option
 */
export type ControllerProps<TFieldValues extends FieldValues = FieldValues> = {
  name: FieldPath<TFieldValues>;
  disabled?: boolean;
  required?: boolean;
  options: Array<Option>;
  emptyOption?: string;
};

/**
 * Rückgabewert des Select-Controllers
 * @template TFieldValues - Der Typ der Formularwerte
 * @param form - React Hook Form Instanz
 * @param isDisabled - Ob das Select deaktiviert ist
 * @param hasEmptyOption - Ob eine leere Option vorhanden ist
 * @param options - Array von Optionen für das Dropdown
 * @param emptyOption - Text für leere Option
 */
export type ControllerResult<TFieldValues extends FieldValues = FieldValues> = {
  form: UseFormReturn<TFieldValues>;
  isDisabled: boolean;
  hasEmptyOption: boolean;
  options: Array<Option>;
  emptyOption?: string;
};
