import type { ReactNode } from 'react';

/**
 * Button-Varianten für Footer-Buttons
 */
export type ButtonVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | 'link';

/**
 * Button-Typen für HTML-Form-Elemente
 */
export type ButtonType = 'button' | 'submit' | 'reset';

/**
 * Konfiguration für einen einzelnen Footer-Button
 * @param label - Anzeigetext des Buttons
 * @param display - Ob der Button angezeigt werden soll
 * @param onClick - Click-Handler für den Button
 * @param variant - Visuelle Variante des Buttons
 * @param disabled - Ob der Button deaktiviert ist
 * @param loading - Ob der Button im Ladezustand ist
 * @param icon - Icon-Element für den Button
 * @param type - HTML-Button-Typ
 * @param className - Zusätzliche CSS-Klassen
 */
export type FooterButton = {
  label: string;
  display: boolean;
  onClick?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  type?: ButtonType;
  className?: string;
};

/**
 * Standard-Button-Konfiguration für Footer
 * @param submit - Submit-Button Konfiguration
 * @param cancel - Cancel-Button Konfiguration
 * @param reset - Reset-Button Konfiguration
 */
export type StandardButtons = {
  submit?: Partial<FooterButton>;
  cancel?: Partial<FooterButton>;
  reset?: Partial<FooterButton>;
};

/**
 * Props für den Footer-Controller
 * @param buttons - Standard-Buttons Konfiguration
 * @param customActions - Zusätzliche benutzerdefinierte Buttons
 */
export type ControllerProps = {
  buttons?: StandardButtons;
  customActions?: Array<FooterButton>;
};

/**
 * Rückgabewert des Footer-Controllers
 * @param formState - Aktueller Zustand des Formulars
 * @param allButtons - Alle anzuzeigenden Buttons
 */
export type ControllerResult = {
  formState: {
    isSubmitting: boolean;
    isDirty: boolean;
    isSubmitted: boolean;
    isValid: boolean;
  };
  allButtons: Array<FooterButton>;
};

/**
 * Footer-Komponenten Props
 * @param buttons - Standard-Buttons Konfiguration
 * @param customActions - Zusätzliche benutzerdefinierte Buttons
 * @param links - Footer-Links
 * @param errors - Array von Fehlermeldungen
 * @param successMessage - Erfolgsmeldung
 * @param className - Zusätzliche CSS-Klassen
 * @param variant - Layout-Variante
 * @param sticky - Ob der Footer am unteren Rand fixiert wird
 */
export type Props = ControllerProps & {
  links?: Array<{
    label: string;
    href: string;
    external?: boolean;
  }>;
  errors?: Array<string>;
  successMessage?: string;
  className?: string;
  variant?: 'default' | 'compact' | 'split' | 'centered';
  sticky?: boolean;
};
