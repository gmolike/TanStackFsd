import { memo } from 'react';

import type { FooterProps } from './Footer';
import { Footer } from './Footer';

/**
 * SplitComponent - Split footer with messages left and buttons right
 */
const SplitComponent = (props: Omit<FooterProps, 'variant'>) => (
  <Footer {...props} variant="split" />
);

export const Split = memo(SplitComponent);
