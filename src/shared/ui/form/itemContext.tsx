import React from 'react';

import { FormItemContextValue } from './type';

export const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue,
);
