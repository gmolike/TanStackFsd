import React from 'react';

import { AuthType } from './type';

export const Context = React.createContext<AuthType | null>(null);
