import React from 'react';

import type { FormFieldContextValue } from './type';

export const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue,
);
