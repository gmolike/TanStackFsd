import { memo } from 'react';

import type { FooterProps } from './Footer';
import { Footer } from './Footer';

/**
 * CompactComponent - Compact footer variant with minimal display
 */
const CompactComponent = (props: Omit<FooterProps, 'variant'>) => (
  <Footer {...props} variant="compact" />
);

export const Compact = memo(CompactComponent);
