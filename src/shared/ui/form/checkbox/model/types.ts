import type { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form';

import type { BaseFieldProps } from '../../input/model/types';

/**
 * Props für die Checkbox-Komponente
 * @template TFieldValues - Der Typ der Formularwerte
 * @param side - Position des Labels relativ zur Checkbox
 */
export type Props<TFieldValues extends FieldValues = FieldValues> = BaseFieldProps<TFieldValues> & {
  side?: 'top' | 'right' | 'bottom' | 'left';
};

/**
 * Props für den Checkbox-Controller
 * @template TFieldValues - Der Typ der Formularwerte
 * @param name - Feldname im Formular
 * @param disabled - Ob die Checkbox deaktiviert ist
 * @param required - Ob die Checkbox erforderlich ist
 * @param side - Position des Labels relativ zur Checkbox
 */
export type ControllerProps<TFieldValues extends FieldValues = FieldValues> = {
  name: FieldPath<TFieldValues>;
  disabled?: boolean;
  required?: boolean;
  side?: 'top' | 'right' | 'bottom' | 'left';
};

/**
 * Rückgabewert des Checkbox-Controllers
 * @template TFieldValues - Der Typ der Formularwerte
 * @param form - React Hook Form Instanz
 * @param isDisabled - Ob die Checkbox deaktiviert ist
 * @param groupClasses - CSS-Klassen für das Layout
 */
export type ControllerResult<TFieldValues extends FieldValues = FieldValues> = {
  form: UseFormReturn<TFieldValues>;
  isDisabled: boolean;
  groupClasses: string;
};
