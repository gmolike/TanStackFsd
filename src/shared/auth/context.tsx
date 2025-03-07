import React from 'react';

import type { AuthType } from './type';

export const Context = React.createContext<AuthType | null>(null);
