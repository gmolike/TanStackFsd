import React from 'react';

import type { FormItemContextValue } from './type';

export const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue,
);
