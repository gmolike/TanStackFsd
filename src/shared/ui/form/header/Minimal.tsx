import { memo } from 'react';

import type { HeaderProps } from './Header';
import { Header } from './Header';

/**
 * HeaderMinimal - Minimal header variant with compact display
 *
 * Alternative to Header with variant="minimal" for consistent API
 */
function MinimalComponent(props: Omit<HeaderProps, 'variant'>) {
  return <Header {...props} variant="minimal" />;
}

export const Minimal = memo(MinimalComponent);
