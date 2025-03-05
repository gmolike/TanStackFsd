import React from 'react';

import { FormFieldContextValue } from './type';

export const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue,
);
