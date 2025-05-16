import { memo } from 'react';

import type { HeaderProps } from './Header';
import { Header } from './Header';

/**
 * CenteredComponent - Centered header variant for onboarding and login forms
 */
const CenteredComponent = (props: Omit<HeaderProps, 'variant'>) => (
  <Header {...props} variant="centered" />
);

export const Centered = memo(CenteredComponent);
