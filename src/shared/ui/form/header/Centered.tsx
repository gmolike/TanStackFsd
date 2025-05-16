import { memo } from 'react';

import type { HeaderProps } from './Header';
import { Header } from './Header';

/**
 * Centered - Centered header variant ideal for onboarding and login forms
 *
 * Alternative to Header with variant="centered" for consistent API
 */
function CenteredComponent(props: Omit<HeaderProps, 'variant'>) {
  return <Header {...props} variant="centered" />;
}

export const Centered = memo(CenteredComponent);
