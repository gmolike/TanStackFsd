import { memo } from 'react';

import type { HeaderProps } from './Header';
import { Header } from './Header';

/**
 * MinimalComponent - Minimal header variant with compact display
 */
const MinimalComponent = (props: Omit<HeaderProps, 'variant'>) => (
  <Header {...props} variant="minimal" />
);

export const Minimal = memo(MinimalComponent);
