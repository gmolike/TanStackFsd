import type { Control, FieldPath, FieldValues, PathValue } from 'react-hook-form';

import type { BaseFieldProps } from '../../input/model/types';

/**
 * Option for Combobox dropdown
 */
export type Option = {
  /**
   * The value that will be submitted
   * Used as the form field value when this option is selected
   */
  value: string;

  /**
   * The label displayed to the user
   * Shown in the dropdown list and when selected
   */
  label: string;

  /**
   * Whether this option is disabled
   * @optional Prevents selection of this option
   */
  disabled?: boolean;
};

/**
 * Props for the Combobox component
 *
 * @template TFieldValues - Type of the form values
 */
export type Props<TFieldValues extends FieldValues = FieldValues> = BaseFieldProps<TFieldValues> & {
  /**
   * Array of options to display in the dropdown
   * Each option must have a unique value
   */
  options: Array<Option>;

  /**
   * Placeholder text for the search input
   * @default 'Suchen...'
   */
  searchPlaceholder?: string;

  /**
   * Text to show when no options match the search
   * @default 'Keine Ergebnisse gefunden.'
   */
  emptyText?: string;

  /**
   * Whether to show clear button
   * @default true
   * Button appears when an option is selected
   */
  showClear?: boolean;

  /**
   * Callback when search value changes
   * @optional Used for async search/filtering
   * @param search - Current search value
   */
  onSearchChange?: (search: string) => void;

  /**
   * Whether options are being loaded
   * @default false
   * Shows loading state in dropdown
   */
  loading?: boolean;
};

/**
 * Props for the Combobox controller hook
 *
 * @template TFieldValues - Type of the form values
 */
export type ControllerProps<TFieldValues extends FieldValues = FieldValues> = {
  /**
   * React Hook Form control object
   * Required to access form state
   */
  control: Control<TFieldValues>;

  /**
   * Field name in the form
   * Used to access field state
   */
  name: FieldPath<TFieldValues>;

  /**
   * Whether the combobox is disabled
   * @optional Combined with form submission state
   */
  disabled?: boolean;

  /**
   * Whether the field is required
   * @optional Used for aria-required attribute
   */
  required?: boolean;

  /**
   * Array of options
   * Used for filtering and selection
   */
  options: Array<Option>;

  /**
   * Callback when search value changes
   * @optional Called with debounced search value
   */
  onSearchChange?: (search: string) => void;

  /**
   * Whether options are being loaded
   * @optional Shows loading state
   */
  loading?: boolean;
};

/**
 * Return value of the Combobox controller hook
 */
export type ControllerResult<TFieldValues extends FieldValues = FieldValues> = {
  /**
   * Whether the combobox is disabled (considering form state)
   * True if explicitly disabled or form is submitting
   */
  isDisabled: boolean;

  /**
   * Whether the dropdown is open
   */
  open: boolean;

  /**
   * Function to set the open state
   * @param open - New open state
   */
  setOpen: (open: boolean) => void;

  /**
   * Current search value
   */
  searchValue: string;

  /**
   * Function to set the search value
   * @param value - New search value
   */
  setSearchValue: (value: string) => void;

  /**
   * Filtered options based on search
   * Case-insensitive filtering by label
   */
  filteredOptions: Array<Option>;

  /**
   * Currently selected option
   * Found by matching field value with option value
   */
  selectedOption: Option | undefined;

  /**
   * Handle option selection
   * @param value - Selected option value
   * @param onChange - Form field onChange handler
   */
  handleSelect: (
    value: string,
    onChange: (value: PathValue<TFieldValues, FieldPath<TFieldValues>>) => void,
  ) => void;

  /**
   * Handle clear button click
   * @param onChange - Form field onChange handler
   */
  handleClear: (
    onChange: (value: PathValue<TFieldValues, FieldPath<TFieldValues>>) => void,
  ) => void;
};
