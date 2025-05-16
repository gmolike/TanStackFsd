import { memo } from 'react';

import type { FooterProps } from './Footer';
import { Footer } from './Footer';

/**
 * FooterCompact - Compact footer variant with minimal display
 *
 * Alternative to Footer with variant="compact" for consistent API
 */
function CompactComponent(props: Omit<FooterProps, 'variant'>) {
  return <Footer {...props} variant="compact" />;
}

export const Compact = memo(CompactComponent);
